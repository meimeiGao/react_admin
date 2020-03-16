import React,{Component} from 'react'
import {
  Form,
  Input,
  Select
} from 'antd'
const Item = Form.Item
const Option = Select.Option
/*添加分类form*/
export default class AddForm extends Component{
  render(){
    return(
      <Form initialValues={{}}>
        <Item label="Note">
          <Select
            placeholder=""
            // onChange={onChangeCategory}
          >
            <Option value="0">一级分类</Option>
            <Option value="1">家用电脑</Option>
            <Option value="2">医疗</Option>
          </Select>
        </Item>
        
        <Item label="Note">
          <Input/>
        </Item>
      </Form>
    )
  }
}
