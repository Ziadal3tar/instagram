import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharingService {
  constructor() {}
  private userData = new BehaviorSubject<any>([]);
  currentUserData = this.userData.asObservable();
  private userNotification = new BehaviorSubject<any>([]);
  currentUserNotification = this.userNotification.asObservable();

  private search = new BehaviorSubject<Boolean>(false);
  currentSearch = this.search.asObservable();

  private chat = new BehaviorSubject<any>([]);
  currentChat = this.chat.asObservable();

  private friend = new BehaviorSubject<any>([]);
  currentFriend = this.friend.asObservable();

  private friendsChats = new BehaviorSubject<any>([]);
  currentFriendChats = this.friendsChats.asObservable();

updateSearch(){
  this.search.next(true);
}
updateChat(data:any,friend:any){
  this.chat.next(data);
  this.friend.next(friend);
}

  updateUserData() {
    const data: any = [
      {
        name: 'Alice',
        stories: [
          '../../../assets/imgs/me.jpg',
          '../../../assets/imgs/MAB.jpg',
          '../../../assets/imgs/anne.jpg',
        ],
      },
      { name: 'Bob', stories: [] },
      { name: 'Charlie', stories: [] },
      { name: 'David', stories: [] },
      { name: 'Emma', stories: [] },
      { name: 'Frank', stories: [] },
      { name: 'Grace', stories: [] },
      { name: 'Henry', stories: [] },
      { name: 'Ivy', stories: [] },
      { name: 'Jack', stories: [] },
      { name: 'Katherine', stories: [] },
      { name: 'Larry', stories: [] },
      { name: 'Molly', stories: [] },
      { name: 'Nancy', stories: [] },
      { name: 'Oscar', stories: [] },
      { name: 'Peter', stories: [] },
      { name: 'Quincy', stories: [] },
      { name: 'Rachel', stories: [] },
      { name: 'Sam', stories: [] },
      { name: 'Tina', stories: [] },
      { name: 'Ulysses', stories: [] },
      { name: 'Victor', stories: [] },
      { name: 'Wendy', stories: [] },
      { name: 'Xavier', stories: [] },
      { name: 'Yvonne', stories: [] },
      { name: 'Zack', stories: [] },
      { name: 'Andrew', stories: [] },
      { name: 'Betty', stories: [] },
      { name: 'Charles', stories: [] },
      { name: 'Diana', stories: [] },
      { name: 'Edward', stories: [] },
      { name: 'Fiona', stories: [] },
      { name: 'George', stories: [] },
      { name: 'Helen', stories: [] },
      { name: 'Isaac', stories: [] },
      { name: 'Jane', stories: [] },
      { name: 'Kevin', stories: [] },
      { name: 'Linda', stories: [] },
      { name: 'Michael', stories: [] },
      { name: 'Nina', stories: [] },
      { name: 'Oliver', stories: [] },
      { name: 'Pamela', stories: [] },
    ];
    this.userData.next(data);
  }
  updateUserNotification() {
    const notification: any[] = [
      {
        user: {
          name: 'ziad almorsy',
          image: '../../../assets/imgs/team-4.jpg',
        },
        notification: {
          text: 'who you might know, is on instagram',
          users: [],
        },
      },
      {
        user: {
          name: 'nada josef',
          image: '../../../assets/imgs/anne.jpg',
        },
        notification: {
          text: 'Started following you',
          users: [],
        },
      },
      {
        user: {
          name: 'amr khalid',
          image: '../../../assets/imgs/ivana-square.jpg',
        },
        notification: {
          text: 'added new story',
          users: [],
        },
      },
      {
        user: {
          name: 'fares ali',
          image: '../../../assets/imgs/team-3.jpg',
        },
        notification: {
          text: 'Like your post',
          users: [],
        },
      },
      {
        user: {
          name: 'yasser mohamed',
          image: '../../../assets/imgs/mosalah.jpg',
        },
        notification: {
          text: 'Comment on your post',
          users: [],
        },
      },
      {
        user: {
          name: 'Abu Obeida',
          image: '../../../assets/imgs/aboobida.jpg',
        },
        notification: {
          text: 'fu*ked Israel',
          users: [],
        },
      },
      {
        user: {
          name: 'saif adel',
          image: '../../../assets/imgs/me.jpg',
        },
        notification: {
          text: 'Started following your friend',
          users: [
            {
              name: 'ali ahmed',
            },
          ],
        },
      },
    ];
    this.userNotification.next(notification);
  }
  updateFriendsChats() {
    const friendChats: any[] = [
      {

          name: 'ziad almorsy',
          image: '../../../assets/imgs/team-4.jpg',


      },
      {

          name: 'nada josef',
          image: '../../../assets/imgs/anne.jpg',

      },
      {

          name: 'amr khalid',
          image: '../../../assets/imgs/ivana-square.jpg',

      },
      {

          name: 'fares ali',
          image: '../../../assets/imgs/team-3.jpg',

      },
      {

          name: 'yasser mohamed',
          image: '../../../assets/imgs/mosalah.jpg',

      },
      {

          name: 'Abu Obeida',
          image: '../../../assets/imgs/aboobida.jpg',

      },
      {

          name: 'saif adel',
          image: '../../../assets/imgs/me.jpg',

      },
      {

        name: 'yasser mohamed',
        image: '../../../assets/imgs/mosalah.jpg',

    },
    {

        name: 'Abu Obeida',
        image: '../../../assets/imgs/aboobida.jpg',

    },
    {

        name: 'saif adel',
        image: '../../../assets/imgs/me.jpg',

    },
    ];
    this.friendsChats.next(friendChats);
  }
}
