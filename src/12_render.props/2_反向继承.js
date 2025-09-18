// import React from 'react';
// import ReactDOM from 'react-dom/client';

import React from '../react/react';
import ReactDOM from '../react/react-dom/client';


const DOMRoot = ReactDOM.createRoot(
  document.getElementById('root')
);
class Button extends React.Component{
  constructor(props){
    super(props);
    this.state = {name:'button'};
  }
  componentDidMount(){
    console.log(`Button componentDidMount`);
  }
  render(){
    return <button name={this.state.name}>{this.props.title}</button>
  }
}
function wrapper(OldComponent){
   return class NewComponent extends OldComponent{
    constructor(props){
      super(props);
      this.state = {number:0}
    }
    componentDidMount(){
      console.log(`NewComponent componentDidMount`);
      super.componentDidMount();
    }
    handleClick = ()=>{
      this.setState({number:this.state.number+1});
    }
    render(){
      let vdom = super.render();
      let newProps = {
        ...vdom.props,
        ...this.state,
        onClick:this.handleClick
      }
      return React.cloneElement(
        vdom,
        newProps,
        this.state.number // 子元素
      );
    }
   }
}
const NewButton = wrapper(Button);
let element = <NewButton title="按钮"/>
DOMRoot.render(element);
