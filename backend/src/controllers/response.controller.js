const responseService = require("../services/response.service");
const { handleError } = require("../utils/errors");

const submit = async (req, res) => {
  try {
    const data = await responseService.submitResponse(req.params.shortCode, req.body);
    // 200 for a repeated submit of the same form, 201 for a new response.
    res.status(data.duplicate ? 200 : 201).json({ message: "Thank you for your feedback", data: { thankYouMessage: data.thankYouMessage } });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { submit };
