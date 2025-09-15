// import React from 'react';
// import ReactDOM from 'react-dom/client';

import React from '../react/react';
import ReactDOM from '../react/react-dom/client';

class Counter extends React.Component {
    //定义的默认属性
    static defaultProps = {
        // props传了name,就覆盖
        name: 'zhufeng'
    }
    constructor(props) {
        super(props); //setup props 设置属性
        this.state = { number: 0 }; //设置状态
        console.log('Counter 1.constructor');
    }
    UNSAFE_componentWillMount() {
        console.log('Counter 2.componentWillMount');
    }
    handleClick = () => {
        this.setState({ number: this.state.number + 1 });
    }
    shouldComponentUpdate(nextProps, nextState) {
        console.log(`Counter 5.shouldComponentUpdate`);
        return nextState.number % 2 === 0; //如果是偶数就为true,就更新，如果为奇数就不更新
    }
    UNSAFE_componentWillUpdate() {
        //组件将要更新
        console.log(`Counter 6.componentWillUpdate`);
    }
    componentDidUpdate() {
        console.log(`Counter 7.componentDidUpdate`);
    }
    render() {
        console.log('Counter 3.render');
        return (
            <div id={`counter${this.state.number}`}>
                <p>{this.state.number}</p>
                {
                    this.state.number === 4 ? null : <FunctionCounter count={this.state.number} />
                }
                <button onClick={this.handleClick}>+</button>
            </div>
        )
    }
    componentDidMount() {
        console.log('Counter 4.componentDidMount');
    }
}
// 父组件先开始挂载 后挂载完成, 子组件后开始挂载 先挂载完成
function FunctionCounter(props) {
    return (
        <div>{props.count}</div>
    )
}
class ChildCounter extends React.Component {
    UNSAFE_componentWillReceiveProps(newProps) {
        console.log('ChildCounter 4.componentWillReceiveProps');
    }
    UNSAFE_componentWillMount() {
        console.log('ChildCounter 1.componentWillMount');
    }
    shouldComponentUpdate(nextProps, nextState) {
        console.log(`ChildCounter 5.shouldComponentUpdate`);
        return nextProps.count % 3 === 0;//如果父组件传过来的count值是3的倍数就更新，否则不更新
    }
    render() {
        console.log('ChildCounter 2.render');
        return (
            <div>{this.props.count}</div>
        )
    }
    componentDidMount() {
        console.log('ChildCounter 3.componentDidMount');
    }
    componentWillUnmount() {
        console.log('ChildCounter 6.componentWillUnmount');
    }
}

const DOMRoot = ReactDOM.createRoot(
    document.getElementById('root')
);
let element = <Counter age={16} />
DOMRoot.render(element);

/*
    <div>{this.props.name}</div> 中{this.props.name} 是在 在打包的时候，babel转译的时候会进行解析
*/


/**
Counter 1.constructor
Counter 2.componentWillMount
Counter 3.render
ChildCounter 1.UNSAFE_componentWillMount
ChildCounter 2.render
ChildCounter 3.componentDidMount
Counter 4.componentDidMount
number=1
Counter 5.shouldComponentUpdate
number=2
Counter 5.shouldComponentUpdate
Counter 6.componentWillUpdate
Counter 3.render
ChildCounter 4.componentWillReceiveProps
ChildCounter 5.shouldComponentUpdate
Counter 7.componentDidUpdate
number=3
Counter 5.shouldComponentUpdate
number=4
Counter 5.shouldComponentUpdate
Counter 6.componentWillUpdate
Counter 3.render
ChildCounter 6.componentWillUnmount
Counter 7.componentDidUpdate
number=5
Counter 5.shouldComponentUpdate
number=6
Counter 5.shouldComponentUpdate
Counter 6.componentWillUpdate
Counter 3.render
ChildCounter 1.UNSAFE_componentWillMount
ChildCounter 2.render
ChildCounter 3.componentDidMount
Counter 7.componentDidUpdate
 */