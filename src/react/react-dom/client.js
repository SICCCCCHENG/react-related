import { REACT_TEXT, REACT_FORWARD_REF_TYPE, REACT_PROVIDER, REACT_CONTEXT, REACT_MEMO } from '../constant'
import { addEvent } from '../event.js'

// if while for 不可以使用hooks, 都不行因为可能会把索引乱掉

// 在源码里，每个函数组件都有自己的独立的hookIndex 和hookStates
let hookStates = []; //[0,{myFocus},{current:input},0] 4个元素
let hookIndex = 0;
let scheduleUpdate;

function mount(vdom, container) {
    //传进去虚拟DOM，返回真实DOM
    const newDOM = createDOM(vdom);
    if (newDOM) {
        container.appendChild(newDOM);
        if (newDOM.componentDidMount) {
            newDOM.componentDidMount()
        }
    }
}


export function useReducer(reducer, initialState) {
    const oldState = hookStates[hookIndex] = hookStates[hookIndex] || initialState;
    const currentIndex = hookIndex;
    function dispatch(action) {
        // let newState = reducer(oldState, action);
        let newState = reducer ? reducer(oldState, action) : typeof action === 'function' ? action(oldState) : action;
        hookStates[currentIndex] = newState;
        scheduleUpdate();
    }
    return [hookStates[hookIndex++], dispatch];
}

export function useState(initialState) {
    return useReducer(null, initialState);
    // const oldState = hookStates[hookIndex] = hookStates[hookIndex] || initialState;
    // const currentIndex = hookIndex;
    // function setState(action) {
    //     let newState = typeof action === 'function' ? action(oldState) : action;
    //     hookStates[currentIndex] = newState;
    //     scheduleUpdate();
    // }
    // return [hookStates[hookIndex++], setState];
}

export function useMemo(factory, deps) {
    //第一次挂载的时候，肯定值是空的
    if (hookStates[hookIndex]) {
        let [lastMemo, lastDeps] = hookStates[hookIndex];
        let same = deps.every((item, index) => item === lastDeps[index]);
        if (same) {//新的依赖数组和老的依赖数组完全 相等
            hookIndex++;
            return lastMemo;
        } else {
            const newMemo = factory();
            hookStates[hookIndex++] = [newMemo, deps];
            return newMemo;
        }
    } else {
        const newMemo = factory();
        hookStates[hookIndex++] = [newMemo, deps];
        return newMemo;
    }
}

export function useCallback(callback, deps) {
    //第一次挂载的时候，肯定值是空的
    if (hookStates[hookIndex]) {
        let [lastCallback, lastDeps] = hookStates[hookIndex];
        let same = deps.every((item, index) => item === lastDeps[index]);
        if (same) {//新的依赖数组和老的依赖数组完全 相等
            hookIndex++;
            return lastCallback;
        } else {
            hookStates[hookIndex++] = [callback, deps];
            return callback;
        }
    } else {
        hookStates[hookIndex++] = [callback, deps];
        return callback;
    }
}

// 专门为函数组件设计
export function useContext(context) {
    return context._currentValue;
}

export function useEffect(callback, deps) {
    const currentIndex = hookIndex;
    if (hookStates[currentIndex]) {
        let [destroy, lastDeps] = hookStates[hookIndex];
        let same = deps && deps.every((item, index) => item === lastDeps[index]);
        if (same) {
            hookIndex++;
        } else {
            destroy?.();
            // 开启新的宏任务
            // useEffect 开启了一个宏任务，因为它要等到DOM渲染到页面之后，也就是页面绘制之后执行
            // useLayoutEffect是相当于一个微任务，会在页面绘制前执行
            setTimeout(() => {
                // 执行callback,保存返回的destroy销毁函数
                hookStates[currentIndex] = [callback(), deps];
            });
            hookIndex++;
        }
    } else {
        // 模拟宏任务
        setTimeout(() => {
            //执行callback,保存返回的destroy销毁函数
            hookStates[currentIndex] = [callback(), deps];
        });
        hookIndex++;
    }
}

