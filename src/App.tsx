import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route
        path="*"
        element={
          <div>
            <h1>404 - Página não encontrada</h1>
            <Link to="/">Voltar para Home</Link>
          </div>
        }
      />
    </Routes>
  );
};

export default App;
