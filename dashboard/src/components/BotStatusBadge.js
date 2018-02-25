/**
 * Copyright (C) 2017 Menome Technologies Inc.
 * 
 * Renders a room in the list of rooms.
 */
import React from 'react';
import { Popover, Icon } from 'antd';
const botStates = {
  "idle": {
    "color": "green",
    "icon": "check-circle" 
  },
  "initializing": {
    "color": "orange",
    "icon": "info-circle" 
  },
  "working": {
    "color": "brown",
    "icon": "clock-circle" 
  },
  "failed": {
    "color": "red",
    "icon": "close-circle" 
  },
  "other": {
    "color": "red",
    "icon": "question-circle"
  }
}

class BotInfo extends React.Component { 
  // {state, message, progressPercent}
  getinfo(status) {
    if(botStates[status]) return botStates[status];
    else return botStates['other'];
  }

  render() {
    if(!this.props.status) return null;
    var info = this.getinfo(this.props.status.state);

    return (
      <span>
        <Popover placement="leftTop" title={this.props.status.state} content={this.props.status.message || "(No Status Message)"}>
          <Icon style={{fontSize: 32, color: info.color}} type={info.icon}/>
        </Popover>
      </span>
    )
  }
}

export default BotInfo;
