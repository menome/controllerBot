/**
 * Copyright (C) 2017 Menome Technologies Inc.
 * 
 * Renders a room in the list of rooms.
 */
import React from 'react';
import { Collapse, List, Button, Modal, Icon } from 'antd';
import BotStatusBadge from "./BotStatusBadge";
import {dispatchFunc, deleteBot} from "../logic/dispatcher";

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
      this.setState({
        modalVisible: true,
        modalContent: result.body.data
      })
    });
  }

  deleteBot(id) {
    return deleteBot({id}).then((result) => {
      this.setState({
        modalVisible: true,
        modalContent: result.body
      })
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
        <Modal
          title="Call Result"
          visible={this.state.modalVisible}
          onOk={()=>{this.setState({modalVisible: false})}}
          onCancel={()=>{this.setState({modalVisible: false})}}
        >
          <pre>{JSON.stringify(this.state.modalContent,null,2)}</pre>
        </Modal>
      </div>
    )
  }
}

export default BotInfo;
