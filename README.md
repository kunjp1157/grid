
# The Grid: AI-Powered Crisis Management Platform

**The Grid** is a modern, web-based platform designed for real-time public crisis reporting and management. It connects citizens directly with crisis management administrators, enabling faster response times and more efficient resource allocation.

---

## 🛠️ Database Setup (Local XAMPP/MySQL)

To connect this application to a local MySQL database via XAMPP, follow these steps:

### 1. Start XAMPP
- Open the **XAMPP Control Panel**.
- Start the **Apache** and **MySQL** modules.

### 2. Create the Database
- Open your browser and go to [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
- Click on **New** in the left sidebar.
- Enter Database name: `the_grid_db` and click **Create**.

### 3. Import the Schema
- Select the `the_grid_db` database you just created.
- Click on the **Import** tab at the top.
- Click **Choose File** and select the SQL file located at: `docs/xampp_mysql_schema.sql`.
- Scroll down and click **Import** (or **Go**).

### 4. Configure Environment Variables
- Create a `.env` file in the root of your project (if not already present).
- Add the following database configuration:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=the_grid_db
GEMINI_API_KEY=your_api_key_here
```

### 5. Note on Implementation
The current version of the app uses a **Local JSON Database** (`database.json`) for zero-config setup. To switch to a live MySQL connection:
1. Install a database driver: `npm install mysql2`.
2. Update the logic in `src/lib/local-db.ts` to use MySQL queries instead of file system operations.

---

## ✨ Core Features

### 1. Dual User Roles
- **Citizen Portal**: Report crises, track status, offer resources, and volunteer.
- **Admin Portal**: Command center for managing reports, dispatching volunteers, and rumor control.

### 2. AI Features (Powered by Google Gemini & Genkit)
- **Auto-Categorization**: Automatically identifies the type and priority of a crisis from text or images.
- **SOP Advisor**: Generates step-by-step emergency protocols for admins.
- **Predictive Hazards**: Predicts secondary risks (e.g., flooding leading to power outages).
- **Rumor Control**: Fact-checks social media rumors against official verified reports.
- **Missing Persons Matcher**: Uses Vision AI to find matches between missing person photos and shelter crowd photos.
- **Voice SOS**: Transcribes and analyzes audio recordings to file emergency reports instantly.

---

## 🚀 Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    Create a `.env` file and add your `GEMINI_API_KEY`.

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```

### Default Login Credentials
- **Admin Login**:
    - **Email**: `kunjp1157@gmail.com`
    - **Password**: `Kunj@2810`
- **Citizen Login**:
    - **Email**: `citizen@example.com`
    - **Password**: `password`
