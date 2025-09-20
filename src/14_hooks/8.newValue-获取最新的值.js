
// import React, { useState, useEffect, useRef } from 'react';
// import ReactDOM from 'react-dom/client';

import React, { useState, useEffect, useRef } from '../react/react';
import ReactDOM from '../react/react-dom/client';

//如何获取最新的值
function Counter() {
  const [number, setNumber] = useState(0);
  const numberRef = useRef(number);
  const handleClick = () => {
    const nextNumber = number + 1;
    setNumber(nextNumber);
    numberRef.current = nextNumber;
    //如何在更新的后获取最新的值
  }
  setTimeout(() => {
    console.log('numberRef.current', numberRef.current);
  }, 1000)
  //它会在浏览器渲染之后执行
  useEffect(() => {
    console.log(number);
  });
  return (
    <div>
      <p>{number}</p>
      <button onClick={handleClick}>+</button>
    </div>
  )
}

const DOMRoot = ReactDOM.createRoot(
  document.getElementById('root')
);
DOMRoot.render(<Counter />);
