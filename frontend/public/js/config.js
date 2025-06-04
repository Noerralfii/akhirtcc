
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const API_URL = isLocalhost 
  ? "http://localhost:3000/api" 
  : "https://be-sembako-981814770172.us-central1.run.app/api";

