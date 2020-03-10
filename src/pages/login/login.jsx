
import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {UserOutlined, LockOutlined} from '@ant-design/icons';


import './login.less'
import logo from '../../assets/images/logo.png'

import {reqLogin} from '../../api'  //默认暴露不用写{},分别暴露就要写{}
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

import {
  Layout,
  Form,
  Input,
  Button,
  message
} from 'antd'
const {Header, Content} = Layout
const Item = Form.Item //不能写在import之前




/*登录的路由组件*/
export default class Login extends Component {
  
  //提交表单验证成功
   onFinish = async(values) => {
    const {username,password} = values
    //光标处在参数位置,在闪的时候,按住ctrl鼠标放在方法上面就可以看到需要传什么参数
    const result = await reqLogin(username,password)
     if(result.status==0){//登录成功
       
       //提示成功信息
       message.success('登录成功')
       //跳转到管理界面(不需要再回退到登录,所以用replace,不用push) //有replace,push,goBack
       
       console.log('result',result)
       const user = result.data
       memoryUtils.user = user
       storageUtils.saveUser(user) //保存在内存中
       this.props.history.replace('/') //保存在local中
       console.log()
       console.log(' memoryUtils.user',memoryUtils.user);
     }else{//登录失败
       //提示失败信息
       console.log('result',result)
       message.error(result.msg)
     }
    
    
    
  }
  //提交表单验证失败
  onFinishFailed = ({ values, errorFields, outOfDate })=>{
    console.log('失败');
    console.log(values);
    console.log(errorFields);
    console.log(outOfDate);
  }
  
  render() {
     //如果用户已经登录,自动跳转到管理界面
    const user = memoryUtils.user
    if(user && user._id){
      return <Redirect to='/'/>
    }
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
                onFinishFailed={this.onFinishFailed}
                initialValues={{
                  username:'admin',
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


