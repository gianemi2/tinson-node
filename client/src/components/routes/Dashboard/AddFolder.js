import React, { Component } from 'react'
import { Grid, FormControl, TextField, Button } from '@material-ui/core'

import { addFolderToList } from '../../../api';

export default class AddFolder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dirname: '',
            dirlink: ''
        }

        this.props.isOnBeta(false)
    }

    handleChange = ({ target }) => {
        this.setState({ [target.name]: target.value });
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

    handleSubmit = async (e) => {
        e.preventDefault();
        if (this.state.dirlink && this.state.dirname) {
            const id = this.grepDriveId(this.state.dirlink);
            const data = await addFolderToList(id, this.state.dirname, this.props.legacy);
            if (data.success) {
                this.setState({
                    dirlink: '',
                    dirname: ''
                })
                this.props.onFolderUpdated();
            }
        }
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
                            name="dirlink"
                            label="G.Drive folder link"
                            value={this.state.dirlink}
                            onChange={this.handleChange}
                            margin="normal"
                            type="url"
                        />
                    </FormControl>
                    <FormControl style={{ marginRight: 10, flex: 1 }}>
                        <TextField
                            name="dirname"
                            label="G.Drive folder name"
                            value={this.state.dirname}
                            onChange={this.handleChange}
                            margin="normal"
                        />
                    </FormControl>
                    <Button type="submit" style={{ marginBottom: 8 }} variant="contained" color="primary">Add folder to list</Button>
                </Grid>
            </form>
        )
    }
}
