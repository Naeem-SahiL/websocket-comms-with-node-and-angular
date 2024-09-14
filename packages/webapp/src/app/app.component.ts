import { ChatRelayMessage, SystemNotice, User } from '@websocket/types';
import { Component, OnInit, inject } from '@angular/core';
import { AppService } from './app.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'websocket-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  messages: ChatRelayMessage[] = [];
  users: User[] = [];
  currentUser : User;
  message: string;
  inputUserName: string;
  systemNotice: string;


  constructor(private appService: AppService, private _snackBar: MatSnackBar) {
    appService.user$.subscribe(user => {
      this.currentUser = user;
    });

    appService.chatMessage$.subscribe(message => {
      this.messages = [...this.messages, message];
    });

    appService.systemNotice$.subscribe((message: SystemNotice) => {
      this.systemNotice = message.contents;
      this._snackBar.open(this.systemNotice, 'Close', {
        duration: 5000,
      });

    });

    appService.userList$.subscribe(users => {
      this.users = users;
    });
  }

  ngOnInit() {

  }

  connect(){
    // show popup message
    // alert(`Connecting as ${this.inputUserName}`);
    this.appService.connect(this.inputUserName);

  }

  sendMessage() {
    // alert(`Sending message: ${this.message}`);
    this.appService.sendMessage(this.message);
    this.message = '';
  }
}
