import { Level } from './Levels';

export class Flags{

    public amount : number ;
    public image : string;

    constructor( level: Level ){
        switch (level) {
            case Level.Easy : this.amount = 10;break;
            case Level.Medium : this.amount = 20;break;
            case Level.Hard : this.amount = 50;break;
        }
        this.image = null;
    }

    FlagUsed(){
        if( this.amount > 0 ){
            this.amount --;
            return;
        }
    }

    FlagReturned(){
        this.amount ++;
    }
}