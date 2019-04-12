import { createElement } from './utils';
import Attributes from './Attributes';


interface IColorStop {
  offset: string | number;
  color: string;
  opacity?: string;
}

function createStop(offset: any, color: any, opacity: string = undefined): IColorStop {
  return { offset, color, opacity }
}

export default class Gradient {
  private tag_: string;
  private attributes_: Attributes;
  private stops_: IColorStop[];

  constructor(tag: string, attributes: Attributes = {}) {
    this.tag_ = tag;
    this.attributes_ = attributes;
    this.stops_ = [];
  }

  addStop(offset, color, opacity: string = undefined) {
    this.stops_.push(createStop(offset, color, opacity));
    return this;
  }

  render() {
    const gradient = createElement(this.tag_, this.attributes_);
    for (const { offset, color, opacity } of this.stops_) {
      const attributes = { offset, "stop-color": color, "stop-opacity": opacity };
      gradient.appendChild(createElement("stop", attributes));
    }
    return gradient;
  }
}