export function useLayoutEffect(callback, deps) {
    const currentIndex = hookIndex;
    if (hookStates[currentIndex]) {
        let [destroy, lastDeps] = hookStates[hookIndex];
        let same = deps && deps.every((item, index) => item === lastDeps[index]);
        if (same) {
            hookIndex++;
        } else {
            destroy?.();
            queueMicrotask(() => {//queue宏任务 setTimeout模拟
                //执行callback,保存返回的destroy销毁函数
                hookStates[currentIndex] = [callback(), deps];
            });
            hookIndex++;
        }
    } else {
        queueMicrotask(() => {
            //执行callback,保存返回的destroy销毁函数
            hookStates[currentIndex] = [callback(), deps];
        });
        hookIndex++;
    }
}

export function useRef(initialState) {
    hookStates[hookIndex] = hookStates[hookIndex] || { current: initialState };
    return hookStates[hookIndex++];
}

// 第二个参数为什么设计成函数,为啥不是对象
// 1.可以传参
// 2.可以动态执行，获取最新的外界参数
// 3.可以实现闭包的变量
export function useImperativeHandle(ref, handler) {
    ref.current = handler()
}

//把虚拟DOM变成真实的DOM
function createDOM(vdom) {
    const { type, props, ref } = vdom;
    let dom;
    if (type && type.$$typeof === REACT_MEMO) {
        return mountMemoComponent(vdom);
    } else if (type && type.$$typeof === REACT_CONTEXT) {
        return mountConsumerComponent(vdom);
    } else if (type && type.$$typeof === REACT_PROVIDER) {
        return mountProviderComponent(vdom);
    } else if (type && type.$$typeof === REACT_FORWARD_REF_TYPE) {
        return mountForwardComponent(vdom);
    } else if (type === REACT_TEXT) { // 如果这个虚拟dom类型是一个文本节点 string number
        dom = document.createTextNode(props);
    } else if (typeof type == 'function') {
        // 类本身也是函数
        if (type.isReactComponent) {
            return mountClassComponent(vdom);
        } else {
            return mountFunctionComponent(vdom);
        }
    } else {
        dom = document.createElement(type);//原生组件
    }
    //判断属性的类型，因为对于元素的话，props是对象，对于文本节点而言，它的props就是文本本身
    if (typeof props === 'object') {
        updateProps(dom, {}, props);
        if (props.children) {
            //如果是独生子的话，把独生子的虚拟DOM转换真实DOM插入到DOM节点上
            if (typeof props.children === 'object' && props.children.type) {
                props.children.mountIndex = 0;
                mount(props.children, dom);
            } else if (Array.isArray(props.children)) {
                reconcileChildren(props.children, dom);
            }
        }
    }
    //在根据虚拟DOM创建真实DOM成功后，就可以建立关系
    vdom.dom = dom;
    //如果此虚拟DOM上有ref属性，则把ref.current的值赋成真实DOM
    if (ref) ref.current = dom;
    return dom;
}

function mountMemoComponent(vdom) {
    const { type: { type: functionComponent }, props } = vdom;
    const renderVdom = functionComponent(props);
    if (!renderVdom) return null;
    vdom.oldRenderVdom = renderVdom;
    return createDOM(renderVdom);
}

function mountProviderComponent(vdom) {
    const { type, props } = vdom;
    const context = type._context;
    context._currentValue = props.value;
    let renderVdom = props.children;
    if (!renderVdom) return null;
    vdom.oldRenderVdom = renderVdom;
    return createDOM(renderVdom)
}

function mountConsumerComponent(vdom) {
    const { type, props } = vdom;
    const context = type._context;
    const renderVdom = props.children(context._currentValue);
    if (!renderVdom) return null;
    vdom.oldRenderVdom = renderVdom;
    return createDOM(renderVdom)
}

