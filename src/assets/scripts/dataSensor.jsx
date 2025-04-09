import axios from 'axios';

const dataSensorApi = axios.create({
  baseURL: 'http://localhost:8086',
  timeout: 5000,
});

export default dataSensorApi;