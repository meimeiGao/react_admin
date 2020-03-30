import React,{Component} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
  Select
} from 'antd'

const {Item} = Form
const {Option} = Select

export default class UserForm extends Component{
  constructor(props){
    super(props)
    this.form  = React.createRef()
  }

  static propTypes = {
    setForm:PropTypes.func.isRequired,
    roles:PropTypes.array.isRequired,
    user:PropTypes.object
  }
  
  //自定义验证用户名
  validtaUserName = (rule, value)=>{
    if(!value){
      return Promise.reject('请输入用户名')
    }else{
      return Promise.resolve()
    }
  }

  //自定义验证密码
  validtaPassword =(rule, value)=>{
    if(!value){
      return Promise.reject('请输入密码')
    }else{
      return Promise.resolve()
    }
  }
  shouldComponentUpdate(nextProps, nextState){
    this.form.current.setFieldsValue(nextProps.user)
    return true
  }
  componentWillMount() {
    this.props.setForm(this.form)
  }

  componentDidMount() {
    this.form.current.setFieldsValue(this.props.user)
  }

  render(){
    const {roles} = this.props
    const {user} = this.props
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    }
    return(
      <Form
        {...layout}
        ref={this.form}
      >
        <Item
          label='用户名'
          name='username'
          rules={[{ required: true,validator:this.validtaUserName }]}
        >
          <Input placeholder='请输入用户名'/>
        </Item>
        {
          user._id?null:(
            <Item
              label='密码'
              name='password'
              rules={[{ required: true,validator:this.validtaPassword }]}
            >
              <Input.Password placeholder='请输入密码'/>
            </Item>
          )
        }
        <Item label='手机号' name='phone'>
          <Input placeholder='请输入手机号'/>
        </Item>
        <Item label='邮箱' name='email'>
          <Input placeholder='请输入邮箱'/>
        </Item>
        <Item label='角色' name='role_id'>
          <Select placeholder="请选择角色">
            {
              roles.map(role=> <Option key={role._id} value={role._id}>{role.name}</Option>)
            }
          </Select>
        </Item>
      </Form>
    )
  }
}
