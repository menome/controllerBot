/**
 * Copyright (C) 2017 Menome Technologies Inc.
 * 
 * Renders a room in the list of rooms.
 */
import React from 'react';
import { Button, Form, Input, Row, Col } from 'antd';
import { connect } from 'react-redux';
import {dispatchFunc} from "../logic/dispatcher";
import {changeModal} from '../redux/Actions';

class BotActionItem extends React.Component {
  runAction = (e) => {
    e.preventDefault();
    var params = {}

    if(Array.isArray(this.props.operation.params)) {
      this.props.operation.params.forEach((param) => {
        params[param.name] = this.props.form.getFieldValue(param.name);
      })
    }

    return dispatchFunc({
      id: this.props.bot.id,
      path: this.props.operation.path,
      method: this.props.operation.method,
      params: params
    }).then((result) => {
      this.props.updateModal({open: true, body: JSON.stringify(result.body.data,null,2)})
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
          <Row gutter={5}>
            <Col span={20}>
              {this.props.operation.params && this.props.operation.params.map((param,idx) => {
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
            </Col>

            <Col span={4}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Run
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
