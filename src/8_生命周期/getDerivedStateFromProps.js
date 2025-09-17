
// import React from 'react';
// import ReactDOM from 'react-dom/client';

import React from '../react/react';
import ReactDOM from '../react/react-dom/client';


const DOMRoot = ReactDOM.createRoot(
    document.getElementById('root')
);
class Counter extends React.Component {
    //定义的默认属性
    static defaultProps = {
        name: 'zhufeng'
    }
    constructor(props) {
        super(props);//setup props 设置属性
        this.state = { number: 0 };//设置状态
        console.log('Counter 1.constructor');
    }
    UNSAFE_componentWillMount() {
        console.log('Counter 2.componentWillMount');
    }
    handleClick = () => {
        this.setState({ number: this.state.number + 1 });
    }
    shouldComponentUpdate(nextProps, nextState) {
        return true;
        //console.log(`Counter 5.shouldComponentUpdate`);
        //return nextState.number%2===0;//如果是偶数就为true,就更新，如果为奇数就不更新
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
                <ChildCounter count={this.state.number} />
                <button onClick={this.handleClick}>+</button>
            </div>
        )
    }
    componentDidMount() {
        console.log('Counter 4.componentDidMount');
    }
}
class ChildCounter extends React.Component {
    constructor(props) {
        super(props);
        this.state = { number: 0 };
    }
    UNSAFE_componentWillReceiveProps(newProps) {
        console.log('ChildCounter 4.componentWillReceiveProps');
    }
    UNSAFE_componentWillMount() {
        console.log('ChildCounter 1.componentWillMount');
    }
    shouldComponentUpdate(nextProps, nextState) {
        return true;
        //console.log(`ChildCounter 5.shouldComponentUpdate`);
        //return nextProps.count%3===0;//如果父组件传过来的count值是3的倍数就更新，否则不更新
    }
    //通过新的属性派生出状态
    static getDerivedStateFromProps(nextProps, prevState) {
        const { count } = nextProps;
        if (count % 2 === 0) {
            return { number: count * 2 };
        } else {
            return { number: count * 3 }
        }
    }
    render() {
        console.log('ChildCounter 2.render');
        return (
            <div>{this.state.number}</div>
        )
    }
    componentDidMount() {
        console.log('ChildCounter 3.componentDidMount');
    }
    componentWillUnmount() {
        console.log('ChildCounter 6.componentWillUnmount');
    }
}

let element = <Counter />
DOMRoot.render(element);
