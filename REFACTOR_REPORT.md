# Frontend Refactor Report

## Scope

This version was rebuilt around the refactored REST API and focuses on navigation correctness, profile architecture, API payload consistency, optimistic UI, socket reliability, caching compatibility, and reduced unnecessary HTTP requests.

## Main architectural changes

- Primary navigation is now Angular Router driven instead of tap/DOM state driven.
- `/home`, `/explore`, `/reels`, `/create`, `/messages`, `/settings`, and `/userProfile/:id` are real application routes.
- Profile is a route-based feature and loads its own profile data from `/user/getProfilesData`.
- API contracts are typed in `src/app/core/models/api.models.ts`.
- Authentication/session storage is centralized in `SessionService`.
- Authorization headers are applied by `AuthInterceptor`.
- Unauthorized sessions are handled by `ApiErrorInterceptor`.
- Socket events use a shared event stream and no longer depend on connection timing.
- `SharingService` stores only shared user/saved state instead of acting as a second router/state system.

## Profile changes

- Uses `followersCount`, `followingCount`, and `isFollowing` from the API.
- Follow/unfollow is optimistic with rollback on failure.
- Posts, reels, and saved content use explicit tabs.
- Saved content is loaded only for the current account.
- Media uses lazy loading and opens through the unified content viewer.
- Collection previews are cached locally to avoid repeated filtering during change detection.
- Profile edit refreshes the shared current-user state after saving.

## Performance changes

- Removed full-array payload assumptions from feed, explore, reels, saved, and profile.
- Likes/saves/comments update counters locally instead of re-fetching the whole post.
- Feed, explore, reels, and saved content are paginated.
- Search uses debounce + switchMap so stale requests are cancelled.
- Reels use IntersectionObserver for media playback and throttled scroll handling.
- Home/profile/explore/reels/chat use OnPush change detection.
- Object URLs are revoked after media previews are released.
- Removed unused Owl/Slick carousel modules and their global CSS from the application bundle.
- Socket notifications update local shared state instead of forcing a full `/user/getUserData` request.

## New API assumptions

The frontend expects the refactored backend contracts, including:

- `GET /feed?page=&limit=` -> `data.items`
- `GET /posts/explore?page=&limit=` -> `data.items`
- `GET /reels/getAllReels?page=&limit=` -> `data.reels`
- `POST /user/getProfilesData` -> `data.profile`, `data.allPosts`
- `POST /posts/like` -> `data.liked`, `data.likesCount`
- `POST /posts/addComment` -> `data.comment`, `data.commentsCount`
- `POST /user/follow/:id` -> `data.isFollowing`
- `POST /user/savePost` -> `data.saved`
- `GET /user/getSaved?page=&limit=` -> `data.items`
- `GET /chats/getChat?to=&limit=` -> paginated message payload

## Validation

- All backend JavaScript files pass `node --check`.
- Frontend source was statically checked after refactor.
- A full Angular production build was not executable in the sandbox because the project dependencies were not installed; the existing project lockfile remains included.

## Run

```bash
npm install
npm start
```

For a production build:

```bash
npm run build
```
