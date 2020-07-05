import React, {Component} from 'react'
import {Table, Button, Card, message, Modal} from 'antd'
import {PlusOutlined, ArrowRightOutlined} from '@ant-design/icons';

import LinkButton from '../../components/link-button'
import {reqCategorys,reqAddCategory,reqUpdateCategory} from '../../api'
import {formatPromise} from '../../utils/promiseUtils'
import './category.less'
import AddForm from './add-form'
import UpdateForm from './update-form'


export default class Category extends Component {
  state = {
    categorys: [],//一级菜单分类数据
    loading: false,//是否是加载
    parentId: '0',//显示一级菜单父分类id
    parentName: '',//一级菜单名称
    subCategorys: [],//二级菜单分类数据
    showState: 0,//显示分类的状态,1是添加,2是修改
  }
  
  showCategorys = () => {
    this.setState({
      parentId: '0',//显示一级菜单父分类id
      parentName: '',//一级菜单名称
      subCategorys: [],//二级菜单分类数据
    },()=>{
      this.initAddCategory(this.state.parentId)
    })
  }
  
  //添加分类
  addCategory = async () => {
    const validtateResult = await formatPromise(this.addForm.current.validateFields())
    if(!validtateResult.errorFields){
      //关闭添加弹框
      this.setState({
        showState: 0
      })
      
      const {parentId, categoryName} = validtateResult
      
      //搜集数据,并发请求
      const result = await reqAddCategory(parentId, categoryName)
      if(result.status===0){
        if(parentId===this.state.parentId){//添加的分类与当前的分类是一样
          //重新获取列表
          this.getCategorys()
          this.initAddCategory(this.state.parentId)
        }else if(parentId==='0'){
          this.getCategorys('0')
        }
    
      }
    }
   
  }
  
  //显示添加分类
  showAdd = () => {
    //修改状态
    this.setState({
      showState: 1
    })
  }
  
  //修改分类
  updateCategory = async () => {
    const validtateResult = await formatPromise(this.form.current.validateFields())
    if(!validtateResult.errorFields){
      //准备数据
      const categoryId = this.category._id
      // const categoryName = this.form.current.getFieldValue('categoryName')
      const categoryName = validtateResult.categoryName
      //2.发请求
      const result = await reqUpdateCategory({categoryId, categoryName})
      if(result.status===0){
        //1.修改状态
        this.setState({
          showState: 0
        })
        //3.重新请求列表
        this.getCategorys()
      }
    }
  }
  
  //重置修改表单
  initUpdateCategory=(categoryName)=>{
    if(this.form && this.form.current){
      this.form.current.setFieldsValue({
        categoryName
      });
    }
  }

  //初始化添加表单
  initAddCategory=(parentId)=>{
    if(this.addForm && this.addForm.current){
      this.addForm.current.setFieldsValue({
        parentId:parentId,
        categoryName:''
      });
    }
  }
  
  
  //点击取消的回调
  handleCancel = () => {//1是添加 ,2 是修改
   if(this.state.showState===2){
     this.form.current.resetFields(['categoryName'])
   }else if(this.state.showState===1){
     this.initAddCategory(this.state.parentId)
    }
   
    //关闭弹框
    this.setState({
      showState: 0
    })

  }
  
  //显示修改分类
  showUpdate = (category) => {
    //保存category对象
    this.category = category
    //更新form对象
    this.initUpdateCategory(category.name)
    //更新状态
    this.setState({
      showState: 2
    })
  }
  
  //显示指定一级分类对象的二级分类列表
  showSubCategorys = (category) => {
    //setState()不能立即获取最新的状态:因为setState()是异步更新状态的
    this.setState({
      parentId: category._id,
      parentName: category.name
    }, () => {//更新状态是异步;回调函数在状态更新且重新render()后执行
      //获取二级分类列表
      this.getCategorys()
      this.initAddCategory(this.state.parentId)
    })
  }
  
  //获取一级/二级categorys
  getCategorys = async (parentId) => {
    //请求前状态
    this.setState({loading: true})
    parentId = parentId || this.state.parentId
    const reslut = await reqCategorys(parentId)
    //请求完成后状态
    this.setState({loading: false})

    if (reslut.status === 0) {
      const categorys = reslut.data
      if (parentId === '0') {//一级菜单
        this.setState({categorys})
      } else {//二级菜单
        this.setState({subCategorys: categorys})
      }
    } else {
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
            <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
            {/*showSubCategorys这个方法是在初始的时候调,我想让它在onClick时候才调,
              如何向事件回调函数传递参数:先定义一个匿名函数,在函数调用处理的函数并传入数据
            */}
            {this.state.parentId === '0' ?
              <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : null}
            
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
    //获取一级分类列表显示
    this.getCategorys('0')
 
  }
  
  render() {
    //读取状态数据
    const {categorys, loading, subCategorys, parentId, parentName, showState} = this.state
    //读category对象
    let category = this.category || {}
    const title = parentId === '0' ? '一级分类' : (
      <span>
        <LinkButton onClick={this.showCategorys}>一级分类</LinkButton>
        <ArrowRightOutlined/>
        <span className='subText'>{parentName}</span>
      </span>
    )
    const extra = (
      <Button type='primary' onClick={this.showAdd}>
        <PlusOutlined/>
        添加
      </Button>
    )
    
    
    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          columns={this.categoryColumns}
          dataSource={parentId === '0' ? categorys : subCategorys}
          pagination={{defaultPageSize: 5, showQuickJumper: true}}
        />
        
        {/*添加分类*/}
        <Modal
          title="添加分类"
          maskClosable={false}
          visible={showState === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm
            categorys={categorys}
            parentId={parentId}
            setForm={form=>{this.addForm = form}}
          >
          </AddForm>
        </Modal>
        
        
        {/*修改分类*/}
        <Modal
          title="修改分类"
          maskClosable={false}
          visible={showState === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UpdateForm
            categoryName={category.name || ''}
            getForm={form=>{this.form = form}}
          >
          </UpdateForm>
        </Modal>
      
      </Card>
    )
  }
}
