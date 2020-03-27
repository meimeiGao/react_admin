import React, {Component} from 'react'
import {
  Select,
  Input,
  Card,
  Button,
  Table,
  message
} from 'antd'
import {PlusOutlined} from '@ant-design/icons';
import './css/home.less'
import LinkButton from '../../components/link-button'
import {reqProducts, reqSearchProducts, reqUpdateStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/constants'


const {Option} = Select;

export default class ProductHome extends Component {
  
  state = {
    products: [],//所有商品数据列表,
    loading: false,//是否加载
    total: 0,//列表的总条数,
    productType: 'productName',
    searchName: ''
  }
  
  //跳转添加/修改商品
  entryProductAddUpdate = (product) => {
    this.props.history.push('/product/addUpdate',{product})
  }
  
  //对商品进行上架/下架处理
  updateStatus = async (productId, status) => {
    const result = await reqUpdateStatus(productId, status)
    if (result.status === 0) {
      message.success('商品状态更新成功')
      this.getProducts(this.pageNum)
    }
  }
  
  //跳转详情s
  entryProductDetail = (product) => {
    product = !product?{}:product
    this.props.history.push(
      '/product/detail',
      {product}
    )
  }
  
  //获取商品columns
  getProuductsColumns = () => {
    this.productColumns = [
      {
        title: '商品名称',
        dataIndex: 'name',
        key: '_id',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
        key: '_id',
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: '_id',
        render: (price) => { //参数就是当前的字段值
          return (
            <span>￥{price}</span>
          )
        }
      },
      {
        title: '状态',
        key: '_id',
        render: (product) => {
          const {_id, status} = product
          const newStatus = status === 1 ? 2 : 1
          return (
            <div>
              <Button
                type='primary'
                className='status-button'
                onClick={() => this.updateStatus(_id, newStatus)}
              >
                {status === 1 ? '下架' : '上架'}
              </Button>
              <span>{status === 1 ? '在售' : '已下架'}</span>
            </div>
          )
        }
      },
      {
        title: '操作',
        key: 'action',
        render: (product) => (
          <span>
            <LinkButton onClick={() => this.entryProductDetail(product)}>详情</LinkButton>
            <LinkButton onClick={()=>this.entryProductAddUpdate(product)}>修改</LinkButton>
          </span>
        ),
      },
    ];
  }
  
  //获取商品所有数据
  getProducts = async (pageNum) => {
    this.pageNum = pageNum
    this.setState({loading: true})
    const {productType, searchName} = this.state
    let result
    if (searchName) {
      result = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, productType, searchName})
    } else {
      result = await reqProducts(pageNum, PAGE_SIZE)
    }
    this.setState({loading: false})
    if (result.status === 0) {
      const {total, list} = result.data
      this.setState({//此处的setState是同步的,因为是在Promise里边
        total,
        products: list
      })
    }
  }
  
  // 为render()前做准备
  componentWillMount() {
    this.getProuductsColumns()
  }
  
  //页面渲染完
  componentDidMount() {
    this.getProducts(1)
  }
  
  render() {
    const {products, total, loading, productType, searchName} = this.state
    const title = (
      <span>
        <Select value={productType} className='title-select' onChange={(value) => this.setState({productType: value})}>
          <Option value="productName">按名称搜索</Option>
          <Option value="productDesc">按描术搜索</Option>
        </Select>
        <Input placeholder='关键字' className='title-key' value={searchName}
               onChange={e => this.setState({searchName: e.target.value})}/>
        <Button type='primary' onClick={() => {
          this.getProducts(1)
        }}>搜索</Button>
      </span>
    )
    
    const extra = (

     
      <Button type='primary' onClick={() => this.entryProductAddUpdate('')}>
        <PlusOutlined/>
        添加商品
      </Button>
    )
    
    return (
      <Card className='home' title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          dataSource={products}
          columns={this.productColumns}
          pagination={{
            defaultPageSize: PAGE_SIZE,
            pageSizeOptions: ['1', '2', '3', '5', '10'],
            showQuickJumper: true,
            total,
            onChange: this.getProducts,
            onShowSizeChange: this.getProducts
          }}
        />
      </Card>
    )
  }
}
