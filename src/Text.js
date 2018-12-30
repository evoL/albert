import { Expression } from "cassowary";
import { createElement, omit, withTemporarySvg } from "./utils";
import { variable } from "./helpers";

export default class Text {
  constructor(text, attributes = {}) {
    this.text_ = text;
    this.attributes_ = omit(attributes, ["x", "y", "fontSize"]);
    this.contextAttributes_ = {};

    this.x = variable("x", attributes.x);
    this.y = variable("y", attributes.y);
    this.fontSize = variable("fontSize", attributes["font-size"] || 16);

    this.ratios = {
      width: 0,
      height: 0,
      left: 0,
      top: 0,
      bottom: 0
    };
    this.width = null;
    this.height = null;
    this.leftEdge = null;
    this.topEdge = null;
    this.rightEdge = null;
    this.bottomEdge = null;
    this.centerX = null;
    this.centerY = null;
    this.baseline = new Expression(this.y);

    this.adjustDimensions_();
  }

  setText(text) {
    this.text_ = text;
    this.adjustDimensions_();
    return this;
  }

  setContext(context) {
    this.contextAttributes_ = context;
    this.adjustDimensions_();
    return this;
  }

  lineHeight(multiplier = 1) {
    return new Expression(this.fontSize).times(multiplier);
  }

  render(useContext = false) {
    const attributes = useContext
      ? Object.assign({}, this.contextAttributes_, this.attributes_)
      : this.attributes_;
    const el = createElement("text", attributes);
    el.appendChild(document.createTextNode(this.text_));

    el.setAttributeNS(null, "x", this.x.value);
    el.setAttributeNS(null, "y", this.y.value);
    el.setAttributeNS(null, "font-size", this.fontSize.value);

    return el;
  }

  adjustDimensions_() {
    const el = this.render(true);
    withTemporarySvg(el, text => {
      const bbox = text.getBBox();

      const widthRatio = bbox.width / this.fontSize.value;
      const heightRatio = bbox.height / this.fontSize.value;
      const leftEdgeRatio = (this.x.value - bbox.x) / this.fontSize.value;
      const topEdgeRatio = (this.y.value - bbox.y) / this.fontSize.value;

      this.width = new Expression(this.fontSize).times(
        new Expression(widthRatio)
      );
      this.height = new Expression(this.fontSize).times(
        new Expression(heightRatio)
      );
      this.leftEdge = new Expression(this.x).minus(
        new Expression(this.fontSize).times(new Expression(leftEdgeRatio))
      );
      this.topEdge = new Expression(this.y).minus(
        new Expression(this.fontSize).times(new Expression(topEdgeRatio))
      );
      this.rightEdge = this.leftEdge.plus(this.width);
      this.bottomEdge = this.topEdge.plus(this.height);
      this.centerX = this.leftEdge.plus(this.width.divide(2));
      this.centerY = this.topEdge.plus(this.height.divide(2));

      this.ratios = {
        width: widthRatio,
        height: heightRatio,
        left: leftEdgeRatio,
        top: topEdgeRatio,
        bottom: (bbox.y + bbox.height - this.y.value) / this.fontSize.value
      };
    });
  }
}
