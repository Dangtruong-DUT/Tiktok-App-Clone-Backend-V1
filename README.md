# TikTok Clone - Backend API

Note: This version includes only the Backend API. The frontend (user interface) is managed in a separate repository for independent development.

## Introduction

TikTok Clone Backend is a RESTful API built using TypeScript and Express.js, offering all the essential features for a short video sharing platform like TikTok. The project follows modern architecture, focusing on performance, security, and scalability.

## Technologies Used

### Core Platform

- Node.js
- TypeScript
- Express.js v5
- MongoDB
- Socket.IO

### Media Storage and Processing

- AWS S3 (media storage)
- AWS SES (email service)
- FFmpeg (video processing)
- HLS (HTTP Live Streaming)
- Sharp (image processing)
- Formidable (multipart parser)

### Authentication and Security

- JWT (JSON Web Token)
- Helmet (HTTP headers protection)
- Bcrypt (password hashing)
- CORS
- Zod & express-validator (data validation)

### Development Support

- Swagger / OpenAPI 3.0 (API documentation)
- ESLint & Prettier
- Nodemon (automatic reload)

## Key Features

### Authentication and Authorization

- Register and login with email/password
- OAuth (Google)
- JWT authentication with token refresh
- Email verification and password recovery
- Role-based authorization

### User Management

- Update personal profile
- Follow / Unfollow users
- Search and discover users
- Privacy settings

### Video and Media Management

- Upload video and image
- Encode video using HLS for smooth streaming
- Store and deliver via AWS S3
- Track video processing status

### Social Networking and Interactions

- Post with hashtags
- Like, comment, and share posts
- Bookmark posts
- Real-time notifications

### Real-Time Messaging

- Private messaging using WebSocket
- Manage conversations
- Track online status

### Search and Discovery

- Search for users, hashtags, and posts
- Suggest content based on behavior

## Folder Structure

```
src/
├── config/           # Application configuration
├── constants/        # Constants and enums
├── controllers/      # Request handlers
├── helpers/          # Utility functions
├── middlewares/      # Express middlewares
├── models/           # Data models
├── repositories/     # Database queries
├── routes/           # API routes
├── services/         # Business logic
│   └── aws/          # AWS integrations
├── socket/           # WebSocket handlers
├── swagger/          # API documentation
├── templates/        # Email templates
├── utils/            # Common utilities
└── validations/      # Input validations
```

## Installation & Running

### Requirements

- Node.js >= 18.x
- MongoDB >= 6.x
- FFmpeg (for video processing)
- AWS Account (S3 & SES)

### Setup Steps

```bash
git clone <repository-url>
cd Backend
npm install
```

Create a `.env` file and configure it according to the documentation (including DB, AWS, JWT, email, etc).

To run the development server:

```bash
npm run dev
```

## API Documentation

Automatically generated at:

```
http://localhost:3000/api-docs
```

### Available Modules

- Auth (Authentication)
- Users (User profiles)
- Posts (Videos, interactions)
- Media (Uploads and processing)
- Search
- Conversations (Messaging)
- Static (Static file serving)

## Useful Commands

| Command               | Description                 |
| --------------------- | --------------------------- |
| npm run dev           | Run server with auto-reload |
| npm run build         | Build for production        |
| npm start             | Start production server     |
| npm run lint          | Lint check                  |
| npm run lint\:fix     | Auto-fix lint errors        |
| npm run prettier      | Check code formatting       |
| npm run prettier\:fix | Fix formatting              |

## Media Types Supported

- IMAGE = 0
- VIDEO = 1
- HLS_VIDEO = 2

## Video Encoding Status

- PENDING = 0
- PROCESSING = 1
- COMPLETED = 2
- FAILED = 3

## Security

- Helmet, CORS, Bcrypt, JWT
- Strong data validation with Zod
- Rate limiting, injection & XSS protection

## Deployment

```bash
npm run build
npm start
```

## License

This project is licensed under the ISC License.

## Contribution

- Fork the repository
- Create a branch (`git checkout -b feature/xyz`)
- Commit changes (`git commit -m 'Add feature xyz'`)
- Push to GitHub
- Open a Pull Request

Note: The frontend is managed separately to ensure optimal workflow and system modularity.
