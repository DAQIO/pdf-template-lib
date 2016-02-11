import _ from 'underscore';
import ReportElement from './ReportElement';

export default class Row extends ReportElement {

  constructor(){
    super(...arguments);
    if(_.isString(this.height)){
      this.height = parseFloat(this.height);
    }
  }

  async draw(){
    this._doc.strokeColor(this.stroke);
    this._doc.fillColor(this.fill);
    this._doc.rect(0, 0, this.width, this.height)
             .fill()
             .rect(0, 0, this.width, this.height)
             .stroke();
  }

  async renderChildren(){
    this._columnCursor = 0;
    for(let child of this.children){
      const width = this._calculateChildWidth(child);
      this._doc.save();
      this._doc.translate(this._columnCursor + 1, 1);
      await child.render();
      this._columnCursor += width;
      this._doc.restore();

      this._doc.save();
      this._doc.strokeColor(this.stroke);
      this._doc.moveTo(this._columnCursor, 0)
               .lineTo(this._columnCursor, this.height)
               .stroke();
      this._doc.restore();

    }
  }

  updateChildren(){
    for(let child of this.children){
      if(!child.originalWidth){
        child.originalWidth = child.width;
      }
      child.width = this._calculateChildWidth(child);
      child.height = this.height - 2;
    }
  }

  get defaults(){
    return {
      stroke: 'black',
      fill: 'white',
      width: '100%',
      height: 15
    };
  }

  _calculateChildWidth(child){
    if(_.isUndefined(child.originalWidth)){
      return this.width / this.children.length;
    }
    if(_.isString(child.originalWidth) && child.originalWidth.indexOf('%') !== -1){
      return this.width * parseFloat(child.originalWidth) / 100;
    } else {
      return parseFloat(child.originalWidth);
    }
  }
}
