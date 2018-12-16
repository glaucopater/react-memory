import React, { Component } from "react";
import Card from "./Card";
import { API_URL, X_CLIENT_ID, MAX_ITEMS, DELAY } from "../constants";
import { shuffle } from "../util";


export default class Board extends Component {
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
      const cards = shuffle(this.randomizeBoard(items));
      this.setState({cards}); 
    }));  
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

    const boardContent = (matchedCardsNames.length === cards.length / 2) ? "You win" : newCards;
    return <div className="board">{boardContent}</div>;
    
  }
}
