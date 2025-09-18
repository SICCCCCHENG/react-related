// import React from 'react';
// import ReactDOM from 'react-dom/client';

import React from '../react/react';
import ReactDOM from '../react/react-dom/client';

const DOMRoot = ReactDOM.createRoot(
  document.getElementById('root')
);

function withMouseTracker(OldComponent) {
  return (
    class MouseTracker extends React.Component {
      constructor(props) {
        super(props);
        this.state = { x: 0, y: 0 };
      }
      handleMouseMove = (event) => {
        this.setState({
          x: event.clientX,
          y: event.clientY
        });
      }
      render() {
        return (
          <div onMouseMove={this.handleMouseMove}>
            <OldComponent {...this.state} />
          </div>
        )
      }
    })
}


function Display(props) {
  return <div>
    <h1>请移动鼠标</h1>
    <p>当前的鼠标位置是{props.x}:{props.y}</p>
  </div>
}
let NewDisplay = withMouseTracker(Display)
DOMRoot.render(<NewDisplay />);
// HOC也就是高阶组件和render props是可以相互改写的
