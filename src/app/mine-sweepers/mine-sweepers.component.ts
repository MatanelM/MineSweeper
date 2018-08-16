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
  private blocks_open = 0;
  private game_level = new GameLevel();
  private grid = new Grid(this.game_level);

  private level: string = this.game_level._level.toString();
  private flags: Flags = new Flags(this.game_level);

  private message = {
    title : "",
    content : ""
  }

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
  setFlag(block){
    this.flags.FlagUsed();
    block.state = state.flagged;
  }
  returnFlag( block : Block ){
    this.flags.FlagReturned();
    block.state = state.question;
  }
  FlagUsed(event,block) {
     if (event.button == 2) {
      if (this.flags.amount == 0) {
        alert("no more flags");
        return;
      }
      switch (block.state){
        case state.flagged : this.returnFlag(block);return;
        case state.question : block.state = state.unset;return;
        case state.open : return;
        case state.unset : this.setFlag(block);
      }
    }
  }

  private game_over = false;
  private pop_up_message = this.game_over;

  WonGame(){
    this.message.title = "Congratulations!";
    this.message.content = "You Won!";
    this.game_over = true;
    this.pop_up_message = this.game_over;
  }

  lostGame(){
    this.message.title = "Game Over";
    this.message.content = "You stepped on a mine!";
    
    this.game_over = true;
    this.pop_up_message = this.game_over;

    this.revealAllMines();
  }
  revealAllMines(){
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
        this.openBlock(this.grid.locations[i][j]);
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

  openBlock(block : Block){
    block.clicked();
    this.blocks_open++;

    if(this.blocks_open === 54)this.WonGame();
    //complete higher level check

  }
  clicked(ev, block) {
    //first check - the user did not flag this block as a potential mined block, and this block is still active
    if ( block.state == state.unset && !this.game_over) {
      
      this.openBlock(block);
      if ( block.isMined ){
        ev.target.style.backgroundColor = 'red';
        this.lostGame();  
      }else if(block.nearbyMines == 0){
        this.revealBlocksNear(block);
      }

    }  
  }

  closeMessageButton(){
    this.pop_up_message = false;
  }
  startNewGame(num){
    this.closeMessageButton();
    this.game_over = false;
    this.game_level._level = num;
    this.blocks_open = 0;
    this.flags = new Flags(this.game_level);
    this.grid = new Grid(new GameLevel());
  }

}
