// Builds the public links shown on the Share screen.
//   survey link:  <base>/<shortCode>
//   branch link:  <base>/<shortCode>/<branchSlug>
//
// Set SURVEY_LINK_BASE_URL (e.g. https://nuvia.link) in .env. Without it we fall back to
// <FRONTEND_URL>/s so links still work in development.
const getBaseUrl = () => {
  const explicit = process.env.SURVEY_LINK_BASE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const frontend = (process.env.FRONTEND_URL || "http://localhost:5173").split(",")[0].trim();
  return `${frontend.replace(/\/+$/, "")}/s`;
};

const buildSurveyLink = (shortCode) => `${getBaseUrl()}/${shortCode}`;

const buildBranchLink = (shortCode, branchSlug) => `${getBaseUrl()}/${shortCode}/${branchSlug}`;

// What a QR code encodes: the same link plus ?src=qr. The survey page reads it and sends
// channel: "qr_code" when submitting, which is how "Collection source: In-store QR code" is known.
const buildQrLink = (link) => `${link}?src=qr`;

module.exports = { buildSurveyLink, buildBranchLink, buildQrLink };
