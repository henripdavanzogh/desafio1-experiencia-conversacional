import { Link, Route, Routes } from 'react-router-dom';
import ChatPage from '../pages/ChatPage';

const RoutesMain = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route
          path="*"
          element={
            <div style={{ padding: '2rem' }}>
              <h1
                style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  marginBottom: '10px',
                }}
              >
                404 - Página não encontrada
              </h1>
              <Link to="/" style={{ textDecoration: 'none' }}>
                Voltar para o Chat FURIA
              </Link>
            </div>
          }
        />
      </Routes>
    </>
  );
};

export default RoutesMain;
