import React, { Component } from 'react'
import { FormControlLabel, Switch, Chip } from '@material-ui/core'

import { fetchGameList, deleteEntriesFromList, checkToken } from '../../api'
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
            folderMode: false,
            beta: false,
            userID: ''
        }
    }

    render() {
        return (
            <React.Fragment>
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
                    this.state.beta
                        ? <Chip style={{ fontSize: 16, marginLeft: 15 }} label="Beta feature" color="secondary" />
                        : false
                }
                {
                    this.state.folderMode
                        ? <AddFolder isOnBeta={(beta) => this.setBetaStatus(beta)} onFolderUpdated={this.fetchGames}></AddFolder>
                        : <AddGame isOnBeta={(beta) => this.setBetaStatus(beta)} onGameUpdated={this.fetchGames}></AddGame>
                }
                <GameList
                    onTriggerDelete={(index) => this.deleteEntries(index)}
                    games={this.state.content}
                    loadingFolders={this.state.folderMode}></GameList>
                <Informations id={this.state.userID}></Informations>
            </React.Fragment>
        )
    }

    setBetaStatus(betaStatus) {
        this.setState({ beta: betaStatus });
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

    componentDidMount() {
        this.fetchGames();
        checkToken().then(res => this.setState({ userID: res.id }));
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
}
