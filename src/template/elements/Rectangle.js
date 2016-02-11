import ReportElement from './ReportElement';

export default class Rectangle extends ReportElement {

  get defaults(){
    return {
      stroke: 'black',
      fill: 'white',
      width: 10,
      height: 10
    };
  }

  async draw(){
    this._doc.strokeColor(this.stroke);
    this._doc.fillColor(this.fill);
    this._doc
        .rect(0,0,this.width,this.height)
        .fill()
        .rect(0,0,this.width,this.height)
        .stroke();
  }
}
