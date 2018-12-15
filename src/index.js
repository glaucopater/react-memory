import React from "react";
import ReactDOM from "react-dom";
import Board  from "./components/Board.js";
import "./styles.css";

function App() {
  return (
    <div className="App"> 
      <Board/>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);