const shareService = require("../services/share.service");
const { handleError } = require("../utils/errors");

const getShare = async (req, res) => {
  try {
    res.json({ data: await shareService.getShare(req.user, req.params.id) });
  } catch (error) {
    handleError(res, error);
  }
};

// Sends the image itself. The frontend must fetch it with the Authorization header
// (then show/download the blob): a plain <img src> can't send the token.
const getQr = async (req, res) => {
  try {
    const { branchId, format, size, download } = req.query;
    const image = await shareService.getQrImage(req.user, req.params.id, { branchId, format, size });

    res.set("Content-Type", image.contentType);
    if (download === "1" || download === "true") {
      res.set("Content-Disposition", `attachment; filename="${image.filename}"`);
    }
    res.send(image.body);
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { getShare, getQr };
