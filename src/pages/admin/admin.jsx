import React,{Component} from 'react'
import {Redirect,Route,Switch} from 'react-router-dom'
import { Layout } from 'antd';

import memoryUtils from "../../utils/memoryUtils";
import './admin.less'
/*
后台管理的路由组件
 */


import LeftNav from '../../components/left-nav'
import MyHeader from '../../components/header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import User from '../user/user'
import Role from '../role/role'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'

const { Header, Footer, Sider, Content } = Layout;
export default class Admin extends Component{
  
  render(){
    const user = memoryUtils.user
    if(!user || !user._id){
      //自动跳转到登录(在render()中)
      return <Redirect to='/login'/>
    }
    return(
      <Layout className='container'>
        <Sider>
          <LeftNav />
        </Sider>
        <Layout className='content'>
          <Header>
            <MyHeader />
          </Header>
          <Content className='content-main'>
            <Switch>
              <Route path='/home' component={Home}></Route>
              <Route path='/category' component={Category}></Route>
              <Route path='/product' component={Product}></Route>
              <Route path='/user' component={User}></Route>
              <Route path='/role' component={Role}></Route>
              <Route path='/charts/bar' component={Bar}></Route>
              <Route path='/charts/line' component={Line}></Route>
              <Route path='/charts/pie' component={Pie}></Route>
              <Redirect to='/home' />
            </Switch>
          </Content>
          <Footer>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
        </Layout>
      </Layout>
    )
  }
}
