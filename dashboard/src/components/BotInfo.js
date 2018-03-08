/**
 * Copyright (C) 2017 Menome Technologies Inc.
 * 
 * Renders a room in the list of rooms.
 */
import React from 'react';
import { Collapse, List, Button, Icon } from 'antd';
import { connect } from 'react-redux';
import BotStatusBadge from "./BotStatusBadge";
import {dispatchFunc, deleteBot} from "../logic/dispatcher";
import {changeModal} from '../redux/Actions';

class BotInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalContent: ""
    }
  }

  runAction(action) {
    return dispatchFunc({
      id: this.props.bot.id,
      path: action.path,
      method: action.method
    }).then((result) => {
      this.props.updateModal({open: true, body: JSON.stringify(result.body.data,null,2)})
    });
  }

  deleteBot(id) {
    return deleteBot({id}).then((result) => {
      this.props.updateModal({open: true, body: JSON.stringify(result.body,null,2)})
    })
  }

  render() {
    return (
      <div>
        <span style={{float: "right"}}>
          <BotStatusBadge style={{display: "inline"}} status={this.props.status}/>
          <a onClick={this.deleteBot.bind(this, this.props.bot.id)}>
            <Icon style={{fontSize: 32, color: "red"}} type="delete"/>
          </a>
        </span>
        <div>
          <h1>{this.props.bot.name}</h1>
          <p>{this.props.bot.desc}</p>
          <p>Metadata Last Updated: {new Date(this.props.bot.last_update).toLocaleTimeString()}</p>
        </div>
        <Collapse bordered={false}>
          <Collapse.Panel header="Actions">
            <List
              itemLayout="horizontal"
              size="large"
              dataSource={this.props.bot.operations.filter(x=>x.path !== '/status')}
              renderItem={(item,idx) => (
                <List.Item key={idx}>
                  <List.Item.Meta
                    title={item.name}
                    description={item.desc}
                  />
                  <Button type="primary" onClick={this.runAction.bind(this, item)}>Run</Button>
                </List.Item>
              )}
            />
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
