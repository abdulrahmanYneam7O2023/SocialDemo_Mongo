# Social Media API with MongoDB

A complete social media content management API built with Node.js, Express, GraphQL, and MongoDB.

## 🚀 Features

- **GraphQL API** for flexible data querying
- **User Authentication** with JWT
- **Social Media Content Management**
- **Analytics Tracking**
- **MongoDB Database** integration
- **RESTful Authentication Routes**

## 📁 Project Structure

```
social-media-api/
├── src/
│   ├── config/         # Database configuration
│   ├── graphql/        # GraphQL schemas and resolvers
│   ├── middleware/     # Authentication middleware
│   ├── models/         # MongoDB models
│   ├── routes/         # REST API routes
│   ├── seed/           # Database seeding
│   └── utils/          # Utility functions
├── Tests/              # Test files
└── index.js           # Application entry point
```

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/abdulrahmanYneam7O2023/SocialDemo_Mongo.git
cd SocialDemo_Mongo/social-media-api
```

2. Install dependencies:
```bash
npm install
```

3. Start MongoDB server

4. Run the application:
```bash
npm start
```

## 📡 API Endpoints

- **GraphQL Playground**: `http://localhost:4000/`
- **Authentication**: `http://localhost:4000/auth`

## 🔧 Available Scripts

- `npm start` - Start the server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run seed` - Seed database with sample data

## 🗄️ Database

This project uses MongoDB for data storage. Make sure MongoDB is running before starting the application.

## 📦 Dependencies

- Apollo Server (GraphQL)
- Express.js
- Mongoose (MongoDB ODM)
- JWT (Authentication)
- bcryptjs (Password hashing)
- Winston (Logging)

## 🤝 Contributing

Feel free to fork this project and submit pull requests.

## 📄 License

This project is open source and available under the MIT License. 