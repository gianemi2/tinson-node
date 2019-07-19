import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { loginUser } from '../api'

export default class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: 'marco',
            password: 'marco',
            loggedIn: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        // Check session storage
    }

    render() {
        return (
            <React.Fragment>
                {this.renderRedirect()}
                <form onSubmit={this.handleSubmit} >
                    <label>
                        Name:
                    <input type="text" name="username" value={this.state.name} onChange={this.handleChange} />
                    </label>
                    <label>
                        Password:
                    <input type="password" name="password" value={this.state.password} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form >
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
        const { name, password } = this.state;
        const data = await loginUser(name, password);
        if (data.success) {
            sessionStorage.setItem('_id', data._id);
            this.setState({ loggedIn: true })
        }
    }
}
