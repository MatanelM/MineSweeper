
export class Mine{

    //_image            image for the mine
    public _image ;
    //_image_clicked    image for when this mine is clicked
    public _image_clicked ;

    constructor( ){
        this._image = null;
        this._image_clicked = null;
    }

    //check for this mine - Polymorphysm
    get isMine() : boolean{
      return true;
    }
}
