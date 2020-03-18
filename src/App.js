import React from 'react';
import './App.css';
import Login from './components/Login/Login';
import Header from './components/Header/Header';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Header />
      </header>
      <div className="App-body">
        <Login />
      </div>
    </div>
  );
}

export default App;
