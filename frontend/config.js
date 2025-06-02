const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const apiBase = isLocalhost
  ? 'http://localhost:8080/api'
  : 'https://your-cloud-run-url.a.run.app/api';
