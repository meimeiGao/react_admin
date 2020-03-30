/*
* 应用根组件
* */

import React, {Component} from 'react'
import {BrowserRouter,Route,Switch} from 'react-router-dom'

import Login from './pages/login/login'
import Admin from './pages/admin/admin'

/*
* BrowseRouter 没有#号
* HashRouter 有#号
* BrowseRouter是路由器,里边的每一个Route 是路由
*
* */
export default class App extends Component{
  
  /*
  * 一旦要写嵌套的标签,就return ()
  *
  * */
  render() {
    return (
      <BrowserRouter>
        <Switch>{/*只匹配其中的一个*/}
          <Route path='/login' component={Login}></Route>
          <Route path='/' component={Admin}></Route>
        </Switch>
      </BrowserRouter>
      
    )
  }
}




