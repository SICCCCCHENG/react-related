function createRoot(container) {
    return new DOMRoot(container);
}
const ReactDOM = {
    createRoot,
    createPortal:function(vdom,container){
        mount(vdom,container);
    }
}