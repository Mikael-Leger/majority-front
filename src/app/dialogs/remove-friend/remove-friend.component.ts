import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Toast } from 'src/app/enums/toasts.enum';
import { User } from 'src/app/interfaces/user';
import { FriendsService } from 'src/app/services/friends.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-remove-friend',
  templateUrl: './remove-friend.component.html',
  styleUrls: ['./remove-friend.component.css']
})
export class RemoveFriendDialog implements OnInit {

  constructor(public dialogRef: MatDialogRef<RemoveFriendDialog>,
    @Inject(MAT_DIALOG_DATA) public data: User, private toast: ToastService, private userService: UserService, private friendsService: FriendsService) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();

  }

  sure(): void {
    this.friendsService.removeFriend(this.userService.getUserId(), this.data.id).subscribe(res => {
      this.dialogRef.close();
      this.toast.show(this.data.username + ' removed from Friends List', 'Friends', Toast.Success);

    });
  }

}
