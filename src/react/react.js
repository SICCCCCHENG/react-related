import { wrapToVdom, shallowEqual } from './utils'
import { REACT_ELEMENT, REACT_FORWARD_REF_TYPE, REACT_PROVIDER, REACT_CONTEXT, REACT_MEMO } from './constant';
import { Component } from './Component'

/**
 * 根据参数，返回一个React元素
 * @param {*} type 元素的类型 div span
 * @param {*} config 配置对象 className style
 * @param {*} children 后面所有参数都是children,children可能有，也可能没有，可能有一个，也可能有多个
 */
function createElement(type, config, children) {
    let ref;
    let key;
    if (config) {
        delete config.__source;
        delete config.__self;
        ref = config.ref;//是用来引用此元素的
        delete config.ref;
        key = config.key;//key是用来标记一个父亲的唯一儿子的
        delete config.key;
    }
    let props = { ...config };
    //如果参数数量大于3说明有儿子，并且儿子数量大于一个
    if (arguments.length > 3) {
        // 拿到后面的所有子元素
        props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom)
        //如果说等于3，那就是只有一个儿子
    } else if (arguments.length === 3) {
        props.children = wrapToVdom(children);
    }
    return {
        $$typeof: REACT_ELEMENT,//默认是元素类型
        type,//span div
        props,//属性
        ref,
        key
    }
}

function createRef() {
    return { current: null };
}

//其实函数组件本质上就是render方法，就是接收属性，返回react元素
function forwardRef(render) {
    return {
        $$typeof: REACT_FORWARD_REF_TYPE,
        render // 其实就是原来的函数组件那个函数
    }
}

function createContext() {
    //_currentValue代表当前的值
    let context = { _currentValue: undefined };
    context.Provider = {
        $$typeof: REACT_PROVIDER,//供应商
        _context: context
    };
    context.Consumer = {
        $$typeof: REACT_CONTEXT,//上下文
        _context: context
    }
    return context;
}

function cloneElement(element, newProps, children) {
    let props = { ...element.props, ...newProps };
    if (arguments.length > 3) {
        props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom)
        //如果说等于3，那就是只有一个儿子
    } else if (arguments.length === 3) {
        props.children = wrapToVdom(children);
    }
    return {
        ...element,
        props
    }
}

class PureComponent extends Component {
    //重写scu方法，如果属性变了或者状态变以就会返回true,如果都没变才会返回false
    shouldComponentUpdate(newProps, nextState) {
        return !shallowEqual(this.props, newProps) || !shallowEqual(this.state, nextState)
    }
}

function memo(type, compare = shallowEqual) {
    return {
        $$typeof: REACT_MEMO,
        type,//函数组件
        compare//比较方法
    }
}

const React = {
    createElement,
    Component,
    createRef,
    forwardRef,
    createContext,
    cloneElement,
    PureComponent,
    memo
}
export default React