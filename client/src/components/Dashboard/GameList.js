import React, { Component } from 'react'

export default class GameList extends Component {
    render() {
        if (this.props.games.length > 0) {
            return (
                <div>
                    <ul>
                        {
                            this.props.games.map((game, i) => {
                                return <li onClick={() => this.onDelete(i)} key={game}>{game}</li>
                            })
                        }
                    </ul>
                </div>
            )
        } else {
            return <p>No games found...</p>
        }
    }

    onDelete(index) {
        this.props.onTriggerDelete(index);
    }
}
