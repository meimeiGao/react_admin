import React,{Component} from 'react'
import PropTypes from 'prop-types'
import {
	Form,
	Input
} from 'antd'

const {Item} = Form
export default class AddForm extends Component{
	
	form = React.createRef();
	
	static propTypes = {
		setForm:PropTypes.func.isRequired
	}
	
	componentWillMount() {
		this.props.setForm(this.form)
	}
	
	render(){
  	const formItemLayout = {
  		labelCol:{span:4},
			wrapperCol:{span:15}
		}
    return(
      <Form {...formItemLayout} ref={this.form}>
				<Item
					label='角色名称'
					name='roleName'
					rules={[{ required: true,message:'请输入角色名称' }]}
				>
					<Input placeholder='请输入角色名称'/>
				</Item>
			</Form>
    )
  }
}
