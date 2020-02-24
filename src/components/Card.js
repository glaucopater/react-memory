import React, { Component } from "react";
import "./Card.scss";
import logo from "../assets/images/logo.png";

export default class Card extends Component {
  constructor() {
    super();
    this.state = {
      flipped: false,
      alreadyMatched: false
    };
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.reset !== prevProps.reset && this.props.reset) {
      this.setState({ flipped: !this.props.reset });
    }
  }

  isAlreadyMAtched(cardName) {
    for (let i = 0; i < this.props.matchedCardsNames.length; i++) {
      if (this.props.matchedCardsNames[i] === cardName) {
        return true;
      }
    }
  }

  handleOnClick = event => {
    if (!this.state.flipped && !this.state.alreadyMatched) {
      this.setState({ flipped: !this.state.flipped });
    }
    let id = this.props.id;
    let name = this.props.name;
    if (!this.state.flipped && !this.isAlreadyMAtched(name)) {
      this.props.flipCard({ id, name });
    }
  };

  render() {
    let name = this.props.name;
    let thumbUrl = this.props.thumbUrl;
    let cssClass = this.state.flipped ? "inside picked" : "inside";
    if (this.isAlreadyMAtched(name)) {
      cssClass += " matched";
    }

    console.log("TCL: Card -> render -> this.props", this.state.flipped);
    return (
      <div className="card" onClick={this.handleOnClick}>
        <div className={cssClass}>
          <div className="front">
            <img src={thumbUrl} alt={name} />
          </div>
          <div className="back">
            <img src={logo} alt="logo" />
          </div>
        </div>
      </div>
    );
  }
}
