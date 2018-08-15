import { Location } from './Location';
import { Level } from './Levels';
import { GameLevel } from './GameLevel';
import { Block } from './Block';
import { Mine } from './Mine';
import { Numbered } from './Numbered';

export class Grid{

    //loctions          the total block grid set in this property
    public locations : any[] ;
    //rows              store a row of block
    public rows : Block[];
    //level             this is giving the number of columns and rows to the grid
    private level : any = {easy:8,medium:12,hard:20}


    constructor(_game_level : GameLevel ){

        this.locations = [];

        switch (_game_level._level){
            case Level.Easy : this.createGrid(this.level.easy);break;
            case Level.Medium : this.createGrid(this.level.medium);break;
            case Level.Hard : this.createGrid(this.level.hard);break;
        }
    }  

    private generateRandomLocation(maxVal) : number{
        let index =  Math.floor((Math.random() * maxVal) + 0);
        return index; 
    } 
    private generateGridArr(length){
        let arr : Location[] = [];
        for (let i = 0; i < length; i++) {
            
            for (let j = 0; j < length; j++) {
                arr.push(new Location(i,j))
            }
        }
        return arr;
    }
    private plantMines(level: Level){
        let number_of_mines : number ;
        switch(level){
            case Level.Easy : number_of_mines = 10;break;
            case Level.Medium : number_of_mines = 20;break;
            case Level.Hard : number_of_mines = 50; break; 
        }

        let unMined = this.generateGridArr(this.level.easy);

        for (let i = 0; i < number_of_mines; i++) {
            let index = this.generateRandomLocation(unMined.length-1);
            let n = unMined[index].horizontal;
            let m = unMined[index].vertical;
            this.plantMine(this.locations[n][m]);
            unMined.splice(index,1);
        }
    }
    private plantMine( block: Block ){
        block.isMined = true;
    }

    //if the next check up returns false, then the coordinates are not in the boundries of the grid
    checkValidCoords(x, y) {
        return (this.checkValidCoord(x) && this.checkValidCoord(y))
    }
    checkValidCoord(coord) {
        return (coord >= 0 && coord < this.locations.length)
    }

    //give the block indication of how many mines are nearby
    private setNearbyMinesCount(block){
        var count = 0;
        for (let i = block.horizontal - 1; i <= block.horizontal + 1; i++) {
            for (let j = block.vertical - 1; j <= block.vertical + 1; j++) {
                 if(!this.checkValidCoords(i,j)) continue;
                if(i === block.horizontal && j === block.vertical) continue;
                if(this.getBlock(i,j).isMined)
                    count++
            }
        }

        block.nearbyMines = count;
    }
    createGrid(length){
        //1. create an array of locations which indicates a mined block.
        for( let x = 0; x < length ; x++ ){
            this.rows = [];
            for( let y = 0; y < length ; y++ ){
                let block = new Block(x,y);
                this.rows.push(block);
            }
            this.locations.push(this.rows);
        }
        //2. planet mines on the grid
        this.plantMines(Level.Easy);

        for (let i = 0; i < length; i++) {
            for (let j = 0; j < length; j++) {
                if(this.locations[i][j].isMined) continue;
                    this.setNearbyMinesCount(this.locations[i][j])
            }            
        }
        return this.locations;
    }
    //return block base on coords
    public getBlock( i : number , j : number  ){
        return this.locations[i][j];
    }
    public getBlockById( id : string ) : Block{
        for (let i = 0; i < this.locations.length; i++) {
            for (let j = 0; j < this.locations.length; j++) {
                if(this.locations[i][j].id == id){
                    return this.locations[i][j];
                }
            }            
        }
    }
    printGrid(){
        console.log("Grid : {");
        for(let i = 0 ; i< 8 ; i++){
            console.log([this.locations[i][0].isMined,this.locations[i][1].isMined,this.locations[i][2].isMined,this.locations[i][3].isMined,this.locations[i][4].isMined,this.locations[i][5].isMined,this.locations[i][6].isMined,this.locations[i][7].isMined]);            
        }
        console.log("}");  
         console.log("Grid : {");
        for(let i = 0 ; i< 8 ; i++){
            console.log([this.locations[i][0].nearbyMines,this.locations[i][1].nearbyMines,this.locations[i][2].nearbyMines,this.locations[i][3].nearbyMines,this.locations[i][4].nearbyMines,this.locations[i][5].nearbyMines,this.locations[i][6].nearbyMines,this.locations[i][7].nearbyMines]);            
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
// [this.locations[i][0].isMined,this.locations[i][1].isMined,this.locations[i][2].isMined,this.locations[i][3].isMined,this.locations[i][4].isMined,this.locations[i][5].isMined,this.locations[i][6].isMined,this.locations[i][7].isMined]
// is numbered
// [this.x[i][0].isNumbered,this.x[i][1].isNumbered,this.x[i][2].isNumbered,this.x[i][3].isNumbered,this.x[i][4].isNumbered,this.x[i][5].isNumbered,this.x[i][6].isNumbered,this.x[i][7].isNumbered,]
//id of the blocks
//[this.x[i][0].id,this.x[i][1].id,this.x[i][2].id,this.x[i][3].id,this.x[i][4].id,this.x[i][5].id,this.x[i][6].id,this.x[i][7].id]
