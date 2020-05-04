import React, { Fragment } from 'react';
import './App.css';
import Login from './components/Login/Login';
import Header from './components/Header/Header';

function App() {
  return (
      <Fragment>
          <Header/>
          <Login/>
          <footer  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>A product by Deep Brain Lab</p></footer>
      </Fragment>
    // <div className="App">
    //   <header className="App-header">
    //     <Header />
    //   </header>
    //   <body className="App-body">
    //     <Login />
    //   </body>
    // </div>
  );
}

export default App;
