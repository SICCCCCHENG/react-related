// import React, { useState, useMemo, useCallback } from 'react';
// import ReactDOM from 'react-dom/client';

import React, { useState, useMemo, useCallback } from '../react/react';
import ReactDOM from '../react/react-dom/client';

let Child = ({ data, handleClick }) => {
  console.log('Child render');
  return <button onClick={handleClick}>{data.number}</button>
}

const MemoChild = React.memo(Child);

function App() {
  console.log('App render');
  const [name, setName] = useState('zhufeng');
  const [number, setNumber] = useState(0);
  //如果依赖数组变化了会重新计算新的memo值，否则 会复用上次的memo对象
  let data = useMemo(() => ({ number }), [number]);
  //如果依赖数组变化了会使用新的callback，否则 会复用上次的callback
  let handleClick = useCallback(() => setNumber(number + 1), [number]);
  return (
    <div>
      {/* input onchange 输入框失焦后触发 */}
      <input type="text" value={name} onChange={event => setName(event.target.value)} />
      <MemoChild data={data} handleClick={handleClick} />
    </div>
  )
}

const DOMRoot = ReactDOM.createRoot(
  document.getElementById('root')
);
DOMRoot.render(<App />);
