import _ from 'underscore';
import _s from 'underscore.string';
export default class Style {
  constructor(node){
    this.styleName = node.$.name;
    for(let key of _.keys(node.$)){
      if(key !== '$'){
        this[_s.camelize(key)] = node.$[key];
      }
    }
  }
}
