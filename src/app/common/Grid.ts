import { Location } from './Location';
import { Level } from './Levels';
import { GameLevel } from './GameLevel';
import { Block } from './Block';
import { Mine } from './Mine';
import { Numbered } from './Numbered';
import { getMaxListeners } from 'cluster';
import { NUMBER_TYPE } from '@angular/compiler/src/output/output_ast';

export class Grid{
  //location[0][1]
    public locations : any[] ;
    public rows : Block[];

    private mines_locations : Location[] = [];

    constructor(_game_level : GameLevel ){

        this.locations = [];

        switch (_game_level._level){
            case Level.Easy : this.createEasyGrid();break;
            case Level.Medium : this.createMediumGrid();break;
            case Level.Hard : this.createHardGrid();break;
        }
    }

    private generateMinesArray(level : Level){
        let number_of_mines : number ;
        switch(level){
            case Level.Easy : number_of_mines = 10;break;
            case Level.Medium : number_of_mines = 20;break;
            case Level.Hard : number_of_mines = 50; break; 
        }

        this.mines_locations = new Array(number_of_mines); 

        for( let i = 0 ; i < number_of_mines ; i++ ){
            let new_loc = this.generateRandomLocation();

            if(this.mines_locations.includes(new_loc)){
                i--;
                continue;
            }

            this.mines_locations.push(new_loc);
        }

        return this.mines_locations;
    }   

    private generateRandomLocation() : Location{
        let pointx =  Math.floor((Math.random() * 8) + 0);
        let pointy =  Math.floor((Math.random() * 8) + 0);

        return new Location(pointx,pointy); 
    } 

    private plantMines(){
        for (let i = 0; i < this.mines_locations.length; i++) {
           this.planetMine(i);
        }
    }

    private planetMine( index : number ){
        this.locations[this.mines_locations[index].horizontal][this.mines_locations[index].vertical].item = new Mine();
    }

    createEasyGrid(){
        //1. create an array of locations which indicates a mined block.
        let mines_locations : Location[] =  this.generateMinesArray(Level.Easy);

        //2. create the grid + implementing mines
        for( let x = 0; x < 8 ; x++ ){
            //this is the first time variable y is being initiated
            this.rows = [];
            for( let y = 0; y < 8 ; y++ ){
                let block = new Block(x,y);
                this.rows.push(block);
            }
            this.locations.push(this.rows);
        }

        this.plantMines();

        //4. implement numbered blocks and numbers
        let num_of_mines : number = 0;
        //fix 4 corners
        // - top left
        if(!this.locations[0][0].isMined){
            num_of_mines = this.locations[1][0].isMined + this.locations[0][1].isMined + this.locations[1][1].isMined;
            if (!num_of_mines){
                //dont do anything (leave is_numbered and number as undefined)
            }else{
                let numbered = new Numbered(num_of_mines);
                this.locations[0][0].item = numbered;
            }
            //cleaning the number of mines around
            num_of_mines=0;
        }
        // - top right
        if(!this.locations[0][7].isMined){
            num_of_mines = this.locations[0][6].isMined + this.locations[1][7].isMined + this.locations[1][6].isMined;
            if (!num_of_mines){
                //dont do anything (leave is_numbered and number as undefined)
            }else{
                let numbered = new Numbered(num_of_mines);
                this.locations[0][7].item = numbered;
            }
            //cleaning the number of mines around
            num_of_mines=0;
        }
        // - bottom left
        if(!this.locations[7][0].isMined){
            num_of_mines = this.locations[6][0].isMined + this.locations[7][1].isMined + this.locations[6][1].isMined;
            if (!num_of_mines){
                //dont do anything (leave is_numbered and number as undefined)
            }else{
              let numbered = new Numbered(num_of_mines);
                this.locations[7][0].item = numbered;
            }
            num_of_mines=0;
        }
        // - bottom right
        if(!this.locations[7][7].isMined){
            num_of_mines = this.locations[6][7].isMined + this.locations[6][6].isMined + this.locations[7][7].isMined;
            if (!num_of_mines){
                //dont do anything (leave is_numbered and number as undefined)
            }else{
              let numbered = new Numbered(num_of_mines);
                this.locations[7][7].item = numbered;
            }
            num_of_mines=0;
        }

        //fix the top line
        for( let i = 1 ; i<7 ; i++ ){
            if(this.locations[0][i].isMined)continue;
            //the left
            num_of_mines = this.locations[0][i-1].isMined +
            //the next
            this.locations[0][i+1].isMined+
            //the bottom-left
            this.locations[1][i-1].isMined+
            //the bottom
            this.locations[1][i].isMined+
            //the bottom-right
            this.locations[1][i+1].isMined;

            if(!num_of_mines){
                //dont do anything (leave is_numbered and number as undefined)
            }else{
              let numbered = new Numbered(num_of_mines);
                this.locations[0][i].item = numbered;
            }
            //clean the number of mines from the variable
            num_of_mines = 0;
        }

        //fix the left line
        for( let i = 1 ; i<7 ; i++ ){
            if(this.locations[i][0].isMined)continue;

            //the top
            num_of_mines = this.locations[i-1][0].isMined+
            //the top right
            this.locations[i-1][1].isMined+
            //the next
            this.locations[i][1].isMined+
            //the bottm right
            this.locations[i+1][1].isMined+
            //the bottom
            this.locations[i+1][0].isMined;
            if(!num_of_mines){
                //dont do anything (leave is_numbered and number as undefined)
            }else{
                  let numbered = new Numbered(num_of_mines);
                this.locations[i][0].item = numbered;
            }
            //clean the number of mines from the variable
            num_of_mines = 0;
        }

        //fix the right line
        for(let i = 1 ; i < 7 ; i++ ){
            if(this.locations[i][7].isMined) continue;

            //the top
            num_of_mines = this.locations[i-1][7].isMined+
            //the top-left
            this.locations[i-1][6].isMined+
            //the left
            this.locations[i][6].isMined+
            //the bottom-left
            this.locations[i+1][6].isMined+
            //the bottom
            this.locations[i+1][7].isMined;

            if(!num_of_mines){
                //dont do anything (leave is_numbered and number as undefined)
            }else{
              let numbered = new Numbered(num_of_mines);
                this.locations[i][7].item = numbered;
            }
            //clean the var
            num_of_mines= 0;
        }

        //fix the bottom line
        for(let i = 1 ; i< 7 ; i++ ){
            if(this.locations[7][i].isMined)continue;

            //the left
            num_of_mines = this.locations[7][i-1].isMined+
            //the top left
            this.locations[6][i-1].isMined+
            //the top
            this.locations[6][i].isMined+
            //the top right
            this.locations[6][i+1].isMined+
            //the next
            this.locations[7][i+1].isMined;

            if(!num_of_mines){
                //do nothing
            }else{
              let numbered = new Numbered(num_of_mines);
                this.locations[7][i].item = numbered;
            }
            num_of_mines= 0 ;
        }
        //fix all inner grid blocks
        for( let i = 1 ; i < 7 ; i++ ){

            for ( let j = 1 ; j < 7 ; j++ ){
                if(this.locations[i][j].isMined)continue;

                //the top
                num_of_mines = this.locations[i-1][j].isMined +
                //the top-right
                this.locations[i-1][j+1].isMined+
                //the next
                this.locations[i][j+1].isMined+
                //the bottom right
                this.locations[i+1][j+1].isMined+
                //the bottom
                this.locations[i+1][j].isMined+
                //the bottom left
                this.locations[i+1][j-1].isMined+
                //the left
                this.locations[i][j-1].isMined+
                //the top left
                this.locations[i-1][j-1].isMined;

                if(!num_of_mines){
                    //dont do anything (leave the fields is_number and number as undefined)
                }else{
                  let numbered = new Numbered(num_of_mines);
                    this.locations[i][j].item = numbered;
                }
                num_of_mines = 0;
            }

        }


        //3. return the grid
        return this.locations;
    }

