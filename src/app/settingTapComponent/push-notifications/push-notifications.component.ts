import { Component } from '@angular/core';

@Component({
  selector: 'app-push-notifications',
  templateUrl: './push-notifications.component.html',
  styleUrls: ['./push-notifications.component.scss']
})
export class PushNotificationsComponent {
  Qus:any[]=[
    {
      id:5,
      title:'Likes',
      type:3,
      value:'From profiles I follow',
      explain:'johnappleseed liked your photo.'
    },
    {
      id:6,
      title:'Likes and comments on photos of you',
      type:3,
      value:'Off',
      explain:"johnappleseed commented on a post you're tagged in."
    },
    {
      id:7,
      title:'Comments',
      type:3,
      value:'Off',
      explain:'johnappleseed commented: "Nice shot!"'
    },
    {
      id:8,
      title:'Comment likes',
      type:2,
      value:'Off',
      explain:"johnappleseed liked your comment: Nice shot!"
    },
    {
      id:9,
      title:'First posts and stories',
      type:3,
      value:'Off',
      explain:"See johnappleseed's first story on Instagram, and other similar notifications."
    },
    {
      id:10,
      title:'New followers',
      type:2,
      value:'Off',
      explain:'John Appleseed (johnappleseed) started following you.'
    },
    {
      id:11,
      title:'Accepted follow requests',
      type:2,
      value:'Off',
      explain:'John Appleseed (johnappleseed) accepted your follow request.'
    },
    {
      id:12,
      title:'Account suggestions',
      type:2,
      value:'Off',
      explain:"johnappleseed, who you might know, is on Instagram, and other similar notifications."
    },
    {
      id:13,
      title:'Mentions in bio',
      type:3,
      value:'Off',
      explain:"johnappleseed mentioned you in their bio."
    },
    {
      id:14,
      title:'Message requests',
      type:2,
      value:'Off',
      explain:"johnappleseed wants to send you a message."
    },
    {
      id:15,
      title:'Messages from individual and group chats',
      type:2,
      value:'Off',
      explain:'johnappleseed sent you a message.'
    },
    {
      id:16,
      title:'Message reminders',
      type:2,
      value:'Off',
      explain:'johnappleseed sent you a message (1d ago).'
    },
    {
      id:17,
      title:'Group requests',
      type:2,
      value:'Off',
      explain:"johnappleseed wants to add janeappleseed to your group."
    },
    {
      id:18,
      title:'Broadcast channel invites',
      type:2,
      value:'Off',
      explain:"johnappleseed invited you to join their broadcast channel: Hello World!"
    },
    {
      id:19,
      title:'Broadcast channel messages',
      type:2,
      value:'Off',
      explain:"johnappleseed sent you a message."
    },
    {
      id:20,
      title:'Broadcast channel replies',
      type:3,
      value:'Off',
      explain:'johnappleseed replied: Nice shot!'
    },
    {
      id:21,
      title:'Broadcast channel reply likes',
      type:2,
      value:'Off',
      explain:'johnappleseed liked your reply: Thanks!'
    },
    {
      id:22,
      title:'Social channel messages',
      type:2,
      value:'Off',
      explain:"johnappleseed sent you a message."
    },
    {
      id:23,
      title:'Original audio',
      type:2,
      value:'Off',
      explain:"johnappleseed created a reel with your audio."
    },
    {
      id:24,
      title:'Remixes',
      type:2,
      value:'Off',
      explain:"johnappleseed remixed your reel."
    },
    {
      id:25,
      title:'Live videos',
      type:2,
      value:'Off',
      explain:'johnappleseed started a live video. Watch it before it ends!'
    },
    {
      id:26,
      title:'Recently uploaded reels',
      type:2,
      value:'Off',
      explain:'johnappleseed, johndoe and janedoe recently shared new reels.'
    },
    {
      id:27,
      title:'Most watched reels',
      type:2,
      value:'Off',
      explain:"Check out the most watched reels in your location today."
    },
    {
      id:28,
      title:'Add Yours',
      type:2,
      value:'Off',
      explain:"johnappleseed started an Add Yours prompt."
    },
    {
      id:29,
      title:'Reels made for you',
      type:2,
      value:'Off',
      explain:"See new reels made for you."
    },
    {
      id:30,
      title:'Your fundraisers',
      type:2,
      value:'Off',
      explain:'johnappleseed donated to your fundraiser.'
    },
    {
      id:31,
      title:'Fundraisers by others',
      type:2,
      value:'Off',
      explain:'johnappleseed started a fundraiser.'
    },
    {
      id:32,
      title:'Reminders',
      type:2,
      value:'Off',
      explain:"You have unseen notifications, and other similar notifications."
    },
    {
      id:33,
      title:'Product announcements & feedback',
      type:2,
      value:'Off',
      explain:"Download Boomerang, Instagram's latest app."
    },
    {
      id:34,
      title:'Support requests',
      type:2,
      value:'Off',
      explain:"Your support request from July 10 was just updated"
    },
    {
      id:35,
      title:'Trending places',
      type:2,
      value:'Off',
      explain:"John Appleseed Park is a trending place near you. See what's being shared."
    },
    {
      id:36,
      title:'Birthdays',
      type:2,
      value:'Off',
      explain:"johnappleseed has a birthday today!"
    },
  ]
  receiveValue(data:any,i:any){
    this.Qus[i].value=data
  }
}