function mountForwardComponent(vdom) {
    const { type, props, ref } = vdom;
    //type.render=就是TextInput
    const renderVdom = type.render(props, ref);
    if (!renderVdom) return null;
    vdom.oldRenderVdom = renderVdom;
    return createDOM(renderVdom);
}

function mountFunctionComponent(vdom) {
    const { type, props } = vdom;//FunctionComponent  {title:'world'}
    const renderVdom = type(props);
    if (!renderVdom) return null;
    vdom.oldRenderVdom = renderVdom;
    return createDOM(renderVdom);
}

function mountClassComponent(vdom) {
    const { type: ClassComponent, props, ref } = vdom;
    var defaultProps = ClassComponent.defaultProps;
    var resolvedProps = { ...defaultProps, ...props }
    const classInstance = new ClassComponent(resolvedProps);//class ClassComponent

    if (ClassComponent.contextType) {
        classInstance.context = ClassComponent.contextType._currentValue;
    }

    // 让虚拟dom的classInstance属性指向此类的实例
    vdom.classInstance = classInstance;
    if (ref) ref.current = classInstance;
    if (classInstance.UNSAFE_componentWillMount) {
        classInstance.UNSAFE_componentWillMount();
    }
    const renderVdom = classInstance.render();
    if (!renderVdom) return null;

    //在获取render的渲染结果后把此结果放到classInstance.oldRenderVdom进行暂存
    classInstance.oldRenderVdom = renderVdom;

    const dom = createDOM(renderVdom);
    if (classInstance.componentDidMount) {
        //把componentDidMount方法暂存到dom对象上
        dom.componentDidMount = classInstance.componentDidMount.bind(classInstance);
    }
    return dom;

}

function reconcileChildren(childrenVdom, parentDOM) {
    for (let i = 0; i < childrenVdom.length; i++) {
        childrenVdom[i].mountIndex = i;
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
        } else if (/^on[A-Z].*/.test(key)) {  // 创建虚拟dom是从里向外生成  生成真实dom是从外到里生成
            // // dom.onclick = handleClick 转为onclick
            // dom[key.toLowerCase()] = newProps[key];
            // 源码中是将其指向undefined
            // // dom[key.toLowerCase()] = (args) => {
            // //     newProps[key].apply(undefined, args)
            // // };
            addEvent(dom, key, newProps[key]);
            // addEvent(dom, key.toLowerCase(), newProps[key]);
        } else {
            //如果是其它属性，则直接赋值
            // 在HTML中，CSS类的属性名是 class，但在JavaScript DOM对象中，由于 class 是保留关键字，所以使用 className 作为DOM属性名。
            // 当你执行 dom.className = "title" 时，这是正确的，会设置元素的CSS类。
            dom[key] = newProps[key];
        }
    }
    for (let key in oldProps) {
        if (!newProps.hasOwnProperty(key)) {
            dom[key] = null;
        }
    }
}

//class>function>class>function
export function findDOM(vdom) {//Class Counter虚拟DOM {type:Counter,classInstance:CounterInstance}
    if (!vdom) return null;
    //如果vdom对应原生组件的的话肯定有dom属性指向真实DOM
    if (vdom.dom) {
        return vdom.dom;
    } else {
        //否则 可能是类组件或者说函数组件 oldRenderVdom {type:div}
        const renderVdom = vdom.classInstance ? vdom.classInstance.oldRenderVdom : vdom.oldRenderVdom;
        return findDOM(renderVdom);
    }
}
/**
 * 比较新的和老的虚拟DOM ,实现DOM-DIFF
 * @param {*} parentDOM 老的父真实DOM
 * @param {*} oldVdom   老的虚拟DOm
 * @param {*} newVdom   新的虚拟DOM
 * @param {*} nextDOM   newVdom的离它最近的下一个真实DOM元素
 */
