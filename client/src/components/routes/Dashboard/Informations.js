import React, { Component } from 'react'

export default class Informations extends Component {
    constructor(props) {
        super(props);
        const _id = sessionStorage.getItem('_id');
        const decoded = atob(_id).split('16sette11');
        this.state = {
            user: decoded[0],
            pass: decoded[1]
        }
    }
    render() {
        return (
            <div>
                <p>
                    <code>
                        {`${window.location.origin}/v1/${this.state.user}/${this.state.pass}`}
                    </code>
                </p>
            </div>
        )
    }
}
