import ReportElement from './ReportElement';

export default class Page extends ReportElement {
  async renderChildren(){
    if(this.options.header){
      await this.options.header.render();
    }
    await super.renderChildren();
    if(this.options.footer){
      await this.options.footer.render();
    }
  }
}
