import React, { Component } from "react"
import "./App.css"

class LambdaDemo extends Component {
  constructor(props) {
    super(props)
    this.state = { loading: false, trains: [] }
  }

  handleClick = api => e => {
    e.preventDefault()

    this.setState({ loading: true })
    fetch("/.netlify/functions/" + api)
      .then(response => response.json())
      .then(json => this.setState({ loading: false, trains: json.RESPONSE.RESULT[0].TrainAnnouncement }))
  }

  render() {
    const { loading, trains } = this.state

    return (
      <p>
        <button onClick={this.handleClick("async-trains")}>{loading ? "Loading..." : "Call Async Lambda"}</button>
        <br />
        <ol>{trains.map(train => <li>{train.AdvertisedTrainIdent}</li>)}</ol>
      </p>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <LambdaDemo />
        </header>
      </div>
    )
  }
}

export default App
