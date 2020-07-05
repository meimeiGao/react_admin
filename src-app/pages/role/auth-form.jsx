import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'


import {
	Input,
	Form,
	Tree
} from 'antd'

const {Item} = Form
const {TreeNode} = Tree;

export default class AuthForm extends PureComponent {

	static propType = {
		role: PropTypes.object.isRequired
	}
	/*
	React 组件挂载之前，会调用它的构造函数constructor 在 constructor() 函数中不要调用 setState() 方法。
	如果你的组件需要使用内部 state，请直接在构造函数中为 this.state 赋值初始 state：
	 */
	constructor(props){
		super(props)
		const {menus} = this.props.role
		this.state = {
			checkedKeys:menus
		}
	}
	
	onCheck = (checkedKeys, info) => {
		this.setState({checkedKeys})
	};
	//给父组件获取menus
	getMenus = ()=> this.state.checkedKeys
	
	componentWillReceiveProps(nextProps, nextContext) {
		const {menus} = nextProps.role
		this.setState({
			checkedKeys:menus
		})
	}
	
	render() {
		const {role} = this.props
		
		const {checkedKeys} = this.state
		const FormItemLayout = {
			labelCol: {span: 4},
			wrapperCol: {span: 15}
		}
		
		return (
			<div>
				<Item label='角色名称' {...FormItemLayout}>
					<Input value={role.name} readOnly/>
				</Item>
				<Tree
					checkable
					defaultExpandAll
					onCheck={this.onCheck}
					checkedKeys={checkedKeys}
					treeData={menuList}
				>
				</Tree>
			</div>
		)
	}
}
