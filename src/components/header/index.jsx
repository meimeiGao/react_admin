import React,{Component} from 'react'

import logo from '../assets/images/logo.png'
export default class Header extends Component{
  render(){
    return(
      <div className='left-nav'>
        <header className='left-nav-header'>
          <img src={logo} alt="logo"/>
          <h1>后台系统</h1>
        </header>
      </div>
    )
  }
}
