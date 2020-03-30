import React, {Component} from 'react'
import {
  Card,
  List,
} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'

import './css/detail.less'
import LinkButton from '../../components/link-button'
import {BASE_IMG_URL} from '../../utils/constants'
import {reqCategory} from "../../api";

const Item = List.Item


export default class ProductDetail extends Component {
  state = {
    ParentName: '',
    subName: ''
  }
  
  //根据分类id获取分类名称
  getCategoryName = async () => {
    
    const {categoryId, pCategoryId} = this.props.location.state.product
    //一级分类
    if (categoryId === '0') {
      const result = await reqCategory('0')
      if(result.status===0){
        this.setState({
          ParentName:result.data.name
        })
      }
    
      //二级分类
    } else {
      
      /*
        await 是必须完成后,await 后面的代码才能执行,如果有10个请求,那必须一个个等,效率低
        const result1 = await reqCategory(categoryId)
        const result2 = await reqCategory(pCategoryId)
        const ParentName = result1.data.name
        const subName = result2.data.name
       */
      
      /*
        results 返加的是一个包含多个结果的数组,数组的顺序与promise.all()里边的数组定义的顺序一样
       */
      const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
      if(results.status===0){
        const ParentName = results[0].data.name
        const subName = results[1].data.name
        this.setState({
          ParentName,
          subName
        })
      }
    }
  }
  
  componentDidMount() {
    this.getCategoryName()
  }
  
  render() {
    const {product} = this.props.location.state
    const {ParentName, subName} = this.state
    const title = (
      <span>
        <LinkButton>
           <ArrowLeftOutlined className='arrow_left' onClick={() => this.props.history.goBack()}/>
        </LinkButton>
        <span className='title'>商品详情</span>
      </span>
    )
    return (
      <Card title={title} className='detail_card'>
        <List>
          
          <Item className='list_item'>
            <span className='item_title'>商品名称：</span>
            <span>{product.name}</span>
          </Item>
          
          <Item className='list_item'>
            <span className='item_title'>商品描述：</span>
            <span>{product.desc}</span>
          </Item>
          
          <Item className='list_item'>
            <span className='item_title'>商品价格：</span>
            <span>{product.price}元</span>
          </Item>
          
          <Item className='list_item'>
            <span className='item_title'>所属分类：</span>
            <span>{ParentName}{subName ? '-->' + subName : null}</span>
          </Item>
          
          <Item className='list_item'>
            <span className='item_title'>商品图片：</span>
            <span>
              {
                product.imgs &&product.imgs.length && product.imgs.map(img => (
                  <img src={BASE_IMG_URL + img} key={img} alt="" className='detail_img'/>
                ))
              }
            </span>
          </Item>
          
          <Item className='list_item'>
            <span className='item_title'>商品详情：</span>
            <span dangerouslySetInnerHTML={{__html: product.detail}}/>
          </Item>
        
        </List>
      </Card>
    )
  }
}
