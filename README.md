# RoomMate Project

## 📋 Tổng quan dự án

H là 1 developer, do công ty xa nhà nên H quyết định lên facebook  tìm phòng trọ nhưng vì phải join 1 đống group, mất rất nhiều thời gian do chờ duyệt vào group và rất nhiều bài post không liên quan đến phòng trọ H cần tìm, vì sự bực tức đó project này ra đời.

## 🛠️ Công nghệ sử dụng

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL

### Frontend
- **Framework**: Nuxt.js
- **Language**: TypeScript
- **UI Library**: Tailwind CSS
- **State Management**: Pinia

### Infrastructure & DevOps
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **Database**: PostgreSQL
- **Environment**: Development (Local)

## 📦 Versions

### Infrastructure
- **Docker**: Latest
- **Docker Compose**: 3.8
- **PostgreSQL**: 15-alpine
- **Nginx**: alpine
- **Node.js**: 20-alpine

## 🚀 Hướng dẫn Setup Môi trường Local

### Prerequisites
- Docker & Docker Compose
- Git
- Terminal/Command Line

### 1. Clone Repository
```bash
git clone <repository-url>
cd RoomMate
```

### 2. Cấu trúc Project
```
RoomMate/
├── backend/                 # NestJS Backend
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # Nuxt.js Frontend
│   ├── app/
│   ├── package.json
│   └── nuxt.config.ts
├── .docker/               # Docker configurations
│   └── local/
│       ├── backend/
│       │   └── Dockerfile
│       └── nginx/
│           └── nginx.conf
├── docker-compose.yml     # Docker services orchestration
└── README.md
```

### 3. Khởi động Services

#### Cách 1: Khởi động tất cả services
```bash
# Build và chạy tất cả services
docker-compose up --build -d

# Xem logs
docker-compose logs -f

# Xem trạng thái services
docker-compose ps
```


### 3. Kiểm tra Services

#### Backend (NestJS)
```bash
# Test API trực tiếp
curl http://localhost:3000

# Xem logs backend
docker-compose logs -f backend
```

#### Frontend (Nuxt.js)
```bash
# Test frontend
curl http://localhost:3001

# Xem logs frontend
docker-compose logs -f frontend
```

#### Database (PostgreSQL)
```bash
# Kết nối database
docker exec -it roommate_postgres psql -U roommate_user -d roommate_db

# Xem databases
docker exec roommate_postgres psql -U roommate_user -d postgres -c "\l"

# Xem tables
docker exec roommate_postgres psql -U roommate_user -d roommate_db -c "\dt"
```

#### Nginx (Reverse Proxy)
```bash
# Test qua nginx
curl http://localhost:80

# Test health check
curl http://localhost:80/health

# Xem logs nginx
docker-compose logs -f nginx
```
vices
```bash
# Rebuild chỉ backend
docker-compose build backend

# Rebuild và restart
docker-compose up --build backend -d

# Rebuild tất cả
docker-compose build
```
**Last Updated**: 24/09/2025
**Version**: 1.0.0-dev