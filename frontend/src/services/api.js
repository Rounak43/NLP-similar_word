/**
 * LexiMind API Service
 * All backend API calls are centralized here using Axios.
 */
import axios from 'axios';

// ── Central backend base URL ──────────────────────────────────────────────────
const BASE_URL = 'http://127.0.0.1:8000';

// ── Axios instance ────────────────────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Response interceptor for consistent error handling ────────────────────────
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'An unexpected error occurred.';
    if (!error.response) {
      message = `Cannot connect to backend at ${BASE_URL}. Is the server running?`;
    } else {
      const { status, data } = error.response;
      if (status === 400) message = data?.detail || 'Bad request. Check your input.';
      else if (status === 503) message = 'The NLP model is not loaded yet. Please wait.';
      else if (status === 404) message = 'Endpoint not found.';
      else if (status === 500) message = 'Internal server error.';
      else message = data?.detail || `Server error (${status}).`;
    }
    error.userMessage = message;
    return Promise.reject(error);
  }
);

// ── API Functions ─────────────────────────────────────────────────────────────
export const getRootStatus  = ()        => apiClient.get('/');
export const getHealth      = ()        => apiClient.get('/health');
export const getVocabStats  = ()        => apiClient.get('/vocab/stats');
export const getSimilarWords = (payload) => apiClient.post('/similar', payload);
export const compareWords    = (payload) => apiClient.post('/similarity', payload);
export const solveAnalogy    = (payload) => apiClient.post('/analogy', payload);
export const checkVocab      = (word)   => apiClient.get(`/vocab/check/${encodeURIComponent(word)}`);

export default apiClient;
