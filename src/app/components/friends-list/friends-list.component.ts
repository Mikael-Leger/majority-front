import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { AddFriendDialog } from 'src/app/dialogs/add-friend/add-friend.component';
import { Friend } from 'src/app/interfaces/friend';
import { AuthService } from 'src/app/services/auth.service';
import { GameService } from 'src/app/services/game.service';
import { UserService } from 'src/app/services/user.service';
import { FriendsService } from '../../services/friends.service';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent implements OnInit {
  friendsConnected: number = 0;
  friendsList: Friend[] = [];
  invitationsList: Friend[] = [];
  messageBoxesList: Friend[] = [];
  show: boolean = false;
  friendsListExpanded: boolean = false;
  friendsListOpenState: boolean = true;
  invitationListOpenState: boolean = false;

  game: string;
  messageFormGroup: FormGroup = new FormGroup({});

  constructor(private cdref: ChangeDetectorRef, public dialog: MatDialog, private router: Router, private gameService: GameService, private userService: UserService, private friendsService: FriendsService, private authService: AuthService, private fb: FormBuilder) {
    friendsService.showFriendsList.subscribe(value => {
      this.show = value;

    });
    this.messageFormGroup = fb.group({});
    this.refreshMessages();
    this.gameService.inGame.subscribe(value => {
      this.game = value;

    })
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();

  }

  ngOnInit(): void {
    console.log("nginit fl");
    const id = localStorage.getItem('ID');
    const token = localStorage.getItem('ACCESS_TOKEN');
    console.log("test : %s - %s", id, token);


    if (this.authService.isAuthenticated()) {
      console.log("auth");

      this.show = true;
      this.friendsListExpanded = localStorage.getItem('friendsListExpanded') == 'true';
      this.getLists();


    } else {
      console.log("not auth");

      this.show = false;

    }
  }

  refreshMessages(): void {
    setInterval(() => {
      this.getLists();
      this.messageBoxesList.forEach(messageBox => {
        this.getMessages(messageBox);

      });
    }, 120000);
  }

  getLists(): void {
    this.getFriendsList();
    this.getInvitations();

  }

  getFriendsList(): void {
    this.friendsService.getFriendsList("accepted").subscribe(res => {
      this.friendsList = res.friendsList;
      this.friendsConnected = res.numberConnected;
      this.getLocalStorageMessages();

    });
  }

  getInvitations(): void {
    this.friendsService.getFriendsList("invited").subscribe(res => {
      this.invitationsList = res.friendsList;

    });
  }

  getLocalStorageMessages(): void {
    this.messageBoxesList = [];
    for (let i = 0; i < 3; i++) {
      const friendId = localStorage.getItem('message-' + i.toString());

      if (friendId) {
        this.friendsService.getFriend(friendId).subscribe(friend => {
          const expanded = localStorage.getItem('friend-expanded-' + friend.username);
          this.addMessageBox(friend, expanded == 'true');

        });
      }
    }
  }

  formatDate(date: Date): string {
    date = new Date(date);

    return ("0" + (date.getUTCMonth()+1)).slice(-2) + "/" +
      ("0" + date.getUTCDate()).slice(-2) + "/" +
      date.getFullYear() + " " +
      ("0" + date.getUTCHours()).slice(-2) + ":" +
      ("0" + date.getUTCMinutes()).slice(-2);
  }

  addMessageBox(friend: Friend, expanded: boolean): void {
    localStorage.setItem('friend-expanded-' + friend.username, expanded.toString());
    friend.expanded = expanded;

    if (this.messageBoxesList.includes(friend)) {
      const index = this.messageBoxesList.map(message => {
        return message.id;
      }).indexOf(friend.id);
      this.messageBoxesList.splice(index, 1);

      for (let i = index; i < 3; i++) {
        const message = localStorage.getItem('message-' + (i + 1));
        if (message) {
          localStorage.setItem('message-' + i, message);

        }
      }
    }

    if (this.messageBoxesList.length === 3) {
      this.messageBoxesList.splice(0, 1);
      const message2 = localStorage.getItem('message-1');
      const message3 = localStorage.getItem('message-2');
      localStorage.setItem('message-0', message2);
      localStorage.setItem('message-1', message3);

    }
    localStorage.setItem('message-' + this.messageBoxesList.length, friend.username);

    this.messageBoxesList.push(friend);
    this.messageFormGroup.addControl(friend.id.toString(), new FormControl(''));
    this.getMessages(friend)

  }

  sendMessage(friend: Friend): void {
    this.friendsService.isUserInFriendsList(this.userService.getUserId(), friend.id).subscribe(userInFriendsList => {
      if (userInFriendsList) {
        const message = this.messageFormGroup.get(friend.id.toString()).value;
        this.friendsService.sendMessage(this.userService.getUserId(), friend.id, message).subscribe(res => {
          this.getMessages(friend);
          this.messageFormGroup.reset();

        });
      } else {
        this.messageFormGroup.get(friend.id.toString()).setErrors({ validator: 'Accept friend request before sending messages to this user' });

      }
    })
  }

  getMessages(friend: Friend): void {
    this.friendsService.getMessages(this.userService.getUserId(), friend.id).subscribe(messages => {
      friend.messages = messages;

    })
  }

  closeMessage(friend: Friend, idx: number): void {
    const index = this.messageBoxesList.map(message => {
      return message.id;
    }).indexOf(friend.id);
    this.messageBoxesList.splice(index, 1);

    this.changeLocalStorage(idx);
  }

  expansionFriendsList(): void {
    this.friendsListExpanded = (this.friendsListExpanded) ? false : true;
    localStorage.setItem('friendsListExpanded', this.friendsListExpanded.toString());

  }

  expansionMessageBox(friend: Friend): void {
    const expanded = localStorage.getItem('friend-expanded-' + friend.username);
    localStorage.setItem('friend-expanded-' + friend.username, ((expanded == 'true') ? 'false' : 'true').toString());

  }

  changeLocalStorage(idx: number): void {
    const messagesArray = [];
    for (let i = 0; i < 3; i++) {
      messagesArray.push(localStorage.getItem('message-' + i));

    }

    if (idx == 2) {
      localStorage.removeItem('message-' + idx);

    } else if (idx == 1) {
      if (messagesArray[2]) {
        const message2 = localStorage.getItem('message-2');
        localStorage.setItem('message-1', message2);
        localStorage.removeItem('message-2');

      } else {
        localStorage.removeItem('message-1');

      }
    } else {
      if (messagesArray[2]) {
        const message1 = localStorage.getItem('message-1');
        localStorage.setItem('message-0', message1);
        const message2 = localStorage.getItem('message-2');
        localStorage.setItem('message-1', message2);
        localStorage.removeItem('message-2');

      } else if (messagesArray[1]) {
        const message1 = localStorage.getItem('message-1');
        localStorage.setItem('message-0', message1);
        localStorage.removeItem('message-1');

      } else {
        localStorage.removeItem('message-0');

      }
    }
  }

  addFriend(): void {
    const dialogRef = this.dialog.open(AddFriendDialog, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getFriendsList();

    });
  }

  answerInvitation(accepted: boolean, friend: Friend, idx: number): void {
    this.friendsService.answerInvitation(this.userService.getUserId(), friend.id, accepted).subscribe(res => {
      this.closeMessage(friend, idx);
      if (accepted) {
        this.addMessageBox(friend, true);

      }
      this.getLists();

    });
  }

  inviteToGame(friend: Friend, gameId: number): void {
    this.friendsService.isUserInFriendsList(this.userService.getUserId(), friend.id).subscribe(userInFriendsList => {
      if (userInFriendsList) {
        this.userService.getUser().subscribe(res => {
          this.friendsService.inviteToGame(res.user, friend, gameId).subscribe(res => {
            this.getMessages(friend);

          });
        });
      } else {
        this.messageFormGroup.get(friend.id.toString()).setErrors({ validator: 'Accept friend request before sending invitations to this user' });

      }
    })
  }

  joinGame(gameId: number, friend: Friend): void {
    this.gameService.getGame(gameId).subscribe(res => {
      if (res.id) {
        if (!this.router.url.includes(`/game/${gameId}`)) {
          this.gameService.joinGame(gameId).subscribe(res => {
            localStorage.setItem('GAME', gameId.toString());
            this.router.navigateByUrl(`/game/${gameId}`);

          })
        }
      } else {
        this.messageFormGroup.get(friend.id.toString()).setErrors({ validator: 'Game no longer exists.' });

      }
    });
  }

}
