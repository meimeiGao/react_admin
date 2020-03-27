import React,{Component} from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'
import loadable from '../../utils/loadable'

const Home = loadable(()=>import('./home'))
const ProductDetail = loadable(()=>import('./detail.jsx'))
const ProductAddUpdate = loadable(()=>import('./add-update.jsx'))

export default class Product extends Component{
  render(){
    return(
      <Switch>
        <Route path='/product' component={Home} exact />{/*路由完全匹配*/}
        <Route path='/product/detail' component={ProductDetail} />
        <Route path='/product/addUpdate' component={ProductAddUpdate} />
        <Redirect to='/product'/>
      </Switch>
    )
  }
}
