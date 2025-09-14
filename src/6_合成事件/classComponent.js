// import React from 'react';
// import ReactDOM from 'react-dom/client';

import React from '../react/react';
import ReactDOM from '../react/react-dom/client';

class ClassComponent extends React.Component {
  constructor(props) {
    super(props) // this.props = props
    this.state = { number: 0 }  // 构造函数中唯一一个可以设置默认值的地方
  }

  // 一直以来在react类组件中的this一直就是个问题
  handleClick = () => {
    // 批量更新, 在React18以前
    // 在函数里的更新都是异步，都是批量的
    // 在setTimeout里都是同步的，非批量的
    // 0 0 2 3 

    // React18以后
    // 不管在事件函数里，还是在setTimeout里都是批量的
    // 0 0 1 1 

    //在进入事件回调之前先把批量更新打开
    // 只要是事件函数,就一定是true   这个逻辑写在了合成事件里面
    this.setState({ number: this.state.number + 1 }, () => {
      console.log(this.state);  // 0   isBatchingUpdate 设置之后 0
    });
    console.log(this.state.number);  // 0   isBatchingUpdate 设置之后 0
    this.setState({ number: this.state.number + 1 });
    console.log(this.state.number);  // 0   isBatchingUpdate 设置之后 0

    setTimeout(() => {
      this.setState({ number: this.state.number + 1 });
      console.log(this.state.number);  // 1   isBatchingUpdate 设置之后 2
      this.setState({ number: this.state.number + 1 });
      console.log(this.state.number);  // 1   isBatchingUpdate 设置之后 3
    }, 1000)
  }

  clickButton = (event) => {
    console.log('clickButtonBubble');
    event.stopPropagation()
  }
  clickButtonCapture = () => {
    console.log('clickButtonCapture');
  }

  clickDiv = () => {
    console.log('clickDivBubble');
  }
  clickDivCapture = () => {
    console.log('clickDivCapture');
  }

  clickMypCapture = () => {
    console.log('clickMypCapture');
  }

  render() {
    return (<div id="counter" onClick={this.clickDiv} onClickCapture={this.clickDivCapture}>
      <div id='myp' onClickCapture={this.clickMypCapture}>
        <p>number:{this.state.number}</p>
        <button onClick={this.clickButton} onClickCapture={this.clickButtonCapture}>+</button>
      </div>
    </div>)
  }
}

setTimeout(() => {
  const dom = document.getElementById('myp')
  dom.addEventListener('click', () => {
    console.log('my p capture');
  }, true)
}, 1000)

// 创建真实dom Root
const root = ReactDOM.createRoot(document.getElementById('root'));
const ele = <ClassComponent title='hello ClassComp' />
root.render(ele);

