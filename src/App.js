/**
 * Copyright (C) 2017 Menome Technologies Inc.
 * 
 * Main page of the App
 */
import React, { Component } from 'react';
import './App.css';
import './w3.css';
import WebService from "./logic/webservice";
import { connect } from 'react-redux';
import { changeStatus, changeLoading } from './redux/Actions';
import RoomPane from './components/RoomPane';
import {Icon} from 'react-fa'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRoom: false
    }

    this.refreshIntervalFrequency = 5000; // Refresh every 5 seconds.

    this.refresh()
    this.refreshInterval = setInterval(this.refresh.bind(this), this.refreshIntervalFrequency);
  }

  // Done so we can reset the refresh interval when the user manually refreshes.
  manualRefresh(force=false) {
    clearInterval(this.refreshInterval)
    
    this.refresh(force).then(() => {
      this.refreshInterval = setInterval(this.refresh.bind(this), this.refreshIntervalFrequency);
    })
  }

  // Refreshes the data from the API.
  refresh(force=false) {
    this.props.changeLoading(true);
    return WebService.get('api/status', {forcerefresh: force}).then((result) => {
      return this.props.changeStatus(result.body.data)
    }).catch((err) => {
      return console.log(err);
    });
  }
  
  selectRoom(room) {
    this.setState({selectedRoom: room.Id});
  }

  getColorClass(devices) {
    var aliveCount = 0;
    var deadCount = 0;
    var otherCount = 0;
    devices.forEach((itm) => {
      if(itm.Status === 'ALIVE') aliveCount++;
      else if(itm.Status === 'DEAD') deadCount++;
      else otherCount++;
    })
    if(aliveCount > 0) return "w3-green";
    if(deadCount > otherCount) return "w3-red";
    else if(otherCount > aliveCount) return "w3-orange";
    else return "w3-green";
  }

  render() {
    return (
      <div className="App">
        <div className="w3-container w3-black">
          <h2>Ignite IoT Dashboard</h2>
        </div>
        <div className="w3-container w3-black">
          <Icon spin={this.props.loadingState} onClick={this.manualRefresh.bind(this,true)} name="refresh"/>
          {' '}
          <span>Last updated {new Date(this.props.lastUpdateTime).toLocaleTimeString()}</span>
        </div>
        <div>
          <div className="w3-row-padding w3-margin-top">
            {(this.props.roomstate && this.props.roomstate.rooms) ? 
              this.props.roomstate.rooms.map((itm,idx) => {
                return <div key={idx} className="w3-quarter">
                  <div className="w3-card w3-margin-bottom w3-hover-shadow" onClick={this.selectRoom.bind(this,itm)}>
                    <header className={"w3-container "+ this.getColorClass(itm.Devices)}>
                      <h3>{itm.RoomName}</h3>
                    </header>
                    <table className="w3-table w3-bordered">
                      <tbody>
                        <tr>
                          <td><b>Devices</b></td>
                          <td>{itm.Devices.length}</td>
                        </tr>
                        <tr>
                          <td><b>Floor</b></td>
                          <td>{itm.Floor}</td>
                        </tr>
                        <tr>
                          <td><b>Room Number</b></td>
                          <td>{itm.RoomNumber}</td>
                        </tr>
                        {itm.Building &&
                          [
                            <tr key="name">
                              <td><b>Building</b></td>
                              <td>{itm.Building.Name}</td>
                            </tr>,
                            <tr key="location">
                              <td><b>Location</b></td>
                              <td>{itm.Building.Location}</td>
                            </tr>
                          ]
                        }
                        
                      </tbody>
                    </table>
                  </div>
                </div>
              })
            : "No Bots Loaded"}
          </div>
          <div>
            <hr/>
            <RoomPane room={this.props.roomstate.rooms && this.props.roomstate.rooms.find((room) => room.Id === this.state.selectedRoom)}/>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
	return {
    roomstate: state.roomstate,
    loadingState: state.loadingState,
    lastUpdateTime: state.lastUpdateTime
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeStatus: status => dispatch(changeStatus(status)),
    changeLoading: loading => dispatch(changeLoading(loading))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
