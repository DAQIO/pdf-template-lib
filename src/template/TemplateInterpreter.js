import _ from 'underscore';
import moment from 'moment';
import Bluebird from 'bluebird';
import Table from './elements/Table';
import Text from './elements/Text';
import Page from './elements/Page';
import Template from './elements/Template';
import Row from './elements/Row';
import Group from './elements/Group';
import Header from './elements/Header';
import Rectangle from './elements/Rectangle';
import Image from './elements/Image';
import Style from './Style';
const xml2js = Bluebird.promisifyAll(require('xml2js'));

const DefaultNodeTypes = {
  'template' : Template,
  'table' : Table,
  'text' : Text,
  'page' : Page,
  'row' : Row,
  'group' : Group,
  'rectangle' : Rectangle,
  'image' : Image
};

export default class TemplateInterpreter {

  constructor(doc, context, {nodeTypes} = {}){
    this._doc = doc;
    this.context = context;
    this._nodeTypes = _.clone(DefaultNodeTypes);
    if(nodeTypes){
      _.extend(this._nodeTypes, nodeTypes);
    }
  }

  async run(template){
    const parserContext = _.extend({}, this.context);
    const xml = await xml2js.parseStringAsync(_.template(template)(parserContext));

    this._pluckStyles(xml);
    this._pluckHeader(xml);

    const root = await this._buildWidgetTree('template', xml.template);
    await root.render();
  }

  _buildWidgetTree(type, node){
    const klazz = NodeTypes[type];
    if(!klazz){
      throw `Undefined type: ${type}`;
    }
    const root = new klazz(this._doc, node, {
      context: this.context,
      styles: this._styles,
      header: this._header,
      footer: this._footer
    });
    for(let {type, node:child} of this._getChildren(node)){
      root.addChild(this._buildWidgetTree(type, child));
    }
    return root;
  }

  _getChildren(node){
    const childTypes = _.filter(_.keys(node), (x) => !_.contains(['$', '_'], x));
    const children = [];
    for(let childType of childTypes){
      for(let child of node[childType]){
        children.push({type: childType, node: child});
      }
    }
    return children;
  }

  _pluckStyles(xml){
    if(xml.template.styles){
      const styles = xml.template.styles[0];
      delete xml.template.styles;
      this._styles = _.map(styles.style, (s) => new Style(s));
    }
  }

  _pluckHeader(xml){
    if(xml.template.header){
      const header = xml.template.header[0];
      delete xml.template.header;
      this._header = new Header(this._doc, header, {context: this.context, styles: this._styles});
      for(let {type, node:child} of this._getChildren(header)){
        this._header.addChild(this._buildWidgetTree(type, child));
      }
    }
  }

}
