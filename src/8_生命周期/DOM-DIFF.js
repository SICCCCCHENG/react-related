
// import React from 'react';
// import ReactDOM from 'react-dom/client';

import React from '../react/react';
import ReactDOM from '../react/react-dom/client';


const DOMRoot = ReactDOM.createRoot(
    document.getElementById('root')
);
class Counter extends React.Component {
    constructor(props) {
        super(props);//setup props 设置属性
        this.state = {
            list: ['A', 'B', 'C', 'D', 'E', 'F']
            // list: ['A', 'B', 'C', 'D', 'E', 'F', 'H']
        }
    }
    handleClick = () => {
        this.setState({
            list: ['A', 'C', 'E', 'B', 'G'],
            // list: ['A', 'C', 'E', 'B', 'G', 'H']
        })
    }
    render() {
        return (
            <div>
                <ul>
                    {
                        this.state.list.map(item => <li key={item}>{item}</li>)
                    }
                </ul>
                <button onClick={this.handleClick}>更新</button>
            </div>
        )
    }
}

let element = <Counter />
DOMRoot.render(element);
