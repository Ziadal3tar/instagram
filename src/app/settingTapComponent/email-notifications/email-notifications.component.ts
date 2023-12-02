import { Component } from '@angular/core';

@Component({
  selector: 'app-email-notifications',
  templateUrl: './email-notifications.component.html',
  styleUrls: ['./email-notifications.component.scss']
})
export class EmailNotificationsComponent {
Qus:any[]=[
  {
    id:0,
    title:'Feedback emails',
    type:2,
    value:'Off',
    explain:'Give feedback on Instagram.'
  },
  {
    id:1,
    title:'Reminder emails',
    type:2,
    value:'Off',
    explain:'Get notifications you may have missed.'
  },
  {
    id:2,
    title:'Product emails',
    type:2,
    value:'Off',
    explain:"Get tips and resources about Instagram's tools."
  },
  {
    id:3,
    title:'News emails',
    type:2,
    value:'Off',
    explain:"Learn about new Instagram features."
  },
  {
    id:4,
    title:'Support emails',
    type:2,
    value:'Off',
    explain:"Get updates on reports and violations of our Community Guidelines."
  },
]

receiveValue(data:any,i:any){
  this.Qus[i].value=data
}
}
