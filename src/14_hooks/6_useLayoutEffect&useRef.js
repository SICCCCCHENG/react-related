
// import React, { useRef, useEffect, useLayoutEffect } from 'react';
// import ReactDOM from 'react-dom/client';

import React, { useRef, useEffect } from '../react/react';
import ReactDOM from '../react/react-dom/client';

function Animation() {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.style.transform = `translate(500px)`;
    ref.current.style.transition = `all 500ms`;
  }, []);
  const styleObj = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: 'red'
  }
  return (
    <div style={styleObj} ref={ref}></div>
  )
}

const DOMRoot = ReactDOM.createRoot(
  document.getElementById('root')
);
DOMRoot.render(<Animation />);
