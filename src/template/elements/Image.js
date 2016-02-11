import ReportElement from './ReportElement';

export default class Image extends ReportElement {
  async draw(){
    this._doc.image(this.src, this.x, this.y, {width: this.width});
  }
}
