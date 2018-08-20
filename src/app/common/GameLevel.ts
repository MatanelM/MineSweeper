import { Level } from './Levels';

export class GameLevel{

    private _level : Level;

    constructor(level : Level){
        this._level = level;
    } 

    get level() : Level {
        return this._level;
    }
    set level(num){

        switch(num){
            case 0: this._level = Level.Easy;break;
            case 1: this._level = Level.Medium;break;
            case 2: this._level = Level.Hard;break;
            default: throw new Error("Excpeted number between 0-2, got ${num}");
        }
    }
}