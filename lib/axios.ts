import axios from 'axios';

const axiosInstance = axios.create();

axiosInstance.defaults.timeout = 25000;

export { axiosInstance };
