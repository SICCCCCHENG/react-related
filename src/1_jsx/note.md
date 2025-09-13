```jsx
let element = <h1 className="title" style={{color:'red'}}>hello</h1>;
//会经过babel的编译变成
//如果runtime配置为classic,代表就是老的转换
//let React = {};
//React.createElement(type,props,...children)    old
React.createElement("h1", {
    className: "title",
    style: {
      color: 'red'
    }
  }, "hello",'world');




//如果说runtime配置成了automatic,代表就是新的转换    new
import { jsx } from "react/jsx-runtime";
//jsx(type,props);
// let element = <h1 className="title" style={{color:'red'}}>hello</h1>;
jsx("h1", {
  className: "title",
  style: {
    color: 'red'
  },
  children: "hello"
});




import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// let element = <h1 className="title" style={{color:'red'}}>hello<span>world</span></h1>;


React.createElement("h1", {
    className: "title",
    style: {
      color: 'red'
    }
  }, "hello", React.createElement("span", null, "world"));


_jsxs("h1", {
  className: "title",
  style: {
    color: 'red'
  },
  children: ["hello", _jsx("span", {
    children: "world"
  })]
});


/*

不管老的转换还是新的转换,dom 对象结构都是一样的
{
    $$typeof: Symbol(react.element),
    "type": "div",
    "props": {
        "className": "title",
        "style": { 
            "color": "red"
        },
        "children": {
            $$typeof: Symbol(react.element),
            "type": "span",
            "props": {
                "children": "hello"
            },
        }
    },
}

JSX_TRANSFORM 在react 17 的时候, 变更成了新的
*/


//  新的转换和老的转换有区别，一个多参数一个单参数是这样？新的做法这样的好处是啥？
//  1.不需要你在源码中手工引入React了,新版里会自动导入一个jsx函数
//  2.关于children的问题更简化了

```