export function compareTwoVdom(parentDOM, oldVdom, newVdom, nextDOM) {

    // let oldDOM = findDOM(oldVdom)
    // let newDOM = createDOM(newVdom)
    // parentDOM.replaceChild(newDOM, oldDOM)

    //如果老的虚拟DOM和新的虚拟DOM都是null或undefined
    if (!oldVdom && !newVdom) {
        return;
        //如果老的虚拟DOM有值，并且新的虚拟DOM为null
    } else if (oldVdom && !newVdom) {
        unMountVdom(oldVdom);
    } else if (!oldVdom && newVdom) {
        //创建新的虚拟DOM对应的真实DOM
        let newDOM = createDOM(newVdom);
        if (nextDOM) {
            parentDOM.insertBefore(newDOM, nextDOM);
        } else {
            parentDOM.appendChild(newDOM);
        }
        if (newDOM.componentDidMount) {
            newDOM.componentDidMount();
        }
    } else if (oldVdom && newVdom && (oldVdom.type !== newVdom.type)) {
        //如果虽然说老的有，新的也有，但是类型不同，则也不能复用老的真实DOM节点
        unMountVdom(oldVdom)
        let newDOM = createDOM(newVdom)
        if (nextDOM) {
            parentDOM.insertBefore(newDOM, nextDOM);
        } else {
            parentDOM.appendChild(newDOM);
        }
        if (newDOM.componentDidMount) {
            newDOM.componentDidMount();
        }
    } else {//如果有老的虚拟DOM，也有新的虚拟DOM，并且类型是一样的，就可以复用老的真实DOM
        updateElement(oldVdom, newVdom);
    }
}

/**
 * 更新元素
 * @param {*} oldVdom 老的虚拟DOM
 * @param {*} newVdom 新的虚拟DOM
 */
function updateElement(oldVdom, newVdom) {

    if (oldVdom.type.$$typeof === REACT_FORWARD_REF_TYPE) {
        updateForwardComponent(oldVdom, newVdom);
    } else if (oldVdom.type.$$typeof === REACT_MEMO) {
        updateMemoComponent(oldVdom, newVdom);
    } else if (oldVdom.type.$$typeof === REACT_PROVIDER) {
        updateProviderComponent(oldVdom, newVdom);
    } else if (oldVdom.type.$$typeof === REACT_CONTEXT) {
        updateContextComponent(oldVdom, newVdom);
    } else if (oldVdom.type === REACT_TEXT) {   //如果新老的虚拟DOM都是文本节点的话
        //复用老DOM节点
        let currentDOM = newVdom.dom = findDOM(oldVdom);
        if (oldVdom.props !== newVdom.props) {
            currentDOM.textContent = newVdom.props;
        }
        return;
        //如果是原生组件的话，就是指span div p
    } else if (typeof oldVdom.type === 'string') {
        let currentDOM = newVdom.dom = findDOM(oldVdom);
        //用新的虚拟DOM属性更新老的真实DOM
        updateProps(currentDOM, oldVdom.props, newVdom.props);
        updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children);
    } else if (typeof oldVdom.type === 'function') {//如果类型是一个函数的话，说明肯定是一个组件
        if (oldVdom.type.isReactComponent) {//如果是类组件的话
            updateClassComponent(oldVdom, newVdom);
        } else {
            updateFunctionComponent(oldVdom, newVdom);//如果是函数组件的话
        }
    }
}

function updateForwardComponent(oldVdom, newVdom) {
    let currentDOM = findDOM(oldVdom);
    if (!currentDOM) return;
    //获取当前的真实DOM的父节点
    let parentDOM = currentDOM.parentNode;
    //重新执行函数获取新的虚拟DOM
    const { type, props, ref } = newVdom;//FunctionComponent  {title:'world'}
    const newRenderVdom = type.render(props, ref);
    //比较新旧虚拟DOM
    compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, newRenderVdom);
    //还要把newRenderVdom保存起来
    newVdom.oldRenderVdom = newRenderVdom;
}

