import React,{Component} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
  Select
} from 'antd'
const Item = Form.Item
const Option = Select.Option
/*添加分类form*/
export default class AddForm extends Component{
  formRef = React.createRef();
  layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  };
  
  static propTypes = {
    categorys:PropTypes.array.isRequired,
    parentId:PropTypes.string.isRequired,
    setForm:PropTypes.func.isRequired,
  }
  
  //初始化分类
  initCategory=(parentId)=>{
    if(this.formRef && this.formRef.current){
      this.formRef.current.setFieldsValue({
        parentId:parentId
      });
    }
  }
  
  //改变分类事件
  handleChange=(value)=>{
   this.setState({
     parentId:value
   })
  }
  
  componentWillMount() {
    this.props.setForm(this.formRef)
  
  }
  
  componentDidMount() {
    this.initCategory(this.props.parentId)
  }
  
  render(){
    const categorys = this.props.categorys
    const layout = this.layout
    return(
      <Form {...layout} ref={this.formRef} name='addForm'>
        <Item label="" name='parentId' >
          <Select
            onChange={this.handleChange}
          >
            <Option value="0">一级分类</Option>
            {
              categorys.map(c=><Option value={c._id} key={c._id}>{c.name}</Option>)
            }
          </Select>
        </Item>
        
        <Item
          label=""
          name='categoryName'
          rules={[
            {
              required: true,
              message: '请输入分类名称',
            },
            {max:12, message: '最大长度为12',}
          ]}>
          <Input placeholder='请输入分类名称' name='categoryName'/>
        </Item>
      </Form>
    )
  }
}
