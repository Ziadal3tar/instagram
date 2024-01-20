import { Component } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent {
  qus:any[]=[
    {
      qus:'Help Center',
      desc:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Alias debitis aut architecto totam modi natus. Asperiores quam consequuntur sapiente iusto fuga rerum magnam reiciendis culpa suscipit, optio libero vitae eligendi voluptate, ad dolor dicta unde aperiam officiis! Quasi amet est dicta corporis, maxime eveniet, iste cumque, sapiente repudiandae fugiat enim recusandae impedit natus suscipit? Odio, ipsa esse. Voluptas porro molestias dignissimos sunt optio. Blanditiis, atque repellendus ipsa et repudiandae alias quo animi cum quasi, aperiam repellat. Ipsam harum consequuntur ut?"
    },
    {
      qus:'Account Status',
      desc:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Alias debitis aut architecto totam modi natus. Asperiores quam consequuntur sapiente iusto fuga rerum magnam reiciendis culpa suscipit, optio libero vitae eligendi voluptate, ad dolor dicta unde aperiam officiis! Quasi amet est dicta corporis, maxime eveniet, iste cumque, sapiente repudiandae fugiat enim recusandae impedit natus suscipit? Odio, ipsa esse. Voluptas porro molestias dignissimos sunt optio. Blanditiis, atque repellendus ipsa et repudiandae alias quo animi cum quasi, aperiam repellat. Ipsam harum consequuntur ut?"
    },
    {
      qus:'Privacy and Security Help',
      desc:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Alias debitis aut architecto totam modi natus. Asperiores quam consequuntur sapiente iusto fuga rerum magnam reiciendis culpa suscipit, optio libero vitae eligendi voluptate, ad dolor dicta unde aperiam officiis! Quasi amet est dicta corporis, maxime eveniet, iste cumque, sapiente repudiandae fugiat enim recusandae impedit natus suscipit? Odio, ipsa esse. Voluptas porro molestias dignissimos sunt optio. Blanditiis, atque repellendus ipsa et repudiandae alias quo animi cum quasi, aperiam repellat. Ipsam harum consequuntur ut?"
    },
    {
      qus:'Support Requests',
      desc:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Alias debitis aut architecto totam modi natus. Asperiores quam consequuntur sapiente iusto fuga rerum magnam reiciendis culpa suscipit, optio libero vitae eligendi voluptate, ad dolor dicta unde aperiam officiis! Quasi amet est dicta corporis, maxime eveniet, iste cumque, sapiente repudiandae fugiat enim recusandae impedit natus suscipit? Odio, ipsa esse. Voluptas porro molestias dignissimos sunt optio. Blanditiis, atque repellendus ipsa et repudiandae alias quo animi cum quasi, aperiam repellat. Ipsam harum consequuntur ut?"
    },
  ]
  active(i: Number, event: any) {
    if (event.target.childNodes[1].classList.contains('bi-chevron-right')) {
      event.target.childNodes[1].classList.replace(
        'bi-chevron-right',
        'bi-chevron-down'
      );
    } else {
      event.target.childNodes[1].classList.replace(
        'bi-chevron-down',
        'bi-chevron-right'
      );
    }
    let desc = document.getElementById(`desc${i}`);
    if (desc?.classList.contains('active')) {
      desc.classList.remove('active');
    } else {
      desc?.classList.add('active');
    }
  }
}
