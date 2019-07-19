import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { registerUser } from '../api'

export default class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: 'marco',
            password: 'marco',
            rePassword: 'marco',
            registered: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return (
            <React.Fragment>
                {this.renderRedirect()}
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Name:
                    <input type="text" name="name" value={this.state.name} onChange={this.handleChange} />
                    </label>
                    <label>
                        Password:
                    <input type="password" name="password" value={this.state.password} onChange={this.handleChange} />
                    </label>
                    <label>
                        Password again:
                    <input type="password" name="rePassword" value={this.state.rePassword} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </React.Fragment>
        )
    }

    handleChange({ target }) {
        this.setState({ [target.name]: target.value });
    }

    handleSubmit(event) {
        event.preventDefault();

        const { name, password, rePassword } = this.state;
        if (name && password && rePassword) {
            if (password === rePassword) {
                this.tryRegisterUser();
            } else {
                alert('Password must be the same!');
            }
        } else {
            alert('All fields must be compiled!');
        }
    }

    renderRedirect() {
        if (this.state.registered) {
            return <Redirect to='/login'></Redirect>;
        }
    }

    tryRegisterUser = async () => {
        const { name, password } = this.state;
        const data = await registerUser(name, password);

        if (data.success) {
            this.setState({ registered: true });
        }
    }
}
