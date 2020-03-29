import React, {Component} from 'react'
import {
  Card,
  Table,
  Button,
  message,
  Modal
} from 'antd'
import LinkButton from '../../components/link-button'
import {reqUsers, reqDeleteUser, reqAddOrUpdateUser} from '../../api'
import UserForm from './user-form'
import {
  del_SUCCESS_MESSAGE,
  PAGE_SIZE
} from '../../utils/constants'


const {confirm} = Modal;


export default class User extends Component {
  state = {
    users: [],//所有用户
    roles: [],//所以角色
    loading: false,//是否加载
    isShow: false,//显示添加/修改用户框
  }

  //显示添加用户界面
  showAdd = () => {
    this.user = {}
    this.setState({isShow: true})
  }

  //显示修改用户界面
  showUpdata = (user) => {
    this.user = user
    this.setState({
      isShow: true
    })
  }

  //关闭添加/修改用户框
  handleCancel = () => {
    this.setState({isShow: false})
    this.form.current.resetFields()
  }

  //添加/修改用户
  addOrUpdate = async () => {
    //搜集对象
    const user = this.form.current.getFieldsValue()
    //发请求
    if(this.user && this.user._id){
      user._id = this.user._id
    }
    const reslut = await reqAddOrUpdateUser(user)
    if (reslut.status === 0) {
      this.setState({isShow: false})
      this.form.current.resetFields()
      //更新列表
      this.getUsers()
    }
  }

  //删除用户
  deleterUser = (user) => {
    confirm({
      title: `确定要删除用户${user.username}吗?`,
      onOk: async () => {
        const result = await reqDeleteUser(user)
        if (result.status === 0) {
          message.success(del_SUCCESS_MESSAGE)
          this.getUsers()
        }
      },
    });
  }

  //初始化角色名称
  initRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre
    }, {})
    return this.roleNames = roleNames
  }

  //获取所有列
  getUsers = async () => {
    this.setState({loading: true})
    const result = await reqUsers()
    this.setState({loading: false})
    if (result.status === 0) {
      const {users, roles} = result.data
      this.initRoleNames(roles)
      this.setState({
        users,
        roles
      })
    }
  }

  //初妈化列
  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render: (role_id) => this.roleNames[role_id]
      },
      {
        title: '操作',
        render: (user) => (
          <span>
            <LinkButton onClick={() => this.showUpdata(user)}>修改</LinkButton>
            <LinkButton onClick={() => this.deleterUser(user)}>删除</LinkButton>
          </span>
        )
      }

    ]
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getUsers()
  }

  render() {
    const {users, roles, loading, isShow} = this.state
    const user = this.user || {}
    const title = (
      <Button type='primary' onClick={() => this.showAdd()}>创建用户</Button>
    )
    return (
      <Card title={title}>
        <Table
          rowKey='_id'
          loading={loading}
          columns={this.columns}
          dataSource={users}
          pagination={{defaultPageSize: PAGE_SIZE, showQuickJumper: true}}
        >
        </Table>

        {/*添加/修改用户*/}
        <Modal
          title={user._id?'修改用户':'添加用户'}
          visible={isShow}
          onOk={this.addOrUpdate}
          onCancel={this.handleCancel}
        >
          <UserForm
            setForm={form => this.form = form}
            roles={roles}
            user={user}
          />
        </Modal>

      </Card>
    )
  }
}
