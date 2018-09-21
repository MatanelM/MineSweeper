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

  private blocks_open : number = 0;
  private blocks_to_win : number = 54;
  public game_level = new GameLevel(Level.Easy);
  private grid = new Grid(this.game_level);
  public blocks : Block[] = [];
  public flags: Flags = new Flags(this.game_level);

  private message = {
    title : "",
    content : ""
  }
  private imgs = {
    flag: "https://i.imgur.com/vnZ0mIf.png",
    question: "https://i.imgur.com/Kypt2fJ.png",
    mine: "https://i.imgur.com/T0Kwk2T.png"
  }
  private game_over = false;
  public pop_up_message = this.game_over;

  constructor() {
    this.copyAllBlocksInArray();
  }

  copyAllBlocksInArray(){
    this.blocks = [];
    for (let i = 0; i < this.grid.locations.length; i++) {
      for (let j = 0; j < this.grid.locations.length; j++) {
        this.blocks[this.blocks.length] = this.grid.locations[i][j];
      }
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

  rightClickCheck(event, block){
    if(event.button == 2){
      this.flagUsed(block)
    }
  }

  flagUsed(block) {
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

  winCheck(){
    return this.blocks_open === this.blocks_to_win
  }

  openBlock(block : Block){
    block.clicked();
    this.blocks_open++;
    if(this.winCheck())this.WonGame();
  }

  setBackgroundRed(block){
    let id = block.numsToId([block.horizontal, block.vertical])
    document.getElementById(id).style.backgroundColor = 'red'
  }

  clicked(block) {
    if ( block.state == state.unset && !this.game_over) {
      this.openBlock(block);
      if ( block.isMined ){
        this.setBackgroundRed(block);
        this.lostGame();
      }else if(block.nearbyMines == 0){
        this.revealBlocksNear(block);
      }
    }  
  }
  closeMessageButton(){
    this.pop_up_message = false;
  }
  startNewGame(){
    this.closeMessageButton();
    this.game_over = false;
    this.blocks_open = 0;
    this.flags = new Flags(this.game_level);
    this.grid = new Grid(this.game_level);
    this.copyAllBlocksInArray();

  }
  setNewLevel(num){
    switch(num){
      case 0 : this.game_level.level = Level.Easy;this.blocks_to_win=54;break;
      case 1 : this.game_level.level = Level.Medium;this.blocks_to_win=124;break;
      case 2 : this.game_level.level = Level.Hard;this.blocks_to_win=391;break;
    }
    this.startNewGame();
  }
}
