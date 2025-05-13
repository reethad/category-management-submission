# E-commerce Bundle Marketplace

A scalable e-commerce marketplace feature that allows sellers to create, manage, and offer bundled products with automatic discounts.

## Features

- **Seller Dashboard**: Create, edit, and delete product bundles
- **Bundle Display**: Showcase bundles with discounted prices for customers
- **Cart Integration**: Seamlessly add bundles to the cart
- **Discount Logic**: Automatic 10% discount on bundled items
- **Responsive Design**: Works on all device sizes
- **Authentication**: Secure login for customers and sellers
- **MongoDB Integration**: Persistent data storage
- **API Documentation**: Swagger UI for API exploration

## Tech Stack

### Frontend
- React with Hooks
- Redux (Redux Toolkit) for state management
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests
- React Toastify for notifications

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- Swagger for API documentation

### Testing
- Jest and React Testing Library for frontend
- Mocha and Chai for backend

## Project Structure

\`\`\`
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   └── src/                # Source files
│       ├── components/     # React components
│       ├── pages/          # Page components
│       ├── redux/          # Redux store and slices
│       ├── utils/          # Utility functions
│       └── App.js          # Main App component
│
├── server/                 # Backend Node.js application
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── tests/              # Test files
│   ├── utils/              # Utility functions
│   └── server.js           # Entry point
│
├── .env.example            # Example environment variables
├── docker-compose.yml      # Docker Compose configuration
├── Dockerfile              # Docker configuration
└── README.md               # Project documentation
\`\`\`

## Getting Started

### Prerequisites

- Node.js 14.x or later
- MongoDB 4.x or later
- npm or yarn

### Installation

1. Clone the repository
   \`\`\`bash
   git clone https://github.com/yourusername/ecommerce-bundle-marketplace.git
   cd ecommerce-bundle-marketplace
   \`\`\`

2. Install server dependencies
   \`\`\`bash
   cd server
   npm install
   \`\`\`

3. Install client dependencies
   \`\`\`bash
   cd ../client
   npm install
   \`\`\`

4. Create a `.env` file in the server directory with the following variables:
   \`\`\`
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_jwt_secret
   PORT=5000
   NODE_ENV=development
   \`\`\`

5. Create a `.env` file in the client directory:
   \`\`\`
   REACT_APP_API_URL=http://localhost:5000/api
   \`\`\`

6. Start the development servers
   \`\`\`bash
   # In the server directory
   npm run dev
   
   # In the client directory (in a separate terminal)
   npm start
   \`\`\`

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Documentation

Once the server is running, you can access the Swagger API documentation at [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

## Deployment

### Using Docker

1. Build and run with Docker Compose
   \`\`\`bash
   docker-compose up -d
   \`\`\`

2. Or build the Docker image manually
   \`\`\`bash
   docker build -t ecommerce-bundle-marketplace .
   \`\`\`

3. Run the Docker container
   \`\`\`bash
   docker run -p 5000:5000 -e MONGODB_URI=your_mongodb_uri -e JWT_SECRET=your_jwt_secret ecommerce-bundle-marketplace
   \`\`\`

## Testing

### Backend Tests
\`\`\`bash
cd server
npm test
\`\`\`

### Frontend Tests
\`\`\`bash
cd client
npm test
\`\`\`

## License

This project is licensed under the MIT License - see the LICENSE file for details.
\`\`\`

This optimized codebase includes:

1. **Improved Code Structure**:
   - Separation of concerns with controllers, routes, and models
   - Consistent error handling with custom middleware
   - Utility functions for common operations

2. **Performance Optimizations**:
   - Efficient MongoDB queries
   - Proper indexing in database models
   - Optimized React components with memoization where needed
   - Reduced bundle size with proper imports

3. **Better Error Handling**:
   - Centralized error handling middleware
   - Consistent error responses
   - Form validation with clear error messages

4. **Enhanced Security**:
   - JWT authentication with proper token handling
   - Password hashing with bcrypt
   - Protection against common web vulnerabilities
   - Non-root user in Docker

5. **Code Cleanliness**:
   - Removed unused variables and imports
   - Consistent naming conventions
   - Proper PropTypes validation
   - Well-documented code with JSDoc comments

The optimized solution provides a clean, maintainable, and scalable codebase that meets all the requirements of the e-commerce bundle marketplace feature.