    createMediumGrid(){
        //..
    }

    createHardGrid(){
        //..
    }

    getBlock( i : number , j : number  ){
        return this.locations[i][j];
    }

    printGrid(){

        console.log("Grid : {");
        for(let i = 0 ; i< 8 ; i++){
            console.log([this.locations[i][0].isNumbered,this.locations[i][1].isNumbered,this.locations[i][2].isNumbered,this.locations[i][3].isNumbered,this.locations[i][4].isNumbered,this.locations[i][5].isNumbered,this.locations[i][6].isNumbered,this.locations[i][7].isNumbered]);
          }
        console.log("}")
    }

}

// //the left
// this.x[0][i-1]
// //the next
// this.x[0][i+1]
// //the bottom-left
// this.x[1][i-1]
// //the bottom
// this.x[1][i]
// //the bottom-right
// this.x[1][i+1]
// print dots
///[this.x[i][0].horizontal,this.x[i][0].vertical,this.x[i][1].horizontal,this.x[i][1].vertical,this.x[i][2].horizontal,this.x[i][2].vertical,this.x[i][3].horizontal,this.x[i][3].vertical,this.x[i][4].horizontal,this.x[i][4].vertical,this.x[i][5].horizontal,this.x[i][5].vertical,this.x[i][6].horizontal,this.x[i][6].vertical,this.x[i][7].horizontal,this.x[i][7].vertical]
// print mines
// [this.x[i][0].isMined,this.x[i][1].isMined,this.x[i][2].isMined,this.x[i][3].isMined,this.x[i][4].isMined,this.x[i][5].isMined,this.x[i][6].isMined,this.x[i][7].isMined,]
// is numbered
// [this.x[i][0].isNumbered,this.x[i][1].isNumbered,this.x[i][2].isNumbered,this.x[i][3].isNumbered,this.x[i][4].isNumbered,this.x[i][5].isNumbered,this.x[i][6].isNumbered,this.x[i][7].isNumbered,]
//id of the blocks
//[this.x[i][0].id,this.x[i][1].id,this.x[i][2].id,this.x[i][3].id,this.x[i][4].id,this.x[i][5].id,this.x[i][6].id,this.x[i][7].id]
