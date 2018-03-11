/**
 * Copyright (C) 2017 Menome Technologies Inc.
 *
 * Renders tasks into little cardlike objects.
 */

import React from 'react';
import { Collapse, Icon, Popconfirm } from 'antd';
import { connect } from 'react-redux';
import {changeModal} from '../../redux/Actions';
import {deleteTask, runTask} from '../../logic/dispatcher';
import cronstrue from 'cronstrue';

class BotInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalContent: ""
    }
  }

  deleteTask() {
    return deleteTask({id:this.props.taskid}).then((result) => {
      this.props.updateModal({open: true, body: JSON.stringify(result.body,null,2)})
    })
  }

  runTask() {
    return runTask({id:this.props.taskid}).then((result) => {
      this.props.updateModal({open: true, body: JSON.stringify(result.body,null,2)})
    })
  }

  render() {
    return (
      <div>
        <span style={{float: "right"}}>
          <Popconfirm placement="topRight" title="Are you sure you want to remove this task?" onConfirm={this.deleteTask.bind(this)}>
            <a><Icon style={{fontSize: 32, color: "red"}} type="delete"/></a>
          </Popconfirm>
          <Icon onClick={this.runTask.bind(this)} style={{fontSize: 32, color: "green"}} type="caret-right"/>
        </span>

        <div>
          <h1>{this.props.task.name}</h1>
          <p><b>Task ID:</b> {this.props.taskid}</p>
          <p><b>Description:</b> {this.props.task.desc}</p>
          <p><b>Cron Schedule</b> <span style={{fontFamily: "courier"}}>{this.props.task.cronTime}</span> ({cronstrue.toString(this.props.task.cronTime, {throwExceptionOnParseError: false})})</p>
        </div>

        <Collapse bordered={false}>
          <Collapse.Panel header="Details">
            <div style={{fontFamily: "courier", padding: "10px", background: "#EEE"}}>
              <pre>{JSON.stringify(this.props.task,null,2)}</pre>
            </div>
          </Collapse.Panel>
        </Collapse> 
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateModal: (...args) => {dispatch(changeModal(...args))}
  }
}

export default connect(
  null,
  mapDispatchToProps
)(BotInfo);
