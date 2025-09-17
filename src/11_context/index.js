
// import React from 'react';
// import ReactDOM from 'react-dom/client';

import React from '../react/react';
import ReactDOM from '../react/react-dom/client';

const ThemeContext = React.createContext();
const { Provider, Consumer } = ThemeContext;


const baseStyle = {
    padding: '5px',
    border: '5px solid red'
}
function Title(props) {
    return (
        <Consumer>
            {
                (contextValue) => (
                    <div style={{ ...baseStyle, border: `5px solid ${contextValue.color}` }}>
                        Title
                    </div>
                )
            }
        </Consumer>
    )
}
class Header extends React.Component {
    static contextType = ThemeContext
    render() {
        return (
            <div style={{ ...baseStyle, border: `5px solid ${this.context.color}` }}>
                Header
                <Title />
            </div>
        )
    }
}
function Content(props) {
    return (
        <Consumer>
            {
                (contextValue) => (
                    <div style={{ ...baseStyle, border: `5px solid ${contextValue.color}` }}>
                        Content
                        <button onClick={() => contextValue.changeColor('red')}>变红</button>
                        <button onClick={() => contextValue.changeColor('green')}>变绿</button>
                    </div>
                )
            }
        </Consumer>
    )
}
class Main extends React.Component {
    static contextType = ThemeContext
    render() {
        return (
            <div style={{ ...baseStyle, border: `5px solid ${this.context.color}` }}>
                Main
                <Content />
            </div>
        )
    }
}
class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = { color: 'green' };
    }
    changeColor = (color) => {
        this.setState({ color });
    }
    render() {
        const contextVal = { color: this.state.color, changeColor: this.changeColor };
        return (
            <Provider value={contextVal}>
                <div style={{ ...baseStyle, width: '250px', border: `5px solid ${this.state.color}` }}>
                    Page
                    <Header />
                    <Main />
                </div>
            </Provider>
        )
    }
}
let element = <Page />

const DOMRoot = ReactDOM.createRoot(
    document.getElementById('root')
);
DOMRoot.render(element);
