import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { FormControlLabel, Switch } from '@material-ui/core'

import { userExists, fetchGameList, deleteEntriesFromList } from '../../api'
import AddGame from './Dashboard/AddGame'
import AddFolder from './Dashboard/AddFolder'
import GameList from './Dashboard/GameList'
import Informations from './Dashboard/Informations'

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fraud: false,
            games: [],
            content: [],
            folderMode: false
        }
    }

    render() {
        return (
            <React.Fragment>
                {this.redirectIfNotLoggedIn()}
                <Informations></Informations>
                <FormControlLabel
                    control={
                        <Switch
                            checked={this.state.folderMode}
                            onChange={() => this.handleChangeMode()}
                            value="checkedA"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                    }
                    label="Manage folders mode"
                />
                {
                    this.state.folderMode
                        ? <AddFolder onFolderUpdated={this.fetchGames}></AddFolder>
                        : <AddGame onGameUpdated={this.fetchGames}></AddGame>
                }
                <GameList
                    onTriggerDelete={(index) => this.deleteEntries(index)}
                    games={this.state.content}
                    loadingFolders={this.state.folderMode}></GameList>
            </React.Fragment>
        )
    }

    handleChangeMode() {
        if (this.state.folderMode) {
            this.setState(
                {
                    folderMode: false,
                    content: this.state.games.files
                }
            )
        } else {
            this.setState(
                {
                    folderMode: true,
                    content: this.state.games.directories
                }
            )
        }
    }

    redirectIfNotLoggedIn() {
        if (this.state.fraud) {
            return <Redirect to="/login" />
        }
    }

    fetchGames = async () => {
        const response = await fetchGameList();
        if (response.success) {
            this.setState({ games: response.data })
            this.state.folderMode
                ? this.setState({ content: response.data.directories })
                : this.setState({ content: response.data.files })
        }
    }

    deleteEntries = async (index) => {
        const response = await deleteEntriesFromList(index, this.state.folderMode);
        if (response.success) {
            this.fetchGames();
        }
    }

    async componentDidMount() {
        if (sessionStorage.getItem('_id') !== null) {
            const data = await userExists();
            if (!data.success) {
                this.setState({ fraud: true });
            } else {
                this.fetchGames();
            }
        } else {
            this.setState({ fraud: true });
        }
    }
}
