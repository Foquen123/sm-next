import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

// Кэширование QueryClient на сервере в рамках одного запроса
const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
        },
      },
    }),
);

export default getQueryClient;
