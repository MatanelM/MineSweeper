import { state } from './../common/State';
import { Location } from './../common/Location';


import { Block } from './../common/Block';
import { Flags } from './../common/Flags';
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
  
  private blocks_open : number = 0;
  private blocks_to_win : number = 54;
  private game_over = false;
  public pop_up_message = this.game_over;
  public block_state = state;
  public flag_clicked = false;
  public level : Level = Level.Easy;
  public grid = new Grid(this.level);
  public flags: Flags = new Flags(this.level);
  
  public message = {
    title : "",
    content : ""
  }
  private imgs = {
    flag: "https://i.imgur.com/vnZ0mIf.png",
    question: "https://i.imgur.com/Kypt2fJ.png",
    mine: "https://i.imgur.com/T0Kwk2T.png"
  }


  constructor() {

  }

  flagButton(){
    this.flag_clicked = this.flag_clicked ? false : true ;
  }
  ngOnInit() {

    const getDivId= function(div){
      return div.id
    }
    /* ---------this set the right click mouse button to set a flag-------- */
    window.addEventListener("contextmenu", e =>{
      e.preventDefault()
    });
    document.querySelector("#field").addEventListener("contextmenu", e => {
      var div =  e.target
      var id = getDivId(div)
      var block = this.grid.getBlockById(id)
      this.flagUsed(block)
      return true;
    })
  }
  setFlag(block){
    this.flags.FlagUsed();
    block.state = state.flagged;
  }
  returnFlag( block : Block ){
    this.flags.FlagReturned();
    block.state = state.question;
  }

  onClick(event, block){
    if( this.flag_clicked ){
      this.flagUsed(block)
      this.flagButton();
      return
    } 
    this.openBlock(block);
    
  }

  flagUsed(block) {
    if ( this.game_over ){
      return 
    }
    if ( this.flags.amount == 0 && block.state == state.unset  ){
      alert( "no more flags" );
      return 
    }
    switch ( block.state ){
      case state.flagged : this.returnFlag(block);return;
      case state.question : block.state = state.unset;return;
      case state.open : return;
      case state.unset : this.setFlag(block);
    }
  }

  endGame(){
    this.game_over = true;
    this.pop_up_message = this.game_over;
  }

  WonGame(){
    this.message.title = "Congratulations!";
    this.message.content = "You Won!";
    this.endGame();
  }

  lostGame(){
    this.message.title = "Game Over";
    this.message.content = "You stepped on a mine!";
    this.endGame();
    this.revealAllMines();
  }
  revealAllMines(){
    for (let i = 0; i < this.grid.length ; i++) {
      for (let j = 0; j <  this.grid.length; j++) {
        let block = this.grid.getBlock(i,j);
        if( block.isMined && block.state == state.unset ){
            block.open();
        }
      }
    }
  }
  revealBlocksNear(block : Block){
    let arr = [];

    for (let i = block.horizontal - 1 ; i <= block.horizontal + 1 ; i++) {
      for (let j = block.vertical - 1 ; j <=  block.vertical + 1 ; j++) {
        if(!this.grid.checkValidCoords(i,j)) {
          continue;
        }
        if(block.horizontal == i && block.vertical == j) {
          continue; 
        }
        if(this.revealValid(i,j)) {
          continue;
        }
        let nearbyBlock = this.grid.getBlock(i,j)
        this.openBlock( nearbyBlock );
        nearbyBlock.nearbyMines == 0 && arr.push( nearbyBlock );
      }
    }
    for (let i = 0; i < arr.length; i++) {
      this.revealBlocksNear(arr[i])      
    }
  }
  revealValid(i,j){
    let block = this.grid.getBlock(i,j);
    return  block.state == state.flagged
      || block.state == state.question
      || block.state == state.open;
  }
  winCheck(){
    return this.blocks_open === this.blocks_to_win
  }
  setBackgroundRed(block){
    let id = block.numsToId([block.horizontal, block.vertical])
    document.getElementById(id).style.backgroundColor = 'red'
  }
  openBlock(block) {
    if ( block.state == state.unset && !this.game_over ) {
      block.open();
      this.blocks_open++;
      if(this.winCheck()){ 
        this.WonGame();
      }
      if ( block.isMined ){
        this.setBackgroundRed(block);
        this.lostGame();
      }else if( block.nearbyMines == 0 ){
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
    this.flags = new Flags(this.level);
    this.grid = new Grid(this.level);
  }
  setNewLevel(num){
    
    switch(num){
      case 0 : this.level = Level.Easy;this.blocks_to_win=54;break;
      case 1 : this.level = Level.Medium;this.blocks_to_win=124;break;
      case 2 : this.level = Level.Hard;this.blocks_to_win=206;break;
    }
    this.startNewGame();
  }
}
