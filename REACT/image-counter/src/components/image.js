import React, { useState } from "react";
import { Image } from "antd";
import Counter from "./counter";
const ImageBuilder = (props) => {
  const { url, totalCounter } = props;

  return (
    <>
      <Image preview={{ visible: false }} width={200} src={url.url}></Image>
      <Counter totalCounter={totalCounter}></Counter>
    </>
  );
};

export default ImageBuilder;
