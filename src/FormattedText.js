import Text from "./Text";
import { Equation, Strength } from "cassowary";
import { appendTo, createElement, minBy, maxBy, last } from "./utils";
import { expression, eqAll, fixAll, forEach } from "./helpers";

export default class FormattedText {
  constructor(text = "", attributes = {}) {
    this.children = [];
    this.constraints_ = [];

    this.text_ = text;
    this.slices_ = [
      {
        start: 0,
        end: text.length,
        attributes
      }
    ];

    this.width = null;
    this.height = null;
    this.fontSize = null;
    this.topEdge = null;
    this.rightEdge = null;
    this.bottomEdge = null;
    this.leftEdge = null;
    this.centerX = null;
    this.centerY = null;

    this.recomputeChildren_();
  }

  add(text, attributes = {}) {
    if (!this.text_.length) {
      this.slices_ = [];
    }

    this.slices_.push({
      start: this.text_.length,
      end: this.text_.length + text.length,
      attributes
    });
    this.text_ += text;

    this.recomputeChildren_();
    return this;
  }

  format(start, end, attributes = {}) {
    const intersection = this.getSliceIntersection_(start, end);

    for (let i = intersection[0]; i <= intersection[1]; i++) {
      const slice = this.slices_[i];

      if (slice.start >= start && slice.end <= end) {
        // Slice is fully within our formatting range
        Object.assign(slice.attributes, attributes);
        continue;
      }

      let skip = 0;
      if (slice.start < start && slice.end > end) {
        // Our formatting range is fully within the slice
        const formattedSlice = {
          start,
          end,
          attributes: Object.assign({}, slice.attributes, attributes)
        };
        const clonedSlice = Object.assign({}, slice, { start: end });

        slice.end = start;

        this.slices_.splice(i + 1, 0, formattedSlice, clonedSlice);
        intersection[1] += 2;
        skip = 2;
      } else if (slice.start < start) {
        // Ends of slices intersect
        const newSlice = {
          start,
          end: slice.end,
          attributes: Object.assign({}, slice.attributes, attributes)
        };

        slice.end = start;
        this.slices_.splice(i + 1, 0, newSlice);
        intersection[1]++;
        skip = 1;
      } else if (slice.end > end) {
        // Starts of slices intersect
        const newSlice = {
          start: slice.start,
          end,
          attributes: Object.assign({}, slice.attributes, attributes)
        };

        slice.start = end;
        this.slices_.splice(i, 0, newSlice);
        i++;
      }

      i += skip;
    }

    this.recomputeChildren_();
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
    const el = createElement("g");
    for (const child of this.children) {
      el.appendChild(child.render());
    }

    el.setAttributeNS(null, "data-type", "formatted-text");

    return el;
  }

  constraints() {
    return this.constraints_;
  }

  getSliceIntersection_(start, end) {
    let intersectionStart = -1;
    let intersectionEnd = -1;

    for (let i = 0; i < this.slices_.length; i++) {
      const slice = this.slices_[i];
      if (start < slice.end && end >= slice.start) {
        if (intersectionStart === -1) {
          intersectionStart = i;
        }
        intersectionEnd = i;
      }
    }
    return [intersectionStart, intersectionEnd];
  }

  recomputeChildren_() {
    this.children = this.slices_.map(
      slice =>
        new Text(
          this.text_.slice(slice.start, slice.end),
          Object.assign({ "xml:space": "preserve" }, slice.attributes)
        )
    );

    this.constraints_ = [];
    for (let i = 1; i < this.children.length; i++) {
      const previous = this.children[i - 1];
      const current = this.children[i];

      this.constraints_.push(
        // Align baselines
        new Equation(current.baseline, previous.baseline, Strength.medium, 1),
        // Put new text to the right of previous text
        new Equation(current.leftEdge, previous.rightEdge, Strength.medium, 1),
        // Make font sizes equal
        new Equation(current.fontSize, previous.fontSize, Strength.medium, 1)
      );
    }

    this.setupExpressions_();
  }

  setupExpressions_() {
    if (!this.children.length) {
      return;
    }

    // Find the top- and bottommost edges based on ratios
    const topMost = minBy(this.children, child => child.ratios.top).topEdge;
    const bottomMost = maxBy(this.children, child => child.ratios.bottom)
      .bottomEdge;

    this.fontSize = expression(this.children[0].fontSize);
    this.topEdge = expression(topMost);
    this.bottomEdge = expression(bottomMost);
    this.leftEdge = expression(this.children[0].leftEdge);
    this.rightEdge = expression(last(this.children).rightEdge);
    this.width = this.rightEdge.minus(this.leftEdge);
    this.height = this.bottomEdge.minus(this.topEdge);
    this.centerX = this.leftEdge.plus(this.rightEdge).divide(2);
    this.centerY = this.topEdge.plus(this.bottomEdge).divide(2);
  }

  forEach(constraint) {
    appendTo(this.constraints_, forEach(this.children, constraint));
    return this;
  }

  fixAll(getter) {
    appendTo(this.constraints_, fixAll(this.children, getter));
    return this;
  }

  eqAll(getter) {
    appendTo(this.constraints_, eqAll(this.children, getter));
    return this;
  }
}
