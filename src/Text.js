import { Expression } from "cassowary";
import { createElement, omit, withTemporarySvg } from "./utils";
import { variable } from "./helpers";

function createSlice(start, end, attributes) {
  return { start, end, attributes };
}

export default class Text {
  constructor(text, attributes = {}) {
    this.text_ = text;
    this.attributes_ = omit(attributes, ["x", "y", "font-size"]);
    this.slices_ = []; // By default there will be no spans

    const idPrefix = attributes.id ? attributes.id + ":" : "";
    this.x = variable(idPrefix + "text.x", attributes.x);
    this.y = variable(idPrefix + "text.y", attributes.y);
    this.fontSize = variable(
      idPrefix + "text.fontSize",
      attributes["font-size"] || 16
    );

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

  setAttributes(attributes) {
    Object.assign(this.attributes_, omit(attributes, ["x", "y", "font-size"]));
    return this;
  }

  setText(text) {
    this.text_ = text;
    this.slices_ = [];
    this.adjustDimensions_();
    return this;
  }

  lineHeight(multiplier = 1) {
    return new Expression(this.fontSize).times(multiplier);
  }

  format(start, end, attributes = {}) {
    if (start >= end) {
      throw new Error(
        `Invalid start or end passed to Text.format(): (${start}, ${end})`
      );
    }

    if ("font-family" in attributes) {
      throw new Error(
        "Changing the font-family for parts of Text is not supported"
      );
    }
    if (
      "font-size" in attributes &&
      !/(%|em|ex|ch)$/.test(attributes["font-size"])
    ) {
      throw new Error(
        "Changing the font-size is only supported for relative units (%, em, ex, ch)"
      );
    }

    for (let i = 0; i < this.slices_.length; i++) {
      const slice = this.slices_[i];
      if (end <= slice.start) {
        // Does not overlap from the left side:
        // Add before the existing slice.
        this.slices_.splice(i, 0, createSlice(start, end, attributes));
        return this;
      }
      if (start >= slice.end) {
        // Does not overlap on the right side:
        // Check with the next slice.
        continue;
      }

      // Overlaps:
      // Split into max three and replace the current.
      const newSlices = [];
      if (start < slice.start) {
        newSlices.push(createSlice(start, slice.start, attributes));
      } else if (start > slice.start) {
        newSlices.push(createSlice(slice.start, start, slice.attributes));
      }

      newSlices.push(
        createSlice(
          Math.max(start, slice.start),
          Math.min(end, slice.end),
          Object.assign({}, slice.attributes, attributes)
        )
      );

      if (end < slice.end) {
        newSlices.push(createSlice(end, slice.end, slice.attributes));
      }

      this.slices_.splice(i, 1, ...newSlices);

      if (end > slice.end) {
        start = slice.end;
        i += newSlices.length - 1;
        continue;
      }
      return this;
    }

    // Didn't find a slice to merge with:
    // Add a new one at the end.
    this.slices_.push(createSlice(start, end, attributes));
    return this;
  }

  formatRegexp(regexp, attributes = {}) {
    if (typeof regexp === "string") {
      regexp = new RegExp(regexp);
    }

    let matches;
    let stop = false;
    while (!stop && (matches = regexp.exec(this.text_)) !== null) {
      this.format(matches.index, matches.index + matches[0].length, attributes);
      stop = !regexp.global;
    }
    return this;
  }

  render() {
    const el = createElement("text", this.attributes_);
    if (this.slices_.length) {
      this.renderSlices_(el);
    } else {
      el.appendChild(document.createTextNode(this.text_));
    }

    el.setAttributeNS(null, "x", this.x.value);
    el.setAttributeNS(null, "y", this.y.value);
    el.setAttributeNS(null, "font-size", this.fontSize.value);

    return el;
  }

  renderSlices_(el) {
    let position = 0;
    for (const { start, end, attributes } of this.slices_) {
      if (position < start) {
        el.appendChild(
          document.createTextNode(this.text_.slice(position, start))
        );
        position = start;
      }

      const span = createElement("tspan", attributes);
      span.textContent = this.text_.slice(position, end);
      el.appendChild(span);
      position = end;
    }

    if (position < this.text_.length) {
      el.appendChild(document.createTextNode(this.text_.slice(position)));
    }
  }

  adjustDimensions_() {
    const el = this.render();
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
