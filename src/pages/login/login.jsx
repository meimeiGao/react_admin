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
class Login extends Component {
 
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
                  username:'111',
                  password:'563'
                 
                }}
              >
                <Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your Username!',
                    },
                  ]}
                >
                  <Input prefix={<UserOutlined className="site-form-item-icon" style={{color: 'rgba(0,0,0,.25)'}}/>}
                         placeholder="用户名"/>
                </Item>
                <Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your Password!',
                    },
                  ]}
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
export default Login

/*
1.
 */


