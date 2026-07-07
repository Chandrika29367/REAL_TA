# RealEstatePlatform

A comprehensive real estate platform built with Next.js, featuring property listings, user authentication, agent management, and a monetized contact system.

## 🚀 Features

### Core Functionality
- **Property Listings**: Browse, search, and filter properties by type, location, price, and status
- **User Authentication**: Separate login portals for buyers, agents, and admins
- **Agent Dashboard**: Manage properties, view inquiries, and reply to potential buyers
- **Admin Dashboard**: Full platform management including user/property oversight
- **Saved Properties**: Users can save favorite listings for later
- **Inquiry System**: Buyers can contact agents through a paid contact flow

### Monetization Features
- **Paid Contact System**: Buyers must pay to unlock agent contact details
- **Mock Payment Processing**: Secure demo payment flow with card validation
- **Plan-Based Access**: Basic and Premium contact plans with different features

### Advanced Features
- **Role-Based Access Control**: Different dashboards and permissions for buyers, agents, and admins
- **Responsive Design**: Mobile-friendly interface with modern UI
- **Real-time Updates**: Instant UI updates for actions like deleting properties
- **Data Seeding**: Pre-populated with sample properties and users

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React** - UI library with hooks and client components
- **CSS-in-JS** - Inline styling for components

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Authentication
- **NextAuth.js** - Authentication library with credentials provider
- **JWT** - JSON Web Tokens for session management

### Development Tools
- **Node.js** - JavaScript runtime
- **npm** - Package manager
- **ESLint** - Code linting

## 📋 Prerequisites

- Node.js 18+
- MongoDB (local or cloud instance)
- npm or yarn

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RealEstatePlatform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Fill in your MongoDB connection string and NextAuth secret:
   ```env
   MONGODB_URI=mongodb://localhost:27017/realestate
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Database Setup**
   - Ensure MongoDB is running
   - Seed the database with sample data:
   ```bash
   npm run db:seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000` to view the application.

## 📁 Project Structure

```
RealEstatePlatform/
├── app/                          # Next.js App Router
│   ├── layout.js                 # Root layout
│   ├── page.js                   # Homepage
│   ├── login/                    # Buyer login page
│   ├── agent-login/              # Agent login page
│   ├── admin-login/              # Admin login page
│   ├── register/                 # Agent registration
│   ├── listings/                 # Property listings
│   ├── property/[id]/            # Property detail pages
│   ├── dashboard/                # User dashboard
│   ├── agent-dashboard/          # Agent dashboard
│   ├── admin/                    # Admin dashboard
│   └── api/                      # API routes
│       ├── auth/                 # Authentication
│       ├── properties/           # Property CRUD
│       ├── inquiries/            # Inquiry management
│       ├── register/             # User registration
│       └── admin/                # Admin operations
├── components/                   # Reusable React components
│   ├── Navbar.js                 # Navigation bar
│   ├── PropertyCard.js           # Property listing card
│   ├── ContactModal.js           # Paid contact flow
│   ├── EMICalculator.js          # EMI calculation tool
│   └── PropertyImages.js         # Image gallery
├── lib/                          # Utility libraries
│   ├── mongodb.js                # MongoDB connection
│   └── constants.js              # App constants
├── models/                       # Mongoose schemas
│   ├── User.js                   # User model
│   ├── Property.js               # Property model
│   ├── Inquiry.js                # Inquiry model
│   └── SavedProperty.js          # Saved property model
├── scripts/                      # Utility scripts
│   └── seed-mongo.js             # Database seeding
├── prisma/                       # Legacy Prisma (migrated to MongoDB)
└── public/                       # Static assets
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth handler
- `POST /api/register` - User registration

### Properties
- `GET /api/properties` - Get all properties (with pagination)
- `GET /api/properties/[id]` - Get single property
- `POST /api/properties` - Create property (agents/admins)
- `PUT /api/properties/[id]` - Update property (agents/admins)
- `DELETE /api/properties/[id]` - Delete property (admins)

### Inquiries
- `GET /api/inquiries` - Get inquiries (filtered by user role)
- `GET /api/inquiries/[id]` - Get single inquiry
- `POST /api/inquiries` - Create inquiry
- `PUT /api/inquiries/[id]` - Update inquiry
- `DELETE /api/inquiries/[id]` - Delete inquiry
- `POST /api/inquiries/[id]/reply` - Reply to inquiry (agents)

