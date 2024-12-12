# LECOLE Track Two Server

## Features
- JWT authentication
- Manage user data using Prisma ORM.
- Pre-configured SQLite database for easy setup.
- Auto-seeding of user data.
- Ready for extension with additional endpoints.

## Prerequisites
- Node.js (v16 or later)

## Getting Started

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/Hoang-Nguyen-Huy/lecole-fast-track-24.git
cd lecole-fast-track-24
```

#### 2. Install Dependencies
```bash
yarn install
```

#### 3. Set up env
- Create ```.env``` file:
```bash
DATABASE_URL="file:./database/user.db"
VITE_API_BASE_URL="http://localhost:3000"

SECRET_KEY="your_secret_key"

ALGORITHM="aes-256-cbc"

JWT_SECRET="your_jwt_secret"
SESSION_SECRET="your_session_secret"
```

#### 4. Seed the Database
```bash
yarn prisma migrate dev --name init

node prisma/seed.js
```

#### 5. Start the server
```bash
yarn dev:server
```

# Available API Endpoints

## Get All Users
- Endpoint: /api/user
- Method: GET
- Description: Fetch all users from the database.

## Get User By ID
- Endpoint: /api/user/{id}
- Method: GET
- Description: Fetch user by id from the database.

## Create User
- Endpoint: /api/user
- Method: POST
- Description: Add a new user to the database.

## Update User
- Endpoint: /api/user/{id}
- Method: PATCH
- Description: Update user information from the database.

## Delete Product
- Endpoint: /api/user/{id}
- Method: DELETE
- Description: Delete user from the database.
