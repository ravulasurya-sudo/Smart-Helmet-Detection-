import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

// Response interceptor to handle errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('API Call Notice:', error.message);
    return Promise.reject(error);
  }
);

export const checkHealth = async () => {
  try {
    const res = await api.get('/health');
    return res.data;
  } catch (err) {
    return { status: 'offline', model: 'YOLOv5s (Standby)', message: 'Backend connecting...' };
  }
};

export const detectHelmet = async (file, confidence = 0.35) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('confidence', confidence);

  const res = await api.post('/detect', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const getHistory = async (limit = 50, offset = 0) => {
  try {
    const res = await api.get(`/history?limit=${limit}&offset=${offset}`);
    return res.data;
  } catch (err) {
    return { success: true, history: [] };
  }
};

export const getStatistics = async () => {
  try {
    const res = await api.get('/statistics');
    return res.data;
  } catch (err) {
    return {
      total_processed: 0,
      total_helmets: 0,
      total_violations: 0,
      total_riders: 0,
      compliance_rate: 0,
      recent_activity: [],
      daily_trend: [],
      hourly_distribution: []
    };
  }
};

export const getReports = async () => {
  try {
    const res = await api.get('/reports');
    return res.data;
  } catch (err) {
    return { success: true, reports: [] };
  }
};

export const downloadReport = (format = 'pdf') => {
  const link = document.createElement('a');
  link.href = `/api/reports/download?format=${format}`;
  link.setAttribute('download', `traffic_report_${Date.now()}.${format}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getModelInfo = async () => {
  try {
    const res = await api.get('/models');
    return res.data;
  } catch (err) {
    return null;
  }
};

export default api;

