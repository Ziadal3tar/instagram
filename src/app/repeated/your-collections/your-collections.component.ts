import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharingService } from 'src/app/services/sharing.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-your-collections',
  templateUrl: './your-collections.component.html',
  styleUrls: ['./your-collections.component.scss'],
})
export class YourCollectionsComponent {
  @Input() collections: any;
  @Input() post: any;
  @Input() ref: any;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();
  collectionSelected: any;
constructor(private _UserService:UserService,private _SharingService:SharingService){}
  closeCollections() {
    this.close.emit('');
  }
ngOnInit(): void {
console.log(this.collections);

}
  select(event: any, collectionSelected: any) {
    let selector = document.getElementsByClassName('select');
    for (let i = 0; i < selector.length; i++) {
      const element = selector[i];
      element.classList.remove('selected');
    }

    this.collectionSelected = collectionSelected._id;
    event.target.classList.add('selected');
  }
  save() {


    let data = {
      postId: this.post._id,
      collectionId: this.collectionSelected,
      ref: this.ref,
    };
    this._UserService.savePost(data).subscribe((data:any)=>{
if (data.success) {
this._SharingService.updateProfileDataDisplay()
}
    })
  }
}
