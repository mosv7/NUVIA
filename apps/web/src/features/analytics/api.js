import { apiRequest } from '../../lib/http/client.js';
import { queryString } from '../../lib/http/query.js';
const data = async (request) => (await request).data;

export const analyticsApi = {
  overviewBranches: (filters = {}, signal) =>
    data(apiRequest(`/overview/branches${queryString(filters)}`, { signal })),
  overviewMetrics: (filters = {}, signal) =>
    data(apiRequest(`/overview/metrics${queryString(filters)}`, { signal })),
  overviewTrends: (filters = {}, signal) =>
    data(apiRequest(`/overview/trends${queryString(filters)}`, { signal })),
  overviewSentiment: (filters = {}, signal) =>
    data(apiRequest(`/overview/sentiment${queryString(filters)}`, { signal })),
  aspectScores: (filters = {}, signal) =>
    data(apiRequest(`/overview/aspect-scores${queryString(filters)}`, { signal })),
  nextActions: (filters = {}, signal) =>
    data(apiRequest(`/overview/next-actions${queryString(filters)}`, { signal })),
  sentimentSummary: (filters = {}, signal) =>
    data(apiRequest(`/sentiment/summary${queryString(filters)}`, { signal })),
  sentimentTrends: (filters = {}, signal) =>
    data(apiRequest(`/sentiment/trends${queryString(filters)}`, { signal })),
  sentimentResponses: (filters = {}, signal) =>
    data(apiRequest(`/sentiment/responses${queryString(filters)}`, { signal })),
  responseAnalysis: (responseId, signal) =>
    data(apiRequest(`/sentiment/responses/${encodeURIComponent(responseId)}`, { signal })),
  trendsAndSignals: (filters = {}, signal) =>
    data(apiRequest(`/trends${queryString(filters)}`, { signal })),
  branchComparison: (filters = {}, signal) =>
    data(apiRequest(`/branch-comparison${queryString(filters)}`, { signal })),
  aspectScoreComparison: (filters = {}, signal) =>
    data(apiRequest(`/analytics/aspect-score-comparison${queryString(filters)}`, { signal })),
  aspectTrend: (filters = {}, signal) =>
    data(apiRequest(`/analytics/aspect-trend${queryString(filters)}`, { signal })),
  aspectAnalysis: (filters = {}, signal) =>
    data(apiRequest(`/analytics/aspect-based${queryString(filters)}`, { signal })),
  aspectFeedbacks: (filters = {}, signal) =>
    data(apiRequest(`/analytics/aspect-feedbacks${queryString(filters)}`, { signal })),
  aspectSentimentBreakdown: (filters = {}, signal) =>
    data(apiRequest(`/analytics/aspect-sentiment-breakdown${queryString(filters)}`, { signal })),
  topicsAndComplaints: (filters = {}, signal) =>
    data(apiRequest(`/topics${queryString(filters)}`, { signal })),
  topicDetails: (filters = {}, signal) =>
    data(apiRequest(`/topics/details${queryString(filters)}`, { signal })),
};
