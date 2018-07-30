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
  private block_state = state;
  private imgs = {
    flag: "https://i.imgur.com/vnZ0mIf.png",
    question: "https://i.imgur.com/Kypt2fJ.png"
  }

  private game_level = new GameLevel();
  private grid = new Grid(this.game_level);

  private level: string = this.game_level._level.toString();
  private flags: Flags = new Flags(this.game_level);
  //this block is temp!
  private block: Block;


  constructor() {
    switch (this.level) {
      case '0': this.level = 'Easy';
    }
  }

  ngOnInit() {
    document.oncontextmenu = () => { return false };
  }

  FlagUsed(event) {
    //create new temporary block with the coordinated spot
    //come back later
    this.block = new Block(
      Number.parseInt(event.target.id.slice(0, 2)),
      Number.parseInt(event.target.id.slice(2, 4))
    )
    var block_id_array = this.block.idToNums(this.block.id);


    var x = Number.parseInt(event.target.id.slice(0, 2));
    var y = Number.parseInt(event.target.id.slice(2, 4));

    //check for the activity of this block
    if (this.grid.getBlock(block_id_array[0], block_id_array[1]).state == state.open) {
      return;
    }


    if (event.button == 2) {

      //If statements for "flagged" and "question"
      if (this.grid.locations[x][y].isFlagged) {
        this.flags.FlagReturned();
        event.target.setAttribute("class", "block question")
        return;
      }
      if (event.target.className == "block question") {
        this.grid.locations[x][y].isFlagged = false;
        event.target.setAttribute("class", "block");
        return;
      }

      if (this.flags.amount == 0) {
        //return a message to the user if he had no flags left
        alert("no more flags");
        return;
      }
      this.flags.FlagUsed();
      this.grid.locations[x][y].isFlagged = true;
      event.target.setAttribute("class", "flagged");

    }

  }

  //tests
  testLocation(event) {

    //this.grid.printGrid();
    //console.log(this.imgs)
    // if (this.grid.getBlock(1, 0).item.number) {
    //   console.log("number here")
    // } else {
    //   console.log("no number here")
    // }
    console.log(this.block_state)
  }


  clicked(ev, block) {
    this.revealRevolved(block);
    // console.log('is able to open ', this.block.state !== state.open)

    console.log('block state:',block.state,'state open: ',this.block_state.open)
    console.log(block._nearby_mines)
    block.state = this.block_state.open
    //first check - the user did not flag this block as a potential mined block, and this block is still active
    if (this.block.state !== state.open) {
    }

    //check the "item" underneatch the block. which is one of 3 : Mine, Number, or nothing.
    if (block._nearby_mines == 0 ) {
      //in this case - reveal all the mine around
      this.revealRevolved(block);
      console.log("no mines around")
    } else if (block.item.isMine) {
      console.log("Mine! next time champ!")
    } 
     
    //  console.log(block.item.number,"mines ahead of you");
    //remove the styling by switching the class by switching the value of the block isActive to false
    var id = ev.target.id;
    this.grid.locations[Number.parseInt(id.slice(0, 2))][Number.parseInt(id.slice(2, 4))].clicked();
    //several things might happen here. first - the user see what lying under the block.
    //second - case it is a mine, a message will be sent. if it is a number - it will be shown.
    //         and if it is undefined - recursion to reveal the revolved blocks.
    this.grid.locations[Number.parseInt(id.slice(0, 2))][Number.parseInt(id.slice(2, 4))].clicked();
  }

  checkValidCoords(x, y) {
    return (this.checkValidCoord(x) && this.checkValidCoord(y))
  }
  checkValidCoord(coord) {
    return (coord > 0 && coord < this.grid.locations.length)
  }
  //return arr[x][0] < 0 || arr[x][1] < 0 || arr[x][0] >= this.grid.locations.length || arr[x][1] >= this.grid.locations.length

  revealRevolved(block: Block) {
    


    //set indications i,j
    // console.log(this.checkValidCoords(block.horizontal,block.vertical))
    let i = block.horizontal;
    let j = block.vertical;

    //1.check for round blocks for valid 

    //

    //The next several methods are used to create useful recursion.
    //1.create an array of all possible blocks around the blocks
    var arr: any = [[i - 1, j], [i - 1, j + 1], [i, j + 1], [i + 1, j + 1], [i + 1, j], [i + 1, j - 1], [i, j - 1], [i - 1, j - 1]];
    //2.filter the array, if the block surround unrevealable block - release it
    //3.go through the array, and commit reveal in any case.
    //4.if the block is numbered - ok, if it is containing nothing - recourse.
    for (let x = 0; x < arr.length; x++) {
      // task 2 - 1. check for technical issues
      if (arr[x][0] < 0 || arr[x][1] < 0 || arr[x][0] >= this.grid.locations.length || arr[x][1] >= this.grid.locations.length) {
        continue;
        //          2. check for logic issues
      }
      // else if(!this.checkValidBlock(this.grid.getBlock(arr[x][0],arr[x][1]))){
      //     continue;
      // }

      // task 3 - reveal the block
      this.grid.locations[arr[x][0]][arr[x][1]].clicked();
      // task 4 - recourse
      if (typeof this.grid.getBlock(arr[x][0], arr[x][1]).item == 'undefined') {
        this.revealRevolved(this.grid.locations[arr[x][0]][arr[x][1]]);

      }
    }

  }

  checkValidBlock(block: Block): boolean {
    if (typeof block == 'undefined') {
      return false;
    }

    if (block.isFlagged || block.state != state.open) return false;
  }
}

/*
//the top
[i-1][j]
//the top right
[i-1][j+1]
//the next
[i][j+1]
//the bottom right
[i+1][j+1]
//the bottom
[i+1][j]
//the bottom left
[i][j-1]
//the left
[i][j-1]
//the top left
[i-1][j-1]
*/
