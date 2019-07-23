import React, { Component } from 'react'
import { Redirect, Link as RouterLink } from 'react-router-dom'
import { TextField, Typography, Button, Link, FormControl, Grid } from '@material-ui/core'

import { loginUser } from '../../api'

export default class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            loggedIn: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return (
            <React.Fragment>
                {this.renderRedirect()}
                <Typography variant="h3" gutterBottom>
                    Login
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Use your credentials to login.
                </Typography>
                <form onSubmit={this.handleSubmit}>
                    <Grid
                        container
                        justify="flex-start"
                        alignItems="flex-end"
                    >
                        <FormControl style={{ marginRight: 10 }}>
                            <TextField
                                name="username"
                                label="Insert your username"
                                placeholder="Username"
                                value={this.state.username}
                                onChange={this.handleChange}
                                margin="normal"
                            />
                        </FormControl>
                        <FormControl style={{ marginRight: 10 }}>
                            <TextField
                                name="password"
                                label="Insert your password"
                                placeholder="Password"
                                value={this.state.password}
                                onChange={this.handleChange}
                                margin="normal"
                            />
                        </FormControl>
                        <Button type="submit" style={{ marginBottom: 8 }} variant="contained" color="primary">Login</Button>
                    </Grid>
                </form >
                <Typography variant="body1" gutterBottom>
                    Are you new to Tinson? <Link component={RouterLink} color="inherit" variant="inherit" to="/register">Register now.</Link>
                </Typography>
            </React.Fragment >

        )
    }

    handleChange({ target }) {
        this.setState({ [target.name]: target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.tryLoginUser();
    }

    renderRedirect() {
        if (this.state.loggedIn) {
            return <Redirect to='/dashboard'></Redirect>;
        }
    }

    async tryLoginUser() {
        const { username, password } = this.state;
        const data = await loginUser(username, password);
        if (data.success) {
            sessionStorage.setItem('_id', data._id);
            this.setState({ loggedIn: true })
        } else {
            alert(data.message);
        }
    }
}
