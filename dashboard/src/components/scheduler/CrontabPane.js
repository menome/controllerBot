/**
 * Copyright (C) 2017 Menome Technologies Inc.
 * 
 * Shows an editable crontab.
 */
import React from 'react';
import { connect } from 'react-redux';
import webservice from '../../logic/webservice';
import TaskInfo from './TaskInfo';

class BotPane extends React.Component {
  render() {
    return (
      <div>
        <h3>Scheduled Tasks</h3>
        {Object.keys(this.props.schedule.tasks).map((key,idx) => {
          var itm = this.props.schedule.tasks[key];
          return (
            <div key={key} style={{borderRadius: "5px", marginTop: "10px", padding: "10px", background: "#efefef"}}>
              <TaskInfo task={itm} taskid={key}/>
            </div>
          )
        })}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
	return {
    schedule: state.schedule,
    loadingState: state.loadingState
  }
}

export default connect(
  mapStateToProps
)(BotPane);
