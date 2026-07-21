import {
  LanguageProvider,
  QueryProvider,
  SessionProvider,
  ThemeProvider,
} from '@/app/providers';
import { router } from '@/app/routes/routes';
import { RouterProvider } from 'react-router-dom';

export function App() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <SessionProvider>
          <LanguageProvider>
            <RouterProvider router={router} />
          </LanguageProvider>
        </SessionProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}

export default App;
