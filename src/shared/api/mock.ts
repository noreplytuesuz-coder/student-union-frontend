import MockAdapter from 'axios-mock-adapter';
import { apiClient } from './index';
import { USE_MOCKS } from '@/shared/config/env';

/**
 * Optional dev-only mock backend.
 *
 * Enabled exclusively via `VITE_USE_MOCKS=true`. The real backend is the
 * source of truth; this exists only to demo the UI without a running
 * server. Paths are relative to `apiClient.baseURL` (no `/api` prefix).
 */
if (USE_MOCKS) {
  const mock = new MockAdapter(apiClient, { delayResponse: 500 });

  mock.onPost('/auth/sign-in').reply((config) => {
    const { email, password } = JSON.parse(config.data);
    if (email && password) {
      return [
        200,
        {
          message: 'ok',
          data: {
            _id: '1',
            name: 'Test User',
            email,
            role: 'user',
            points: 0,
            isVerified: true,
          },
        },
      ];
    }
    return [401, { message: 'Invalid credentials' }];
  });

  mock.onPost('/auth/sign-up').reply((config) => {
    const data = JSON.parse(config.data);
    return [
      200,
      {
        message: 'ok',
        data: {
          _id: '2',
          name: data.name,
          email: data.email,
          role: 'member',
          points: 0,
          isVerified: false,
        },
      },
    ];
  });

  mock.onGet('/auth/me').reply(() => [
    200,
    {
      message: 'ok',
      data: {
        _id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        points: 0,
        isVerified: true,
      },
    },
  ]);

  mock.onGet('/events').reply(() => [
    200,
    { message: 'ok', data: { events: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } } },
  ]);

  mock.onAny().passThrough();
}

export {};
