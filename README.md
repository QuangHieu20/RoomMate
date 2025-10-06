# 🏠 RoomMate - Tìm Phòng Trọ Thông Minh

## 📋 Tổng quan dự án

RoomMate là một nền tảng tìm kiếm phòng trọ thông minh, được phát triển để giải quyết những khó khăn khi tìm phòng trọ trên Facebook. Thay vì phải join nhiều group, chờ duyệt và lọc qua hàng trăm bài post không liên quan, RoomMate cung cấp một giải pháp tập trung và hiệu quả.

### ✨ Tính năng chính
- 🔍 **Tìm kiếm thông minh**: Lọc theo khu vực, giá cả, loại phòng
- 📱 **Giao diện thân thiện**: Responsive design, dễ sử dụng
- 🔐 **Bảo mật cao**: JWT authentication, HttpOnly cookies
- 📸 **Upload media**: Hỗ trợ ảnh và video
- 🌐 **Đa ngôn ngữ**: Tiếng Việt và Tiếng Anh
- 💬 **Chat realtime**: Liên hệ trực tiếp với chủ phòng

## 🛠️ Tech Stack

### Backend (NestJS)
- **Framework**: NestJS 11.0.1
- **Language**: TypeScript 5.7.3
- **Database**: PostgreSQL + Prisma 6.16.2
- **Authentication**: JWT + Passport + bcrypt
- **File Upload**: Multer 2.0.2
- **Validation**: class-validator + class-transformer
- **Testing**: Jest 30.0.0

### Frontend (Nuxt 4)
- **Framework**: Nuxt 4.1.2 + Vue 3.5.21
- **Styling**: Tailwind CSS 3.4.17 + DaisyUI 5.1.18
- **Validation**: VeeValidate 4.15.1 + Yup 1.7.1
- **Icons**: Heroicons Vue 2.2.0
- **Carousel**: Vue3-carousel 0.16.0
- **i18n**: @nuxtjs/i18n 10.1.0
- **Package Manager**: Yarn

### Infrastructure & DevOps
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL 15-alpine
- **Environment**: Development + Production ready

## 📁 Cấu trúc dự án

```
RoomMate/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   ├── posts/             # Posts module
│   │   ├── users/             # Users module
│   │   ├── prisma/            # Database service
│   │   └── common/            # Shared utilities
│   ├── prisma/                # Database schema & migrations
│   ├── uploads/               # File uploads
│   └── package.json
├── frontend/                  # Nuxt 4 Frontend
│   ├── app/
│   │   ├── components/        # Vue components
│   │   │   ├── base/         # Base UI components
│   │   │   └── forms/        # Form components
│   │   ├── composables/      # Vue composables
│   │   ├── pages/            # Pages/routes
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Utility functions
│   ├── i18n/locales/         # i18n translations
│   └── nuxt.config.ts
├── docker-compose.yml        # Docker services
├── .prettierrc               # Code formatting
└── README.md
```

## 🚀 Hướng dẫn Setup

### Prerequisites

- **Node.js**: 18+ 
- **Yarn**: Latest
- **Docker & Docker Compose**: Latest
- **Git**: Latest

### 1. Clone Repository

```bash
git clone <repository-url>
cd RoomMate
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
yarn install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Setup database
npx prisma generate
npx prisma db push

# Start development server
yarn start:dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
yarn install

# Start development server
yarn dev
```

### 4. Docker Setup (Alternative)

```bash
# Build and run all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 5. Docker Production Database Setup

```bash
# Start production services (Prisma migrations will run automatically)
docker-compose -f docker-compose.production.yml up -d

# Manual Prisma commands (if needed)
docker-compose -f docker-compose.production.yml exec roommate_be_prod npx prisma generate    # Generate client
docker-compose -f docker-compose.production.yml exec roommate_be_prod npx prisma db push     # Push schema
docker-compose -f docker-compose.production.yml exec roommate_be_prod npx prisma migrate deploy  # Deploy migrations
docker-compose -f docker-compose.production.yml exec roommate_be_prod npx prisma db seed      # Seed database
docker-compose -f docker-compose.production.yml exec roommate_be_prod npx prisma studio       # Open Prisma Studio
```

> **💡 Lưu ý**: Prisma migrations sẽ tự động chạy khi container backend khởi động nhờ `command` trong docker-compose.production.yml.

## 🔧 Development Commands

### Backend Commands

```bash
cd backend

# Development
yarn start:dev          # Start with hot reload
yarn start:debug        # Start with debug mode

# Database
npx prisma generate     # Generate Prisma client
npx prisma db push      # Push schema to database
npx prisma studio       # Open Prisma Studio

# Docker Production Database Commands
docker-compose -f docker-compose.production.yml exec roommate_be_prod npx prisma generate    # Generate client in container
docker-compose -f docker-compose.production.yml exec roommate_be_prod npx prisma db push     # Push schema in container
docker-compose -f docker-compose.production.yml exec roommate_be_prod npx prisma migrate deploy  # Deploy migrations
docker-compose -f docker-compose.production.yml exec roommate_be_prod npx prisma db seed      # Seed database (if configured)

# Testing
yarn test               # Run unit tests
yarn test:e2e           # Run e2e tests
yarn test:cov           # Run with coverage

# Build
yarn build              # Build for production
yarn start:prod         # Start production server
```

### Frontend Commands

```bash
cd frontend

# Development
yarn dev                # Start development server
yarn build              # Build for production
yarn preview            # Preview production build

# Code Quality
yarn lint               # Run ESLint
yarn format             # Format with Prettier
```

## 🌐 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Đăng nhập
- `POST /api/v1/auth/register` - Đăng ký
- `POST /api/v1/auth/logout` - Đăng xuất

### Posts
- `GET /api/v1/posts` - Lấy danh sách bài đăng
- `POST /api/v1/posts/create` - Tạo bài đăng mới
- `DELETE /api/v1/posts/:id` - Xóa bài đăng

### Users
- `GET /api/v1/users/profile` - Lấy thông tin user
- `PUT /api/v1/users/profile` - Cập nhật thông tin

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/roommate_db"
JWT_SECRET="your-jwt-secret"
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"
```

### Frontend (.env)
```env
NUXT_PUBLIC_API_BASE="http://localhost:3000/api/v1"
NUXT_PUBLIC_MEDIA_BASE="http://localhost:3000"
```

## 📱 Features

### ✅ Đã hoàn thành
- [x] Authentication (Login/Register)
- [x] Post Management (CRUD)
- [x] File Upload (Images/Videos)
- [x] Responsive Design
- [x] i18n Support (VI/EN)
- [x] Form Validation
- [x] Database Integration

### 🚧 Đang phát triển
- [ ] Real-time Chat
- [ ] Advanced Search Filters
- [ ] Push Notifications
- [ ] Payment Integration
- [ ] Admin Dashboard

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Nguyen Quang Hieu**
- GitHub: [@nguyenquanghieu](https://github.com/nguyenquanghieu)
- Email: your.email@example.com

---

**Last Updated**: 29/12/2024  
**Version**: 1.0.0-dev  
**Status**: 🚧 In Development
