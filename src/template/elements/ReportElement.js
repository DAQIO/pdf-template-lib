import _ from 'underscore';
import _s from 'underscore.string';

export default class ReportElement {

  constructor(doc, node, {context, styles, ...options}){
    this._doc = doc;
    this.context = context;
    this.children = [];
    this.styles = styles || [];
    this.options = options;
    _.extend(this, this.defaults);
    if(node.$){
      for(let key of _.keys(node.$)){
        this[_s.camelize(key)] = node.$[key];
      }
    }
    this._applyStyle(node);
    this.x = parseFloat(this.x || "0");
    this.y = parseFloat(this.y || "0");
  }

  get defaults(){
    return {};
  }

  addChild(element){
    this.children.push(element);
  }

  async preload() {
    for(let child of this.children){
      await child.preload();
    }
    this.preloaded = true;
  }

  async render(){
    if(!this.preloaded){
      await this.preload();
    }
    this.updateChildren();
    this._doc.save();
    this._doc.translate(this.x, this.y);
    await this.draw();
    await this.renderChildren();
    this._doc.restore();
  }

  async renderChildren(){
    for(let child of this.children){
      await child.render();
    }
  }

  async draw(){

  }

  updateChildren(){

  }

  _applyStyle(node){
    for(let style of this.styles){
      if(node.$ && node.$.style === style.styleName){
        _.extend(this, style);
        break;
      }
    }
  }
}
