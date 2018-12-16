import React from "react";
import ReactDOM from "react-dom";
import Board  from "./components/Board.js";
import "./styles.scss";

function App() {
  return (
    <div className="App"> 
      <Board/>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);