import './login.less'
import React, {Component} from 'react'
import logo from './images/logo.png'
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {
  Layout,
  Form,
  Input,
  Button,
} from 'antd'

const {Header, Content} = Layout
const Item = Form.Item


/*登录的路由组件*/
export default class Login extends Component {
 
  //提交表单
  onFinish = (event) => {
    console.log('要提交表单了',event)
  }
  render() {
    return (
      <div className='login'>
        <Layout className='login-layout'>
          <Header className='login-header'>
            <img src={logo} alt="logo图片"/>
            <div className='login-title'>react项目:综合管理后台</div>
          </Header>
          <Content className='login-content'>
            <div className='form'>
              <p>用户登录</p>
              <Form
                name="normal_login"
                className="login-form"
                onFinish={this.onFinish}
                initialValues={{
                  username:'',
                  password:''
                 
                }}
              >
                <Item
                  validateFirst={true}
                  name="username"
                  rules={[
                    {required: true, message: '请输入用户名',},
                    {min: 4, message: '最小长度为4',},
                    {max:12, message: '最大长度为12',},
                    {pattern:/^[a-zA-z0-9]+$/, message: '用户为输入字母、数字或下划线',},
                  ]}
                >
                  <Input prefix={<UserOutlined className="site-form-item-icon" style={{color: 'rgba(0,0,0,.25)'}}/>}
                         placeholder="用户名"/>
                </Item>
                <Item
                  name="password"
                  rules={
                    [
                      () => ({
                        validator(rule, value) {
                          if(!value){
                            return Promise.reject('密码必须输入')
                          }else if(value.length<4){
                            return Promise.reject('密码不能小于4位');
                          }else if(value.length>12){
                            return Promise.reject('密码不能大于12位')
                          }else if(!(/^[a-zA-z0-9]+$/.test(value))){
                            return Promise.reject('密码为输入字母、数字或下划线')
                          }else{
                            return Promise.resolve();
                          }
                        },
                      }),
                    ]
                  }
                >
                  <Input
                    prefix={<LockOutlined className="site-form-item-icon" style={{color: 'rgba(0,0,0,.25)'}}/>}
                    type="password"
                    placeholder="密码"
                  />
                </Item>
                <Item>
                  <Button type="primary" htmlType="submit" className="login-form-button">
                    登录
                  </Button>
                </Item>
              </Form>
            </div>
          </Content>
        </Layout>
      </div>
    )
  }
}


/*
1.
 */


