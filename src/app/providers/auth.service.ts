import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from "angularfire2/auth";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import * as firebase from 'firebase/app';
import { Logger } from "app/providers/logger.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AngularFireAuth, private router: Router) { }

  canActivate(): Observable<boolean> {
    return Observable.from(this.auth.authState)
      .take(1)
      .map(state => !!state)
      .do(authenticated => {
        if
        (!authenticated) this.router.navigate(['/login']);
      })
  }

}

@Injectable()
export class AuthService {
  private authState: firebase.User;

  constructor(private angularFireAuth: AngularFireAuth, public logger: Logger) { this.init(); }

  private init(): void {
    this.angularFireAuth.authState.subscribe((authState) => {
      if (authState !== null) {
        this.authState = authState;
        this.logger.log("authState is: ", authState);
      }
    });
  }

  public get currentUid(): string {
    return this.authState ? this.authState.uid : undefined;
  }

  public get currentUser(): firebase.User {
    return this.authState ? this.authState : undefined;
  }

  public get currentUserObservable(): Observable<firebase.User> {
    return this.angularFireAuth.authState;
  }

  public get currentAuth(): firebase.auth.Auth {
    return this.angularFireAuth.auth;
  }

  public get isAnonymous(): boolean {
    return this.authState ? this.authState.isAnonymous : false;
  }

  public get isAuthenticated(): boolean {
    return !!this.authState;
  }

  public logout(): void {
    this.angularFireAuth.auth.signOut();
  }

  public signInWithEmailAndPassword(email: string, password: string): Promise<any> {
    //Only login if the user is not authenticated
    //if the user is authenticated, then she must first logout
    let signIn: Promise<any> = new Promise((resolve, reject) =>
      this.angularFireAuth.auth.signInWithEmailAndPassword(email, password)
        .then((data) => { this.logger.log(data); resolve(data) },
        (err) => { this.logger.log(err); reject(err); }
        )

    );
    return signIn;
  }

}
