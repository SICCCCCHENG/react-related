import React from '../react/react';
import ReactDOM from '../react/react-dom/client';
class TextInput extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }
    getFocus = () => {
        this.ref.current.focus();
    }
    render() {
        return (
            <input ref={this.ref} />
        )
    }
}
class Form extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }
    getFocus = () => {
        this.ref.current.getFocus();
    }
    render() {
        return (
            <div>
                <TextInput ref={this.ref} />
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