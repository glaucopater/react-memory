import React, { Component } from "react";
import "./Deck.css";
import Card from "./Card";

export default class Deck extends Component {
  constructor() {
    super();
    this.state = {
      flippedCards: [],
      matchedCardsNames: [],
      reset: false
    };
    this.flipCard = this.flipCard.bind(this);
  }

  flipCard = card => {
    console.log("deck flipcard", card, this.state.flippedCards);
    let flippedCards = this.state.flippedCards;
    let matchedCardsNames = this.state.matchedCardsNames;
    let reset = this.state.reset;

    if (flippedCards.length === 2) {
      flippedCards = [];
      reset = true;
    } else {
      reset = false;
      flippedCards.push(card);
      if (
        flippedCards.length > 1 &&
        flippedCards[0].name === flippedCards[1].name
      ) {
        console.log("flippedCards check ", flippedCards, card.name);
        matchedCardsNames.push(flippedCards[0].name);
        flippedCards = [];
      }
    }
    this.setState({
      flippedCards: flippedCards,
      reset: reset,
      matchedCardsNames: matchedCardsNames
    });
  };

  render() {
    let flippedCards = this.state.flippedCards;
    let matchedCardsNames = this.state.matchedCardsNames;

    //a deck is a list of cards
    let cards = [
      { id: 1, name: 1 },
      { id: 2, name: 1 },
      { id: 3, name: 2 },
      { id: 4, name: 2 },
      { id: 5, name: 3 },
      { id: 6, name: 3 }
    ].map(card => {
      return (
        <Card
          key={card.id}
          id={card.id}
          name={card.name}
          flippedCards={flippedCards}
          matchedCardsNames={matchedCardsNames}
          flipCard={this.flipCard}
          reset={this.state.reset}
        />
      );
    });
    if(matchedCardsNames.length === cards.length / 2){
      return <div className="deck">You win</div> 
    }
    else
      return <div className="deck">{cards}</div>;
  }
}
