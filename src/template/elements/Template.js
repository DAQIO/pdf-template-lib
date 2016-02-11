import _ from 'underscore';
import ReportElement from './ReportElement';

export default class Template extends ReportElement {
  async render(){
    let index = 0;
    for(let child of this.children){
      if(index > 0){
        this._doc.addPage();
      }
      index += 1;
    }
    await* _.map(this.children, (c) => c.preload());

    index = 0;
    for(let child of this.children){
      this._doc.switchToPage(index);
      await child.render();
      index += 1;
    }
    this._doc.flushPages();
  }

  _validateChildren(){
    for(let child of this.children){
      if(!(child instanceof Page)){
        throw `Invalid Child of Template ${child}`;
      }
    }
  }

}
