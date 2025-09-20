// import React, { useState, useMemo, useCallback } from 'react';
// import ReactDOM from 'react-dom/client';

import React, { useState } from '../react/react';
import ReactDOM from '../react/react-dom/client';


function App() {
  const [number, setNumber] = useState(0);
  const handleClick = () => setNumber(state => state + 1)

  const [number2, setNumber2] = useState(0);
  const handleClick2 = () => setNumber2(state => state + 1)

  return (
    <div>
      <p>{number}</p>
      <button onClick={handleClick}>+</button>
      <p>{number2}</p>
      <button onClick={handleClick2}>+</button>
    </div>
  )
}

const DOMRoot = ReactDOM.createRoot(
  document.getElementById('root')
);
DOMRoot.render(<App />);
