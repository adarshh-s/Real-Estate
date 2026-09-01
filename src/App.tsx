import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { CurrencyProvider } from './context/CurrencyContext';
import { ShortlistProvider } from './context/ShortlistContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { ScrollProgress } from './components/ScrollProgress';
import { Home } from './pages/Home';
import { Listings } from './pages/Listings';
import { PropertyDetail } from './pages/PropertyDetail';
import { OffPlan } from './pages/OffPlan';
import { ProjectDetail } from './pages/ProjectDetail';
import { Communities } from './pages/Communities';
import { CommunityDetail } from './pages/CommunityDetail';
import { Agents } from './pages/Agents';
import { AgentDetail } from './pages/AgentDetail';
import { Journal } from './pages/Journal';
import { ArticleDetail } from './pages/ArticleDetail';
import { About } from './pages/About';
import { Sell } from './pages/Sell';
import { Contact } from './pages/Contact';
import { Shortlist } from './pages/Shortlist';
import { NotFound } from './pages/NotFound';

// Scrolls to top on a normal navigation (clicking a link), but restores the
// scroll position a visitor had when they use the browser's back/forward
// buttons — otherwise "back" always dumps them at the top of the page.
function ScrollToTop() {
  const { pathname, key } = useLocation();
  const navigationType = useNavigationType();
  const positions = useRef<Record<string, number>>({});

  useEffect(() => {
    return () => {
      positions.current[key] = window.scrollY;
    };
  }, [key]);

  useEffect(() => {
    const saved = positions.current[key];
    if (navigationType === 'POP' && saved !== undefined) {
      window.scrollTo(0, saved);
      // The page remounts with static fallback content first, then live
      // Sanity data swaps in and can reflow the page taller — that clamps
      // the scroll above until it settles, so nudge it back a few times.
      const retries = [100, 350, 800].map((delay) => window.setTimeout(() => window.scrollTo(0, saved), delay));
      return () => retries.forEach(window.clearTimeout);
    }
    window.scrollTo(0, 0);
  }, [pathname, key, navigationType]);

  return null;
}

function AppRoutes() {
  const location = useLocation();
  return (
    <>
      <ScrollProgress />
      <ScrollToTop />
      <Navbar />
      <main>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/property/:slug" element={<PropertyDetail />} />
              <Route path="/off-plan" element={<OffPlan />} />
              <Route path="/off-plan/:slug" element={<ProjectDetail />} />
              <Route path="/communities" element={<Communities />} />
              <Route path="/communities/:slug" element={<CommunityDetail />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/agents/:slug" element={<AgentDetail />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/journal/:slug" element={<ArticleDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/shortlist" element={<Shortlist />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CurrencyProvider>
        <ShortlistProvider>
          <AppRoutes />
        </ShortlistProvider>
      </CurrencyProvider>
    </BrowserRouter>
  );
}
