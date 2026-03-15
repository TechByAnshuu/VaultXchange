# VaultX Exchange

VaultX Exchange is a modern, premium banking simulation platform designed for secure and efficient financial management. It features a robust Spring Boot backend and a dynamic React frontend.

## 🚀 Features

- **Account Management**: Create and manage multiple accounts with ease.
- **Secure Transactions**: Transfer funds securely between accounts.
- **Real-time Alerts**: Get notified for important account activities via email.
- **Modern UI**: A sleek, dark-themed interface with smooth animations and responsive design.
- **Data Integrity**: Built with JPA/Hibernate and MySQL for reliable data persistence.

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.3
- **Language**: Java 17
- **Database**: MySQL 8.x
- **ORM**: Hibernate / Spring Data JPA
- **Build Tool**: Maven
- **Security & Validation**: Jakarta Validation, Lombok

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM 6
- **Styling**: Vanilla CSS (Custom Glassmorphism Design)
- **Icons**: Lucide React

## 📦 Installation & Setup

### Prerequisites
- JDK 17 or higher
- Node.js & npm
- MySQL Server

### 1. Backend Setup
1. Navigate to the root directory.
2. Configure your database in `.env` (copied from `.env.example`).
3. Run Maven to install dependencies:
   ```bash
   mvn clean install
   ```
4. Start the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

### 2. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `frontend/.env`.
4. Start the development server:
   ```bash
   npm run dev
   ```

## ⚙️ Configuration

The project uses `.env` files for environment-specific configurations. Make sure to create these from the provided `.env.example` templates in both the root and `frontend` directories.

- **Root `.env`**: Database credentials and backend port.
- **Frontend `.env`**: API URL and application branding.

## 🎨 Branding Note

**VaultX Exchange** styling:
- **Vault**: Navy Blue
- **X**: Red
- **Exchange**: Gray (Uppercase)

---
© 2026 VaultX Exchange. All rights reserved.
