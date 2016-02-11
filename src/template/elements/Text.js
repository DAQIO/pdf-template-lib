import _ from 'underscore';
import ReportElement from './ReportElement';

export default class Text extends ReportElement {

  get defaults(){
    return {
      fontSize: 9,
      align: 'left',
      fontColor: 'black',
      value: '',
      font: 'Helvetica',
      background: ''
    }
  }

  async draw(){
    this._doc.font(this.font);
    this._doc.fontSize(parseInt(this.fontSize));
    if(!_.isEmpty(this.background)){
      this._doc.fillColor(this.background);
      this._doc.rect(0, 0, this.width, this.height).fill();
    }
    this._doc.fillColor(this.fontColor);
    let x = 3;
    if(this.align === 'center'){
      x = 0;
    }
    this._doc.text(this.value, x, 3.5, {
      align: this.align,
      width: this.width,
      height: this.height
    });
  }
}
