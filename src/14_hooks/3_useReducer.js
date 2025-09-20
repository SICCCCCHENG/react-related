
// import React, { useReducer } from 'react';
// import ReactDOM from 'react-dom/client';

import React, { useReducer } from '../react/react';
import ReactDOM from '../react/react-dom/client';


function reducer(state = { number: 0 }, action) {//{type:'ADD'}
  switch (action.type) {
    case 'ADD':
      return { number: state.number + 1 };
    case 'MINUS':
      return { number: state.number - 1 };
    default:
      return state;
  }
}
function Counter() {
  //useState和useReducer都用来定义一个状态，并可以修改状态
  //修改方法不太一样，useState更新的时候直接传入新状态，useReducer需要通过reducer计算新的状态
  const [state, dispatch] = useReducer(reducer, { number: 100 });
  return (
    <div>
      <p>{state.number}</p>
      <button onClick={() => dispatch({ type: "ADD" })}>+</button>
      <button onClick={() => dispatch({ type: "MINUS" })}>-</button>
    </div>
  )
}

const DOMRoot = ReactDOM.createRoot(
  document.getElementById('root')
);

DOMRoot.render(<Counter />);
