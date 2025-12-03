
import React, { Suspense, useLayoutEffect, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigationType, Outlet, Navigate, useParams } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';
import ErrorBoundary from './components/ErrorBoundary';
import LanguageRedirect from './components/LanguageRedirect';
import { LanguageProvider, VALID_LANGUAGES, DEFAULT_LANGUAGE } from './i18n';
import { FavoritesProvider } from './context/FavoritesContext';
import { ThemeProvider } from './context/ThemeContext';
import { CacheProvider } from './context/CacheContext';

// Lazy Load Pages to improve initial load performance
const Homepage = React.lazy(() => import('./pages/Homepage'));
const AccommodationPage = React.lazy(() => import('./pages/AccommodationPage'));
const RestaurantsPage = React.lazy(() => import('./pages/RestaurantsPage'));
const ShoppingPage = React.lazy(() => import('./pages/ShoppingPage'));
const EntertainmentPage = React.lazy(() => import('./pages/EntertainmentPage'));
const AttractionsPage = React.lazy(() => import('./pages/AttractionsPage'));
const WineParadisePage = React.lazy(() => import('./pages/WineParadisePage'));
const PomosNaPatPage = React.lazy(() => import('./pages/PomosNaPatPage'));
const SpecialOffersPage = React.lazy(() => import('./pages/SpecialOffersPage'));
const StoriesPage = React.lazy(() => import('./pages/StoriesPage'));
const StoryDetailPage = React.lazy(() => import('./pages/StoryDetailPage'));
const InteractiveMapPage = React.lazy(() => import('./pages/InteractiveMapPage'));
const EventsPage = React.lazy(() => import('./pages/EventsPage'));
const FavoritesPage = React.lazy(() => import('./pages/FavoritesPage'));
const PhotographersPage = React.lazy(() => import('./pages/PhotographersPage'));
const JsonFormEditorPage = React.lazy(() => import('./pages/JsonFormEditorPage'));
const FaqPage = React.lazy(() => import('./pages/FaqPage'));
const TermsOfUsePage = React.lazy(() => import('./pages/TermsOfUsePage'));
const VideoMomentsPage = React.lazy(() => import('./pages/VideoMomentsPage'));
const GasStationsPage = React.lazy(() => import('./pages/GasStationsPage'));

const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Ensure browser handles scroll restoration for POP actions (back button)
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'auto';
    }
    
    // Scroll to top only on new navigations (PUSH or REPLACE), NOT on back (POP)
    if (navigationType !== 'POP' && !hash) {
        window.scrollTo(0, 0);
    }
  }, [pathname, hash, navigationType]);

  useLayoutEffect(() => {
    const handleScroll = () => {
        if (hash) {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                element.style.transition = 'outline 0.5s ease-in-out, box-shadow 0.5s ease-in-out';
                element.style.outline = '2px solid #F97316';
                element.style.boxShadow = '0 0 20px rgba(249, 115, 22, 0.5)';
                
                setTimeout(() => {
                    element.style.outline = 'none';
                    element.style.boxShadow = '';
                }, 3000);
            }
        }
    };

    const timeoutId = setTimeout(handleScroll, 50);
    return () => clearTimeout(timeoutId);
  }, [pathname, hash, navigationType]);

  return null;
};

// Main Layout handles structure and validates language param
const MainLayout: React.FC = () => {
  const { lang } = useParams();

  // Validate language in URL. If invalid (e.g. /de/...), redirect to default /mk/...
  if (lang && !VALID_LANGUAGES.includes(lang)) {
    return <Navigate to={`/${DEFAULT_LANGUAGE}`} replace />;
  }

  return (
    <LanguageProvider>
      <ThemeProvider>
        <FavoritesProvider>
          <CacheProvider>
            <div className="flex flex-col min-h-screen [overflow-anchor:none]">
              <ScrollToTop />
              <Header />
              <main className="flex-grow w-full">
                <ErrorBoundary>
                  <Suspense fallback={
                    <div className="flex-grow flex items-center justify-center min-h-[60vh]">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
                    </div>
                  }>
                    <Outlet />
                  </Suspense>
                </ErrorBoundary>
              </main>
              <Footer />
              <ScrollToTopButton />
            </div>
          </CacheProvider>
        </FavoritesProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

const App: React.FC = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <Routes>
      {/* Root Path Redirector */}
      <Route path="/" element={<LanguageRedirect />} />

      {/* Main App Routes - All nested under /:lang */}
      <Route path="/:lang" element={<MainLayout />}>
        <Route index element={<Homepage />} /> {/* Matches /mk, /en etc */}
        <Route path="accommodation" element={<AccommodationPage />} />
        <Route path="restaurants" element={<RestaurantsPage />} />
        <Route path="shopping" element={<ShoppingPage />} />
        <Route path="special-offers" element={<SpecialOffersPage />} />
        <Route path="entertainment" element={<EntertainmentPage />} />
        <Route path="attractions" element={<AttractionsPage />} />
        <Route path="wine-paradise" element={<WineParadisePage />} />
        <Route path="pomos-na-pat" element={<PomosNaPatPage />} />
        <Route path="gas-stations" element={<GasStationsPage />} />
        <Route path="stories" element={<StoriesPage />} />
        <Route path="stories/:id" element={<StoryDetailPage />} />
        <Route path="interactive-map" element={<InteractiveMapPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="photographers" element={<PhotographersPage />} />
        <Route path="photographers/:id" element={<PhotographersPage />} />
        <Route path="gvg-play" element={<VideoMomentsPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="terms-of-use" element={<TermsOfUsePage />} />
        {isDevelopment && <Route path="editor" element={<JsonFormEditorPage />} />}
        
        {/* Catch-all for inside lang route, redirects to home of that lang */}
        <Route path="*" element={<Navigate to="" replace />} />
      </Route>

      {/* Catch-all for top level invalid routes, redirect to root to let LanguageRedirect handle it */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
