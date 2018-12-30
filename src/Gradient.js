import { createElement } from "./utils";

function createStop(offset, color, opacity = undefined) {
  return { offset, color, opacity };
}

export default class Gradient {
  constructor(tag, attributes = {}) {
    this.tag_ = tag;
    this.attributes_ = attributes;
    this.stops_ = [];
  }

  addStop(offset, color, opacity = undefined) {
    this.stops_.push(createStop(offset, color, opacity));
    return this;
  }

  render() {
    const gradient = createElement(this.tag_, this.attributes_);
    for (const { offset, color, opacity } of this.stops_) {
      const attributes = Object.assign(
        { offset, "stop-color": color },
        opacity && { "stop-opacity": opacity }
      );
      gradient.appendChild(createElement("stop", attributes));
    }
    return gradient;
  }
}
