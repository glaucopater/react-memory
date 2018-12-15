import React, { Component } from "react";
import "./Deck.css";
import Card from "./Card";
import { API_URL, X_CLIENT_ID, MAX_ITEMS, DELAY } from "../constants";

export default class Deck extends Component {
  constructor() {
    super();
    this.state = {
      flippedCards: [],
      matchedCardsNames: [],
      reset: false,
      items: [],
      cards: []
    };
    this.flipCard = this.flipCard.bind(this);
  }

  componentDidMount(){
    this.fetchData();
    
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
      setTimeout(() => { this.setState({flippedCards: [], reset: true});}, DELAY);
  }

  fetchData() {
      return fetch(API_URL, {
        method: "GET",  
        mode: "cors",
        credentials: "same-origin",  
        headers: {
            "Content-Type": "application/json; charset=utf-8", 
            "X-Client-Id" : X_CLIENT_ID
        }
    })
    .then(response => response.json()
    .then(json => {
      const items = json.photos.items.slice(0,MAX_ITEMS).filter( elem => elem.id );
      const cards = this.shuffle(this.randomizeBoard(items));
      this.setState({cards}); 
    }));  
  }

  //Fisher–Yates algorithm
  shuffle(array) {
    let m = array.length, t, i;
    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
       i = Math.floor(Math.random() * m--);
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  }

  randomizeBoard(cards){ 
    const newCards =  cards.reduce(function (res, current, index, array) { 
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
    const cards = this.state.cards;
    let newCards = cards.map(card => {
      return (
        <Card
          key={card.index}
          {...card} 
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
    else{
      return <div className="deck">{newCards}</div>;
    }
  }
}
