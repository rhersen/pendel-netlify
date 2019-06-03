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
    fetch("/.netlify/functions/" + api + "?train=2751")
      .then(response => response.json())
      .then(json =>
        this.setState({
          loading: false,
          trains: json.RESPONSE.RESULT[0].TrainAnnouncement
        })
      )
  }

  render() {
    const { loading, trains } = this.state

    return (
      <div>
        <button onClick={this.handleClick("async-trains")}>
          {loading ? "Loading..." : "Call Async Lambda"}
        </button>
        <table>
          <tbody>
            {trains.map(train => (
              <tr key={train.LocationSignature + train.ActivityType}>
                <td>{train.AdvertisedTrainIdent}</td>
                <td>{train.ToLocation.map(loc => loc.LocationName).join()}</td>
                <td>{train.ActivityType}</td>
                <td>{train.LocationSignature}</td>
                <td>{train.AdvertisedTimeAtLocation.substring(11)}</td>
                <td>
                  {train.TimeAtLocation && train.TimeAtLocation.substring(11)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