### Saved Properties
- `GET /api/saved-properties` - Get user's saved properties
- `POST /api/saved-properties` - Save property
- `DELETE /api/saved-properties` - Remove saved property

### Admin
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - All users
- `DELETE /api/admin/users/[email]` - Delete user

## 🗄 Database Schema

### User Model
```javascript
{
  name: String,
  email: String,
  password: String, // hashed
  role: String, // 'buyer', 'agent', 'admin'
  phone: String, // agents only
  agentName: String, // agents only
  agentBio: String, // agents only
  createdAt: Date
}
```

### Property Model
```javascript
{
  id: String, // scraped ID
  title: String,
  property_name: String,
  type: String,
  price: String,
  price_per_sqft: String,
  min_price: Number,
  max_price: Number,
  locality: String,
  city: String,
  state: String,
  status: String, // 'available', 'sold'
  agent: String, // agent email
  images: [String],
  features: Object,
  createdAt: Date
}
```

### Inquiry Model
```javascript
{
  message: String,
  propertyId: String,
  buyerEmail: String,
  agentEmail: String,
  status: String, // 'pending', 'replied'
  replies: [{
    message: String,
    from: String, // 'buyer' or 'agent'
    createdAt: Date
  }],
  createdAt: Date
}
```

## 🎯 Usage

### For Buyers
1. Browse properties on the homepage or listings page
2. Use filters to find specific properties
3. Save favorite properties to your dashboard
4. Contact agents through the paid contact system

### For Agents
1. Register as an agent or login to agent portal
2. Add and manage your properties
3. View and reply to buyer inquiries
4. Access agent-specific dashboard features

### For Admins
1. Login to admin portal
2. View platform statistics
3. Manage all users and properties
4. Delete inappropriate content

## 🔐 Authentication Flow

The platform uses role-based authentication with separate login pages:

- **Buyers**: `/login` → redirected to `/listings`
- **Agents**: `/agent-login` → redirected to `/agent-dashboard`
- **Admins**: `/admin-login` → redirected to `/admin`

Registration is available at `/register` for new agents.

## 💳 Payment System

The contact system requires payment before revealing agent details:

- **Basic Plan**: ₹99 - Phone number only
- **Premium Plan**: ₹299 - Phone + WhatsApp + priority support

Payment is mocked - no real transactions occur.

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🧪 Testing

Run the development server and test features:
- User registration and login
- Property browsing and filtering
- Contact flow and payment simulation
- Dashboard functionalities
- Admin operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues or questions:
- Check the existing issues on GitHub
- Create a new issue with detailed description
- Include error messages and steps to reproduce

---

Built with ❤️ using Next.js and MongoDB

Or just drag-and-drop the folders in VS Code.

### 2. Place final_merged.json in the project root

```
RealEstatePlatform/
├── final_merged.json   ← put it here
├── app/
├── lib/
...
```

### 3. Set up your .env

```bash
cd RealEstatePlatform
cp .env.example .env
```

Then edit `.env`:

**Option A — Local MongoDB (no account needed):**
```
MONGODB_URI="mongodb://localhost:27017/real_estate_db"
```
Install MongoDB locally: https://www.mongodb.com/try/download/community

**Option B — MongoDB Atlas (free cloud):**
```
MONGODB_URI="mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/real_estate_db"
```
Sign up free at: https://www.mongodb.com/cloud/atlas

Generate your NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 4. Install dependencies

```bash
npm install
```

This installs mongoose and removes the need for prisma.

### 5. Seed the database

```bash
npm run db:seed
```

This will:
- Clear any existing data
- Create 3 default users (admin, buyer, agent)
- Import all 934 properties from final_merged.json
- Create a sample inquiry

### 6. Run the app

```bash
npm run dev
```

Visit https://real-estate-platform-six-iota.vercel.app/

---

## Login credentials (after seeding)

| Role  | Email             | Password  |
|-------|-------------------|-----------|
| Admin | admin@realty.com  | admin123  |
| Buyer | john@example.com  | john123   |
| Agent | priya@realty.com  | priya123  |

---

## Delete Prisma (optional cleanup)

Once everything works, you can remove Prisma entirely:

```bash
npm uninstall @prisma/client prisma
rm -rf prisma/
```

---

## Notes

- Properties from final_merged.json keep their original `id` field (e.g. "P89075154").
  Property detail URLs use this ID: `/property/P89075154`
- Manually added properties (by agents/admin) use MongoDB's `_id`.
  The API handles both transparently.
- The `prisma/` folder can stay — it won't cause errors, it's just unused.
