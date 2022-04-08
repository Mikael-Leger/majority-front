import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Event, NavigationStart } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Game } from 'src/app/interfaces/game';
import { AuthService } from 'src/app/services/auth.service';
import { GameService } from 'src/app/services/game.service';
import { Player } from '../../interfaces/player';
import { Question } from '../../interfaces/question';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [

      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({opacity: 1})),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave',
        animate(600, style(
          {opacity: 0, marginTop: '{{marginTop}}'})
        ),
        {params: {marginTop: '-30px'}}
      )
    ])
  ]
})
export class GameComponent implements OnInit {
  playersInGame: BehaviorSubject<Player[]> = new BehaviorSubject<Player[]>([]);
  players: Player[] = [];
  winners: Player[] = [];
  currentQuestion: BehaviorSubject<Question> = new BehaviorSubject<Question>(null);
  game: Game;
  question: Question;
  player: Player;

  answersPossible: string[] = ['A', 'B', 'C'];
  resultsBool: boolean = false;
  voteAnswer: string = '';
  answers: string[] = [];
  timeLeft: number;
  intervalTimer: number;
  gameEndedFor: string;
  testBool: boolean = false;

  constructor(private router: Router, private authService: AuthService, private route: ActivatedRoute, private gameService: GameService) {
    if (!authService.isAuthenticated) {
      this.router.navigateByUrl('/');

    }

    this.playersInGame.subscribe(value => {
      this.players = value;

    });

    this.currentQuestion.subscribe(value => {
      this.question = value;

    });
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated() || !this.isUserInGame()) this.router.navigateByUrl('/');

