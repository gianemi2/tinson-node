import React, { Component } from 'react'

import { addGameToList } from '../../api'

export default class AddGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameLink: 'https://drive.google.com/file/d/1cAJIjdVpznjXtGG4McVts-xnaZxFqbRh/view?usp=drivesdk',
            gameName: ''
        }
    }
    handleChange = ({ target }) => {
        this.setState({ [target.name]: target.value });
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        if (this.state.gameLink && this.state.gameName) {
            let id = this.grepDriveId(this.state.gameLink);
            const data = await addGameToList(id, this.state.gameName);
            if (data.success) {
                this.props.onGameUpdated();
            }
        }
    }

    grepDriveId(driveLink) {
        // Tentativo #1 controllo in GET se c'è l'id
        const url = new URL(driveLink);
        let id;
        if (url.searchParams.get('id')) {
            id = url.searchParams.get('id');
        } else {
            // Tentativo fallito. 
            // Tentativo #2: controllo manuale.
            const paths = url.pathname.split('/');
            id = paths.reduce((prev, curr) => {
                return prev.length > curr.length ? prev : curr;
            })
        }
        return id;
    }
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Google drive link:
                    <input type="url" name="gameLink" value={this.state.gameLink} onChange={this.handleChange} />
                </label><br />
                <label>
                    Game name:
                    <input type="text" name="gameName" value={this.state.gameName} onChange={this.handleChange} />
                </label><br />
                <input type="submit" value="Submit" />
            </form>
        )
    }
}
