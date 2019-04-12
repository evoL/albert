

import Element from "./Element";
import Attributes from "./Attributes";

export default class Image extends Element {
  constructor(href: string, attributes: Attributes = {}) {
    super("image", {"xlink:href": href, ...attributes});
  }
}