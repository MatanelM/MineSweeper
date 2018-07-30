import { Location } from './Location';
import { Mine } from './Mine';
import { state } from './State';

export class Block extends Location{

    private _isFlagged : boolean;

    public color : string = "gray";

    public _state : state ;

    private  _item : any ;

    public _nearby_mines = null;

    constructor ( x:number , y:number ){
        super(x , y );
        this._isFlagged = false;
        this._state = state.unset;
        this._nearby_mines = 0;
    }

    clicked(){
        this._state = state.open;
    }

    get state(){
      return this._state;
    }

    set state(value : state){
      this._state = value;
    }

    get isMined():boolean{
      if(typeof this._item === 'undefined') return false;
      if(this._item.isMine) return true;

      return null;
    }

    get isNumbered():boolean{
      if(this.isMined == null){
        return true;
      }return null;

    } 
    get isFlagged() : boolean{
      return this._isFlagged;
    }
    set isFlagged( value : boolean ){
      this._isFlagged = value;
    }

    //getters & setters
    get item() : any {
    return this._item;
    }
    set item(value : any){
      this._item = value;
      if(!value.isMine){
         this._nearby_mines = value.number;
      }
    }

    
}
