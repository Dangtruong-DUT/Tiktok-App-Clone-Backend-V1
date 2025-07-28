# Repository Pattern Implementation

Đã tách phần query từ service layer và đưa vào repository layer để dễ mở rộng và maintain.

## Cấu trúc mới:

### Repositories:

- `TiktokPost.repository.ts` - Chứa các query liên quan đến TikTok posts
- `hashtag.repository.ts` - Chứa các query liên quan đến hashtags
- `bookmarks.repository.ts` - Chứa các query liên quan đến bookmarks
- `likes.repository.ts` - Chứa các query liên quan đến likes
- `likesBookmarks.repository.ts` - Utility repository để kiểm tra trạng thái like/bookmark
- `users.repository.ts` - Chứa các query liên quan đến users và followers
- `medias.repository.ts` - Chứa các query liên quan đến video encoding status

### Services:

- `TiktokPost.services.ts` - Chỉ chứa business logic, sử dụng repositories
- `bookmarks.services.ts` - Business logic cho bookmark operations
- `likes.services.ts` - Business logic cho like operations
- `users.services.ts` - Business logic cho user operations
- `medias.services.ts` - Business logic cho media upload/processing
- `HLSVideoEncoder.ts` - Video encoding service sử dụng medias repository

## Lợi ích:

1. **Separation of Concerns**: Tách biệt rõ ràng giữa business logic (service) và data access layer (repository)
2. **Maintainability**: Dễ dàng maintain và debug các query database
3. **Testability**: Dễ dàng mock repositories trong unit tests
4. **Reusability**: Các repository có thể được sử dụng lại trong các service khác
5. **Scalability**: Dễ dàng mở rộng thêm các repository mới khi cần

## Methods đã được refactor:

### TikTokPostRepository:

- `insertPost()` - Tạo mới post
- `findPostById()` - Tìm post theo ID với đầy đủ thông tin
- `updatePostViews()` - Cập nhật lượt view
- `findFriendPosts()` - Tìm posts của bạn bè với phân trang
- `countFriendPosts()` - Đếm tổng số posts của bạn bè
- `findChildrenPosts()` - Tìm các reply/comment/quote posts
- `countChildrenPosts()` - Đếm số lượng reply/comment/quote posts

### HashtagRepository:

- `findAndCreateHashtag()` - Tìm hoặc tạo mới hashtag
- `findAndCreateHashtags()` - Xử lý bulk hashtags

### BookmarksRepository:

- `createBookmark()` - Tạo bookmark mới
- `deleteBookmark()` - Xóa bookmark
- `findBookmark()` - Tìm bookmark theo post và user
- `countBookmarksByPost()` - Đếm số bookmark của post
- `findBookmarksByUser()` - Tìm tất cả bookmarks của user

### LikesRepository:

- `createLike()` - Tạo like mới
- `deleteLike()` - Xóa like
- `findLike()` - Tìm like theo post và user
- `countLikesByPost()` - Đếm số likes của post
- `findLikesByUser()` - Tìm tất cả likes của user
- `findLikesByPost()` - Tìm users đã like post

### UsersRepository:

- `insertUser()` - Tạo user mới
- `findUserById()` - Tìm user theo ID
- `findUserByEmail()` - Tìm user theo email
- `findUserByUsername()` - Tìm user theo username
- `updateUser()` - Cập nhật thông tin user
- `checkEmailExists()` - Kiểm tra email tồn tại
- `insertRefreshToken()` - Tạo refresh token
- `deleteRefreshToken()` - Xóa refresh token
- `deleteAllRefreshTokensByUser()` - Xóa tất cả refresh tokens của user
- `createFollower()` - Tạo quan hệ follow
- `deleteFollower()` - Xóa quan hệ follow
- `countFollowers()` - Đếm số followers
- `countFollowing()` - Đếm số following
- `checkFriendshipStatus()` - Kiểm tra trạng thái bạn bè
- `searchUsers()` - Tìm kiếm users
- `getUserFollowers()` - Lấy danh sách followers
- `getUserFollowing()` - Lấy danh sách following

### MediasRepository:

- `createVideoStatus()` - Tạo video encoding status
- `findVideoStatusByName()` - Tìm video status theo tên
- `updateVideoStatus()` - Cập nhật video encoding status
- `deleteVideoStatus()` - Xóa video status
- `findVideoStatusesByStatus()` - Tìm videos theo trạng thái
- `countVideoStatusesByStatus()` - Đếm videos theo trạng thái
- `findPendingVideoStatuses()` - Tìm videos đang chờ encode
- `findProcessingVideoStatuses()` - Tìm videos đang được encode

## Backup Files:

- `TiktokPost.services.backup.ts` - Backup của TikTok Post service gốc
- `users.services.backup.ts` - Backup của Users service gốc

## Cấu trúc thư mục:

```
src/
├── repositories/
│   ├── TiktokPost.repository.ts
│   ├── hashtag.repository.ts
│   ├── bookmarks.repository.ts
│   ├── likes.repository.ts
│   ├── likesBookmarks.repository.ts
│   ├── users.repository.ts
│   ├── medias.repository.ts
│   └── README.md
└── services/
    ├── TiktokPost.services.ts
    ├── bookmarks.services.ts
    ├── likes.services.ts
    ├── users.services.ts
    ├── medias.services.ts
    ├── HLSVideoEncoder.ts
    ├── database.services.ts
    ├── TiktokPost.services.backup.ts
    └── users.services.backup.ts
```
