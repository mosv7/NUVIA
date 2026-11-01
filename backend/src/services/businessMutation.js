const mongoose = require('mongoose');
const Business = require('../models/business.model');
const { fail } = require('../utils/errors');

// Every mutation that changes public form availability/content shares this write.
// A transaction retry must acquire it before reading the form or lifecycle state.
const lockBusiness = async (businessId, session) => {
  const business = await Business.findOneAndUpdate(
    { _id: businessId },
    { $inc: { __v: 1 } },
    { session, returnDocument: 'after' },
  );
  if (!business) throw fail('Business not found', 404);
  return business;
};
const runBusinessMutation = (businessId, fn) =>
  mongoose.connection.transaction(async (session) => {
    const business = await lockBusiness(businessId, session);
    return fn(session, business);
  });
module.exports = { lockBusiness, runBusinessMutation };
