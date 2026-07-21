import { ProtectedRoute } from '@/app/providers';
import { AdminLayout, PublicLayout } from '@/widgets/layout';

import { Home } from '@/pages/public/Home';
import { Events } from '@/pages/public/Events';
import { EventDetails } from '@/pages/public/EventDetails';
import { Calendar } from '@/pages/public/Calendar';
import { Ranking } from '@/pages/public/Ranking';
import { Gallery } from '@/pages/public/Gallery';
import { News } from '@/pages/public/News';
import { NewsDetails } from '@/pages/public/NewsDetails';
import { JoinUs } from '@/pages/public/JoinUs';
import { Contact } from '@/pages/public/Contact';
import { Documents } from '@/pages/public/Documents';
import { Projects } from '@/pages/public/Projects';
import { Students } from '@/pages/public/Students';
import { Profile } from '@/pages/public/Profile';
import { Login } from '@/pages/auth/Login';
import { Signup } from '@/pages/auth/Signup';

import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminRanking } from '@/pages/admin/AdminRanking';
import { AdminEvents } from '@/pages/admin/AdminEvents';
import { AdminNews } from '@/pages/admin/AdminNews';
import { AdminProjects } from '@/pages/admin/AdminProjects';
import { AdminMembers } from '@/pages/admin/AdminMembers';
import { AdminRegistrations } from '@/pages/admin/AdminRegistrations';
import { AdminSubmissions } from '@/pages/admin/AdminSubmissions';
import { AdminContacts } from '@/pages/admin/AdminContacts';
import { AdminDocuments } from '@/pages/admin/AdminDocuments';
import { AdminGallery } from '@/pages/admin/AdminGallery';
import { AdminPartners } from '@/pages/admin/AdminPartners';
import { AdminSettings } from '@/pages/admin/AdminSettings';

import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/events', element: <Events /> },
      { path: '/events/:id', element: <EventDetails /> },
      { path: '/calendar', element: <Calendar /> },
      { path: '/ranking', element: <Ranking /> },
      { path: '/gallery', element: <Gallery /> },
      { path: '/news', element: <News /> },
      { path: '/news/:id', element: <NewsDetails /> },
      { path: '/contact', element: <Contact /> },
      { path: '/documents', element: <Documents /> },
      { path: '/projects', element: <Projects /> },
      { path: '/students', element: <Students /> },
      {
        path: '/join',
        element: (
          <ProtectedRoute requiredRole="member">
            <JoinUs />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute requiredRole="member">
            <Profile />
          </ProtectedRoute>
        ),
      },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
      { path: '*', element: <div className="flex h-[60vh] items-center justify-center font-display text-4xl">404 — Not Found</div> },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="user">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'events', element: <AdminEvents /> },
      { path: 'news', element: <AdminNews /> },
      { path: 'projects', element: <AdminProjects /> },
      { path: 'members', element: <AdminMembers /> },
      { path: 'registrations', element: <AdminRegistrations /> },
      { path: 'submissions', element: <AdminSubmissions /> },
      { path: 'contacts', element: <AdminContacts /> },
      { path: 'documents', element: <AdminDocuments /> },
      { path: 'gallery', element: <AdminGallery /> },
      { path: 'partners', element: <AdminPartners /> },
      { path: 'ranking', element: <AdminRanking /> },
      { path: 'settings', element: <AdminSettings /> },
    ],
  },
]);
