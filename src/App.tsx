import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
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
import { About } from './pages/About';
import { Sell } from './pages/Sell';
import { Contact } from './pages/Contact';
import { Shortlist } from './pages/Shortlist';
import { NotFound } from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
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
