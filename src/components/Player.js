import React from "react";
import "./Player.scss"; 

const Player = (props) => { 
    const isActive = () => {
        return parseInt(props.name) === props.activePlayer;
    }
        const cssClass = isActive() ? "player active" : "player";  
        return (
            <div className={cssClass}> 
                <label>Player {+props.name+1}:</label><span> {props.score}</span>
            </div>
        );
}

export default Player;
