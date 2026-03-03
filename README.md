
# The Grid: AI-Powered Crisis Management Platform

**The Grid** is a modern, web-based platform designed for real-time public crisis reporting and management. It connects citizens directly with crisis management administrators, enabling faster response times and more efficient resource allocation.

---

## 🛠️ Database Structure (Local XAMPP/MySQL)

If you are planning to connect this application to a local MySQL database (via XAMPP), the following 8 tables are required:

1.  **`users`**: Manages all user profiles (Citizens & Admins), including medical info and volunteer status.
2.  **`zones`**: Defines operational zones for crisis management.
3.  **`reports`**: The core table for incident reports, priorities, and status tracking.
4.  **`report_messages`**: Stores the chat history between citizens and admins for specific reports.
5.  **`community_resources`**: Tracks shared community resources like clean water and shelter.
6.  **`volunteer_tasks`**: Stores tasks created by admins for volunteers.
7.  **`volunteer_assignments`**: Links volunteers to the tasks they have accepted.
8.  **`barter_posts`**: Manages the peer-to-peer item exchange board.

A complete SQL schema is available in `docs/xampp_mysql_schema.sql`.

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
