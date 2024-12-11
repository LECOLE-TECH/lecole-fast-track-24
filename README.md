# Welcome to LECOLE Fast Track 24

## User Admin Live Update Application

This application enables users to create accounts and manage behavior based on their roles. It also provides real-time updates using **Socket.IO** for smooth and instant communication.

### Features

- **Role-Based Notifications:**
  - Notify admin users whenever a secret is updated.
  - Notify individual users when their secrets are modified.
  - Notify all users when a new user registers.
  
- **Additional Functionality:**
  - Pagination for efficient feedback management.
  - Real-time notifications for user interactions.
  - Secure backend with **JWT authentication** and **password encryption**.

---

## How to Run

To set up and run the application locally, follow these steps:

1. **Intall dependencies**
   ```
   yarn install
   ```
NOTE: If you got error while installing please delete the package-lock.json and this line in package.json:     
  ```
  "lecole-fast-track-24": "file:", 
  ```

2. **Start the Server:**
   ```
   npm run dev:server
   ```

3. **Start the Client:**
   ```
   npm run dev
   ```

4. **Access the Application:**
    Open [http://localhost:5173/](http://localhost:5173/)