import React from '../react/react';
// import ReactDOM from 'react-dom/client';

debugger
let element = (
    <div className='title' style={{ color: 'red' }}>
        <span>hello</span>
        {/* <span>hello</span> */}
    </div>
)

console.log(element);

// 创建真实dom Root
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(element);

/*

类似babel转换器还有很多, 都可以转
acron estree esprima

let element = React.createElement("div", {
  className: "title",
  style: {
    color: 'red'
  },
  __self: undefined,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 6,
    columnNumber: 5
  }
}, React.createElement("span", {
  __self: undefined,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 7,
    columnNumber: 9
  }
}, "hello"), React.createElement("span", {
  __self: undefined,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 8,
    columnNumber: 9
  }
}, "world"));

*/

