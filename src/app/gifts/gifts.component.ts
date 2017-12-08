import { Observable } from "rxjs/Rx";
import { Subject } from "rxjs/Subject";
import { SearchFilter } from "./../pipes/search.pipe";
import {
  FirebaseListObservable
} from "angularfire2/database";
import { Component, Pipe } from "@angular/core";
import { OnInit } from "@angular/core";
import { GiftData } from "./giftdata";
import { GiftHttpService } from "../providers/gift.httpService";
import { GiftFirebaseService } from "../providers/gift.firebaseService";
import { Router, ActivatedRoute, Params } from "@angular/router";
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";
import { GiftStatus } from "./gift-status";
import { Logger } from "app/providers/logger.service";
import { Filter } from "app/gifts/filter";
import {ProceedDeleteDialog} from 'app/gifts/preceedDeleteDialog.component';
import { MdDialog, MdDialogRef } from '@angular/material';



@Component({
  selector: "gifts",
  templateUrl: "./gifts.component.html",
  styleUrls: ["./gifts.component.css"]
})
export class GiftesComponent implements OnInit {
  showRecieved: boolean = false;
  giftsdata: GiftData[];
  giftsFirebaseList: FirebaseListObservable<GiftData[]>;
  // giftsList: Observable<GiftData[]>;

  private searchTerms = new Subject<Filter>();

  addingGift: boolean;
  newGift: GiftData;
  editingGift: GiftStatus = new GiftStatus();
  user: string;
  proceedToDelete: boolean;

  searchText: string = "";
  sortingProperty: string = "desiredRating";
  isDesc: boolean = true;
  direction: number = this.isDesc ? -1 : 1;
  sortingOrder: string = "Most Desired";

  // Change sort function to this:
  sort() {
    this.isDesc = !this.isDesc; //change the direction
    this.direction = this.isDesc ? -1 : 1;
    this.sortingOrder = this.isDesc ? "Most Desired" : "Least Desired";
  }

  //push a search term into the observable stream.
  search(term: string, recieved: boolean): void {
    this.logger.log("The search term is : "+ term, recieved);
    this.searchTerms.next({searchTerm: term, giftRecieved: recieved});
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.logger.log("loading gifts!");
    this.proceedToDelete = false;
    this.addingGift = false;
    this.editingGift.PictureURL = false;
    this.newGift = new GiftData();

    this.route.params
      .switchMap((params: Params) => this.getAllGifts(params['person'], 'firebase'))
      .subscribe(gifts => {
        this.logger.log("giftsdata are " + JSON.stringify(gifts));
        this.giftsdata = gifts
        .filter(item=> {
            if (item.recieved === null || item.recieved === undefined) {
              return false;
            } else {
              this.logger.log("recieved :" + item.recieved, !!item.recieved);
              return (!!item.recieved === this.showRecieved)?true:false;
            }
        });
      });


    this.searchTerms
      .debounceTime(300) // wait 300ms after each keystroke before considering the term
      .distinctUntilChanged() // ignore if next search term is same as previous
      .switchMap((term // switch to new observable each time the term changes
      ) => this.getSearchedGifts(this.user?this.user:"unknown", "firebase", term)
      )
      .subscribe(gifts => {
        this.logger.log("giftsdata are " + JSON.stringify(gifts));
        this.giftsdata = gifts;
      });

  }


  constructor(
    // private router: Router,
    private giftService: GiftHttpService,
    private giftFirebaseService: GiftFirebaseService,
    private route: ActivatedRoute,
    private logger: Logger,
    public dialog: MdDialog
  ) {}

  openDialog(gift : GiftData) {
    let dialogRef = this.dialog.open(ProceedDeleteDialog, {
    });

    dialogRef.afterClosed().subscribe(result => {
      this.proceedToDelete = result;
      if (this.proceedToDelete === true) {
        this.logger.log("Proceed to delete gift is: " + this.proceedToDelete);
        this.logger.log("Proceed to delete gift with data: "+ JSON.stringify(gift));
        this.delete(gift);
      }
    });
  }

  getGifts(
    person,
    service,
    recieved: boolean
  ): FirebaseListObservable<GiftData[]> {
    if (service != null) {
      if (service == "firebase") {
        this.giftsFirebaseList = <FirebaseListObservable<
          GiftData[]
        >>this.giftFirebaseService.getGifts(person, recieved).map(items => {
          this.logger.log("raw object is: " + JSON.stringify(items));
          return items.map(item => {
            this.logger.log("the gift key is: " + item.$key);
            let {
              name: name,
              "added-time": addedTime,
              description: description,
              pictureURL: pictureURL,
              "desired-rating": desiredRating,
              "recieve-time": recieveTime,
              recieved: recieved,
              "where-to-buy": whereToBuy
            } = item;
            let gift = new GiftData(
              item.$key,
              name,
              addedTime,
              description,
              pictureURL,
              desiredRating,
              recieveTime,
              recieved,
              whereToBuy
            );
            return gift;
          });
        });
        this.logger.log(
          "this.giftsFirebaseList is: " + JSON.stringify(this.giftsFirebaseList)
        );
        return this.giftsFirebaseList;
      }
    }
  }

