import './App.css';
import React from 'react';
import {
  BrowserRouter as Router
} from 'react-router-dom';
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import Main from './components/Main.js';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <Main />
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;


// Main
//   Dashboard = 