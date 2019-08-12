import React from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios';

export default class Logout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirecting: false
        }
    }
    render() {
        return this.state.redirecting ? <Redirect to="/login"></Redirect> : 'Redirecting ...'
    }
    async componentDidMount() {
        const { data } = await axios.get('/deleteSession');
        if (data.success) {
            this.setState({ redirecting: true });
        }
    }
}
