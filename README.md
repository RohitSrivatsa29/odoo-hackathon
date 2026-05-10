# TRAVELOOP - Travel Planning Application

A refined, high-end travel planning interface with an elegant dark aesthetic. Built for the Odoo Hackathon, TRAVELOOP provides a comprehensive solution for planning, organizing, and managing travel experiences.

## 🌟 Features

### Core Functionality
- **User Management**: Secure authentication with profile customization
- **Trip Planning**: Create and manage multiple travel trips with dates, destinations, and budgets
- **Itinerary Builder**: Day-by-day activity scheduling with time and location details
- **Expense Tracking**: Monitor trip expenses by category with budget analysis
- **Checklist Management**: Track pre-trip and during-trip tasks
- **Travel Journal**: Document memories and experiences during trips
- **Photo Gallery**: Upload and manage trip photos
- **Activity Search**: Discover activities and attractions in destination cities
- **City Search**: Explore and add multiple cities to your trip itinerary
- **Budget Breakdown**: Visual analysis of trip spending with charts

### User Interface
- Elegant dark theme design
- Responsive layout with sidebar navigation
- Interactive dashboard with trip overview
- Real-time budget tracking and visualization
- Intuitive itinerary timeline view

## 🛠 Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type-safe JavaScript
- **React Router DOM** - Client-side routing
- **Lucide React** - Icon library
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Google Maps API** - Location services

### Backend (Python/FastAPI)
- **FastAPI** - Modern web framework
- **SQLAlchemy** - ORM for database operations
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server
- **PostgreSQL/SQLite** - Database support

### Backend (Node.js/Express) - Alternative
- **Express** - Web framework
- **PostgreSQL** - Database with better-sqlite3
- **JWT** - Authentication
- **Multer** - File uploads
- **CORS** - Cross-origin resource sharing

### Database
- **PostgreSQL** - Primary database (production)
- **SQLite** - Default database (development)

## 📁 Project Structure

```
TRAVELOOP/
├── DATABASE/
│   └── schema.sql          # PostgreSQL database schema
├── back-end/
│   ├── main.py             # FastAPI application entry point
│   ├── models.py           # SQLAlchemy database models
│   ├── schemas.py          # Pydantic schemas for API
│   ├── database.py         # Database connection configuration
│   ├── server.js           # Alternative Node.js/Express server
│   ├── routes/             # API route handlers
│   ├── middleware/         # Custom middleware
│   ├── requirements.txt    # Python dependencies
│   └── package.json        # Node.js dependencies
└── front-end/
    ├── src/
    │   ├── components/     # Reusable UI components
    │   │   └── layout/     # Layout components (Navbar, Sidebar)
    │   ├── pages/          # Page components
    │   ├── context/        # React context providers
    │   ├── data/           # Static data and utilities
    │   ├── App.tsx         # Main application component
    │   └── index.tsx       # Application entry point
    ├── public/             # Static assets
    ├── package.json        # Frontend dependencies
    └── tsconfig.json       # TypeScript configuration
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- Python 3.8 or higher
- PostgreSQL (optional, for production)

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd TRAVELOOP/front-end
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

### Backend Setup (Python/FastAPI)

1. Navigate to the backend directory:
```bash
cd TRAVELOOP/back-end
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Create environment file:
```bash
echo "DATABASE_URL=sqlite:///./traveloop.db" > .env
```

4. Start the FastAPI server:
```bash
uvicorn main:app --reload
```

The API will run on `http://localhost:8000`

### Backend Setup (Node.js/Express) - Alternative

1. Navigate to the backend directory:
```bash
cd TRAVELOOP/back-end
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/traveloop
PORT=5000
UPLOAD_DIR=uploads
FRONTEND_URL=http://localhost:3000
```

4. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The API will run on `http://localhost:5000`

### Database Setup (PostgreSQL)

1. Create a PostgreSQL database:
```sql
CREATE DATABASE traveloop;
```

2. Run the schema script:
```bash
psql -U your_username -d traveloop -f DATABASE/schema.sql
```

## 📡 API Endpoints

### User Endpoints
- `POST /api/users/` - Create a new user
- `GET /api/users/` - List all users
- `POST /api/users/{user_id}/avatar` - Upload user avatar

### Trip Endpoints
- `POST /api/trips/` - Create a new trip
- `GET /api/trips/` - List all trips
- `GET /api/trips/{trip_id}` - Get trip details

### Itinerary Endpoints
- `POST /api/trips/{trip_id}/itinerary/` - Add itinerary item
- `GET /api/trips/{trip_id}/itinerary/` - Get trip itinerary

### Expense Endpoints
- `POST /api/trips/{trip_id}/expenses/` - Add expense
- `GET /api/trips/{trip_id}/expenses/` - Get trip expenses

### Checklist Endpoints
- `POST /api/trips/{trip_id}/checklists/` - Add checklist item
- `GET /api/trips/{trip_id}/checklists/` - Get trip checklists

### Journal Endpoints
- `POST /api/trips/{trip_id}/journals/` - Add journal entry
- `GET /api/trips/{trip_id}/journals/` - Get trip journals

## 🗄️ Database Schema

### Tables
- **users** - User accounts and profiles
- **trips** - Trip information and details
- **itinerary_items** - Daily activity schedules
- **expenses** - Trip expense tracking
- **checklist_items** - Trip preparation tasks
- **journal_entries** - Travel journal entries
- **uploaded_photos** - Photo gallery management

## 🎨 Pages Overview

- **HomePage** - Main dashboard with trip overview
- **LoginPage/SignupPage** - Authentication
- **CreateTripPage** - Trip creation wizard
- **MyTripsPage** - List of user's trips
- **ItineraryBuilderPage** - Plan daily activities
- **ItineraryViewPage** - View complete itinerary
- **BudgetBreakdownPage** - Expense analysis
- **ChecklistPage** - Task management
- **JournalPage** - Travel diary
- **ActivitySearchPage** - Discover activities
- **CitySearchPage** - Add destinations
- **ProfilePage** - User profile settings
- **BillingPage** - Subscription management

## 🔧 Configuration

### Environment Variables

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:8000
```

**Backend (Python - .env)**
```
DATABASE_URL=sqlite:///./traveloop.db
```

**Backend (Node.js - .env)**
```
DATABASE_URL=postgresql://user:password@localhost:5432/traveloop
PORT=5000
UPLOAD_DIR=uploads
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key
```

## 🤝 Contributing

This project was created for the Odoo Hackathon. Contributions are welcome!

## 📄 License

This project is open source and available under the MIT License.

## 👥 Team

- **RohitSrivatsa29** - Project Lead, Backend Developer
-**Anvesh Sunkari** - Frontend Developer
-**Akhil issaku**-Database Developer
-**sravanth nimmana**-Backend Developer


---


