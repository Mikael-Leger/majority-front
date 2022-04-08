import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuestionsListComponent } from './pages/questions-list/questions-list.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { HeaderComponent } from './components/header/header.component';

import { MaterialExampleModule } from './materials/material.module';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StartingPageComponent } from './pages/starting-page/starting-page.component';
import { GameComponent } from './pages/game/game.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { ProfileComponent } from './pages/profile/profile.component';
import { RankingComponent } from './pages/ranking/ranking.component';
import { RankingTopComponent } from './components/ranking-top/ranking-top.component';
import { HomeComponent } from './pages/home/home.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { EditQuestionComponent } from './pages/edit-question/edit-question.component';
import { DeleteConfirmationDialog } from './dialogs/delete-confirmation/delete-confirmation.component';
import { FriendsListComponent } from './components/friends-list/friends-list.component';
import { AddFriendDialog } from './dialogs/add-friend/add-friend.component';
import { RemoveFriendDialog } from './dialogs/remove-friend/remove-friend.component';

@NgModule({
  declarations: [
    AppComponent,
    QuestionsListComponent,
    RegisterComponent,
    LoginComponent,
    HeaderComponent,
    StartingPageComponent,
    GameComponent,
    ProfileComponent,
    RankingComponent,
    RankingTopComponent,
    HomeComponent,
    SpinnerComponent,
    BackButtonComponent,
    EditQuestionComponent,
    DeleteConfirmationDialog,
    FriendsListComponent,
    AddFriendDialog,
    RemoveFriendDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    MatSliderModule,
    BrowserAnimationsModule,
    MaterialExampleModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    ToastrModule.forRoot({
      timeOut: 5000,
    })
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
