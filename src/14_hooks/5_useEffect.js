
// import React, { useState, useEffect } from 'react';
// import ReactDOM from 'react-dom/client';

import React, { useState, useEffect } from '../react/react';
import ReactDOM from '../react/react-dom/client';

function Counter() {
  const [number, setNumber] = useState(0)
  useEffect(() => {
    console.log('开启 setInterval');
    const timer = setInterval(() => {
      console.log('tick');
      setNumber(number => number + 1)
    }, 1000)
    // effect 函数执行后,会返回一个销毁函数, 此销毁函数会在下次effect函数执行之前执行
    return () => {
      console.log('销毁 setInterval');
      clearInterval(timer)
    }
  })
  return (
    <div>{number}</div>
  )
}

const DOMRoot = ReactDOM.createRoot(
  document.getElementById('root')
);

DOMRoot.render(<Counter />);
