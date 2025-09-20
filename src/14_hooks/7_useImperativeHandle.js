
// import React, { useState, useRef, useImperativeHandle } from 'react';
// import ReactDOM from 'react-dom/client';

import React, { useState, useRef, useImperativeHandle } from '../react/react';
import ReactDOM from '../react/react-dom/client';


function Child(props, forwardRef) {
  const inputRef = useRef(null);
  useImperativeHandle(forwardRef, () => ({
    myFocus() {
      inputRef.current.focus();
    }
  }));
  return <input type="text" ref={inputRef} />
}

const ForwardChild = React.forwardRef(Child);
function Parent() {
  const [number, setNumber] = useState(0);
  const inputRef = useRef(null);
  const getFocus = () => {
    inputRef.current.myFocus();
    // inputRef.current.remove();
  }
  return (
    <div>
      <ForwardChild ref={inputRef} />
      <button onClick={getFocus}>获得焦点</button>
      <p>{number}</p>
      <button onClick={() => {
        setNumber(number + 1)
      }}>+</button>
    </div>
  )
}

const DOMRoot = ReactDOM.createRoot(
  document.getElementById('root')
);
DOMRoot.render(<Parent />);
