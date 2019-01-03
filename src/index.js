import React from "react";
import ReactDOM from "react-dom";
import { TITLE }  from "./constants";
import Board  from "./components/Board.js";
import "./styles.scss";

function App() {
  return (
    <div className="App">
    <h3>{TITLE}</h3>
      <Board/>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);