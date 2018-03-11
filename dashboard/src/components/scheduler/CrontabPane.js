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
  state = {
    crontab: {},
    tasks: {}
  }

  componentDidMount() {
    webservice.get('/api/schedule').then((result) => {
      this.setState({
        crontab: result.body.data,
        tasks: result.body.data.tasks
      })
    })
  }

  onCommit(cronjob) {
    console.log(cronjob);
  }

  render() {
    return (
      <div>
        <h3>Scheduled Tasks</h3>
        {Object.keys(this.state.tasks).map((key,idx) => {
          var itm = this.state.tasks[key];
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
    botstatus: state.botstatus,
    registry: state.registry,
    loadingState: state.loadingState,
    lastUpdateTime: state.lastUpdateTime
  }
}

export default connect(
  mapStateToProps
)(BotPane);