  getSearchedGifts(person, service, filter: Filter): FirebaseListObservable<GiftData[]> {
    if (service != null) {
      if (service == "firebase") {
        this.logger.log ("The current user is :" + person);
        this.giftsFirebaseList = <FirebaseListObservable<
          GiftData[]
        >>this.giftFirebaseService.getAllGifts(person).map(items => {
          this.logger.log("raw object is: " + JSON.stringify(items));
          return items.map(item => {
            this.logger.log("the gift key is: " + item.$key);
            let {
              name: name,
              "added-time": addedTime,
              description: description,
              pictureURL: pictureURL,
              "desired-rating": desiredRating,
              "recieve-time": recieveTime,
              recieved: recieved,
              "where-to-buy": whereToBuy
            } = item;
            let gift = new GiftData(
              item.$key,
              name,
              addedTime,
              description,
              pictureURL,
              desiredRating,
              recieveTime,
              recieved,
              whereToBuy
            );
            return gift;
          }).filter(gift => { return filter.searchTerm? gift.name.toLowerCase().includes(filter.searchTerm): true && (filter.giftRecieved==gift.recieved)});
        });

        return this.giftsFirebaseList;
      }
    }
  }

  getAllGifts(person, service): FirebaseListObservable<GiftData[]> {
    this.logger.log ("The current user is :" + person);
    this.user = person; //set the user for future calls within the same route
    if (service != null) {
      if (service == "firebase") {
        this.giftsFirebaseList = <FirebaseListObservable<
          GiftData[]
        >>this.giftFirebaseService.getAllGifts(person).map(items => {
          this.logger.log("raw object is: " + JSON.stringify(items));
          return items.map(item => {
            this.logger.log("the gift key is: " + item.$key);
            let {
              name: name,
              "added-time": addedTime,
              description: description,
              pictureURL: pictureURL,
              "desired-rating": desiredRating,
              "recieve-time": recieveTime,
              recieved: recieved,
              "where-to-buy": whereToBuy
            } = item;
            let gift = new GiftData(
              item.$key,
              name,
              addedTime,
              description,
              pictureURL,
              desiredRating,
              recieveTime,
              recieved,
              whereToBuy
            );
            return gift;
          });
        });

        return this.giftsFirebaseList;
      }
    }
  }

  addGift(newGift: GiftData): void {
    this.showRecieved = false;
    this.search(null, this.showRecieved);
    this.logger.log("gift added with the data: " + JSON.stringify(newGift));
    this.giftFirebaseService.addGift({
      name: newGift.name,
      "added-time": newGift.addedTime,
      description: newGift.description,
      pictureURL: newGift.pictureURL,
      "desired-rating": newGift.desiredRating,
      "recieve-time": newGift.recieveTime,
      recieved: newGift.recieved,
      "where-to-buy": newGift.whereToBuy
    });
    this.addingGift = false;
    this.newGift = new GiftData();
  }

  cancel(newGift: GiftData): void {
    this.logger.log(
      "Canceling adding gift with the data: " + JSON.stringify(newGift)
    );
    this.addingGift = false;
  }

  expandAddingGift(): void {
    this.addingGift = true;
  }

   editSwitch(status: GiftStatus): void {
    this.editingGift = status;
  }

  editSwitchPictureURL(pictureURL: boolean): void {
    this.editingGift.PictureURL = pictureURL;
  }

  delete(gift: GiftData) {
    this.logger.log("Deleting gift with the data: " + JSON.stringify(gift));
    this.giftFirebaseService.removeGift(gift);
  }

  updateGift(updateGift: GiftData): void {
    this.logger.log(
      "Updating gift  with the data: " + JSON.stringify(updateGift)
    );
    this.giftFirebaseService.updateGift(updateGift.key, {
      name: updateGift.name,
      "added-time": updateGift.addedTime,
      description: updateGift.description,
      pictureURL: updateGift.pictureURL,
      "desired-rating": updateGift.desiredRating,
      "recieve-time": updateGift.recieveTime,
      recieved: updateGift.recieved,
      "where-to-buy": updateGift.whereToBuy
    });
    //reset editing status after update
    this.editSwitch({
      PictureURL: false
    });
  }

  errorHandler(event) {
    this.logger.log(event);
  }
}
