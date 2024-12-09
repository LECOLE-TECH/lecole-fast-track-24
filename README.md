# Product Management CRUD App

A simple and elegant CRUD (Create, Read, Update, Delete) application for managing products. This project showcases clean code practices, reusable components, and optimized performance techniques.


## ✨ Features

- **CRUD Functionalities**: Add, view, update, and delete products seamlessly.
- **Reusable Alert System**: Context-based popup notifications to give users feedback on operations.
- **Pagination**: Paginated product list for better navigation and data organization.
- **Performance Optimization**: Efficient state management using `useMemo` and `useCallback` to avoid unnecessary re-renders.

---

## 🛠️ Technologies Used

- **Frontend**: React (with hooks like `useState`, `useEffect`, `useCallback`, and `useMemo`)
- **Styling**: TailwindCSS for rapid and responsive UI design.
- **Backend API**: Integration with API functions for CRUD operations (`createProduct`, `fetchProducts`, etc.).
- **Popup Notifications**: TailwindCSS-based alert system using `useContext`.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) package manager

### Installation


1. **Install Dependencies**:
    ```
    npm install
    ```

2. **Start the Frontend**:
    ```
    npm run dev
    ```

3. **Start the Server**:
    ```
    npm run dev:server
    ```

4. Open [http://localhost:5173/](http://localhost:5173/) or whatever the port your front end decide to run on

## Challenges

    One of the most challenging aspects of this project was implementing frontend pagination. Determining how many pages should be visible around the current page and deciding when to include ellipses required careful thought and balancing usability with simplicity. I spent more time than anticipated fine-tuning the logic to ensure a seamless and intuitive user experience.