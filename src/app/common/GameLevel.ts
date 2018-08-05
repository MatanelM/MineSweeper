import { Level } from './Levels';

export class GameLevel{

    private level : Level;

    constructor(){
        this.level = Level.Easy;
    } 

    get _level() : Level {
        return this.level;
    }
    set _level(num){

        switch(num){
            case 0: this.level = Level.Easy;break;
            case 1: this.level = Level.Medium;break;
            case 2: this.level = Level.Hard;break;
            default: throw new Error("Excpeted number between 0-2, got ${num}");
        }
    }
}