function updateMemoComponent(oldVdom, newVdom) {
    let { type: { compare, type: functionComponent } } = oldVdom;
    //比较新的和老的属性对象，如果是一样的，就不render
    if (compare(oldVdom.props, newVdom.props)) {
        //则不重新渲染，直接复用老的渲染的虚拟DOM
        newVdom.oldRenderVdom = oldVdom.oldRenderVdom;
    } else {
        const oldDOM = findDOM(oldVdom);
        const parentDOM = oldDOM.parentNode;
        const renderVdom = functionComponent(newVdom.props)
        compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom);
        newVdom.oldRenderVdom = renderVdom;
    }
}

function updateProviderComponent(oldVdom, newVdom) {
    //先获取父DOM节点
    let parentDOM = findDOM(oldVdom).parentNode;
    let { type, props } = newVdom;
    let context = type._context;
    context._currentValue = props.value;
    let renderVdom = props.children;
    compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom);
    newVdom.oldRenderVdom = renderVdom;
}

function updateContextComponent(oldVdom, newVdom) {
    //先获取父DOM节点
    let parentDOM = findDOM(oldVdom).parentNode;
    let { type, props } = newVdom;
    let context = type._context;
    let renderVdom = props.children(context._currentValue);
    compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom);
    newVdom.oldRenderVdom = renderVdom;
}

function updateClassComponent(oldVdom, newVdom) {
    //复用老的类组件的实例
    let classInstance = newVdom.classInstance = oldVdom.classInstance;
    if (classInstance.UNSAFE_componentWillReceiveProps) {
        classInstance.UNSAFE_componentWillReceiveProps(newVdom.props);
    }
    classInstance.updater.emitUpdate(newVdom.props);
}

function updateFunctionComponent(oldVdom, newVdom) {
    let currentDOM = findDOM(oldVdom);
    if (!currentDOM) return;
    //获取当前的真实DOM的父节点
    let parentDOM = currentDOM.parentNode;
    //重新执行函数获取新的虚拟DOM
    const { type, props } = newVdom;//FunctionComponent  {title:'world'}
    const newRenderVdom = type(props);
    //比较新旧虚拟DOM
    compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, newRenderVdom);
    //还要把newRenderVdom保存起来
    newVdom.oldRenderVdom = newRenderVdom;
}

/**
 * 更新它的子节点
 * @param {*} parentDOM 父真实DOM
 * @param {*} oldVChildren 老的子虚拟DOM
 * @param {*} newVChildren 新的子虚拟DOM
 */
