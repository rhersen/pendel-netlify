import React, { Component } from "react"
import "./App.css"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { loading: false, trains: [] }
  }

  handleClick = (type, id) => e => {
    e.preventDefault()

    this.setState({ loading: true, trains: [] })
    fetch(`/.netlify/functions/async-trains?${type}=${id}`)
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
        <button onClick={this.handleClick("station", "Sst")}>
          {loading ? "Loading..." : "Call Async Lambda"}
        </button>
        <table>
          <tbody>
            {trains.map(train => (
              <tr key={train.LocationSignature + train.ActivityType}>
                <td
                  onClick={this.handleClick(
                    "train",
                    train.AdvertisedTrainIdent
                  )}
                >
                  {train.AdvertisedTrainIdent}
                </td>
                <td>
                  {(train.ToLocation || []).map(loc => loc.LocationName).join()}
                </td>
                <td>{train.AdvertisedTimeAtLocation.substring(11)}</td>
                <td
                  onClick={this.handleClick("station", train.LocationSignature)}
                >
                  {train.LocationSignature}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

export default App
