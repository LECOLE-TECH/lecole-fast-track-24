# LECOLE 3rd Track

## Implementation
Built a Trello-like to-do app with a local-first approach. Key features include:

- **SQLite with WASM**: Integrated a SQLite database on the frontend using WASM and synced it with the backend every 15 seconds.
- **Drag-and-Drop Interface**: Implemented a smooth drag-and-drop experience using `react-dnd`.
- **Conflict Resolution**: Ensured consistency across backend and frontend by introducing fields like `isAdded` and `isDeleted` in the `todos` table to handle sync conflicts effectively.

### How to Run

1. **Install Dependencies**:
    ```
    npm install
    ```

2. **Start the Frontend**:
    ```
    npm run dev:server
    ```

3. **Start the Server**:
    ```
    npm run dev
    ```

4. Go to [http://localhost:5173/](http://localhost:5173/)