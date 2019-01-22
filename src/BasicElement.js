import {
  appendTo,
  createElement,
  insertAfter,
  insertAt,
  insertBefore,
  prependTo
} from "./utils";

export default class BasicElement {
  constructor(tag, attributes = {}) {
    this.tag_ = tag;
    this.attributes_ = attributes;
    this.children_ = [];
  }

  append(...children) {
    appendTo(this.children_, children);
    return this;
  }
  prepend(...children) {
    prependTo(this.children_, children);
    return this;
  }
  insertAt(index, ...children) {
    insertAt(this.children_, index, children);
    return this;
  }
  insertBefore(child, ...children) {
    insertBefore(this.children_, child, children);
    return this;
  }
  insertAfter(child, ...children) {
    insertAfter(this.children_, child, children);
    return this;
  }

  render() {
    const el = createElement(this.tag_, this.attributes_);
    for (const child of this.children_) {
      el.appendChild(child.render());
    }
    return el;
  }
}
