export class Numbered{
  // _number              number of the (block.isMined) around this location which return true
  private _number : number ;
  //_image                image for the number
  private _image : string ;

  constructor ( number_:number , image_?:string ){
    this._number = number_;
    this._image = image_;
  }
  //getters & setters
  get number() : number{
    return this._number;
  }
  set number ( value : number ){
    this._number = value ;
  }
  get image() : string {
    return this._image ;
  }
  set image ( value : string ){
    this._image = value;
  }


}
