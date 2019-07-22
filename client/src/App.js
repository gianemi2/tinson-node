import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import 'typeface-roboto';
import { Container, CssBaseline } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles';

import TopAppBar from './components/TopAppBar'
import RegisterForm from './components/RegisterForm'
import LoginForm from './components/LoginForm'
import Dashboard from './components/Dashboard'
import Homepage from './components/Homepage';

import './App.css';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.theme = 'dark';
        this.state = {
            theme: createMuiTheme({
                palette: {
                    type: this.theme
                }
            })
        }
    }

    get swapTheme() {

        const theme = (this.theme === 'dark' ? 'light' : 'dark');
        this.theme = theme;
        return this.theme;
    }

    handleChangeTheme = () => {
        const newTheme = this.swapTheme;
        this.setState({
            theme: createMuiTheme({
                palette: {
                    type: newTheme
                }
            })
        })
    }

    render() {
        return (
            <React.Fragment>
                <ThemeProvider theme={this.state.theme}>
                    <CssBaseline />
                    <Container maxWidth="md">
                        <Router>
                            <div>
                                <TopAppBar onChangeTheme={this.handleChangeTheme}></TopAppBar>

                                <Route path="/" exact component={Homepage} />
                                <Route path="/register/" component={RegisterForm} />
                                <Route path="/login/" component={LoginForm} />
                                <Route path="/dashboard/" component={Dashboard} />
                            </div>
                        </Router>
                    </Container>
                </ThemeProvider>
            </React.Fragment>
        );
    }
}

export default App;
