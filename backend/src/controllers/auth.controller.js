const authService = require("../services/auth.service");
const { clientMeta } = require("../utils/device");

const register = async (req, res) => {
  try {
    const { name, email, password, phone, preferredLanguage } = req.body;

    const result = await authService.register({
      name,
      email,
      password,
      phone,
      preferredLanguage,
      meta: clientMeta(req),
    });

    return res.status(201).json({
      message: "Business owner registered successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login({ email, password, meta: clientMeta(req) });

    return res.status(200).json({
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await authService.getMe(req.user.id);

    return res.status(200).json({
      data: user,
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
};