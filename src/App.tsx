import { Routes, Route, Link } from 'react-router-dom';
import ChatPage from './pages/ChatPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<ChatPage />} />
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