    this.gameService.getGame(this.getGameId()).subscribe((game) => {
      if (game) {
        this.game = game;
        this.gameService.inGame.next(game.id.toString());
        this.getPlayers();
        this.checkIfUserJoined();

        this.router.events.subscribe((event: Event) => {
          if(event instanceof NavigationStart) {
            if (this.router.url.includes('/game/')) {
              this.removePlayer();

            }
          }
        });
      } else {
        this.router.navigateByUrl('/');

      }
    });
  }

  removePlayer(): void {
    if (this.game.status != 'ended') {
      localStorage.removeItem('GAME');
      this.gameService.inGame.next("");
      this.gameService.removePlayer(this.getGameId(), this.player.id).subscribe(res => {
        const index = this.players.map(player => {
          return player.id;
        }).indexOf(this.player.id);
        this.players.splice(index, 1);
        this.playersInGame.next(this.players);
        if (this.players.length == 0) {
          this.deleteGame();

        }
      });
    }
  }

  // TESTS
  Test_RandomVotesForBots(): void {
    const answers = ['', 'A', 'A', 'A', 'B', 'B', 'B', 'C', 'C', 'C'];
    for (let i = 2; i < 15; i++) {
      this.players.forEach(player => {
        if (player.id == i && player.lifes > 0) {
          const answer = answers[Math.floor(Math.random() * answers.length)];
          player.vote = answer;
          this.gameService.vote(this.getGameId(), i, answer).subscribe((response) => {});

        }
      });
    }
  }

  checkIfUserJoined(): void {
    const intervalCheck = setInterval(() => {
      if (this.game.status == 'lobby' && this.players.length < 15) {
        this.gameService.getPlayers(this.getGameId()).subscribe(players => {
          this.playersInGame.next(players);

        });
      } else {
        this.startGame();
        clearInterval(intervalCheck);

      }
    }, 1000)
  }

  isUserInGame(): boolean {
    return (parseInt(localStorage.getItem('GAME'))) ? true : false;
  }

  getGameId(): number {
    const id = this.route.snapshot.paramMap.get('id');
    return (id) ? Number(id) : 0;
  }

  getGame(): void {
    this.gameService.getGame(this.getGameId()).subscribe((game) => {
      this.game = game;

    });
  }

  getPlayers(): void {
    this.gameService.getPlayers(this.getGameId()).subscribe((responsePlayers) => {
      this.players = responsePlayers;
      this.getPlayer(responsePlayers);

      if (this.game.status == 'started') {
        const majorityAnswers = this.calcMajority();
        this.updateLifes(majorityAnswers);
        this.voteAnswer = '';

      }
    });
  }

  getPlayer(players: Player[]): void {
    const userId = parseInt(localStorage.getItem('ID'));
    this.player = players.find(player => {
      if (player.id == userId) {
        return player;
      }
    });

  }

  vote(answer: string): void {
    this.voteAnswer = answer;
    this.players.find(player => player.id = this.player.id).vote = answer;
    this.gameService.vote(this.getGameId(), this.player.id, answer).subscribe((response) => {});

  }

  startGame(): void {
    this.game.status = 'started';
    this.gameService.start(this.getGameId()).subscribe((response) => {
      this.nextQuestion();

    });
  }

  startTimerQuestion() {
    this.timeLeft = 5;
    this.intervalTimer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;

      } else {
        this.questionResults();

      }
    },1000)
  }

  startTimerResults(): void {
    this.timeLeft = 2;
    this.intervalTimer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;

      } else {
        this.nextQuestion();

      }
    },1000)
  }

  pauseTimer(): void {
    clearInterval(this.intervalTimer);

  }

  nextQuestion(): void {
    if (this.game.nb_question >= 10) {
      this.gameEndedFor = 'Le quiz touche à sa fin !';
      this.endGame();
      return;
    }

    this.gameService.setQuestionNumber(this.getGameId(), this.game.nb_question + 1).subscribe(() => {
      this.gameService.getQuestion(this.getGameId()).subscribe(question => {
        this.currentQuestion.next(question);

        this.players.forEach(player => {
          player.vote = '';
          this.gameService.vote(this.getGameId(), player.id, '').subscribe((response) => {});

        });
        this.pauseTimer();

        if (this.checkIfOneOrTwoPlayersAlive()) {
          this.gameEndedFor = 'Plus que deux joueurs sont en vie !';
          this.endGame();

        } else {
          this.resultsBool = false;
          this.game.nb_question++;
          this.answers = [];
          this.startTimerQuestion();

        }
      });
    });
  }

  questionResults(): void {
    this.Test_RandomVotesForBots(); // TEST: Delete after
    this.pauseTimer();
    this.startTimerResults();
    this.resultsBool = true;
    this.updateInfos();

  }

  updateInfos(): void {
    this.gameService.getGame(this.getGameId()).subscribe(async (game) => {
      this.game = game;
      this.getPlayers();

    });
  }

  calcMajority(votes = {'A': 0, 'B': 0, 'C': 0} , majority = []): string[] {
    this.players.forEach(player => {
      switch (player.vote) {
        case 'A':
          votes.A++
          break;
        case 'B':
          votes.B++
          break;
        case 'C':
          votes.C++
          break;
        default:
          break;
      }
    });
    if (votes.A >= votes.B && votes.A >= votes.C) {
      majority.push('A');

    }
    if (votes.B >= votes.A && votes.B >= votes.C) {
      majority.push('B');

    }
    if (votes.C >= votes.A && votes.C >= votes.B) {
      majority.push('C');

    }
    this.answers = majority;
    if (votes.A == 0 && votes.B == 0 && votes.C == 0) {
      majority.push('');

    }
    return majority;
  }

  updateLifes(majorityAnswers: string[]): void {
    const answersPossible = ['A', 'B', 'C', ''];
    answersPossible.forEach(answer => {
      if (!majorityAnswers.includes(answer)) {
        this.players.forEach(player => {
          if (player.lifes > 0 && player.vote == answer) {
            player.lifes--;
            this.fadeAway(player);
            this.gameService.setLifes(this.getGameId(), player.id, player.lifes).subscribe((response) => {});

          }
        });
      }
    });
  }

  checkIfOneOrTwoPlayersAlive(): boolean {
    let nbAlive = 0;
    this.players.forEach(player => {
      if (player.lifes > 0) {
        nbAlive++;
      }
    });
    return (nbAlive == 1 || nbAlive == 2);
  }

  endGame(): void {
    this.game.status = 'ended';
    this.pauseTimer();
    this.players.forEach(player => {
      if (player.lifes > 0) {
        this.winners.push(player);
        this.pauseTimer();

      }
    });
    this.gameService.updateUsersStats(this.players).subscribe((response) => {
      this.deleteGame();

    });
  }

  deleteGame(): void {
    this.gameService.deleteGame(this.getGameId()).subscribe((response) => {

    });
  }

  backToMenu(): void {
    this.router.navigateByUrl('/');

  }

  fadeAway(player: Player): void {
    player.losingLife = true;
    window.setTimeout(() => {
      player.losingLife = false;

    }, 10)

  }

}
