const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db/connection");
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const companyRoutes = require("./routes/companyRoutes");


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Use the correct environment variable name
const mongoUri = process.env.MONGO_URI;



app.use("/api", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/companies", companyRoutes);



app.get("/login", (req, res) => {
  res.send("Hello, this is the backend");
});

const startServer = async () => {
  try {
    await connectDB(mongoUri);
    app.listen(5000, () => {
      console.log("Server is listening on port 5000");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
