import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { userExists, fetchGameList, deleteGameFromList } from '../api'
import AddGame from './Dashboard/AddGame'
import GameList from './Dashboard/GameList'
import Informations from './Dashboard/Informations';

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fraud: false,
            games: []
        }
    }

    render() {
        return (
            <React.Fragment>
                {this.redirectIfNotLoggedIn()}
                <Informations></Informations>
                <AddGame onGameUpdated={this.fetchGames}></AddGame>
                <GameList onTriggerDelete={(index) => this.deleteGames(index)} games={this.state.games}></GameList>
            </React.Fragment>
        )
    }

    redirectIfNotLoggedIn() {
        if (this.state.fraud) {
            return <Redirect to="/login" />
        }
    }

    fetchGames = async () => {
        const response = await fetchGameList();
        if (response.success) {
            this.setState({ games: JSON.parse(response.data).files })
        }
    }

    deleteGames = async (index) => {
        console.log('Sending ', index);
        const response = await deleteGameFromList(index);
        if (response.success) {
            this.fetchGames();
        }
    }

    async componentDidMount() {

        const data = await userExists();
        if (!data.success) {
            this.setState({ fraud: true });
        }
        this.fetchGames();
    }
}
