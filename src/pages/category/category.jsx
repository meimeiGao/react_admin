import React, {Component} from 'react'
import {Table, Button, Card,message} from 'antd'
import {PlusOutlined} from '@ant-design/icons';


import LinkButton from '../../components/link-button'
import {reqCategorys} from '../../api'


export default class Category extends Component {
  state = {
    categorys: [],//一级菜单分类数据
    loading: false,//是否是加载
    parentId:'0',//默认显示一级菜单
    parentName:'',//一级菜单名称
    subCategorys:[],//二级菜单分类数据
  }
  
  //显示二级菜单
  showSubCategory = (category)=>{
    this.setState({
    
    })
  }
  
  //获取categorys
  getCategorys = async () => {
    //请求前状态
    this.setState({loading:true})
    const {parentId} = this.state
    const reslut = await reqCategorys(parentId)
    //请求完成后状态
    this.setState({loading:false})
    
    if(reslut.status===0){
      const categorys = reslut.data
      if(parentId==='0'){//一级菜单
        this.setState({categorys})
      }else {//二级菜单
        this.setState({subCategorys:categorys})
      }
    
    }else {
      message.error('获取分类列表失败')
    }
  }
  
  //获取columns
  getCategoryColumns = () => {
    this.categoryColumns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        align: 'center',
        width: '300px',
        render: (category) => (
          <span>
            <LinkButton>修改分类</LinkButton>
            <LinkButton onClick={()=>this.showSubCategory(category)}>查看子分类</LinkButton>
          </span>
        ),
      },
    ];
  }
  
  //为第一次render()准备数据
  componentWillMount() {
    this.getCategoryColumns()
  }
  
  //执行异步ajax/启动定时器
  componentDidMount() {
    this.getCategorys('0')
  }
  
  render() {
    const title = '一级分类'
    const extra = (
      <Button type='primary'>
        <PlusOutlined/>
        添加
      </Button>
    )
    
    const {categorys,loading} = this.state
    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          columns={this.categoryColumns}
          dataSource={categorys}
          pagination={{defaultPageSize:5,showQuickJumper:true}}
        />
      </Card>
    )
  }
}
