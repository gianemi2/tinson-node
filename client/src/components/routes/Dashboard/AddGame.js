import React, { Component } from 'react'
import { Grid, FormControl, TextField, Button } from '@material-ui/core'

import { addGameToList } from '../../../api'

export default class AddGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameLink: '',
            gameName: ''
        }
        this.props.isOnBeta(false);
    }
    handleChange = ({ target }) => {
        this.setState({ [target.name]: target.value });
    }


    handleSubmit = async (e) => {
        e.preventDefault();
        if (this.state.gameLink && this.state.gameName) {
            let id = this.grepDriveId(this.state.gameLink);
            const data = await addGameToList(id, this.state.gameName, this.props.legacy);
            if (data.success) {
                this.setState({
                    gameLink: '',
                    gameName: ''
                })
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
                <Grid
                    container
                    justify="flex-start"
                    alignItems="flex-end"
                >
                    <FormControl style={{ marginRight: 10, flex: 1 }}>
                        <TextField
                            name="gameLink"
                            label="Google Drive link"
                            value={this.state.gameLink}
                            onChange={this.handleChange}
                            margin="normal"
                            type="url"
                        />
                    </FormControl>
                    <FormControl style={{ marginRight: 10, flex: 1 }}>
                        <TextField
                            name="gameName"
                            label="Google Drive name"
                            value={this.state.gameName}
                            onChange={this.handleChange}
                            margin="normal"
                        />
                    </FormControl>
                    <Button type="submit" style={{ marginBottom: 8 }} variant="contained" color="primary">Add game to list</Button>
                </Grid>
            </form>
        )
    }
}
