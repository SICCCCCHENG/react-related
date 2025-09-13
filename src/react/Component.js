import { findDOM, compareTwoVdom } from './react-dom/client';

//这是一个更新队列
export let updateQueue = {
    isBatchingUpdate: false, //这是一个是否是批量更新的标识,默认是非批量的，是同步的
    updaters: new Set(),//更新的集合
    batchUpdate() {
        updateQueue.isBatchingUpdate = false;
        for (const updater of updateQueue.updaters) {
            updater.updateComponent();
        }
        updateQueue.updaters.clear();
    }
}
class Updater {
    //每个更新器会保存一个组件类的实例
    constructor(classInstance) {
        this.classInstance = classInstance;
        //用来存放 待更新状态
        this.pendingStates = [];
        this.callbacks = [];
    }
    flushCallbacks() {
        if (this.callbacks.length > 0) {
            //如果没有使用箭头函数，那这里的
            this.callbacks.forEach((callback) => callback());
            this.callbacks.length = 0;
        }
    }
    addState(partialState, callback) {
        this.pendingStates.push(partialState);
        if (typeof callback === 'function') {
            this.callbacks.push(callback);
        }
        //发射更新有两种，一种是更新属性，一种是更新状态
        // 准备更新
        this.emitUpdate();
    }
    emitUpdate(nextProps) {
        // 如果需要批量更新
        if (updateQueue.isBatchingUpdate) {
            //则不要直接更新组件，而是先把更新器添加到updaters里去进行暂存
            updateQueue.updaters.add(this);
        } else {
            this.updateComponent();
        }
    }
    updateComponent() {
        //获取等待 生效的状态数组和类的实例
        const { pendingStates, nextProps, classInstance } = this;
        //如果有正在等待生效的状态
        if (pendingStates.length > 0) {
            shouldUpdate(classInstance, null, this.getState());
        }
    }
    //根据等待生效的状态数组组计算新的状态
    getState() {
        const { pendingStates, classInstance } = this;
        //先获取类的实例上的老状态
        let { state } = classInstance;
        pendingStates.forEach((partialState) => {
            if (typeof partialState === 'function') {
                partialState = partialState(state);
            }
            state = { ...state, ...partialState }
        });
        pendingStates.length = 0;
        return state;
    }
}
function shouldUpdate(classInstance, nextProps, nextState) {

    //不管最终要不要更新页面上的组件，都会把新的状态传送给classInstance.state
    // 先把计算的新状态 赋值给 类的实例
    // 此处应该是给了 子类 的 state
    classInstance.state = nextState;
    classInstance.forceUpdate();
}
export class Component {
    //给类Component添加了一个静态属性 isReactComponent=true
    static isReactComponent = true
    constructor(props) {
        this.props = props;
        this.state = {};
        //每个类会有一个更新器的实例
        this.updater = new Updater(this);
    }
    setState(partialState, callback) {
        this.updater.addState(partialState, callback);
    }
    forceUpdate() {
        console.log('forceUpdate', this.state);

        //先获取老的虚拟DOM，再计算新的虚拟DOM，找到新老虚拟DOM的差异，把这些差异更新到真实DOM上
        //获取老的虚拟DOM div#counter
        let oldRenderVdom = this.oldRenderVdom;

        //根据新的状态计算新的虚拟DOM
        let newRenderVdom = this.render();

        // 获取到此组件对应的老的真实DOM，才的DIV
        const oldDOM = findDOM(oldRenderVdom);
        //比较新旧虚拟DOM的差异，把更新后的结果放在真实DOM上
        compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom);


        //在更新后需要把oldRenderVdom更新为新的newRenderVdom
        // 第一次挂载 老的div#counter
        // 第一次更新的时候 新的div#counter
        // replaceChild  div#root>新的div#counter
        //它永远指向当前父DOM节点当前的子DOM节点
        this.oldRenderVdom = newRenderVdom;

        this.updater.flushCallbacks();
    }
}