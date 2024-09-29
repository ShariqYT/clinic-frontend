import axios from './api';

const api = axios.create({
  baseURL: 'https://your-rails-api-url.com',
});

export default api;
