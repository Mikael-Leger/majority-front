import { Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {
  @Input() user: User;
  @Input() size: string = 'medium';
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';
  diameter: number;

  constructor() { }

  ngOnInit(): void {
    switch (this.size) {
      case 'large':
        this.diameter = 50;
        break;
      case 'medium':
        this.diameter = 30;
        break;
      case 'small':
      default:
        this.diameter = 15;
        break;
    }
  }

  getValue(user: User) {
    return (user.exp / user.expNextLevel)*100;
  }


}
