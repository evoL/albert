import Gradient from "./Gradient";
import Attributes from "./Attributes";


export default class RadialGreadient extends Gradient {
  constructor(attributes: Attributes = {}) {
    super("radialGradient", attributes);
  }
}