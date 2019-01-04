import Text from "./Text";

export default class FormattedText extends Text {
  constructor(text = "", attributes = {}) {
    super(text, attributes);
    if (process.env.NODE_ENV !== "production") {
      console.warn("FormattedText is deprecated. Just use Text directly.");
    }
  }

  constraints() {
    return [];
  }
}
