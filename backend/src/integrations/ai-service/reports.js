const axios = require("axios");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";
const AI_SERVICE_TOKEN = process.env.X_AI_SERVICE_TOKEN || "";

const callService = async (operation, payload) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/api/v1/${operation}`, payload, {
      headers: {
        "Content-Type": "application/json",
        "X-AI-Service-Token": AI_SERVICE_TOKEN,
      },
      timeout: 180000,
    });
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.error?.code || error.message,
    };
  }
};

module.exports = { callService };