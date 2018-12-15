import React, { Component } from "react";
import "./Player.css";

export default class Card extends Component {
    constructor() {
        super();
        this.state = {
            score: 0,
            name: ""
        };
    }

    render() { 
        return (
            <div className="player" > 
                Player {this.state.name} : {this.state.score}
            </div>
        );
    }
}
