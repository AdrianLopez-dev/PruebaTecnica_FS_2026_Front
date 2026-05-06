export const environment = {
  production: true,
  api: {
    baseUrl: '/api/v1',
    token: '',
    requestTimeoutMs: 15_000,
  },
} as const;
