import { state } from './../common/State';
import { Location } from './../common/Location';


import { Block } from './../common/Block';
import { Flags } from './../common/Flags';
import { GameLevel } from './../common/GameLevel';
import { Component, OnInit } from '@angular/core';
import { Level } from '../common/Levels';
import { EventEmitter } from 'events';
import { Grid } from '../common/Grid';

@Component({
  selector: 'app-mine-sweepers',
  templateUrl: './mine-sweepers.component.html',
  styleUrls: ['./mine-sweepers.component.css']
})
export class MineSweepersComponent implements OnInit {

  public block_state = state;
  private imgs = {
    flag: "https://i.imgur.com/vnZ0mIf.png",
    question: "https://i.imgur.com/Kypt2fJ.png",
    mine: "https://i.imgur.com/T0Kwk2T.png"
  }

  private game_level = new GameLevel();
  private grid = new Grid(this.game_level);

  private level: string = this.game_level._level.toString();
  private flags: Flags = new Flags(this.game_level);

  constructor() {
    switch (this.level) {
      case '0': this.level = 'Easy';break;
      case '1': this.level = 'Medium';break;
      case '2': this.level = 'Hard';break;
    }
  }

  ngOnInit() {
    document.oncontextmenu = () => { return false };
  }

  FlagUsed(event,block) {
    //check for the activity of this block
    if (block.state == state.open) {
      return;
    }

    if (event.button == 2) {
      //If statements for "flagged" and "question"
      if (block.state == state.flagged) {
        this.flags.FlagReturned();
        block.state = state.question;
        event.target.setAttribute("class", "block question")
        return;
      }
      if (block.state == state.question) {
        block.state = state.unset;
        event.target.setAttribute("class", "block");
        return;
      }
      if (this.flags.amount == 0) {
        //return a message to the user if he had no flags left
        alert("no more flags");
        return;
      }
      this.flags.FlagUsed();
      block.state = state.flagged;
      event.target.setAttribute("class", "flagged");
    }
  }

  private game_over = false;
  private game_over_message = this.game_over;
  lostGame(){

    this.game_over = true;
    this.game_over_message = this.game_over;

    //reveal all mines
    for (let i = 0; i < this.grid.locations.length ; i++) {
      for (let j = 0; j <  this.grid.locations.length; j++) {
        if(this.grid.locations[i][j].isMined && 
          (this.grid.locations[i][j].state != state.flagged && this.grid.locations[i][j].state != state.question)){
          this.grid.locations[i][j].clicked();
        }
      }
    }
  }

  revealBlocksNear(block : Block){

    let arr = [];

    for (let i = block.horizontal - 1 ; i <= block.horizontal + 1 ; i++) {
      for (let j = block.vertical - 1 ; j <=  block.vertical + 1 ; j++) {
        if(!this.grid.checkValidCoords(i,j)) continue;
        if(block.horizontal == i && block.vertical == j) continue; 
        if(this.revealValid(i,j)) continue;        
        this.grid.locations[i][j].clicked();
        if(this.grid.locations[i][j].nearbyMines == 0 ) arr.push(this.grid.locations[i][j]);
      }
    }
    
    for (let i = 0; i < arr.length; i++) {
      this.revealBlocksNear(arr[i])      
    }

  }

  revealValid(i,j){
    return  this.grid.locations[i][j].state == state.flagged
      || this.grid.locations[i][j].state == state.question
      || this.grid.locations[i][j].state == state.open;
  }
  clicked(ev, block) {

    //first check - the user did not flag this block as a potential mined block, and this block is still active
    if ( block.state == state.unset && !this.game_over) {
  
      block.clicked();
      if ( block.isMined ){
        ev.target.style.backgroundColor = 'red';
        this.lostGame();  
      }else if(block.nearbyMines == 0){
        this.revealBlocksNear(block);
      }
    }  
  }

  closeMessageButton(){
    this.game_over_message = false;
  }
  startNewGame(num){
    this.closeMessageButton();
    this.game_over = false;
    this.game_level._level = num;
    this.flags = new Flags(this.game_level);
    this.grid = new Grid(new GameLevel());
  }

}
