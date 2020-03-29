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

  shouldComponentUpdate(nextProps, nextState){
    debugger
    if(nextProps.user._id){
      this.form.current.setFieldsValue(nextProps.user)
    }

    return true
  }
  componentWillMount() {
    this.props.setForm(this.form)
  }

  componentDidMount() {
    debugger
    this.form.current.setFieldsValue(this.props.user)
  }

  render(){
    const {roles} = this.props
    const aa = this.props
    debugger
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    }
    return(
      <Form {...layout} ref={this.form} >
        <Item label='用户名' name='username'>
          <Input placeholder='请输入用户名'/>
        </Item>
        <Item label='密码' name='password'>
          <Input.Password placeholder='请输入密码'/>
        </Item>
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
