import { BrowserRouter as Router } from 'react-router-dom';
import { Header } from './views/Header';
import { Footer } from './views/Footer';
import { Main } from './views/Main';
import './App.css';

export const App = (): JSX.Element => {
  return (
    <Router>
      <div className="App">
        <Header />
        <Main />
        <Footer />
      </div>
    </Router>
  );
};