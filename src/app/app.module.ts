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
import { DisplaypostsComponent } from './repeated/displayposts/displayposts.component';
import { FooterComponent } from './components/footer/footer.component';
import { SettingComponent } from './components/setting/setting.component';
import { EditProfileComponent } from './settingTapComponent/edit-profile/edit-profile.component';
import { AppsAndWebsitesComponent } from './settingTapComponent/apps-and-websites/apps-and-websites.component';
import { EmailNotificationsComponent } from './settingTapComponent/email-notifications/email-notifications.component';
import { PushNotificationsComponent } from './settingTapComponent/push-notifications/push-notifications.component';
import { WhatYouSeeComponent } from './settingTapComponent/what-you-see/what-you-see.component';
import { WhoCanSeeYourContentComponent } from './settingTapComponent/who-can-see-your-content/who-can-see-your-content.component';
import { WhoOthersComponent } from './settingTapComponent/who-others/who-others.component';
import { SupervisionComponent } from './settingTapComponent/supervision/supervision.component';
import { SubscriptionsComponent } from './settingTapComponent/subscriptions/subscriptions.component';
import { HelpComponent } from './settingTapComponent/help/help.component';
import { QnotificationsComponent } from './repeated/qnotifications/qnotifications.component';
import { LoginComponent } from './components/login/login.component';
import { RegesterComponent } from './components/regester/regester.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from './components/loading/loading.component';

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
    DisplaypostsComponent,
    FooterComponent,
    SettingComponent,
    EditProfileComponent,
    AppsAndWebsitesComponent,
    EmailNotificationsComponent,
    PushNotificationsComponent,
    WhatYouSeeComponent,
    WhoCanSeeYourContentComponent,
    WhoOthersComponent,
    SupervisionComponent,
    SubscriptionsComponent,
    HelpComponent,
    QnotificationsComponent,
    LoginComponent,
    RegesterComponent,
    LoadingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CarouselModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
