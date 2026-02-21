# 📝 FormFlow - Dynamic MERN Stack Form Builder

FormFlow is a full-stack, responsive form-building application inspired by Google Forms. It allows users to easily create custom forms using an intuitive drag-and-drop interface, featuring a unique "Smart Fields" system that automatically generates fully-configured inputs for common data types.

## ✨ Key Features

* **Drag-and-Drop Interface:** Easily build forms by dragging question types from a sticky left sidebar onto the main canvas (powered by `dnd-kit`).
* **Smart Fields:** Instantly add pre-configured fields like "Full Name", "Email Address", or "Phone Number" with automatic validation and type-setting.
* **In-Card Editing:** Change a question's type, duplicate it, or delete it directly from the question card without starting over.
* **Live Preview:** Toggle between "Edit" and "Preview" modes to see exactly what respondents will see.
* **SaaS Professional UI:** A clean, modern interface built with Tailwind CSS, featuring active-state highlights and smooth transitions.
* **Full-Stack MERN:** Robust backend API for saving form schemas and collecting user responses.

## 🛠️ Tech Stack

**Frontend:**
* React.js
* Tailwind CSS (Styling)
* `dnd-kit` (Drag and Drop functionality)
* Lucide React (Icons)
* Vite (Build Tool)

**Backend:**
* Node.js
* Express.js
* MongoDB & Mongoose (Database & ORM)
* CORS & dotenv

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

* [Node.js](https://nodejs.org/) (v16 or higher)
* [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas URI)

### 1. Clone the Repository

```bash
git clone [https://github.com/utkarshbinekar/FormFlow.git](https://github.com/utkarshbinekar/FormFlow.git)
cd FormFlow
```

### 2. Backend Setup
Open a terminal and navigate to the backend folder:

```bash
cd backend
npm install
```

Create a .env file in the backend directory and add the following:

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
```

Start the backend server:

```bash
npm run dev
```
(The server should now be running on http://localhost:5000)

### 3. Frontend Setup
Open a new terminal window and navigate to the frontend folder:
```bash
cd frontend
npm install
```

Create a .env file in the frontend directory (if using Vite, use VITE_ prefix):
```text
VITE_API_URL=http://localhost:5000/api
```

Start the React development server:
```bash
npm run dev
```
(The frontend should now be running on http://localhost:5173)

### 📂 Folder Structure (Overview)
```text
FormFlow/
├── backend/
│   ├── models/         # Mongoose Schemas (Form, Response)
│   ├── routes/         # Express API Routes
│   ├── controllers/    # Route logic
│   ├── server.js       # Entry point
│   └── .env            
└── frontend/
    ├── src/
    │   ├── components/ # Reusable UI components (Sidebar, Canvas, Cards)
    │   ├── context/    # State management for form data
    │   ├── utils/      # Helpers (Smart Field mappings, ID generators)
    │   ├── App.jsx     # Main React component
    │   └── main.jsx    
    ├── tailwind.config.js
    └── package.json
```

### 🎯 How to Use
Create a Form: Open the app and give your form a title and description.

-Add Questions: Drag standard elements (Short Answer, Multiple Choice, etc.) from the left sidebar to the canvas.

-Use Smart Fields: Click or drag a Smart Field (e.g., "Email") to instantly generate a validated question block.

-Edit Questions: Click on any question card to make it active. Type your question, add options, or use the top-right dropdown to change the question type dynamically.

-Save & Preview: Save your progress and click the "Preview" toggle (eye icon) to view the final output.