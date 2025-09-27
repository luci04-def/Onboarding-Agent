# 🚀 Project Backend

This is a **Node.js + Express backend server** built for handling authentication, APIs, and secure communication between clients and the database. It includes JWT authentication, environment variable support, and middleware for logging & cross-origin access.

---

## 📂 Project Structure
<img width="496" height="574" alt="image" src="https://github.com/user-attachments/assets/dfa02f75-bc2c-4100-a665-047a97f5cc0f" />

## ⚙️ Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd Project/server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## 🔑 Environment Variables

Create a `.env` file inside `/server` with the following:

```
PORT=5000
JWT_SECRET=your-secret-key
```

You can add more variables as required (like database connection strings).

---

## ▶️ Running the Server

Start the development server:

```bash
npm start
```

The backend will be running at:

```
http://localhost:5000
```

---

## 🛠 Features

- ✅ **Express.js** server for API handling  
- ✅ **CORS enabled** for secure frontend-backend communication  
- ✅ **JWT authentication** support  
- ✅ **dotenv** for secure environment configuration  
- ✅ **morgan** for request logging  
- ✅ **UUID** for unique identifiers  

---

## 🌟 Advantages (for Presentation / Judges)

- **Secure & Scalable** → Uses JWT + environment variables for security.  
- **Easy Integration** → Works with any frontend (React, Angular, Vue, etc.).  
- **Lightweight** → Minimal dependencies for faster performance.  
- **Extendable** → Can easily add database, routes, and more.  
- **Developer Friendly** → Clean code structure & logging support.  
