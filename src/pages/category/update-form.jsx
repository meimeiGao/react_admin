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
    getForm:PropTypes.func.isRequired,
  }
  
  initUpdateCategory=(categoryName)=>{
    if(this.formRef && this.formRef.current){
      this.formRef.current.setFieldsValue({
        categoryName:categoryName
      });
    }
  }
  componentWillMount() {
    this.props.getForm(this.formRef)
  }
  
  componentDidMount() {
    this.initUpdateCategory(this.props.categoryName)
  }
  
  componentWillUnmount() {

  }
  
  render(){
    return(
      <Form name='updateForm' ref={this.formRef}>
        <Item
          label="分类名称"
          name='categoryName'
          rules={[
            {
              required: true,
              message: '请输入分类名称',
            },
            {max:12, message: '最大长度为12',}
          ]}>
          <Input placeholder='请输入分类名称'/>
        </Item>
      </Form>
    )
  }
}
