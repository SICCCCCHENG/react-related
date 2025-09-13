// import React from 'react';
// import ReactDOM from 'react-dom/client';

import React from '../react/react';
import ReactDOM from '../react/react-dom/client';

class ClassComponent extends React.Component {
  constructor(props) {
    super(props) // this.props = props
    this.state = { number: 0, age: 16 }  // 构造函数中唯一一个可以设置默认值的地方
  }

  handleClick = () => {
    //除构造函数外不能直接修改this.state,需要通过setState来修改状态
    //因为setState有一个副作用，就是修改完状态后会让组件重新刷新
    // this.setState({ number: this.state.number + 1 }, () => {
    //   console.log('newState', this.state);
    // });

    this.setState((state) => ({ number: state.number + 1 }), () => {
      console.log('newState', this.state);
    });


    // debugger
    // this.setState({
    //   number: this.state.number + 1
    // });

    // this.setState({
    //   number: this.state.number + 1
    // });
    // this.setState({
    //   age: this.state.age + 1
    // });
    // console.log('newState', this.state);
  }

  render() {
    return (<div id="counter">
      <p>title:{this.props.title}</p>
      <p>number:{this.state.number}</p>
      <p>age:{this.state.age}</p>
      <button onClick={this.handleClick}>+</button>
    </div>)
  }

}

// 创建真实dom Root
const root = ReactDOM.createRoot(document.getElementById('root'));

const ele = <ClassComponent title='hello ClassComp' />
root.render(ele);

