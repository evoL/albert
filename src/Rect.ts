import Attributes from "./Attributes";
import Element from "./Element";


export default class Rect extends Element {
  constructor(attributes: Attributes = {}) {
    super("rect", attributes);
  }
}