const express = require("express");
const cors = require("cors");
const app = express();

const { connectDB, sequelize } = require("./database/database");

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], 
  credentials: true
}));

app.use(express.json());

app.use("/api/user", require("./routes/route"));
app.use("/api/product", require("./routes/productRoute"));

app.get("/", (req, res) => {
  res.json("Welcome to the home page");
});

const startServer = async () => {
  await connectDB();
  await sequelize.sync({ alter: true });

  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
};

startServer();
