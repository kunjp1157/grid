
# The Grid: AI-Powered Crisis Management Platform

**The Grid** is a modern, web-based platform designed for real-time public crisis reporting and management. It serves as a comprehensive final-year project for an 8th-semester Computer Science student, demonstrating a wide range of advanced concepts including AI-driven automation, real-time communication, and data visualization.

The application connects citizens directly with crisis management administrators, enabling faster response times and more efficient resource allocation during emergencies.

---

## ✨ Core Features

The platform is rich with features that showcase a full-stack development skillset and an understanding of modern application architecture.

### 1. Dual User Roles (Citizen & Admin)
- **Citizen Portal**: Allows the public to sign up, submit detailed crisis reports, track their status, and provide feedback on resolution.
- **Admin Portal**: A powerful command center for administrators to manage incoming reports, oversee operations, and analyze system performance.
- **Role-Based Access Control (RBAC)**: Secure routing and middleware ensure that users can only access the dashboard and features appropriate for their role.

### 2. AI-Assisted Report Processing
- **Automated Categorization & Prioritization**: When a user submits a report, a multi-modal GenAI agent analyzes the description and any uploaded images to automatically assign a category (e.g., "Public Safety," "Utilities") and a priority level ("Low" to "Critical").
- **Visual Damage Assessment**: The AI model is prompted to perform a visual analysis of uploaded photos to determine the severity of an incident (e.g., distinguishing a small trash fire from a building fire), making its priority assessment highly accurate.
- **Geofencing & Smart Routing**: An AI flow uses the report's GPS coordinates to determine the correct operational zone and automatically assigns the report to the relevant administrator.

### 3. AI-Powered SOP Advisor
- **Dynamic Checklist Generation**: For "High" or "Critical" priority reports, an AI agent acts as a "Crisis Management Coordinator," instantly generating a dynamic Standard Operating Procedure (SOP) checklist for the administrator.
- **Interactive Guidance**: Admins can check off tasks as they complete them, ensuring that critical actions like "Dispatch nearest fire brigade" or "Notify police for traffic control" are followed systematically.

### 4. Live Eye-Witness Video Streaming
- **Real-time Video Feed**: Citizens can initiate a one-way live video stream from their phone's camera directly to the admin's dashboard, providing unparalleled situational awareness during an ongoing incident.
- **In-Dashboard Viewer**: Administrators can view the live stream directly within the report details page, enabling immediate and accurate assessment of the situation on the ground.

### 5. Performance Analytics Dashboard
- **Data Visualization**: An interactive "Overview" dashboard for admins provides charts and graphs to visualize key performance indicators.
- **Key Metrics**: At-a-glance cards display stats for Total Reports, Resolved, Overdue, and Average Resolution Time.
- **Data-Driven Insights**: Charts show the distribution of reports by type and the trend of report submissions over time.
- **Data Export**: Functionality to export all analytics data to a CSV file for further analysis or record-keeping.

### 6. Comprehensive User Profiles
- **Editable Personal & Emergency Information**: Users can view and edit their profile, including contact details, address, and critical information like blood group, medical conditions, and emergency contacts.
- **Role-Specific Stats**: The profile page displays relevant statistics, such as reports submitted for citizens and reports resolved for admins.

### 7. Knowledge Base & Multi-Language Support
- **First Aid & Preparedness Guides**: A built-in, searchable knowledge base provides citizens with essential information for handling emergencies like fires, floods, or medical incidents.
- **Internationalization (i18n)**: The entire application supports multiple languages (English and Hindi) with a simple language switcher, demonstrating an understanding of building global-ready applications.

---

## 🛠️ Technology Stack

This project utilizes a modern, robust technology stack favored by top tech companies.

- **Frontend**:
    - **Next.js**: React framework for building server-rendered and static web applications.
    - **React & TypeScript**: For building a type-safe, component-based UI.
    - **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
    - **ShadCN UI**: A collection of beautifully designed, accessible, and reusable components.
    - **Recharts**: For creating interactive data visualization charts.

- **Artificial Intelligence**:
    - **Genkit (by Google)**: An open-source framework for building production-ready AI applications.
    - **Google Gemini**: The underlying multi-modal AI model used for text analysis, visual assessment, and function calling.

- **Real-time & Backend Simulation**:
    - **Server Actions**: Next.js feature used for handling form submissions and data mutations on the server.
    - **Simulated WebRTC**: The "Live Eye" feature simulates a real-time video connection using browser MediaStream APIs.
    - **In-Memory Data**: The application uses mock data arrays to simulate a database, allowing it to be fully functional for demonstration purposes without a database setup.

---

## 🚀 Getting Started

To run the project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your Gemini API key:
    ```
    GEMINI_API_KEY=your_google_ai_studio_api_key
    ```

4.  **Run the development servers:**
    This project requires two development servers to run concurrently: one for the Next.js application and one for the Genkit AI flows.

    - **In your first terminal, run the Next.js app:**
      ```bash
      npm run dev
      ```
      This will start the main application, typically on `http://localhost:9002`.

    - **In your second terminal, run the Genkit flows:**
      ```bash
      npm run genkit:watch
      ```
      This will start the Genkit development server, which allows the Next.js app to communicate with the AI models.

5.  **Access the application:**
    Open your browser and navigate to `http://localhost:9002`. You can now use the application.

### Default Login Credentials

You can use the following default credentials to explore the different roles:

-   **Citizen Login**:
    -   **Email**: `citizen@example.com`
    -   **Password**: `password`
-   **Admin Login**:
    -   **Email**: `admin@example.com`
    -   **Password**: `password`
