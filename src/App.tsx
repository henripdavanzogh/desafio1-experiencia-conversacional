import RoutesMain from './routes/RoutesPage';
import Reset from './styles/reset';
import Global from './styles/globalStyle';

const App = () => {
  return (
    <>
      <Reset />
      <Global />
      <RoutesMain />
    </>
  );
};

export default App;
