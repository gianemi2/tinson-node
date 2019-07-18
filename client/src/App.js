import React from 'react';
import './App.css';

class App extends React.Component {
    state = { randomText: '' };
    componentDidMount() {
        this.fetchRandomText();
    }
    render() {
        const { randomText } = this.state;
        return (
            <div className="App" >
                <header className="App-header">
                    <p>I'm working pretty fine!</p>
                    <p>{randomText}</p>
                </header>
            </div>
        );
    }
    fetchRandomText = () => {
        fetch('/api/passwords')
            .then((res) => res.json())
            .then((res) => this.setState({ randomText: res }));
    }
}

export default App;
