import logo from "./logo.svg";
import React, { useState } from "react";
import "./App.css";
import Image from "./components/image";
const data = [
  {
    url: "https://api.ferrari.com/cms/network/medias//resize/6093c2680abef6224c06a042-ferrari-magazine-oGehKAJD4w.jpg?apikey=9QscUiwr5n0NhOuQb463QEKghPrVlpaF",
  },
  {
    url: "https://s3-prod-europe.autonews.com/s3fs-public/styles/1200x630/public/Lamborghini%20Huracan%20STO%20web.jpg",
  },
];

function App() {
  const [count, setCounter] = useState(0);

  function totalCounter() {
    setCounter(count + 1);
  }

  return (
    <div className="App">
      <h1>Total count: {count}</h1>
      {data.map((val) => (
        <Image url={val} totalCounter={totalCounter}></Image>
      ))}
    </div>
  );
}

export default App;

//
