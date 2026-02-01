
# The Grid: AI-Powered Crisis Management Platform

**The Grid** is a modern, web-based platform designed for real-time public crisis reporting and management. It serves as a comprehensive final-year project for a Computer Science student, demonstrating a wide range of advanced concepts including AI-driven automation, real-time communication, data visualization, and community collaboration tools.

The application connects citizens directly with crisis management administrators, enabling faster response times and more efficient resource allocation during emergencies. It is designed to be resilient, accessible, and proactive, moving beyond simple reporting to become a complete crisis ecosystem.

---

## ✨ Core Features

The platform is rich with features that showcase a full-stack development skillset and a deep understanding of modern, resilient, and intelligent application architecture.

### 1. Dual User Roles with Robust Access Control
- **Citizen Portal**: Allows the public to sign up, submit detailed crisis reports, track their status, and provide feedback on resolution.
- **Admin Portal**: A powerful command center for administrators to manage incoming reports, oversee operations, analyze system performance, and dispatch resources.
- **Role-Based Access Control (RBAC)**: Secure routing and middleware ensure that users can only access the dashboards and features appropriate for their role.

### 2. AI-Assisted Report Processing
- **Automated Categorization & Prioritization**: When a user submits a report, a multi-modal GenAI agent analyzes the description and any uploaded images to automatically assign a category (e.g., "Public Safety," "Utilities") and a priority level ("Low" to "Critical").
- **Visual Damage Assessment**: The AI model performs a visual analysis of uploaded photos to determine the severity of an incident (e.g., distinguishing a small trash fire from a building fire), making its priority assessment highly accurate.
- **Geofencing & Smart Routing**: An AI flow uses the report's GPS coordinates to determine the correct operational zone and automatically assigns the report to the relevant administrator.

### 3. Proactive AI "Cascading Risk" Prediction
- **Predictive Hazard Analysis**: When a report for a primary crisis (e.g., "Heavy Flooding") is filed, an AI agent proactively analyzes the situation and predicts likely secondary or "cascading" hazards.
- **Actionable Intelligence**: It generates warnings for potential follow-on events like "Power Outages," "Water Contamination," or "Traffic Gridlock," allowing admins to prepare and respond preemptively. This moves the platform from being reactive to proactive.

### 4. AI-Powered SOP Advisor
- **Dynamic Checklist Generation**: For "High" or "Critical" priority reports, an AI agent acts as a "Crisis Management Coordinator," instantly generating a dynamic Standard Operating Procedure (SOP) checklist for the administrator.
- **Interactive Guidance**: Admins can check off tasks as they complete them, ensuring that critical actions like "Dispatch nearest fire brigade" or "Notify police for traffic control" are followed systematically.

### 5. AI "Rumor Control" & Fact-Checking
- **Misinformation Analysis**: An admin tool allows pasting in a social media rumor (e.g., "The main bridge has collapsed!").
- **Fact-Checking Against Official Data**: The AI compares the rumor against the database of verified reports and provides a conclusion: "Supported," "Not Supported," or "Unverified," along with its reasoning. This helps combat the spread of fake news during a crisis.

### 6. Voice-Activated "Panic Mode"
- **Instant Audio Reporting**: For users in immediate danger who cannot type, a large "SOS" button allows them to press and hold to record a voice message.
- **AI Transcription & Analysis**: On release, the audio is sent to an AI flow that transcribes the message, extracts the emergency type, and automatically files a high-priority report with the user's current location.

### 7. Community & Volunteer Management
- **Verified Volunteer Dispatch**: Citizens can register as volunteers and list their skills (e.g., CPR, Driving). Admins can "broadcast" tasks to nearby, qualified volunteers who can then accept the "gig," turning passive citizens into an active response force.
- **Community Resource Mapping**: Citizens can "pin" available resources on a community board, such as "Clean Water," "First Aid Kits," or "Safe Shelter." This crowdsources solutions and allows neighbors to help each other directly.
- **The Barter Board**: A peer-to-peer exchange platform where users can post items they have and items they need, facilitating trade when normal currency may be useless (e.g., "HAVE: Power Bank, NEED: Baby Formula").

### 8. Humanitarian AI Tools
- **"Missing Persons" AI Matcher**: Users can upload a photo of a missing person and a group photo from a shelter. A vision AI model compares the images and provides a confidence score on whether a match has been found, helping to reunite families.
- **"Psychological First Aid" Chatbot**: An empathetic AI chatbot named "Aura" provides emotional support, using calming language and grounding techniques to help users manage stress and panic during a crisis.

### 9. Resilient & Accessible Design
- **Offline-First Reporting**: Citizens can create and save a crisis report even without an internet connection. The app stores it locally and automatically submits it once connectivity is restored.
- **Multi-Language Support**: The entire application supports 22+ languages, including regional Indian languages, making it accessible to a diverse, global audience.
- **Digital Medical ID**: Each user profile features a QR code that contains their critical medical information (blood group, allergies, emergency contact). First responders can scan this to get instant access to vital data if a user is incapacitated.

### 10. Comprehensive Dashboards & Profiles
- **Performance Analytics Dashboard**: An interactive "Overview" dashboard for admins provides charts and graphs to visualize key metrics like report volume, resolution times, and report types. Data can be exported to CSV.
- **Detailed User Profiles**: All users can view and edit their profiles, including personal, contact, and emergency information. Profiles also display role-specific statistics (reports submitted for citizens, reports resolved for admins).
- **Feedback Mechanism**: Citizens can rate the resolution of their reports and provide comments, giving administrators valuable feedback to improve services.

---

## 🛠️ Technology Stack

This project utilizes a modern, robust technology stack favored by top tech companies.

- **Frontend**:
    - **Next.js & React**: For building a server-rendered, component-based UI with TypeScript.
    - **Tailwind CSS & ShadCN UI**: For rapid, accessible, and beautiful UI development.
    - **Recharts**: For creating interactive data visualization charts.

- **Artificial Intelligence**:
    - **Genkit (by Google)**: An open-source framework for building production-ready AI applications.
    - **Google Gemini**: The underlying multi-modal AI model used for text analysis, visual assessment, and function calling.

- **Real-time & Backend Simulation**:
    - **Next.js Server Actions**: Used for handling form submissions and data mutations on the server.
    - **In-Memory Data**: The application uses mock data arrays to simulate a database, allowing it to be fully functional for demonstration purposes without a database setup.
    - **Browser APIs**: Utilizes `localStorage` for offline storage and `MediaRecorder` for audio capture.

- **Internationalization (i18n)**:
    - **React Context & JSON**: A custom, lightweight i18n system supporting over 22 languages.

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
    -   **Email**: `kunjp1157@gmail.com`
    -   **Password**: `Kunj@2810`
