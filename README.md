# TikTok Clone 2025 - Backend API

A personal project replicating TikTok's core features, built with **Node.js + TypeScript + Express.js (backend)** and **Next.js (frontend)** to practice full-stack development.

> Author: **Nguyễn Đăng Trường**

> API Docs: [api.taplamit.tech/api-docs/](https://api.taplamit.tech/api-docs/)

> Live Demo: [taplamit.tech](https://taplamit.tech)
---

## Technologies Used

![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178c6?logo=typescript)
![Express.js](https://img.shields.io/badge/Express.js-5-404D59?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?logo=mongodb)
![Socket.IO](https://img.shields.io/badge/Socket.IO-%20-010101?logo=socket.io)
![AWS S3](https://img.shields.io/badge/AWS%20S3-%20-FF9900?logo=amazon-aws)
![AWS SES](https://img.shields.io/badge/AWS%20SES-%20-FF9900?logo=amazon-aws)
![FFmpeg](https://img.shields.io/badge/FFmpeg-%20-007808?logo=ffmpeg)
![HLS](https://img.shields.io/badge/HLS-%20-FF0000?logo=video)
![Zod](https://img.shields.io/badge/Zod-%20-6E4AFF?logo=zod)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203.0-85EA2D?logo=swagger)
![ESLint](https://img.shields.io/badge/ESLint-%20-4B32C3?logo=eslint)
![Prettier](https://img.shields.io/badge/Prettier-%20-F7B93E?logo=prettier)
![Docker](https://img.shields.io/badge/Docker-%20-2496ED?logo=docker)

---

## Features

- **Authentication:** Email/password, Google OAuth, JWT, refresh tokens, email verification, password reset, role-based access.
- **User Management:** Profiles, follow/unfollow, search, privacy settings.
- **Video/Media:** Upload, image/video encoding, HLS streaming, AWS S3 storage, FFmpeg processing, status tracking.
- **Social Interactions:** Likes, comments, hashtags, shares, bookmarks, notifications.
- **Real-time Messaging:** Private chats, conversations, online status, Socket.IO.
- **Search & Discovery:** Search users/posts/hashtags, content suggestion.
- **Security:** Helmet, CORS, Bcrypt, Zod validation, rate limiting, XSS & injection prevention.
- **Docs:** OpenAPI 3.0 (Swagger) at `/api-docs`
- **Dev Experience:** ESLint, Prettier, Nodemon.

---

## Folder Structure

```
src/
├── config/           # App configuration
├── constants/        # Enums, constants
├── controllers/      # Request handlers
├── helpers/          # Utility functions
├── middlewares/      # Express middlewares
├── models/           # Mongoose models
├── repositories/     # Database queries
├── routes/           # API routes
├── services/         # Business logic
│   └── aws/          # AWS integrations
├── socket/           # WebSocket handlers
├── docs/
│   └── swagger/      # API docs
├── templates/        # Email templates
├── utils/            # Common utilities
└── validations/      # Input validation
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.x
- MongoDB >= 6.x
- FFmpeg (for video processing)
- AWS account (S3, SES)

### Installation & Running

```bash
git clone <repository-url>
cd Backend
npm install
```

Create a `.env` file and configure (DB, AWS, JWT, email, ...).

To start the server:

```bash
npm run dev
```

---

## API Documentation

- **Swagger UI:** [https://api.taplamit.tech/api-docs/](https://api.taplamit.tech/api-docs/)
- **Local:** `http://localhost:3000/api-docs`

### Main Modules

- Auth (authentication, OAuth)
- Users (profile, follow, search)
- Posts (videos, interactions)
- Media (upload, HLS, S3)
- Search
- Conversations (messaging)
- Static (file serving)

---

## Useful Commands

| Command                | Description                 |
| ---------------------- | --------------------------- |
| npm run dev            | Dev server with hot reload  |
| npm run build          | Build for production        |
| npm start              | Start prod server           |
| npm run lint           | Lint check                  |
| npm run lint:fix       | Auto-fix lint errors        |
| npm run prettier       | Check formatting            |
| npm run prettier:fix   | Auto-fix formatting         |

---

## Media Types Supported

- `IMAGE = 0`
- `VIDEO = 1`
- `HLS_VIDEO = 2`

## Video Encoding Status

- `PENDING = 0`
- `PROCESSING = 1`
- `COMPLETED = 2`
- `FAILED = 3`

---

## Security

- Helmet, CORS, Bcrypt, JWT, Zod validation
- Rate limiting, XSS, injection protection

---

## Deployment

```bash
npm run build
npm start:production
```

---

##  Contribution

1. Fork the repository
2. Create a branch (`git checkout -b feature/xyz`)
3. Commit changes (`git commit -m 'Add feature xyz'`)
4. Push to GitHub
5. Open a Pull Request

*Note: Frontend managed separately for modularity and optimal workflow.*

---


## License

Licensed under the ISC License.
