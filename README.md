# RBAC Management System

Welcome to the **RBAC Management System**! This project demonstrates a Role-Based Access Control (RBAC) application with the following features:
- Manage Users
- Manage Roles
- Assign and Modify Permissions
- Animated and Responsive UI using **React**, **Framer Motion**, and **TailwindCSS**.

---

## Features

1. **Home Page**: A welcoming interface that links to different sections of the RBAC system.
2. **User Management**: View, add, edit, and delete users.
3. **Role Management**: View, add, edit, and delete roles with permissions.
4. **Permissions Management**: Assign or modify permissions for specific roles.
5. **Animation**: Enhanced user experience with smooth animations using **Framer Motion**.
6. **Backend**: Uses a **JSON Server** for simulating a REST API.

---

## Tech Stack

### Frontend:
- **React** with **Vite**
- **React Router** for routing
- **Framer Motion** for animations
- **TailwindCSS** for styling

### Backend:
- **JSON Server**: A mock backend to simulate APIs.

---

## Installation Guide

### Prerequisites:
Ensure you have the following installed on your system:
- **Node.js** (v16 or later)
- **npm** or **yarn**

---

### Setup

Frontend:

Copy code
cd rbac-ui
npm install



Start the Backend:
Navigate to the project directory:

Copy code
cd rbac-ui
Start the JSON Server:

Copy code
json-server --watch db.json --port 5000


Available Endpoints:
Users: http://localhost:5000/users
Roles: http://localhost:5000/roles
Permissions: http://localhost:5000/permissions