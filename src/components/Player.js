import React, { Component } from "react";
import "./Player.scss"; 
export default class Card extends Component {
    constructor() {
        super();
        this.state = {
            score: 0,
            name: ""
        };
    }


    componentDidUpdate(prevProps) {
        if (this.props.reset !== prevProps.reset && this.props.reset) { 
          this.setState({score: this.state.score + 1})
        }
      }

    isActive(){
        return parseInt(this.props.name) === this.props.activePlayer;
    }

    render() { 
        const cssClass = this.isActive() ? "player active" : "player"; 

        console.log(this.props);
        return (
            <div className={cssClass}> 
                <label>Player {this.props.name}:</label><span> {this.state.score}</span>
            </div>
        );
    }
}
