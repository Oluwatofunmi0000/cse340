/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const app = express();
const static = require("./routes/static");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const reviewRoute = require("./routes/reviewRoute");
const utilities = require("./utilities/");
const errorHandlers = require("./middleware/errorHandler");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { checkLogin } = require("./middleware/auth");

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Routes
 *************************/
// Parse form data
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser());

// Session for simple flash-like messaging
app.use(
  session({
    secret: process.env.SESSION_SECRET || "cse340-secret",
    resave: false,
    saveUninitialized: true,
  })
);

// Expose one-time message to views
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// Check login status (JWT) and expose to all views
app.use(checkLogin);

app.use(static);

// Lightweight health route (no DB access)
app.get('/health', (req, res) => {
  res.type('text/plain').send('OK');
});

// Index route
app.get("/", utilities.handleErrors(async function(req, res) {
  let nav = await utilities.getNav();
  res.render("index", { title: "Home", nav });
}));

// Inventory routes
app.use("/inv", inventoryRoute);

// Account routes
app.use("/account", accountRoute);

// Review routes
app.use("/review", reviewRoute);

// 404 Handler - Must be after all other routes
app.use(errorHandlers.notFoundHandler);

// Error Handler - Must be last
app.use(errorHandlers.errorHandler);

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = parseInt(process.env.PORT, 10) || 5000;
const host = process.env.HOST || '0.0.0.0';

process.on('uncaughtException', (err) => {
  console.error('[fatal] Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[fatal] Unhandled Rejection:', reason);
});

/* ***********************
 * Start server with graceful EADDRINUSE handling
 *************************/
function startServer() {
  try {
    const server = app.listen(port, host, () => {
      const addr = server.address();
      console.log(`[startup] Listening on ${typeof addr === 'object' ? `${addr.address}:${addr.port}` : addr}`);
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`[startup] Port ${port} in use. Free it or set PORT env.`);
        process.exit(1);
      } else {
        console.error('[startup] Server error:', err);
        process.exit(1);
      }
    });
    // Post-listen verification after short delay
    setTimeout(() => {
      console.log('[verify] Server initialization complete. Test /health endpoint.');
    }, 500);
  } catch (e) {
    console.error('[startup] Failed to start server:', e.message);
    process.exit(1);
  }
}

startServer();
