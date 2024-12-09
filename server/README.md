# LECOLE Track One Server

## Features
- Create, Read, and Manage product data using Prisma ORM.
- Pre-configured SQLite database for easy setup.
- Auto-seeding of product data.
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
DATABASE_URL="file:./database/products.db"
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

## Get All Products
- Endpoint: /api/product
- Method: GET
- Description: Fetch all products from the database.

## Get Product By ID
- Endpoint: /api/product/{id}
- Method: GET
- Description: Fetch product by id from the database.

## Create Product
- Endpoint: /api/product
- Method: POST
- Description: Add a new product to the database.

## Update Product
- Endpoint: /api/product/{id}
- Method: PATCH
- Description: Update product information from the database.

## Delete Product
- Endpoint: /api/product/{id}
- Method: DELETE
- Description: Delete product from the database.
