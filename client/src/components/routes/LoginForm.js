import React, { Component } from 'react'
import { Link as RouterLink } from 'react-router-dom'
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
                <Typography variant="h3" gutterBottom>
                    Login to Tinson <span role="img" aria-label="Tinson icon!">🤖</span>
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

    tryLoginUser = async () => {
        const { username, password } = this.state;
        const response = await loginUser(username, password);
        if (response.success) {
            this.props.history.push('/dashboard');
        } else {
            alert("Something went wrong. Maybe wrong credentials or user doesn't exists at all.")
        }
    }
}
