// import React from 'react';
// import ReactDOM from 'react-dom/client';

import React from '../react/react';
import ReactDOM from '../react/react-dom/client';

function TextInput(props, forwardRef) {
    return (
        <input ref={forwardRef} />
    )
}
const ForwardTextInput = React.forwardRef(TextInput);
class Form extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }
    getFocus = () => {
        this.ref.current.focus()
    }
    render() {
        return (
            <div>
                {/* 
                    <ForwardTextInput ref={this.ref}/>
                    React.createElement(ForwardTextInput,{ref:this.ref});
                    {
                        $$typeof:REACT_ELEMENT,//默认是元素类型
                        type: {
                            $$typeof:REACT_FORWARD_REF_TYPE,
                            render// 其实就是原来的函数组件那个函数
                        },
                        props:{},//属性
                        ref:this.ref,
                    }
                */}
                <ForwardTextInput ref={this.ref} />
                <button onClick={this.getFocus}>获得焦点</button>
            </div>
        )
    }
}
const DOMRoot = ReactDOM.createRoot(
    document.getElementById('root')
);
let element = <Form />
DOMRoot.render(element);