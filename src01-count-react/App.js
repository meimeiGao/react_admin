import React,{Component} from 'react'
export default class App extends Component{
	constructor(props){
		super(props)
		this.selectRef = React.createRef()
	}
	
	state={
		count:0
	}
	
	increment=()=>{
		const mun = this.selectRef.current.value*1
		this.setState((state)=>({count:state.count+mun}))
	}
	
	decrement = ()=>{
		const mun = this.selectRef.current.value*1
		this.setState((state)=>({count:state.count-mun}))
	}
	incrementIfOdd=()=>{
		const mun = this.selectRef.current.value*1
		
		if(this.state.count%2===1){
			this.setState((state)=>({count:state.count+mun}))
		}
	}
	incrementAsync=()=>{
		const mun = this.selectRef.current.value*1
		setTimeout(()=>{
			this.setState((state)=>({count:state.count+mun}))
		},1000)
	}
  render(){
		const {count} = this.state
    return(
      <div>
				<p>click {count} times</p>
				<select ref={this.selectRef}>
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
				</select>&nbsp;&nbsp;&nbsp;&nbsp;
				<button onClick={this.increment}> + increment</button>&nbsp;&nbsp;&nbsp;&nbsp;
				<button onClick={this.decrement}> - decrement</button>&nbsp;&nbsp;&nbsp;&nbsp;
				<button onClick={this.incrementIfOdd}> + incrementIfOdd</button>&nbsp;&nbsp;&nbsp;&nbsp;
				<button onClick={this.incrementAsync}> + incrementAsync</button>
			</div>
    )
  }
}
