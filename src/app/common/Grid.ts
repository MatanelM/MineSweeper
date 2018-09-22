import { Location } from './Location';
import { Level } from './Levels';
import { Block } from './Block';

export class Grid{

    public blocks : Block[] = [];

    public length ;

    constructor( level: Level ){

        switch (level){
            case Level.Easy : this.length = 8; this.createGrid(this.length); break;
            case Level.Medium : this.length = 12; this.createGrid(this.length); break;
            case Level.Hard : this.length = 16; this.createGrid(this.length); break;
        }
    }  

    private generateRandomLocation(maxVal) : number{
        let index =  Math.floor((Math.random() * maxVal) + 0);
        return index; 
    } 

    generateGridArray(){
        var arr = []
        for (let i = 0; i < this.blocks.length; i++) {
            arr.push(this.blocks[i])
        }
        return arr
    }

    private plantMines(length){
        let number_of_mines : number ;
        switch(length){
            case 8 : number_of_mines = 10;break;
            case 12 : number_of_mines = 20;break;
            case 16 : number_of_mines = 50; break; 
        }
        var unMined = this.generateGridArray();

        for (let i = 0; i < number_of_mines; i++) {
            let index = this.generateRandomLocation(unMined.length-1);
            let n = unMined[index].horizontal;
            let m = unMined[index].vertical;
            this.plantMine(this.getBlock(n,m));
            unMined.splice(index,1);
        }
    }
    private plantMine( block: Block ){
        block.isMined = true;
    }

    //if the next check up returns false, then the coordinates are not in the boundries of the grid
    checkValidCoords(x, y) : boolean {
        return (this.checkValidCoord(x) && this.checkValidCoord(y))
    }
    checkValidCoord(coord) : boolean {
        return (coord >= 0 && coord < this.length)
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
    private createGrid(length){
        //1. create an array of locations which indicates a mined block.
        for( let x = 0; x < length ; x++ ){
            for( let y = 0; y < length ; y++ ){
                let block = new Block(x,y);
                this.blocks.push(block);
            }
        }
        //2. planet mines on the grid
        this.plantMines(length);
        //3. if any, set on every block the number of the nearby mines
        for (let i = 0; i < length; i++) {
            for (let j = 0; j < length; j++) {
                if(this.getBlock(i,j).isMined) continue;
                this.setNearbyMinesCount(this.getBlock(i,j))
            }
        }
    }
    //return block base on coords
    public getBlock( i : number , j : number  ): Block{

        return this.blocks[i*this.length+j]
    }
    //return block with a given id attribute
    public getBlockById( id : string ) : Block{
        //tempo 
        let location = new Location(0,0);
        let nums = location.idToNums(id) 
        return this.getBlock(nums[0], nums[1]);
    }
    printGrid(){

    }
}

//testing methods
// print dots
///[this.x[i][0].horizontal,this.x[i][0].vertical,this.x[i][1].horizontal,this.x[i][1].vertical,this.x[i][2].horizontal,this.x[i][2].vertical,this.x[i][3].horizontal,this.x[i][3].vertical,this.x[i][4].horizontal,this.x[i][4].vertical,this.x[i][5].horizontal,this.x[i][5].vertical,this.x[i][6].horizontal,this.x[i][6].vertical,this.x[i][7].horizontal,this.x[i][7].vertical]
// print mines
// [this.locations[i][0].isMined,this.locations[i][1].isMined,this.locations[i][2].isMined,this.locations[i][3].isMined,this.locations[i][4].isMined,this.locations[i][5].isMined,this.locations[i][6].isMined,this.locations[i][7].isMined]
// is numbered
// [this.x[i][0].isNumbered,this.x[i][1].isNumbered,this.x[i][2].isNumbered,this.x[i][3].isNumbered,this.x[i][4].isNumbered,this.x[i][5].isNumbered,this.x[i][6].isNumbered,this.x[i][7].isNumbered,]
//id of the blocks
//[this.x[i][0].id,this.x[i][1].id,this.x[i][2].id,this.x[i][3].id,this.x[i][4].id,this.x[i][5].id,this.x[i][6].id,this.x[i][7].id]
