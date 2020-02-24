import React, { useState, useEffect } from "react";
import Card from "./Card";
import Player from "./Player";
import {
  API_URL,
  X_CLIENT_ID,
  MAX_ITEMS,
  ANIMATION_DELAY,
  MAX_PLAYERS
} from "../constants";
import { shuffle } from "../util";
import "./Board.scss";

const Board = () => {
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCardsNames, setMatchedCardsNames] = useState([]);
  const [reset, setReset] = useState(false);
  const [cards, setCards] = useState([]);
  const [activePlayer, setActivePlayer] = useState(0);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      return await fetch(API_URL, {
        method: "GET",
        mode: "cors",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "X-Client-Id": X_CLIENT_ID
        }
      }).then(response =>
        response.json().then(json => {
          const items = json.photos.items
            .slice(0, MAX_ITEMS)
            .filter(elem => elem.id);
          const cards = shuffle(randomizeBoard(items));
          //add player score logic
          const score = [
            { name: "1", score: 0 },
            { name: "2", score: 0 }
          ];

          setCards(cards);
          setScore(score);
        })
      );
    };
    fetchData();
  }, []);

  const flipCard = card => {
    const currentScore = score;
    let newReset = reset;
    let newFlipperCards = flippedCards;

    if (flippedCards.length === 2) {
      newFlipperCards = [];
      newReset = true;
      //active player score ++
    } else {
      newReset = false;
      newFlipperCards.push(card);
      if (
        newFlipperCards.length > 1 &&
        newFlipperCards[0].name === newFlipperCards[1].name
      ) {
        matchedCardsNames.push(newFlipperCards[0].name);
        newFlipperCards = [];
        for (let i = 0; i < currentScore.length; i++) {
          if (currentScore[activePlayer].name === currentScore[i].name) {
            currentScore[i].score = currentScore[i].score + 1;
          }
        }
      } else if (newFlipperCards.length > 1) {
        delayedReset();
      }
    }

    setFlippedCards(newFlipperCards);
    setReset(newReset);
    setMatchedCardsNames(matchedCardsNames);
    setRound(round);
    setScore(currentScore);
  };

  const getNextPlayer = () => {
    if (activePlayer === MAX_PLAYERS - 1) {
      return 0;
    } else {
      return activePlayer + 1;
    }
  };

  const delayedReset = () => {
    setTimeout(() => {
      setFlippedCards([]);
      setReset(true);
      setRound(round + 1);
      setActivePlayer(getNextPlayer());
    }, ANIMATION_DELAY);
  };

  const randomizeBoard = cards => {
    const newCards = cards.reduce(function(res, current, index, array) {
      let { id, file_id, thumbUrl } = current;
      const uniqueIndex = id + "-" + index;
      const uniqueIndex2 = id + "-" + (index + 1);
      return res.concat([
        { index: uniqueIndex, id, name: id, file_id, thumbUrl },
        { index: uniqueIndex2, name: id, id, file_id, thumbUrl }
      ]);
    }, []);
    return newCards;
  };

  const getRound = () => {
    return (
      <div className="round">
        <label>Round:</label> {round}
      </div>
    );
  };

  const getWinner = winner => {
    return (
      <div className="winning">
        <label>Player </label>
        {+winner + 1} wins!
      </div>
    );
  };

  const getBoardContent = (
    matchedCardsNames,
    cards,
    newCards,
    activePlayer
  ) => {
    const content =
      matchedCardsNames.length === cards.length / 2
        ? getWinner(activePlayer)
        : newCards;
    return content;
  };

  let newCards = cards.map(card => {
    return (
      <Card
        key={card.index}
        flippedCards={flippedCards}
        matchedCardsNames={matchedCardsNames}
        flipCard={flipCard}
        reset={reset}
        {...card}
      />
    );
  });
  const _round = getRound();

  const _players = Array.from(Array(MAX_PLAYERS).keys()).map((player, i) => {
    const _score = score[i] ? score[i].score : 0;
    return (
      <Player
        key={i}
        name={player}
        activePlayer={activePlayer}
        score={_score}
      />
    );
  });

  const boardContent = getBoardContent(
    matchedCardsNames,
    cards,
    newCards,
    activePlayer
  );

  return (
    <div className="board-container">
      <div className="game-info">
        {_round}
        {_players}
      </div>
      <div className="board">{boardContent}</div>
    </div>
  );
};

export default Board;
