# Mini Payment Portal

A full-stack payment portal built with React (frontend) and Node.js/Express (backend) deployed on Netlify Functions. This project demonstrates modern web development practices with a professional UI similar to Stripe's design.

## 🚀 Live Demo

**View the live application:** : https://playful-sunshine-727949.netlify.app

## ✨ Features

- **User Authentication**: JWT-based login and registration
- **Wallet Management**: Add money to wallet balance
- **Payment Processing**: Send money to other users
- **Transaction History**: View and filter all transactions
- **Refund System**: Process refunds for sent payments
- **Responsive Design**: Professional UI that works on all devices
- **Real-time Updates**: Live balance and transaction updates

## 🛠️ Tech Stack

### Frontend
- React 19
- React Router DOM
- Axios for API calls
- CSS3 with modern styling
- Responsive design

### Backend
- Node.js with Express
- SQLite database
- JWT authentication
- bcryptjs for password hashing
- CORS enabled
- Netlify Functions for serverless deployment

## 📋 Demo Credentials

- **Email:** john@example.com
- **Password:** password123

## 🚀 Deployment

This application is deployed using Netlify Functions, which allows both frontend and backend to be hosted on the same platform.

### Deploy to Netlify

1. **Connect Repository**
   - Push this code to GitHub
   - Go to [Netlify](https://netlify.com) and sign up/login
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - **Branch:** main (or your default branch)
   - **Build command:** `npm run build` (automatically handled by netlify.toml)
   - **Publish directory:** `frontend/build` (automatically handled by netlify.toml)

3. **Environment Variables**
   - Add `JWT_SECRET` in Netlify environment variables
   - Set it to a secure random string

4. **Deploy**
   - Click "Deploy site"
   - Wait for deployment to complete
   - Your site will be available at `https://your-site-name.netlify.app`

## 🏗️ Project Structure

```
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   └── TransactionHistory.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── config.js         # API configuration
│   └── package.json
├── netlify/
│   ├── functions/
│   │   └── api.js            # Serverless backend
│   └── package.json
├── netlify.toml              # Netlify configuration
└── README.md
```

## 🔧 Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd stripe-project
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend (for local development)
   cd ../backend
   npm install
   ```

3. **Start development servers**
   ```bash
   # Frontend (in one terminal)
   cd frontend
   npm start

   # Backend (in another terminal, if needed)
   cd backend
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### User Management
- `GET /api/user/profile` - Get user profile

### Wallet
- `POST /api/wallet/add` - Add money to wallet

### Payments
- `POST /api/payment/send` - Send payment to another user
- `POST /api/payment/refund/:id` - Refund a transaction

### Transactions
- `GET /api/transactions` - Get user transaction history

## 🎨 UI Features

- **Modern Design**: Clean, professional interface inspired by Stripe
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Loading States**: Visual feedback for all user actions
- **Error Handling**: Comprehensive error messages and validation
- **Status Badges**: Color-coded transaction statuses
- **Data Tables**: Sortable and filterable transaction history
- **Form Validation**: Real-time input validation

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- CORS protection
- Input validation and sanitization
- Secure API endpoints

## 📊 Database Schema

### Users Table
- id (Primary Key)
- name
- email (Unique)
- password (Hashed)
- balance
- role

### Transactions Table
- id (Primary Key)
- sender_id (Foreign Key)
- receiver_id (Foreign Key)
- amount
- status
- created_at

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Built with ❤️ for demonstrating full-stack development skills.

---

**Note:** This is a demonstration project for portfolio purposes. It uses SQLite in-memory database for Netlify Functions deployment. For production use, consider using a persistent database solution.
