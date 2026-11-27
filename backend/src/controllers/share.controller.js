const shareService = require('../services/share.service');
const { handleError } = require('../utils/errors');

const getShare = async (req, res) => {
  res.set('Cache-Control', 'no-store');
  try {
    res.json({ data: await shareService.getShare(req.user, req.params.id) });
  } catch (error) {
    handleError(res, error);
  }
};

const getQr = async (req, res) => {
  res.set('Cache-Control', 'no-store');
  try {
    const png = await shareService.getQrImage(req.user, req.params.id, req.query.branchId);
    res.attachment('survey-qr.png').send(png);
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { getShare, getQr };
