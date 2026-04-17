import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import CataloguePage from './pages/CataloguePage';
import DetailPage from './pages/DetailPage';

// Set to true to show gold debug borders and selector labels on all blocks
const DEBUG = true;

const DEBUG_SELECTORS = [
  'nav', 'footer', 'aside', 'section',
  '.card', '.card-body',
  '.pagination', '#genre-list',
  '.container', '.container-fluid',
];

function applyDebugLabels() {
  DEBUG_SELECTORS.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      const tag = el.tagName.toLowerCase();
      const classes = el.className
        ? '.' + el.className.trim().split(/\s+/).join('.')
        : '';
      el.setAttribute('data-debug-label', tag + classes);
    });
  });
}

export default function App() {
  const location = useLocation();

  useEffect(() => {
    if (DEBUG) {
      document.body.classList.add('debug');
      applyDebugLabels();
    } else {
      document.body.classList.remove('debug');
    }
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<CataloguePage />} />
      <Route path="/book/:id" element={<DetailPage />} />
    </Routes>
  );
}
