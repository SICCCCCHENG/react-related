
// import React from 'react';
// import ReactDOM from 'react-dom/client';

import React from '../react/react';
import ReactDOM from '../react/react-dom/client';

const DOMRoot = ReactDOM.createRoot(
  document.getElementById('root')
);
class ScrollList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { messages: [] };
    this.wrapper = React.createRef();
  }
  addMessage = () => {
    this.setState(state => ({
      messages: [`${state.messages.length}`, ...state.messages]
    }));
  }
  componentDidMount() {
    this.timerID = window.setInterval(() => {
      this.addMessage();
    }, 1000);
  }
  //在更新前获取真实DOM的快照
  getSnapshotBeforeUpdate() {
    return {
      prevScrollTop: this.wrapper.current.scrollTop,//DOM更新前向上卷去的高度
      prevScrollHeight: this.wrapper.current.scrollHeight//在DOM更新内容的高度
    }
  }
  componentDidUpdate(prevProps, prevState, { prevScrollTop, prevScrollHeight }) {
    //修正向上卷去的高度
    this.wrapper.current.scrollTop = prevScrollTop + (this.wrapper.current.scrollHeight - prevScrollHeight)
  }
  render() {
    let style = {
      height: '100px',
      width: '200px',
      border: '1px solid red',
      overflow: 'auto'
    };
    return (
      <div style={style} ref={this.wrapper}>
        {
          this.state.messages.map((message, index) => (
            <div key={index}>{message}</div>
          ))
        }
      </div>
    )
  }
}
let element = <ScrollList />
DOMRoot.render(element);
