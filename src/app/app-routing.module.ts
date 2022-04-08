import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionsListComponent } from './pages/questions-list/questions-list.component';
import { EditQuestionComponent } from './pages/edit-question/edit-question.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { StartingPageComponent } from './pages/starting-page/starting-page.component';
import { GameComponent } from './pages/game/game.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RankingComponent } from './pages/ranking/ranking.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'questions', component: QuestionsListComponent },
  { path: 'questions/edit/:id', component: EditQuestionComponent },
  { path: 'start', component: StartingPageComponent },
  { path: 'game/:id', component: GameComponent },
  { path: 'profile/:username', component: ProfileComponent },
  { path: 'ranking', component: RankingComponent },
  { path: 'ranking/:username', component: RankingComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
