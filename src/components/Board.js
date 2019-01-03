import React, { Component } from "react";
import Card from "./Card";
import Player from "./Player";
import { API_URL, X_CLIENT_ID, MAX_ITEMS, ANIMATION_DELAY, MAX_PLAYERS } from "../constants";
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
      activePlayer: 0,
      round: 1,
      score: [],
      players: []
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
    const currentScore = this.state.score;

    if (flippedCards.length === 2) {
      flippedCards = [];
      reset = true;
      //active player score ++
    } else {
      reset = false;
      flippedCards.push(card);
      if (flippedCards.length > 1 && flippedCards[0].name === flippedCards[1].name) { 
        matchedCardsNames.push(flippedCards[0].name);
        flippedCards = [];
        for(let i=0;i<currentScore.length;i++){
          if(currentScore[this.state.activePlayer].name === currentScore[i].name){
            currentScore[i].score = currentScore[i].score + 1;
          }
        }
      }
      else if (flippedCards.length > 1) {  
        this.delayedReset();
      }
    }
    this.setState({
      flippedCards: flippedCards,
      reset: reset,
      matchedCardsNames: matchedCardsNames,
      round,
      score: currentScore
    });
  };

  getNextPlayer(){
    if (this.state.activePlayer === MAX_PLAYERS - 1){
      return 0;
    } else {
      return this.state.activePlayer + 1 ;
    }
  }

  delayedReset() { 
      setTimeout(() => { 
        this.setState({
          flippedCards: [], 
          reset: true, 
          round: this.state.round + 1,
          activePlayer: this.getNextPlayer()
        });}, ANIMATION_DELAY);
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
      //add player score logic
      const score = [{name:"1",score:0},{name:"2",score:0}];
      
      this.setState({cards,score}); 
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

  getWinner(winner){
    return <div className="winning"><label>Player </label>{+winner + 1} wins!</div>
  }

  getBoardContent(matchedCardsNames,cards,newCards,activePlayer){
    const content = (matchedCardsNames.length === cards.length / 2) ? this.getWinner(activePlayer) : newCards;
    return content;
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
    const round = this.getRound(); 
    const activePlayer = this.state.activePlayer;
    const players = (Array.from(Array(MAX_PLAYERS).keys())).map((player, i)=>{
      const score = this.state.score[i] ? this.state.score[i].score : 0;
      return (
      <Player 
      key={i} 
      name={player} 
      activePlayer={activePlayer} 
      score={score}/>)});
    const boardContent = this.getBoardContent(matchedCardsNames,cards,newCards,activePlayer);
    return (
    <div className="board-container">
      <div className="game-info">{round}{players}</div>
      <div className="board">
        {boardContent}
      </div>
    </div>
    );
  }
}
