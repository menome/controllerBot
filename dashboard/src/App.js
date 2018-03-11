import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Input, Modal, Button, Spin, Divider } from 'antd';
import {initialize, refresh} from './logic/telemetry';
import BotPane from './components/BotPane';
import CrontabPane from './components/scheduler/CrontabPane';
import {addBot} from './logic/dispatcher';
import {changeModal} from './redux/Actions';

class App extends Component {
  constructor(props) {
    super(props);
    initialize();
  }

  addBot(address) {
    return addBot({address}).then((result) => {
      this.props.updateModal({open: true, body: JSON.stringify(result.body,null,2)})
    }).catch((err) => {
      this.props.updateModal({open: true, body: err.toString()})
    });
  }

  forceRefresh() {
    refresh();
  }

  render() {
    return (
      <Layout>
        <Layout.Header>
          <div style={{
            height: "31px",
            fontSize: "2em",
            color: "slategrey",
            margin: "0px 24px 16px 0",
            float: "left"
          }}>
            <p>Bot Management Dashboard</p>
          </div>
        </Layout.Header>
        <Layout.Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
          <Input.Search placeholder="Enter Bot Address" enterButton="Add Bot" onSearch={(str) => {this.addBot(str)}}/>
          <Divider/>
          <div style={{marginTop: "20px"}}>
            <Spin style={{float: "right"}} spinning={this.props.loadingState}/>
            <Button onClick={this.forceRefresh} loading={this.props.loadingState} icon="sync" shape="circle"/>
            <span style={{marginLeft: "5px"}}>Last Status Update: {new Date(this.props.lastUpdateTime).toLocaleTimeString()}</span>
            <BotPane/>
          </div>
          <Divider/>
          <CrontabPane/>
        </Layout.Content>
        <Modal
          title={this.props.modal.title || "Call Result"}
          visible={this.props.modal.open}
          onOk={this.props.updateModal.bind({open: false, body: "", title: ""})}
          onCancel={this.props.updateModal.bind({open: false, body: "", title: ""})}
        >
          <pre>{this.props.modal.body}</pre>
        </Modal>
      </Layout>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
	return {
    loadingState: state.loadingState,
    lastUpdateTime: state.lastUpdateTime,
    modal: state.modal
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateModal: (...args) => {dispatch(changeModal(...args))}
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
