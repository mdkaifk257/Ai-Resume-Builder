import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TopBar } from './components/Layout';
import { ResumeProvider } from './context/ResumeContext';
import { TemplateProvider } from './context/TemplateContext';
import { HomePage } from './pages/HomePage';
import { BuilderPage } from './pages/BuilderPage';
import { PreviewPage } from './pages/PreviewPage';
import { ProofPage } from './pages/ProofPage';

function App() {
  return (
    <ResumeProvider>
      <TemplateProvider>
        <Router>
          <div className="kodnest-app">
            <TopBar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/builder" element={<BuilderPage />} />
              <Route path="/preview" element={<PreviewPage />} />
              <Route path="/proof" element={<ProofPage />} />
            </Routes>
          </div>
        </Router>
      </TemplateProvider>
    </ResumeProvider>
  );
}

export default App;

