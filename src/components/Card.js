import React, { Component } from "react";
import "./Card.css";

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
    // Typical usage (don't forget to compare props):
    if (this.props.reset !== prevProps.reset && this.props.reset) {
      this.setState({ flipped: !this.props.reset });
    }
  }

  handleOnClick = event => {
    if (!this.state.flipped && !this.state.alreadyMatched) {
      this.setState({ flipped: !this.state.flipped });
    }
    let id = this.props.id;
    let name = this.props.name;

    this.props.flipCard({ id, name });
  };

  render() {
    let id = this.props.id;
    let name = this.props.name;
    console.log(id, name, this.props.matchedCardsNames);
    let cssClass = this.state.flipped ? "card flipped" : "card";
    for (let i = 0; i < this.props.matchedCardsNames.length; i++) {
      if (this.props.matchedCardsNames[i] === name) {
        cssClass += " alreadyMatched flipped";
      }
    }

    return (
      <div className={cssClass} onClick={this.handleOnClick}>
        Card {id} : {name}
      </div>
    );
  }
}