function updateChildren(parentDOM, oldVChildren, newVChildren) {
    oldVChildren = (Array.isArray(oldVChildren) ? oldVChildren : oldVChildren ? [oldVChildren] : []);
    newVChildren = (Array.isArray(newVChildren) ? newVChildren : newVChildren ? [newVChildren] : []);

    // 获取第二个儿子数组的最大长度
    // let maxLength = Math.max(oldVChildren.length, newVChildren.length);
    // for (let i = 0; i < maxLength; i++) {
    //     let nextVdom = oldVChildren.find((item, index) => index > i && item && findDOM(item));
    //     compareTwoVdom(parentDOM, oldVChildren[i], newVChildren[i], nextVdom && findDOM(nextVdom));
    // }

    //存放老节点的map
    const keyedOldMap = {}
    //上一个放置好的，不需要移动元素的索引
    let lastPlacedIndex = -1;
    oldVChildren.forEach((oldVChild, index) => {
        //如果用户提供了key就用用户提供的key,否则就使用index索引
        let oldKey = (oldVChild.key) ? oldVChild.key : index;
        keyedOldMap[oldKey] = oldVChild;
    })
    //创建一个补丁包，存放将要进行的操作
    let patch = [];
    //遍历新的虚拟DOM数组
    newVChildren.forEach((newVChild, index) => {
        newVChild.mountIndex = index;
        let newKey = newVChild.key ? newVChild.key : index;
        //用新的key去老的map中找找有没有可复用的虚拟DOM
        let oldVChild = keyedOldMap[newKey];
        //如果找到了就可以进行复用了
        if (oldVChild) {
            //如果找到了就直接进行更新
            updateElement(oldVChild, newVChild);
            //再判断此节点是否需要移动
            //如果此可复用的老节点的挂载索引比上一个不需要移动的节点的索引要小的话，那就需要移动 
            if (oldVChild.mountIndex < lastPlacedIndex) {// 1 < 4
                patch.push({
                    type: 'MOVE',
                    oldVChild,//移动老B 1
                    newVChild,
                    mountIndex: index //3
                });
            }
            //把可以复用的老的虚拟DOM节点从map中删除
            delete keyedOldMap[newKey];
            //更新lastPlacedIndex为老的lastPlacedIndex和oldVChild.mountIndex中的较大值
            lastPlacedIndex = Math.max(lastPlacedIndex, oldVChild.mountIndex);
        } else {
            patch.push({
                type: 'PLACEMENT',
                newVChild,
                mountIndex: index
            });
        }
    });
    //执行patch中的操作
    //获取所有需要移动的元素 ['B']
    const moveVChildren = patch.filter(action => action.type === 'MOVE').map(action => action.oldVChild);
    //获取所有留在map中的老的虚拟DOM加上移动的老的虚拟DOM
    //直接从老的真实DOM中删除 D F B
    Object.values(keyedOldMap).concat(moveVChildren).forEach(oldVChild => {
        let currentDOM = findDOM(oldVChild);
        parentDOM.removeChild(currentDOM);
    });
    //patch =[{type:'MOVE',B},{type:'PLACEMENT',G}]
    patch.forEach(action => {
        const { type, oldVChild, newVChild, mountIndex } = action;
        let oldTrueDOMs = parentDOM.childNodes;//获取老的真实DOM的集合[A,C,E]
        if (type === 'PLACEMENT') {
            //先根据新的虚拟DOM创建新的真实DOM
            let newDOM = createDOM(newVChild);
            const oldTrueDOM = oldTrueDOMs[mountIndex];
            if (oldTrueDOM) {
                //如果要挂载的索引处有真实DOM，就是插到它的前面
                parentDOM.insertBefore(newDOM, oldTrueDOM);
            } else {
                parentDOM.appendChild(newDOM);
            }
        } else if (type === 'MOVE') {
            let oldDOM = findDOM(oldVChild);//B真实DOM
            let oldTrueDOM = oldTrueDOMs[mountIndex];//获取挂载索引处现在的真实DOM
            if (oldTrueDOM) {
                //如果要挂载的索引处有真实DOM，就是插到它的前面
                parentDOM.insertBefore(oldDOM, oldTrueDOM);
            } else {
                parentDOM.appendChild(oldDOM);
            }
        }
    });
}

function unMountVdom(vdom) {
    const { props, ref } = vdom;
    //获取此虚拟DOM对应的真实DOM
    let currentDOM = findDOM(vdom);
    //如果类的实例上componentWillUnmount方法则执行它
    if (vdom.classInstance && vdom.classInstance.componentWillUnmount) {
        vdom.classInstance.componentWillUnmount();
    }
    if (ref) {
        ref.current = null;
    }
    if (props.children) {
        const children = Array.isArray(props.children) ? props.children : [props.children];
        children.forEach(unMountVdom);
    }
    //如果此虚拟DOM对应了真实DOM，则把此真实DOM进行删除
    if (currentDOM) currentDOM.remove();
}

class DOMRoot {
    constructor(container) {
        this.container = container;
    }
    render(vdom) {
        mount(vdom, this.container);
        scheduleUpdate = () => {
            hookIndex = 0;
            // 容器 老的vdom 新的vdom
            // 两个vdom是由于两次执行后的vdom不一样
            // 每次更新从根节点开始更新
            compareTwoVdom(this.container, vdom, vdom);
        }
    }
}

function createRoot(container) {
    return new DOMRoot(container);
}
const ReactDOM = {
    createRoot,
    createPortal: function (vdom, container) {  // 基本不用
        mount(vdom, container);
    }
}

export default ReactDOM;