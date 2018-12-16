import React, { Component } from "react";
import Card from "./Card";
import Player from "./Player";
import { API_URL, X_CLIENT_ID, MAX_ITEMS, ANIMATION_DELAY } from "../constants";
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
      score: []
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
        //currentScore[this.state.activePlayer] = currentScore[this.state.activePlayer] + 1;
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
    if(this.state.activePlayer === 0){
      return 1;
    } else return 0;
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
    const score0 = this.state.score[0] ? this.state.score[0].score : 0;
    const score1 = this.state.score[1] ? this.state.score[1].score : 0;
    const activePlayer = this.state.activePlayer;
    players.push(<Player key="0" name="0" activePlayer={activePlayer} score={score0}/>);
    players.push(<Player key="1" name="1" activePlayer={activePlayer} score={score1}/>);
    const boardContent = (matchedCardsNames.length === cards.length / 2) ? this.getWinner(activePlayer) : newCards;
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
