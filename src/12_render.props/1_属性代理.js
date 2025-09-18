
// import React from 'react';
// import ReactDOM from 'react-dom/client';

import React from '../react/react';
import ReactDOM from '../react/react-dom/client';

function withLoading(OldComponent) {
  return class extends React.Component {
    render() {
      const state = {
        show: () => console.log('show'),
        hide: () => console.log('hide')
      }
      return <OldComponent {...this.props} {...state} />
    }
  }
}

class Hello extends React.Component {
  render() {
    return (
      <div>
        <p>hello</p>
        <button onClick={this.props.show}>show</button>
        <button onClick={this.props.hide}>hide</button>
      </div>
    )
  }
}

const NewHello = withLoading(Hello)
let element = <NewHello />
const DOMRoot = ReactDOM.createRoot(
  document.getElementById('root')
);
DOMRoot.render(element);
