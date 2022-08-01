import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
import { store } from './redux/store';
import { HashRouter as Router, Switch, Route, Link, Routes } from 'react-router-dom';
import Radiology from './components/Radiology/Radiology';
import Header from './components/Header/Header';
import History from './components/History/History';
import Signup from './components/Signup/Signup';

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Routes>
                <Route path='/' element={<App />} />
                <Route path='/radiology' element={<Fragment><Header /> <Radiology /></Fragment>} />
                <Route path='/history' element={<Fragment><Header /> <History /></Fragment>} />
                {/* <Route path='/signup' element={<Fragment><Header /> <Signup /></Fragment>} /> */}
            </Routes>
        </Router>
        {/* <App /> */}
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
