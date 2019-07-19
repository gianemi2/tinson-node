import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import 'typeface-roboto';

import RegisterForm from './components/RegisterForm'
import LoginForm from './components/LoginForm'
import Dashboard from './components/Dashboard'


import './App.css';

class App extends React.Component {

    render() {
        return (
            <div className="App" >
                <header className="App-header">
                    <Router>
                        <div>
                            <nav>
                                <ul>
                                    <li>
                                        <Link to="/">Register</Link>
                                    </li>
                                    <li>
                                        <Link to="/login/">Login</Link>
                                    </li>
                                </ul>
                            </nav>

                            <Route path="/" exact component={RegisterForm} />
                            <Route path="/login/" component={LoginForm} />
                            <Route path="/dashboard/" component={Dashboard} />
                        </div>
                    </Router>
                </header>
            </div>
        );
    }
}

export default App;
