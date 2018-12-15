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
    if (this.props.reset !== prevProps.reset && this.props.reset) {
      this.setState({ flipped: !this.props.reset });
    }
  }

  isAlreadyMAtched(cardName){
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
    if(!this.state.flipped && !this.isAlreadyMAtched(name)){ 
      this.props.flipCard({ id, name });
    }
  };

  render() {
    let id = this.props.id;
    let name = this.props.name;
    let cssClass = this.state.flipped ? "card flipped" : "card";
    if(this.isAlreadyMAtched(name)) {
      cssClass += " alreadyMatched flipped";
    }
    return (
      <div className={cssClass} onClick={this.handleOnClick}>
        Card {id} : {name}
      </div>
    );
  }
}
