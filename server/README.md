# LECOLE Fast Track 24 Backend

Welcome to the backend of the **LECOLE Fast Track 24** application. This backend is built using **Express.js** and **SQLite3**, providing a robust and scalable API for managing products. The project follows a modular architecture to ensure maintainability and ease of development.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Configuration](#configuration)
  - [Running the Server](#running-the-server)
  - [Seeding the Database](#seeding-the-database)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
  - [Endpoints](#endpoints)
- [Environment Variables](#environment-variables)
- [Error Handling](#error-handling)
- [Logging](#logging)
- [Deployment](#deployment)
  - [Docker Deployment](#docker-deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- **CRUD Operations**: Create, Read, Update, and Delete products.
- **Modular Architecture**: Organized into controllers, models, routes, middleware, and utilities.
- **Database Management**: Uses SQLite3 for lightweight and efficient data storage.
- **Environment Configuration**: Managed via environment variables for flexibility.
- **Error Handling**: Centralized error handling middleware.
- **Logging**: Request logging for monitoring and debugging.
- **Health Check Endpoint**: Verify the server's status.

## Getting Started

### Prerequisites

- **Node.js** (v14 or later)
- **Yarn** (preferred) or **npm**
- **Docker** (optional, for containerization)

### Configuration

1. **Environment Variables**

   Create a `.env` file in the root directory to configure environment variables:

   ```env
   PORT=3000
   DB_PATH=./database/products.db
   CORS_ORIGIN=http://localhost:5173
   ```

   - `PORT`: The port on which the server will run.
   - `DB_PATH`: Path to the SQLite database file.
   - `CORS_ORIGIN`: Allowed origin for CORS.

2. **Database Setup**

   Ensure the `database` directory exists. The SQLite database will be created automatically if it doesn't exist.

### Running the Server

**Start in Development Mode**

```bash
yarn dev:server
```

### Seeding the Database

To populate the database with initial product data, run the seeding script:

```bash
yarn seed
```

This script inserts predefined products into the `products` table if the table is empty.

## Project Structure

The backend follows a modular structure for clarity and scalability:

📦server<br>
┣ 📂controllers<br>
┃ ┗ 📜productController.js<br>
┣ 📂database<br>
┃ ┣ 📜db.js<br>
┃ ┗ 📜seed.js<br>
┣ 📂middleware<br>
┃ ┗ 📜errorHandler.js<br>
┣ 📂models<br>
┃ ┗ 📜productModel.js<br>
┣ 📂routes<br>
┃ ┗ 📜productRoutes.js<br>
┣ 📂utils<br>
┃ ┗ 📜logger.js<br>
┣ 📜.env<br>
┣ 📜index.js<br>
┗ 📜README.md<br>

## API Documentation

### Endpoints

#### 1. Get All Products

- **URL**: `/api/product`
- **Method**: `GET`
- **Description**: Retrieves a list of all products.
- **Response**:

  ```json
  [
    {
      "id": 1,
      "name": "Product A",
      "description": "Description of Product A",
      "price": 19.99,
      "stock": 100
    },
    ...
  ]
  ```

#### 2. Get Product by ID

- **URL**: `/api/product/:id`
- **Method**: `GET`
- **Description**: Retrieves a single product by its ID.
- **Parameters**:
  - `id` (path) - ID of the product to retrieve.
- **Response**:

  ```json
  {
  	"id": 1,
  	"name": "Product A",
  	"description": "Description of Product A",
  	"price": 19.99,
  	"stock": 100
  }
  ```

#### 3. Create a New Product

- **URL**: `/api/product`
- **Method**: `POST`
- **Description**: Creates a new product.
- **Body**:

  ```json
  {
  	"name": "Product Name",
  	"description": "Product Description",
  	"price": 29.99,
  	"stock": 50
  }
  ```

- **Response**:

  ```json
  {
  	"id": 2,
  	"name": "Product Name",
  	"description": "Product Description",
  	"price": 29.99,
  	"stock": 50
  }
  ```

#### 4. Update an Existing Product

- **URL**: `/api/product/:id`
- **Method**: `PUT`
- **Description**: Updates an existing product by its ID.
- **Parameters**:
  - `id` (path) - ID of the product to update.
- **Body**:

  ```json
  {
  	"name": "Updated Product Name",
  	"description": "Updated Description",
  	"price": 24.99,
  	"stock": 75
  }
  ```

- **Response**:

  ```json
  {
  	"id": 2,
  	"name": "Updated Product Name",
  	"description": "Updated Description",
  	"price": 24.99,
  	"stock": 75,
  	"changes": 1
  }
  ```

#### 5. Delete a Product

- **URL**: `/api/product/:id`
- **Method**: `DELETE`
- **Description**: Deletes a product by its ID.
- **Parameters**:
  - `id` (path) - ID of the product to delete.
- **Response**: `204 No Content`