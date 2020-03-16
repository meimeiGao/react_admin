import React,{Component} from 'react'
import PropTypes from 'prop-types';

import {
  Form,
  Input,
} from 'antd'
const Item = Form.Item


/*修改分类form*/
export default class UpdateForm extends Component{
  formRef = React.createRef();
  
  static propTypes = {
    categoryName:PropTypes.string.isRequired,
    setForm:PropTypes.func.isRequired
  }
  
  componentWillMount() {
    this.props.setForm(this.formRef)
  }
  
  componentDidMount() {
  
  }
  
  render(){
   
    let categoryName = this.props.categoryName
    return(
      <Form initialValues={{categoryName}} ref={this.formRef}>
        <Item label="分类名称" name='categoryName'>
          <Input placeholder='请输入分类名称'/>
        </Item>
      </Form>
    )
  }
}
