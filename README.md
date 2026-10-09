# ReLoop

**Tagline:** Find it. Sell it. Reuse it.  
**Purpose:** A unified community platform where users can report lost and found items and list quality used goods for reuse.

---

## 1. Technology Stack

- **Frontend:** React 19 + Vite
- **Styling:** Custom Clean CSS (Responsive Cards, Forms, Badges & Toolbars)
- **Routing:** React Router v7 (`react-router-dom`)
- **HTTP Client:** Axios
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose (with in-memory fallback support for testing)

> **Note on Authentication:** Authentication (registration, login, JWT, sessions, password hashing, and user ownership) is postponed for this MVP phase. Schemas are structured with extensible `owner` and `seller` references so authentication can be added later without rewriting the application.

---

## 2. Color Palette

The application strictly implements the specified brand palette:

| Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Deep navy** | `#010736` | Primary brand color, headers, footers |
| **Dark navy** | `#0D1C42` | Hero background, sub-headers, text dark |
| **Muted blue** | `#22396F` | Buttons, action links, interactive accents |
| **Warm cream** | `#FCF1D0` | Highlights, badges, status callouts, tags |
| **White** | `#FFFFFF` | Main content cards, background, inputs |

---

## 3. Pages & Routes

1. **Home Page (`/`)**
   - Hero banner with ReLoop tagline and mission
   - Quick action buttons ("Report an Item", "Explore Marketplace")
   - "How ReLoop Works" process walkthrough
   - Recent Lost & Found reports feed
   - Recent Marketplace listings feed
   - Empty state handling when no records exist
   - Full navigation footer

2. **Lost & Found (`/lost-found`)**
   - Live feed of community reports
   - Search by keyword across title, description, and location
   - Filter by report type (`Lost`, `Found`)
   - Filter by category (`Electronics`, `Accessories`, etc.)
   - Filter by status (`Lost`, `Found`, `Returned`, `Closed`)

3. **Report an Item (`/report-item`)**
   - Form with input validation
   - Fields: Title, description, category, event date, location, type (`lost` or `found`), optional image URL

4. **Item Details (`/lost-found/:id`)**
   - Detailed view with image, meta information, and description
   - Development prototype action bar: edit report details and update status (`Returned`, `Closed`)

5. **Marketplace (`/marketplace`)**
   - Browse secondhand listings
   - Keyword search across title, description, and location
   - Category filtering
   - Sorting options: Newest first, Price: Low to High, Price: High to Low
   - One-click flag/report inappropriate listing modal

6. **Sell an Item (`/sell`)**
   - Product submission form with input validation
   - Fields: Title, description, price, category, condition, pickup location, optional image URL, optional seller contact info

7. **Marketplace Item Details (`/marketplace/:id`)**
   - Product details, pricing, condition, and pickup location
   - Direct "Contact Seller" action (reveals seller phone/email without requiring account)
   - Mark as Sold action
   - Report listing to moderation modal
   - In-place development editing

8. **My Posts (`/my-posts`)**
   - Local prototype dashboard displaying all MongoDB records
   - Tabbed view: Lost & Found reports vs. Marketplace listings
   - Quick status updates and management controls

9. **Moderation Admin (`/admin`)**
   - Internal review table for community flagged listings
   - Filter reports by status: `pending`, `resolved`, `dismissed`
   - Actions to remove offending listings or resolve reports
   - Clearly marked as local development mode only

---

## 4. Backend API Endpoints

### General
- `GET /api/health` — System status, uptime, and timestamp

### Lost & Found
- `GET /api/items` — Query items with backend search, category, type, and status filters
- `POST /api/items` — Create a new lost or found report
- `GET /api/items/:id` — Retrieve an item report by ID
- `PATCH /api/items/:id` — Update report fields or status

### Marketplace
- `GET /api/listings` — Query listings with backend search, category, and price sorting
- `POST /api/listings` — Create a new marketplace listing
- `GET /api/listings/:id` — Retrieve a listing by ID
- `PATCH /api/listings/:id` — Update listing fields
- `POST /api/listings/:id/sold` — Mark listing status as `sold`

### Moderation & Admin
- `POST /api/moderation/reports` — Submit a listing report with reason
- `GET /api/admin/reports` — Fetch all reports with populated listing details
- `PATCH /api/admin/reports/:id` — Update report status (`resolved`, `dismissed`)

---

## 5. Getting Started & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

### Environment Configuration
The server expects environment variables in `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/reloop
NODE_ENV=development
```

### Running the Application

1. **Install Dependencies:**
   ```bash
   # In root directory
   cd server && npm install
   cd ../client && npm install
   ```

2. **Start the Backend API:**
   ```bash
   cd server
   npm run dev
   # Server runs on http://localhost:5000
   ```

3. **Start the Frontend Client:**
   ```bash
   cd client
   npm run dev
   # Client runs on http://localhost:5173
   ```

4. **Run Backend API Automated Tests:**
   ```bash
   node server/test-api.js
   ```

---

## 6. Architecture & Security Notes

- **No Public Admin Exposure:** The `/admin` route and `/api/admin` endpoints are local prototype tools. Before deploying to production, secure authentication, hashed credentials, and role-based access control (RBAC) must be implemented.
- **Database Persistence:** All data is persisted directly in MongoDB (no temporary `localStorage` mocks).
- **Extensible Schema:** Mongoose schemas are pre-configured to receive user IDs upon integration with authentication without schema migration conflicts.
