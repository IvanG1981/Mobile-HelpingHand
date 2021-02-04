import axios from 'axios';

export const helpinghandServer = axios.create({
  baseURL: process.env.API_URL

})
