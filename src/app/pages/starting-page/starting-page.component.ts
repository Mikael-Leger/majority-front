import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { GameService } from '../../services/game.service'

@Component({
  selector: 'app-starting-page',
  templateUrl: './starting-page.component.html',
  styleUrls: ['./starting-page.component.css']
})
export class StartingPageComponent implements OnInit {
  gameInProgress = false;

  constructor(private router: Router, private authService: AuthService, private gameService: GameService) { }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) this.router.navigateByUrl('/');
    this.gameInProgress = (localStorage.getItem('GAME') != null) ? true : false;

  }

  start(): void {
    this.gameService.joinGame().subscribe((game) => {
      localStorage.setItem('GAME', game.gameId.toString());
      this.gameInProgress = true;
      this.router.navigateByUrl('/game/' + game.gameId.toString());

    });

  }

}
