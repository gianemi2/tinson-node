import React, { Component } from 'react'
import { Redirect, Link as RouterLink } from 'react-router-dom'
import { Typography, Grid, FormControl, TextField, Button, Link } from '@material-ui/core'

import { registerUser } from '../../api'

export default class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            password: '',
            registered: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return (
            <React.Fragment>
                <Typography variant="h3" gutterBottom>
                    Register to Tinson <span role="img" aria-label="Tinson icon!">🤖</span>
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Please, fill up the registration form for start using Tinson.
                </Typography>
                <form onSubmit={this.handleSubmit}>
                    <Grid
                        container
                        justify="flex-start"
                        alignItems="flex-end"
                    >
                        <FormControl style={{ marginRight: 10 }}>
                            <TextField
                                name="name"
                                label="Insert your username"
                                placeholder="Username"
                                value={this.state.name}
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
                        <Button type="submit" style={{ marginBottom: 8 }} variant="contained" color="primary">Register</Button>
                    </Grid>
                </form>
                <Typography variant="body1" gutterBottom>
                    Have you created an account before? <Link component={RouterLink} color="inherit" variant="inherit" to="/login">Login back!</Link>
                </Typography>
            </React.Fragment>
        )
    }

    handleChange({ target }) {
        this.setState({ [target.name]: target.value });
    }

    handleSubmit(event) {
        event.preventDefault();

        const { name, password } = this.state;
        if (name && password) {
            this.tryRegisterUser();
        } else {
            alert('All fields must be compiled!');
        }
    }

    tryRegisterUser = async () => {
        const { name, password } = this.state;
        const response = await registerUser(name, password);
        alert(response.data);
        if (response.success) {
            this.setState({ registered: true });
            this.props.history.push('/login');
        }
    }
}
