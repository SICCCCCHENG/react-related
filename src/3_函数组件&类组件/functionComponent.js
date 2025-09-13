import React from '../react/react';
import ReactDOM from '../react/react-dom/client';

/**
 * 1.函数组件接收一个属性对象并返回一个React元素
 * 2.函数必须以大写字母开头，因为在内部是通过大小写判断是自定义组件还是默认组件div span
 * 3.函数组件在使用前必须先定义
 * 4.函数组件能且只能返回一个根元素
 * @returns 
 */
function FunctionComponent(props) {
  return (<div className='title' style={{ color: 'red' }}>
    <span>{props.title}</span>
    {/* <span>hello</span> */}
  </div>)
}

// 创建真实dom Root
const root = ReactDOM.createRoot(document.getElementById('root'));

const ele = <FunctionComponent title='hello function Component'/>

debugger
// 等价于
// const ele = React.createElement(FunctionComponent, { title: 'hello' })
root.render(ele);

