require("dotenv").config();

const mongoose = require("mongoose");

const app = require("./app");
const analysisWorker = require("./src/services/analysisWorker.service");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Analyses feedback in the background (and picks up work left over from before a restart).
    analysisWorker.start();
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();