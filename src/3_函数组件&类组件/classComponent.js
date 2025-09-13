import React from '../react/react';
import ReactDOM from '../react/react-dom/client';

class ClassComponent extends React.Component {
  render() {
    return (<div className='title' style={{ color: 'red' }}>
      <span>{this.props.title}</span>
      {/* <span>hello</span> */}
    </div>)
  }

}

// 创建真实dom Root
const root = ReactDOM.createRoot(document.getElementById('root'));

const ele = <ClassComponent title='hello ClassComp' />

debugger
// 等价于
// const ele = React.createElement(ClassComponent, { title: 'hello' })
root.render(ele);

