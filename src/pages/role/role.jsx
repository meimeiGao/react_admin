import React,{Component} from 'react'
import {
  Card,
  Button,
  Table,
  message,
  Modal
} from 'antd'
import './css/role.less'
import {reqRoles,reqAddRole,reqUpdateRole} from '../../api'
import AddForm from './add-form'
import {formatPromise} from '../../utils/promiseUtils'
import AuthForm from './auth-form'
import memoryUtils from '../../utils/memoryUtils'
import {formatDate} from '../../utils/dateUtils'
import {
  ADD_SUCCESS_MESSAGE,
  REQ_ERROR_MESSAGE,
  PAGE_SIZE,
  ADD_ERROR_MESSAGE
} from "../../utils/constants";

export default class Role extends Component{
  
  
  constructor(prpos){
    super(prpos)
    this.auth = React.createRef()
  }
  
  state={
    roles:[], //角色数组
    role:{},//单个role对象
    loading:false,//加载
    isShowAdd:false,// 是否显示添加角色弹框
    isShowAuth:false,//是否显示设置权限弹框
  }
  
  //修改角色
  updateRole = async ()=>{
    let {role} = this.state
    const menus = this.auth.current.getMenus()
    role.menus = menus
    role.auth_time = Date.now()
    role.auth_name = memoryUtils.user.username
    const result = await reqUpdateRole(role)
    if(result.status ===0){
      this.setState({isShowAuth:false})
      message.success(ADD_SUCCESS_MESSAGE)
      this.getRoles()
    }else{
      message.error(ADD_ERROR_MESSAGE)
    }
  }
  
  //添加角色
  addRole = async ()=>{
    const result = formatPromise(this.form.current.validateFields())
    if(!result.errorFields){
      const roleName = this.form.current.getFieldValue('roleName')
      const result = await reqAddRole(roleName)
      if(result.status === 0){
        const role = result.data
        message.success(ADD_SUCCESS_MESSAGE)
        this.setState({isShowAdd:false})
        this.form.current.resetFields()
        this.getRoles()
        /*
          setState里边传一个函数的写法,多用于,要更新的状态是在原数据的基础之上的,
          而只传一对象是更新的数据跟以前的没有什么关系
          react 不建议直接读state的值然后直接修改 如this.state.roles = roles2
          
          更新列表的另一种方式
          const roles = this.state
          this.setState((state,props)=>({
            roles:[...role,roles]
          }))
        */
      }else{
        message.error(ADD_ERROR_MESSAGE)
      }
    }else{
      message.error(REQ_ERROR_MESSAGE)
    }
  }
  
  //获取角色列表
  getRoles = async ()=>{
    this.setState({loading:true})
    const result = await reqRoles()
    this.setState({loading:false})
    if(result.status ===0){
      const roles = result.data
      this.setState({roles})
    }
  }
  
  //点击某一行的回调
  clickRow=(role, index)=>{
    return {
      onClick: event => { // 点击行
        console.log('record, index',role, index)
        this.setState({role})
      },
    };
  }
  
  //初始化列
  initColumns=()=>{
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render:formatDate
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render:formatDate
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
      },
    ]
  }
  
  componentWillMount() {
    this.initColumns()
  }
  
  componentDidMount() {
    this.getRoles()
  }
  
  render(){
    
    const {roles,role,loading,isShowAdd,isShowAuth} = this.state
    
    const title = (
      <span>
        <Button type='primary' className='add_role' onClick={()=>this.setState({isShowAdd:true})}>
          创建角色
        </Button>
        <Button type='primary' disabled={!role._id} onClick={()=>this.setState({isShowAuth:true})}>设置角色权限</Button>
      </span>
    )
    
    return(
      <Card className='role_card' title={title}>
        <Table
          loading={loading}
          columns={this.columns}
          dataSource={roles}
          rowSelection={{type:'radio',selectedRowKeys:[role._id]}}
          rowKey='_id'
          onRow={this.clickRow}
          pagination={{showQuickJumper:true,defaultPageSize:PAGE_SIZE}}
        />
        
        {/*添加角色*/}
        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={()=>{this.addRole()}}
          onCancel={()=>this.setState({isShowAdd:false})}
        >
          <AddForm setForm={(form)=>this.form = form}/>
        </Modal>
        
        {/*修改权限*/}
        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={()=>this.setState({isShowAuth:false})}
        >
          <AuthForm role={role} ref={this.auth}/>
        </Modal>
        
      </Card>
    )
  }
}
