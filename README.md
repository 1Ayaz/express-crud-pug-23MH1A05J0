# Express CRUD PUG App - README

## MongoDB Setup

You have **two options** to run this application:

### Option 1: Without MongoDB (Recommended for Quick Testing)
The tests already work without MongoDB using `mongodb-memory-server`. However, to run the actual application, you need MongoDB.

### Option 2: Install MongoDB Locally

#### Windows Installation:
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Install MongoDB with default settings
3. MongoDB will run as a Windows service automatically
4. Verify installation: Open a new terminal and run `mongod --version`

#### Alternative: Use MongoDB Atlas (Cloud)
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster and get your connection string
3. Update the `.env` file with your Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/express-crud-pug
   ```

## Running the Application

1. Make sure MongoDB is running (locally or use Atlas)
2. Run: `npm start`
3. Open browser: `http://localhost:3000`

## Running Tests (No MongoDB Required)
```bash
npm test
```

Tests use an in-memory database, so you don't need MongoDB installed to verify the code works!

## UI Features
- Clean, modern interface with professional styling
- Responsive table layout for student list
- Form validation with error messages
- Confirmation dialogs for delete operations
- Navigation buttons for easy access
