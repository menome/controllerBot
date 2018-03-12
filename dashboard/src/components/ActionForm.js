/**
 * Copyright (C) 2017 Menome Technologies Inc.
 * 
 * Control for executing or scheduling bot tasks.
 */
import React from 'react';
import { Button, Form, Input, Row, Col, Modal } from 'antd';
import { connect } from 'react-redux';
import {dispatchFunc, addTask} from "../logic/dispatcher";
import {changeModal} from '../redux/Actions';
import cronstrue from 'cronstrue';

const isValidJson = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

class BotActionItem extends React.Component {
  runAction = (e) => {
    e.preventDefault();
    var params = {}
    var body = this.props.form.getFieldValue('body');

    if(Array.isArray(this.props.action.params)) {
      this.props.action.params.forEach((param) => {
        params[param.name] = this.props.form.getFieldValue(param.name);
      })
    }

    if(!!body && !isValidJson(body))
      return Modal.error({
        title: "Invalid Body",
        content: "The body you entered is not valid JSON."
      })

    return dispatchFunc({
      id: this.props.bot.id,
      path: this.props.action.path,
      method: this.props.action.method,
      params: params,
      body: body ? JSON.parse(body) : undefined
    }).then((result) => {
      this.props.updateModal({open: true, body: JSON.stringify(result.body.data,null,2)})
    });
  }

  scheduleJob = () => {
    var params = {};
    var cronTime = this.props.form.getFieldValue('cronTime');
    var taskName = this.props.form.getFieldValue('SchedName');
    var taskDesc = this.props.form.getFieldValue('SchedDesc');
    var body = this.props.form.getFieldValue('body');

    if(Array.isArray(this.props.action.params)) {
      this.props.action.params.forEach((param) => {
        params[param.name] = this.props.form.getFieldValue(param.name);
      })
    }

    if(!!body && !isValidJson(body))
      return Modal.error({
        title: "Invalid Body",
        content: "The body you entered is not valid JSON."
      })

    return addTask({
      name: taskName,
      desc: taskDesc,
      cronTime: cronTime,
      job: {
        id: this.props.bot.id,
        path: this.props.action.path,
        method: this.props.action.method,
        params: params,
        body: body ? JSON.parse(body) : undefined
      },
    }).then((result) => {
      this.props.updateModal({open: true, body: JSON.stringify(result.body,null,2)})
    });
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <div style={{flex: 1}}>
        <Form onSubmit={this.runAction}>
          <Row gutter={12}>
            <Col sm={24} md={12}>
              <h3>Parameters</h3>
              {(!this.props.action.body && (!this.props.action.params || this.props.action.params.length < 1)) && <p>No Parameters on this action</p>}
              {this.props.action.params && this.props.action.params.map((param,idx) => {
                return (
                  <Form.Item key={param.name} label={param.name} {...formItemLayout}>
                    {this.props.form.getFieldDecorator(param.name, {
                      rules: [{ required: param.required }],
                    })(
                      <Input placeholder={param.desc}/>
                    )}
                  </Form.Item>
                )
              })}
              {this.props.action.body && (
                <Form.Item key={"body"} label="Request Body" {...formItemLayout}>
                  {this.props.form.getFieldDecorator("body", {
                    rules: [{ required: false }],
                  })(
                    <Input.TextArea rows={6} placeholder={"JSON Body of Request"}/>
                  )}
                </Form.Item>
              )}
              <Form.Item style={{textAlign: "right"}}>
                <Button type="primary" htmlType="submit">
                  Run Action
                </Button>
              </Form.Item>
            </Col>
            <Col sm={24} md={12}>
              <h3>Scheduling</h3>
              <Form.Item label={"Scheduled Task Name"} {...formItemLayout}>
                {this.props.form.getFieldDecorator('SchedName', {
                  rules: [{ required: false }],
                })(
                  <Input placeholder="Name of Scheduled Action"/>
                )}
              </Form.Item>
              <Form.Item label={"Scheduled Task Description"} {...formItemLayout}>
                {this.props.form.getFieldDecorator('SchedDesc', {
                  rules: [{ required: false }],
                })(
                  <Input placeholder="Description of Scheduled Action"/>
                )}
              </Form.Item>
              <Form.Item label={"Cron Time"} {...formItemLayout}>
                {this.props.form.getFieldDecorator('cronTime', {
                  rules: [{ required: false }],
                })(
                  <Input placeholder="Cron Time"/>
                )}
              </Form.Item>
              {this.props.form.getFieldValue('cronTime') && cronstrue.toString(this.props.form.getFieldValue('cronTime'), {throwExceptionOnParseError: false})}
              <Form.Item style={{textAlign: "right"}}>
                <Button type="primary" onClick={this.scheduleJob} disabled={!this.props.form.getFieldValue('cronTime')}>
                  Schedule Action
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
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
)(Form.create()(BotActionItem));
