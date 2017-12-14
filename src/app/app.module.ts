import { Logger } from './providers/logger.service';
import { GiftFirebaseService } from './providers/gift.firebaseService';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './providers/in-memory-data.service';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule, animate } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase} from 'angularfire2/database';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { EmailComponent } from './email/email.component';
import { SignupComponent } from './signup/signup.component';
import { MembersComponent } from './members/members.component';
import { AuthGuard, AuthService } from './providers/auth.service';
import { AppRoutingModule } from './app-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { GiftesComponent } from './gifts/gifts.component';
import {MdSliderModule, MdSlideToggleModule, MdButtonModule, MdCardModule, MdMenuModule, MdToolbarModule, MdIconModule, MdInputModule} from '@angular/material';
import { OverlayContainer, MdTabsModule } from "@angular/material";
import {SearchFilter} from './pipes/search.pipe';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MdDialogModule } from '@angular/material';
import { ProceedDeleteDialog } from 'app/gifts/preceedDeleteDialog.component';
import {OrderByPipe}  from './pipes/orderBy.pipe';



export const firebaseConfig = {
    firebase: {
    apiKey: "AIzaSyBZ6Z0j0q3ICT69URZYFpMhv2Q0FgM1DLg",
    authDomain: "giftslist-bf2f8.firebaseapp.com",
    databaseURL: "https://giftslist-bf2f8.firebaseio.com",
    storageBucket: "giftslist-bf2f8.appspot.com",
    messagingSenderId: "668847751266"
  }
}



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EmailComponent,
    SignupComponent,
    MembersComponent,
    PageNotFoundComponent,
    GiftesComponent,
    SearchFilter,
    OrderByPipe,
    ProceedDeleteDialog
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService),
    AngularFireModule.initializeApp(firebaseConfig.firebase),
    AppRoutingModule,
    MdButtonModule,
    MdCardModule,
    MdMenuModule,
    MdToolbarModule,
    MdIconModule,
    MdInputModule,
    MdSliderModule,
    MdSlideToggleModule,
    MdTabsModule,
    FlexLayoutModule,
    MdDialogModule
  ],
  entryComponents: [
    ProceedDeleteDialog
  ],
  providers: [AuthGuard, AuthService, InMemoryDataService, GiftFirebaseService, AngularFireAuth, AngularFireDatabase, Logger],
  bootstrap: [AppComponent]
})
export class AppModule {
    constructor(overlayContainer: OverlayContainer) {
    // overlayContainer.themeClass = 'dark-theme';
  }
}
