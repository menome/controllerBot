/**
 * Copyright (C) 2017 Menome Technologies Inc.
 * 
 * Renders a room in the list of rooms.
 */
import React from 'react';
import { connect } from 'react-redux';
import BotInfo from './BotInfo';

class BotPane extends React.Component {
  render() {
    return (
      <div>
        {this.props.registry.map((itm,idx) => {
          return (
            <div key={itm.id} style={{borderRadius: "5px", marginTop: "10px", padding: "10px", background: "#efefef"}}>
              <BotInfo bot={itm} status={this.props.botstatus[itm.id]}/>
            </div>
          )
        })}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
	return {
    botstatus: state.botstatus,
    registry: state.registry,
    loadingState: state.loadingState,
    lastUpdateTime: state.lastUpdateTime
  }
}

export default connect(
  mapStateToProps
)(BotPane);
