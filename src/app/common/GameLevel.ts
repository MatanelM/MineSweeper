import { Level } from './Levels';

export class GameLevel{

    private level : Level;

    constructor(){
        this.level = Level.Easy;
    } 

    get _level() : Level {
        return this.level;
    }
}