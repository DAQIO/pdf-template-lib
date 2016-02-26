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
    this.events.emitEvent('total-pages', [index]);
    await* _.map(this.children, (c) => c.preload());

    index = 0;
    for(let child of this.children){
      this.events.emitEvent('started-page', [index]);
      this._doc.switchToPage(index);
      await child.render();
      this.events.emitEvent('finished-page', [index]);
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
