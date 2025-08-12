# NTSA Road Safety Program Management Platform

A comprehensive React-based dashboard designed for Kenya's National Transport and Safety Authority (NTSA) to plan, manage, and report on road safety initiatives across the country.

## Core Features

- **Dynamic Dashboard:** Get a real-time, at-a-glance overview of all programs, activities, and tasks. Key metrics include total budget, task completion rates, overdue tasks, and program progress.
- **Reporting & Analytics:** A powerful reporting suite with dynamic charts visualizing key performance indicators, including monthly task performance, budget allocation by program, and activity volume.
- **Program Management:** A hierarchical system to manage large-scale **Programs**, which are broken down into **Activities**, and further into actionable **Tasks**.
- **Role-Based Access Control (RBAC):** A sophisticated permission system that provides tailored access and capabilities to different user roles, ensuring data security and operational efficiency.
- **Resource Center:** A centralized repository for essential documents, guidelines, and training materials, complete with category filtering and full-text search.
- **Stakeholder Management:** A complete directory of all internal and external stakeholders, with tools for searching, sorting, and managing engagement levels.

## Role-Based Access Control (RBAC)

The platform uses a delegated administration model to mirror a real-world organizational structure. Permissions are granted based on the principle of least privilege.

| Role              | Key Responsibilities                                                                                             |
|-------------------|------------------------------------------------------------------------------------------------------------------|
| **Program Manager** | Creates and manages top-level Programs. Has global read-only access to all data.                                 |
| **Supervisor**      | Manages Team Leads and approves task reports submitted by them. Has read-access to regional data.                |
| **Team Lead**       | Manages Team Members, assigns them to tasks, and submits reports on task completion.                             |
| **Team Member**     | Executes assigned tasks. Work is reported by their Team Lead.                                                    |

## Project Structure

The `src` directory is organized as follows:

- `components/`: Shared, reusable React components (e.g., `MainLayout`, `Header`).
- `context/`: React Context providers, such as `AuthContext` for managing user sessions.
- `data/`: Centralized mock data files (`mockData.js`) used throughout the application.
- `pages/`: Top-level page components that correspond to the main routes (e.g., `DashboardPage`, `ProgramsPage`).
- `App.js`: The main application component responsible for routing.

## Getting Started

### Prerequisites
- Node.js v16+
- npm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/RichWangombe/road-safety-platform.git
   ```
2. Navigate to the project directory:
   ```bash
   cd road-safety-platform
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Backend Setup

Choose **ONE** of these options to run the Laravel API locally:

#### Option 1: Laragon (Recommended for Windows)
1. [Download Laragon](https://laragon.org/download/) (Full version)
2. Install → drag your `backend` folder into Laragon
3. Click "Start All" → access API at `http://road-safety-platform.test/api`

#### Option 2: Native PHP
1. Ensure PHP 8.2+ is installed and in PATH
2. From `backend/` directory:
   ```bash
   # First-time setup
   copy .env.example .env
   php artisan key:generate
   
   # Start server
   php artisan serve --port=8000
   ```
3. React app will auto-connect to `http://localhost:8000/api`

#### Testing the API
```bash
curl http://localhost:8000/api/test
```

### Running the Application

To start the development server:
```bash
npm start
```
The application will be available at `http://localhost:3000`.

## Testing

To run the test suite:
```bash
npm test
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. Please ensure to update tests as appropriate.