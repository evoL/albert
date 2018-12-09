import Element from "./Element";

export default class Image extends Element {
  constructor(href, attributes = {}) {
    super("image", Object.assign({ "xlink:href": href }, attributes));
  }
}
