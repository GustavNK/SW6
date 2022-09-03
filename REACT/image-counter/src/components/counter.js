import React, { useState } from "react";

const Counter = (props) => {
  const [counter, setCounter] = useState(0);
  const totalCounter = props;

  const clickHandler = () => {
    setCounter(counter + 1);
    totalCounter.totalCounter();
  };

  return <div onClick={clickHandler}>{counter}</div>;
};

export default Counter;
