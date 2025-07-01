import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://prep-ai-backend.onrender.com/api/', // Change as per your backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
