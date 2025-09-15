import React from '../react/react';
import ReactDOM from '../react/react-dom/client';
class Sum extends React.Component {
    constructor(props) {
        super(props);
        this.a = React.createRef();//{current:null}
        this.b = React.createRef();
        this.c = React.createRef();
    }
    add = (event) => {
        this.c.current.value = this.a.current.value + this.b.current.value;
    }
    render() {
        return (
            <div>
                <input ref={this.a} />
                +
                <input ref={this.b} />
                <button onClick={this.add}>=</button>
                <input ref={this.c} />
            </div>
        )
    }
}
const DOMRoot = ReactDOM.createRoot(
    document.getElementById('root')
);
let element = <Sum />
DOMRoot.render(element);