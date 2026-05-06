export const environment = {
  production: false,
  api: {
    baseUrl: 'http://localhost:8080/api/v1',
    token: '',
    requestTimeoutMs: 15_000,
  },
} as const;
