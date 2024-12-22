import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
config();
import { connectToDB } from "./db/database.js";

import logger from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import container from "./container.js";
import { ValidationError } from "express-validation";
import { seedDatabase } from "./db/Seeders/initialSeed.js";

// Routes imports
import UserRoutes from "./src/User/UserRoutes.js";
import CompanyRoutes from "./src/Company/CompanyRoutes.js";
import StocksHistoryRoutes from "./src/StocksHistory/StocksHistoryRoutes.js";
import UserStocksRoutes from "./src/UserStocks/UserStocksRoutes.js";
import UserProfitRoutes from "./src/UserProfit/UserProfitRoutes.js";
import UserWithdrawRoutes from "./src/UserWithdraw/UserWithdrawRoutes.js";
import TransactionRoutes from "./src/Transaction/TransactionRoutes.js";
import AdminRoutes from "./src/Admin/AdminRoutes.js";
// import { startCronJobs } from "./src/jobs/userUpdateJobs.js";
import { insertData } from "./db/Seeders/companyHistory.js";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// List of allowed IPs
const allowedIPs = process.env.ALLOWED_IPS
  ? process.env.ALLOWED_IPS.split(",")
  : [];

// Middleware
app.set("trust proxy", true);
app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/images", express.static(path.join(__dirname, "images")));

// Middleware to restrict access
app.use((req, res, next) => {
  const forwardedFor = req.headers["x-forwarded-for"];
  const clientIP = forwardedFor ? forwardedFor.split(",")[0].trim() : req.ip;
  console.log("Client IP:", clientIP);

  // If ALLOWED_IPS is *, allow all IPs
  if (allowedIPs.includes("*")) {
    return next();
  }

  if (allowedIPs.includes(clientIP)) {
    next(); // Allow access
  } else {
    res.status(403).send("Access forbidden: Your IP is not allowed.");
  }
});

// Define the routes
const userController = container.resolve("userController");
const companyController = container.resolve("companyController");
const stocksHistoryController = container.resolve("stocksHistoryController");
const userStocksController = container.resolve("userStocksController");
const userProfitController = container.resolve("userProfitController");
const userWithdrawController = container.resolve("userWithdrawController");
const transactionController = container.resolve("transactionController");
const adminController = container.resolve("adminController");

app.use("/api/users", UserRoutes(userController));
app.use("/api/companies", CompanyRoutes(companyController));
app.use("/api/stocksHistory", StocksHistoryRoutes(stocksHistoryController));
app.use("/api/userStocks", UserStocksRoutes(userStocksController));
app.use("/api/userProfit", UserProfitRoutes(userProfitController));
app.use("/api/userWithdraw", UserWithdrawRoutes(userWithdrawController));
app.use("/api/transactions", TransactionRoutes(transactionController));
app.use("/api/admin", AdminRoutes(adminController));

// Error Handler
app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    // Extract specific details of the validation error
    return res.status(err.statusCode).json({
      message: "Validation Failed",
      details: err.details.body, // Provide detailed validation errors (adjust based on validation type)
    });
  }

  // Handle other errors
  return res.status(500).json({ message: "Internal Server Error" });
});

const startServer = async () => {
  try {
    // Start DB connection
    await connectToDB();

    // await seedDatabase();
    // insertData().catch((err) => console.log(err));

    // Start Cron Jobs
    // startCronJobs();

    // Start Server
    app.listen(PORT, "0.0.0.0", (err) => {
      if (err) {
        console.error(`Error starting server: ${err.message}`);
      } else {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Access it on your LAN at http://192.168.10.139:${PORT}`);
      }
    });
  } catch (error) {
    console.error("Error starting the application:", error);
  }
};

startServer();
