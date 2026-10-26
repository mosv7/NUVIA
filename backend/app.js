const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { appOrigin, requireBrowserCsrf } = require('./src/utils/browserSession');

const authRoutes = require('./src/routes/auth.routes');
const onboardingRoutes = require('./src/routes/onboarding.routes');
const surveyRoutes = require('./src/routes/survey.routes');
const surveyTemplateRoutes = require('./src/routes/surveyTemplate.routes');
const branchRoutes = require('./src/routes/branch.routes');
const businessRoutes = require('./src/routes/business.routes');

const app = express();

app.use(
  cors({
    origin: appOrigin(),
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use('/api', requireBrowserCsrf);
app.get('/api/health/live', (req, res) => res.json({ status: 'ok' }));
app.get('/api/health/ready', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) throw new Error('not connected');
    await mongoose.connection.db.command({ ping: 1 }, { timeoutMS: 3000 });
    res.json({ status: 'ready' });
  } catch {
    res.status(503).json({ status: 'unavailable' });
  }
});

app.get('/', (req, res) => {
  res.json({
    message: 'Customer Feedback API',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/survey-templates', surveyTemplateRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/business', businessRoutes);
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const status =
    error.type === 'entity.parse.failed' ? 400 : error.type === 'entity.too.large' ? 413 : 500;
  res.status(status).json({
    message: status === 500 ? 'Something went wrong, please try again' : 'Invalid request body',
  });
});

module.exports = app;
