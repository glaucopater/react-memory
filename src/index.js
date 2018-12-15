import React from "react";
import ReactDOM from "react-dom";
import Deck  from "./components/Deck.js";
import "./styles.css";

function App() {
  return (
    <div className="App"> 
      <Deck/>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
