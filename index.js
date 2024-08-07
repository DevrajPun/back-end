const express = require("express");
const app = express();
const dotenv = require("dotenv");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const route = require("./routers/path");
const connect_db = require("./database/dbCon");

// Load environment variables from .env file
dotenv.config({
  path: ".env",
});

// Connect to the database
connect_db();

// Parse incoming JSON data
app.use(express.json());

// Parse incoming requests with URL-encoded payloads (e.g., form submissions)
app.use(express.urlencoded({ extended: true }));

// Parse and handle cookies
app.use(cookieParser());

// Configure session handling
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Secret for signing session ID cookies
    resave: false, // Don't save session if unmodified
    saveUninitialized: true, // Save new sessions to store
    cookie: { secure: false }, // Cookie will be sent over HTTP and HTTPS
  })
);

// Set up flash messages for one-time notifications
app.use(flash());

// Enable Cross-Origin Resource Sharing (CORS) for API requests
app.use(cors());

// Handle file uploads with support for temporary files
app.use(fileUpload({ useTempFiles: true }));

// Mount the router on the root path
app.use("/", route);

// Start the server and listen on the specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
