import { REACT_TEXT } from '../constant'

function mount(vdom, container) {
    //传进去虚拟DOM，返回真实DOM
    const newDOM = createDOM(vdom);
    if (newDOM) {
        container.appendChild(newDOM);
    }
}

//把虚拟DOM变成真实的DOM
function createDOM(vdom) {
    const { type, props } = vdom;
    let dom;

    // 如果这个虚拟dom类型是一个文本节点 string number
    if (type === REACT_TEXT) {
        dom = document.createTextNode(props);
    } else {
        dom = document.createElement(type);//原生组件
    }
    //判断属性的类型，因为对于元素的话，props是对象，对于文本节点而言，它的props就是文本本身
    if (typeof props === 'object') {
        updateProps(dom, {}, props);
        if (props.children) {
            //如果是独生子的话，把独生子的虚拟DOM转换真实DOM插入到DOM节点上
            if (typeof props.children === 'object' && props.children.type) {
                mount(props.children, dom);
            } else if (Array.isArray(props.children)) {
                reconcileChildren(props.children, dom);
            }
        }
    }
    return dom;
}

function reconcileChildren(childrenVdom, parentDOM) {
    for (let i = 0; i < childrenVdom.length; i++) {
        childrenVdom[i].mountIndex=i;
        mount(childrenVdom[i], parentDOM);
    }
}

/**
 * 更新DOM元素的属性
 * 1.把新的属性全部赋上去
 * 2.把老的属性在新的属性对象没有删除掉
 */
function updateProps(dom, oldProps = {}, newProps = {}) {
    for (let key in newProps) {
        //children属性会在后面单独处理
        if (key === 'children') {
            continue;
        } else if (key === 'style') {
            //把样式对象上的所有属性都赋给真实DOM
            let styleObject = newProps[key];
            for (const attr in styleObject) {
                dom.style[attr] = styleObject[attr];
            }
        } else {
            //如果是其它属性，则直接赋值
            // 在HTML中，CSS类的属性名是 class，但在JavaScript DOM对象中，由于 class 是保留关键字，所以使用 className 作为DOM属性名。
            // 当你执行 dom.className = "title" 时，这是正确的，会设置元素的CSS类。
            dom[key] = newProps[key];
        }
    }
    // for (let key in oldProps) {
    //     if (!newProps.hasOwnProperty(key)) {
    //         dom[key] = null;
    //     }
    // }
}

class DOMRoot {
    constructor(container) {
        this.container = container;
    }
    render(vdom) {
        mount(vdom, this.container);
    }
}

function createRoot(container) {
    return new DOMRoot(container);
}
const ReactDOM = {
    createRoot,
}

export default ReactDOM;