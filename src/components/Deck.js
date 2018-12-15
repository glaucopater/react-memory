import React, { Component } from "react";
import "./Deck.css";
import Card from "./Card";
import { API_URL, X_CLIENT_ID } from "../constants";

export default class Deck extends Component {
  constructor() {
    super();
    this.state = {
      flippedCards: [],
      matchedCardsNames: [],
      reset: false,
      cards: []
    };
    this.flipCard = this.flipCard.bind(this);
  }

  flipCard = card => {
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
        matchedCardsNames.push(flippedCards[0].name);
        flippedCards = [];
      }
      else if (flippedCards.length > 1) {  
        this.delayedReset();
      }
    }
    this.setState({
      flippedCards: flippedCards,
      reset: reset,
      matchedCardsNames: matchedCardsNames
    });
  };

  delayedReset() { 
      setTimeout(
        () => { this.setState({flippedCards: [], reset: true});}, 600
    );
  }

 
  fetchData(){
      const url =  API_URL;
      return fetch(url, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin 
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json; charset=utf-8", 
            "X-Client-Id" : X_CLIENT_ID
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
    })
    .then(response => response.json()
    .then(json => {
      const cards = json.photos.items.slice(0,6).filter( elem => elem.id );
      this.setState({cards}); 
    }));  
  }

  randomizeBoard(){ 
    const newCards =  this.state.cards.reduce(function (res, current, index, array) { 
        let { id, file_id , thumbUrl } = current;
        const uniqueIndex = id + "-" + index; 
        const uniqueIndex2 = id + "-" + (index+1);
        return res.concat([ {index : uniqueIndex, id, name : id, file_id , thumbUrl }, {index: uniqueIndex2,name : id,  id, file_id , thumbUrl}]);
    }, []);
  
    return newCards;
  }

  render() {
    let flippedCards = this.state.flippedCards;
    let matchedCardsNames = this.state.matchedCardsNames;
    //a deck is a list of cards
    const cards = this.randomizeBoard();
    let newCards = cards.map(card => {
      return (
        <Card
          key={card.index}
          id={card.id}
          name={card.name}
          thumbUrl={card.thumbUrl}
          flippedCards={flippedCards}
          matchedCardsNames={matchedCardsNames}
          flipCard={this.flipCard}
          reset={this.state.reset}
        />
      );
    });
    if(matchedCardsNames.length === cards.length / 2){
      this.fetchData();
      return <div className="deck">You win</div> 
    }
    else{
      return <div className="deck">{newCards}</div>;
    }
      
  }
}
