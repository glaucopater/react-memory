import React, { Component } from "react";
import Card from "./Card";
import Player from "./Player";
import { API_URL, X_CLIENT_ID, MAX_ITEMS, DELAY } from "../constants";
import { shuffle } from "../util";
 
import "./Board.scss"; 

export default class Board extends Component {
  constructor() {
    super();
    this.state = {
      flippedCards: [],
      matchedCardsNames: [],
      reset: false, 
      cards: [],
      activePlayer: 1,
      round: 1
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
    let round = this.state.round;

    if (flippedCards.length === 2) {
      flippedCards = [];
      reset = true;
      //active player score ++

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
      matchedCardsNames: matchedCardsNames,
      round
    });
  };

  getNextPlayer(){
    if(this.state.activePlayer === 1){
      return 2;
    } else return 1;
  }

  delayedReset() { 
      setTimeout(() => { 
        this.setState({
          flippedCards: [], 
          reset: true, 
          round: this.state.round + 1,
          activePlayer: this.getNextPlayer()
        });}, DELAY);
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
      const activePlayer = 1;
      this.setState({cards,activePlayer}); 
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

  getRound(){
    return <div className="round"><label>Round:</label> {this.state.round}</div>
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

    let players = [];
    const round = this.getRound(); 
    console.log(this.state.reset);
    players.push(<Player key="1" name="1" activePlayer={this.state.activePlayer} score={this.state.reset}/>);
    players.push(<Player key="2" name="2" activePlayer={this.state.activePlayer} score={this.state.reset}/>);
    const boardContent = (matchedCardsNames.length === cards.length / 2) ? "You win" : newCards;
    return <div className="board">{round}{players}{boardContent}</div>;
  }
}
