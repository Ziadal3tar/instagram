import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';
import { ExploreComponent } from './components/explore/explore.component';
import { ReelsComponent } from './components/reels/reels.component';
import { MessageComponent } from './components/message/message.component';
import { NotificationComponent } from './components/notification/notification.component';
import { CreateComponent } from './components/create/create.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NavComponent } from './components/nav/nav.component';
import { StoryComponent } from './components/story/story.component';
import { MousePosition } from './Directive/MousePosition.directive';
import { HoverdataComponent } from './components/hoverdata/hoverdata.component';
import { DisplayExploreComponent } from './components/display-explore/display-explore.component';
import { DropdownBtnComponent } from './buttons/dropdown-btn/dropdown-btn.component';
import { StoriesComponent } from './components/stories/stories.component';
import { ChatComponent } from './components/chat/chat.component';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchComponent,
    ExploreComponent,
    ReelsComponent,
    MessageComponent,
    NotificationComponent,
    CreateComponent,
    ProfileComponent,
    NavComponent,
    StoryComponent,
    MousePosition,
    HoverdataComponent,
    DisplayExploreComponent,
    DropdownBtnComponent,
    StoriesComponent,
    ChatComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
