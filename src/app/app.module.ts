import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from '@abacritt/angularx-social-login';
import { LoadingBTNComponent } from './repeated/loading-btn/loading-btn.component';
import { ReelsCommentsComponent } from './components/reels-comments/reels-comments.component';
import { UserImageComponent } from './repeated/user-image/user-image.component';
import { CommentsComponent } from './repeated/comments/comments.component';
import { DisplayCollectionComponent } from './components/display-collection/display-collection.component';
import { YourCollectionsComponent } from './repeated/your-collections/your-collections.component';
import { AddStoryComponent } from './components/add-story/add-story.component';
import { PostTimePipe } from './pipes/post-time.pipe';
import { InstaLoadingComponent } from './repeated/insta-loading/insta-loading.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { SLoadingComponent } from './components/sloading/sloading.component';
import { GraphQLModule } from './graphql.module'; // Import SlickCarouselModule
import { LazyLoadDirective } from './Directive/lazy-load.directive';
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
    LoadingBTNComponent,
    ReelsCommentsComponent,
    UserImageComponent,
    CommentsComponent,
    DisplayCollectionComponent,
    YourCollectionsComponent,
    AddStoryComponent,
    PostTimePipe,
    InstaLoadingComponent,
    SLoadingComponent,
LazyLoadDirective


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CarouselModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    SocialLoginModule,
    BrowserAnimationsModule,
    SlickCarouselModule,
    GraphQLModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '1098782159208-4afkg7i8tv5e0btbk5emsk5lhre7fmaj.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('7123911704362891')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    },
    MessageComponent,
    HomeComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
