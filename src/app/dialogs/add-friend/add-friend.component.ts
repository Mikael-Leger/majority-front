import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Toast } from 'src/app/enums/toasts.enum';
import { FriendsService } from 'src/app/services/friends.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.css']
})
export class AddFriendDialog implements OnInit {
  form: FormGroup = new FormGroup({});

  constructor(
    public dialogRef: MatDialogRef<AddFriendDialog>, private toast: ToastService, private friendsService: FriendsService, private userService: UserService, private router: Router, private fb: FormBuilder) {
    this.form = fb.group({
      friendUsername: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();

  }

  getErrorMessage(type: string): string {
    const formControl = this.form.get(type);
    if (formControl.hasError('required')) return 'Required';
    if (formControl.hasError('validator')) return formControl.getError('validator');

  }

  addFriend(): void {
    const friendUsername = this.form.get('friendUsername').value
    if (friendUsername) {
      this.userService.getUser(friendUsername).subscribe(messageUser => {
        if (messageUser.user) {
          this.friendsService.addFriend(this.userService.getUserId(), messageUser.user.id).subscribe(res => {
            this.toast.show('Invitation sent to ' + friendUsername, 'Friend', Toast.Success);
            this.dialogRef.close();

          });
        } else {
          this.toast.show('No player named ' + friendUsername, 'Friend', Toast.Error);

        }
      });
    }
  }

}
