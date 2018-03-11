/**
 * Copyright (C) 2017 Menome Technologies Inc.
 */
import React from 'react';
import { Collapse, List, Icon, Popconfirm, Button, Modal } from 'antd';
import { connect } from 'react-redux';
import BotStatusBadge from "./BotStatusBadge";
import ActionForm from "./ActionForm";
import {deleteBot} from "../logic/dispatcher";
import {changeModal} from '../redux/Actions';
// import BotActionItem from './BotActionItem';

class BotInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalContent: ""
    }
  }

  componentDidMount() {
    console.log('info mount')
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
          <Popconfirm placement="topRight" title="Are you sure you want to remove this bot?" onConfirm={this.deleteBot.bind(this, this.props.bot.id)}>
            <a>
              <Icon style={{fontSize: 32, color: "red"}} type="delete"/>
            </a>
          </Popconfirm>
        </span>
        <div>
          <h1>{this.props.bot.name}</h1>
          <p>{this.props.bot.desc}</p>
          <p>Metadata Last Updated: {new Date(this.props.bot.last_update).toLocaleTimeString()}</p>
        </div>
        <Collapse bordered={false}>
              {this.props.bot.operations.filter(x=>x.path !== '/status').map((action) => {
                return (
                  <Collapse.Panel key={action.path} header={<span>{action.name} - <small>{action.desc}</small></span>}>
                    <ActionForm bot={this.props.bot} action={action}/>
                  </Collapse.Panel>
                )
              })}
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
