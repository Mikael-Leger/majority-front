import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast } from 'src/app/enums/toasts.enum';
import { User } from 'src/app/interfaces/user';
import { FriendsService } from 'src/app/services/friends.service';
import { RemoveFriendDialog } from 'src/app/dialogs/remove-friend/remove-friend.component';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User;
  userProfile: boolean;
  edit = false;
  form: FormGroup = new FormGroup({});
  userInFriendsList: boolean;

  constructor(public dialog: MatDialog, private router: Router, private route: ActivatedRoute, private toast: ToastService, private friendsService: FriendsService, private userService: UserService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getUser();

  }

  getUser(): void {
    this.userService.getUser(this.route.snapshot.paramMap.get('username')).subscribe(resUser => {
      this.user = resUser.user;
      this.form = this.fb.group({
        description: resUser.user.description

      })
      this.userProfile = (resUser.user.id == parseInt(localStorage.getItem('ID')));
      if (!this.userProfile) {
        this.friendsService.isUserInFriendsList(this.userService.getUserId(), this.user.id).subscribe(resUserInFriendsList => {
          this.userInFriendsList = resUserInFriendsList;

        });
      }
    });
  }

  editProfile(): void {
    this.edit = true;

  }

  saveProfile(): void {
    this.edit = false;
    const description = this.form.get('description').value;

    this.userService.setDescription(this.user.id, description).subscribe(res => {
      this.user.description = description;

    });
  }

  addFriend(): void {
    const username = this.route.snapshot.paramMap.get('username');
    this.userService.getUser(username).subscribe(messageUser => {
      if (messageUser.user) {
        this.friendsService.addFriend(this.userService.getUserId(), messageUser.user.id).subscribe(res => {
          this.toast.show('Invitation sent to ' + username, 'Friend', Toast.Success);

        });
      }
    });
  }

  removeFriend(): void {
    const dialogRef = this.dialog.open(RemoveFriendDialog, {
      width: '250px',
      data: this.user
    });

    dialogRef.afterClosed().subscribe(result => {
      window.location.reload();

    });
  }

  showLocalDate(dateString: string): string {
    const date = new Date(dateString);
    const lang = navigator.language
    return date.toLocaleDateString(lang);

  }

  goToRank(): void {
    this.router.navigateByUrl('/ranking/' + this.user.username);

  }

}
