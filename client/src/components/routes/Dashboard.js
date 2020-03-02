import React, { Component } from 'react'
import { FormControlLabel, Switch, Chip } from '@material-ui/core'

import { fetchGameList, deleteEntriesFromList, checkToken } from '../../api'
import AddGame from './Dashboard/AddGame'
import AddFolder from './Dashboard/AddFolder'
import GameList from './Dashboard/GameList'
import Informations from './Dashboard/Informations'
import SetSuccessMessage from './Dashboard/SetSuccessMessage'

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fraud: false,
            games: [],
            content: [],
            folderMode: false,
            beta: false,
            userID: '',
            legacyMode: false
        }
    }

    render() {
        return (
            <React.Fragment>
                <p>
                    Tinson has been updated massively. A lot of things has been changed for security reasons. Unfortunately this brings to a factory reset of the DB. So every game added to a list has been removed.
                    If you had a very long list and you're tired of import it back, please send me a message on discord (<u>gianemi2#0920</u>) and I'll get back to you as soon as possible.
                </p>
                <div style={{
                    maxWidth: "100%",
                    width: 715
                }}>
                    <SetSuccessMessage />
                    <FormControlLabel
                        style={{ marginTop: 20, marginBottom: -15 }}
                        control={
                            <Switch
                                checked={this.state.folderMode}
                                onChange={() => this.handleChangeMode()}
                                value="checkedA"
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                            />
                        }
                        label={
                            this.state.folderMode
                                ? 'Deactivate folder mode'
                                : 'Activate folder mode'
                        }
                    />
                    <br />
                    <FormControlLabel
                        style={{ marginTop: 20, marginBottom: -15 }}
                        control={
                            <Switch
                                checked={this.state.legacyMode}
                                onChange={() => this.handleLegacyChange()}
                                value="checkedA"
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                            />
                        }
                        label={
                            this.state.legacyMode
                                ? 'Deactivate Tinfoil <8.00 compatibility'
                                : 'Activate Tinfoil <8.00 compatibility'
                        }
                    />
                    {
                        this.state.beta
                            ? <Chip style={{ fontSize: 16, marginLeft: 15 }} label="Beta feature" color="secondary" />
                            : false
                    }
                    {
                        this.state.folderMode
                            ? <AddFolder
                                isOnBeta={(beta) => this.setBetaStatus(beta)}
                                onFolderUpdated={this.fetchGames}
                                legacy={this.state.legacyMode} />
                            : <AddGame
                                isOnBeta={(beta) => this.setBetaStatus(beta)}
                                onGameUpdated={this.fetchGames}
                                legacy={this.state.legacyMode} />
                    }
                    <GameList
                        onTriggerDelete={(index) => this.deleteEntries(index)}
                        games={this.state.content}
                        loadingFolders={this.state.folderMode}></GameList>
                </div>
                <Informations id={this.state.userID}></Informations>
            </React.Fragment >
        )
    }

    setBetaStatus(betaStatus) {
        this.setState({ beta: betaStatus });
    }

    handleLegacyChange() {
        if (this.state.legacyMode != true) {
            alert('please consider upgrade Tinfoil to > 8.00')
        }
        this.setState(
            {
                legacyMode: !this.state.legacyMode
            }
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
