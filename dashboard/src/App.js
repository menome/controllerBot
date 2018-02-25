import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Input } from 'antd';
import {initialize} from './logic/telemetry';
import BotPane from './components/BotPane';
import {addBot} from './logic/dispatcher';

class App extends Component {
  constructor(props) {
    super(props);
    initialize();
  }

  addBot(address) {
    return addBot({address});
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
          <Input onPressEnter={(e) => {this.addBot(e.target.value)}} placeholder="Add Bot"/>
          <BotPane/>
        </Layout.Content>
      </Layout>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
	return {
    loadingState: state.loadingState,
    lastUpdateTime: state.lastUpdateTime
  }
}

export default connect(
  mapStateToProps
)(App);
