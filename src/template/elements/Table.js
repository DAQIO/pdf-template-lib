import ReportElement from './ReportElement';
import Row from './Row';

export default class Table extends ReportElement {

  async renderChildren(){
    this._rowCursor = 0;
    for(let child of this.children){
      if(!(child instanceof Row)){
        throw 'Child must be a row';
      }

      this._doc.save();
      this._doc.translate(0, this._rowCursor);
      await child.render();
      this._doc.restore();

      this._rowCursor += child.height || 15;
    }
  }

  updateChildren(){
    for(let child of this.children){
      if(!child.originalWidth){
        child.originalWidth = child.width || '100%';
      }
      if(child.originalWidth.indexOf('%') === -1){
        throw 'Child width must be a percentage';
      }
      child.width = (parseInt(child.originalWidth) / 100) * this.width;
    }
  }

  get defaults(){
    return {
      width: 545
    };
  }

}
