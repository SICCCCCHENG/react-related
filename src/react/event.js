import { updateQueue } from './Component';
/**
 * 给DOM元素添加事件处理函数
 * @param {*} dom 要添加事件的DOM元素
 * @param {*} eventType 事件的类型 onClick onClickCapture
 * @param {*} handler 事件处理函数
 */
export function addEvent(dom, eventType, handler) {
    //判断dom元素上有没有store属性，如果有直接返回，如果没能则赋值为空对象然后返回
    let store = dom.store || (dom.store = {});
    //向store中存放属性和值，属性是事件类型onclick 值是一个事件函数函数
    //onClick  onClickCapture
    store[eventType.toLowerCase()] = handler;
    const eventName = eventType.toLowerCase();
    // 只绑定给document  事件默认只在冒泡阶段触发
    const name = eventName.replace(/Capture$/, '').slice(2);
    if (!document[name]) {
        //其实在React17 前后此逻辑是有改变的
        //在React17以前是不合理的，此方法只在冒泡阶段执行，并且直接模拟捕获和冒泡二个流程
        //此event是浏览器传进来的
        document.addEventListener(eventName.slice(2).toLowerCase(), (event) => {
            dispatchEvent(event, true);
        }, true);
        document.addEventListener(eventName.slice(2).toLowerCase(), (event) => {
            dispatchEvent(event, false);
        }, false);
        document[name] = true;
    }
}
function dispatchEvent(event, isCapture) {
    //为什么要做事件委托，为什么要把子DOM的事件全部委托给父类
    // 1.为了减少绑定，提高性能 
    // 2.统一进行事件实现合成事件
    //target事件源 button type是件名称 click
    const { target, type } = event;
    let eventType = `on${type}`;//onclick
    let eventTypeCapture = `on${type}capture`;
    let syntheticEvent = createSyntheticEvent(event);

    // 在执行事件函数之前, 把isBatchingUpdate设置为true, 把批量更新打开
    updateQueue.isBatchingUpdate = true;
    //为了跟源码一样，我们需要自己手工再次模拟捕获和冒泡的全过程
    //我们需要先记录一栈结构
    let targetStack = [];
    let currentTarget = target
    while (currentTarget) {
        targetStack.push(currentTarget);//button div#counter div#root document
        currentTarget = currentTarget.parentNode;
    }

    //处理捕获阶段
    if (isCapture) {
        for (let i = targetStack.length - 1; i >= 0; i--) {
            const currentTarget = targetStack[i];
            let { store } = currentTarget;
            let handler = store && store[eventTypeCapture];
            handler && handler(syntheticEvent);
        }
    } else {
        //处理冒泡阶段
        for (let i = 0; i < targetStack.length; i++) {
            const currentTarget = targetStack[i];
            let { store } = currentTarget;
            let handler = store && store[eventType];
            handler && handler(syntheticEvent);
            if (syntheticEvent.isPropagationStopped) {
                break;
            }
        }
    }
    updateQueue.batchUpdate();
}
/**
 * 根据原生事件对象创建合成事件
 * 1.为了实现兼容性处理
 * @param {*} event 
 */
function createSyntheticEvent(nativeEvent) {
    let syntheticEvent = {};
    for (let key in nativeEvent) {
        let value = nativeEvent[key];
        if (typeof value === 'function')
            value = value.bind(nativeEvent);
        syntheticEvent[key] = value;
    }
    syntheticEvent.nativeEvent = nativeEvent;
    //是否已经阻止了默认事件
    syntheticEvent.isDefaultPrevented = false;
    syntheticEvent.preventDefault = preventDefault;
    syntheticEvent.isPropagationStopped = false;
    syntheticEvent.stopPropagation = stopPropagation;
    return syntheticEvent;
}
function preventDefault() {
    this.isDefaultPrevented = true;
    const nativeEvent = this.nativeEvent;
    if (nativeEvent.preventDefault) {
        nativeEvent.preventDefault();
    } else {//IE
        nativeEvent.returnValue = false;
    }
}
function stopPropagation() {
    this.isPropagationStopped = true;
    const nativeEvent = this.nativeEvent;
    if (nativeEvent.stopPropagation) {
        nativeEvent.stopPropagation();
    } else {//IE
        nativeEvent.cancelBubble = true;
    }
}