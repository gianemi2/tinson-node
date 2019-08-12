import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { checkToken } from '../api';

export default function withAuth(ComponentToProtect, inverseRedirect) {
    return class extends Component {
        constructor() {
            super();
            this.state = {
                loading: true,
                redirect: false,
            };
        }
        async componentDidMount() {
            const response = await checkToken();
            try {
                if (response.success) {
                    this.setState({ loading: false });
                } else {
                    throw new Error(response.data);
                }
            } catch (err) {
                this.setState({ loading: false, redirect: true });
            }
        }

        render() {
            const { loading, redirect } = this.state;
            if (loading) {
                return null;
            }
            if (redirect) {
                return <Redirect to="/login" />;
            }
            return (
                <React.Fragment>
                    <ComponentToProtect {...this.props} />
                </React.Fragment>
            );
        }
    }
}