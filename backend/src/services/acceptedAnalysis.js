// Aggregates count only stored results with reviewed provenance.
module.exports = {
  'analysis.status': { $in: ['completed', 'partial'] },
  'analysis.provenance.qualityAccepted': true,
  'analysis.provenance.qualityStatus': 'accepted',
};
