import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFriendDialog } from './add-friend.component';

describe('AddFriendComponent', () => {
  let component: AddFriendDialog;
  let fixture: ComponentFixture<AddFriendDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFriendDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFriendDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
