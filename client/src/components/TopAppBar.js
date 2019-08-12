import React from 'react';
import { AppBar, Button, Toolbar, Typography, Icon, IconButton } from '@material-ui/core';
import { Link as RouterLink, withRouter } from 'react-router-dom'

import { checkToken } from '../api'

class TopAppBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedin: false,
            button: ''
        }
    }

    render() {
        return (
            <div style={{
                flexGrow: 1,
                marginTop: 25,
                marginBottom: 30
            }}>
                <AppBar position="static" color="default">
                    <Toolbar>
                        <Typography variant="h6" style={{ flexGrow: 1 }}>
                            <RouterLink style={{ color: 'inherit', textDecoration: 'none' }} to="/">Tinson <span role="img" aria-label="Tinson icon!">🤖</span></RouterLink>
                        </Typography>
                        <IconButton
                            color="inherit"
                            aria-label="Change Tinson theme"
                            onClick={() => this.props.onChangeTheme()}
                        >
                            <Icon>invert_colors</Icon>
                        </IconButton>
                        {this.state.button}
                    </Toolbar>
                </AppBar>
            </div >
        );
    }

    async handleStatus() {
        if (!this.state.loggedin) {
            const data = await checkToken();
            if (data.success) {
                this.setState({ loggedin: true });
            } else {
                this.setState({ loggedin: false });
            }
        }
        this.updateButtons();
    }

    async componentDidMount() {
        this.handleStatus();
    }

    async componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.handleStatus();
        }
    }

    updateButtons = () => {
        if (!this.state.loggedin) {
            this.setState(
                {
                    button: <React.Fragment>
                        <Button component={RouterLink} color="inherit" to="/login">Login</Button>
                        <Button component={RouterLink} color="inherit" to="/register">Register</Button>
                    </React.Fragment>
                }
            )
        } else {
            this.setState(
                {
                    button: <React.Fragment>
                        <Button component={RouterLink} color="inherit" to="/dashboard">Dashboard</Button>
                        <Button component={RouterLink} color="inherit" to="/logout">Logout</Button>
                    </React.Fragment>
                }
            );
        }
    }

}

export default withRouter(TopAppBar)