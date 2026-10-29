const express = require("express");

const onboardingController = require("../controllers/onboarding.controller");
const authenticate = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const {
  businessValidation,
  setupValidation,
} = require("../validations/onboarding.validation");

const router = express.Router();

// Only the business owner goes through onboarding
router.use(authenticate, authorize("owner"));

router.get("/status", onboardingController.getStatus);

router.put("/business", businessValidation, validate, onboardingController.saveBusiness);

router.put("/setup", setupValidation, validate, onboardingController.saveSetup);

router.post("/complete", onboardingController.complete);

module.exports = router;
