
// import React, { useReducer } from 'react';
// import ReactDOM from 'react-dom/client';

import React, { useReducer, useContext } from '../react/react';
import ReactDOM from '../react/react-dom/client';


const CounterContext = React.createContext()

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
  const { state, dispatch } = useContext(CounterContext)
  return (
    <div>
      <p>{state.number}</p>
      <button onClick={() => dispatch({ type: "ADD" })}>+</button>
      <button onClick={() => dispatch({ type: "MINUS" })}>-</button>
    </div>
  )
}


function App() {
  const [state, dispatch] = useReducer(reducer, { number: 100 });
  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      <Counter />
    </CounterContext.Provider>
  )
}

const DOMRoot = ReactDOM.createRoot(
  document.getElementById('root')
);

DOMRoot.render(<App />);
