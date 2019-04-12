import Gradient from './Gradient';
import Attributes from './Attributes';

export default class LinearGradient extends Gradient {
  constructor(attributes: Attributes = {}) {
    super("linearGradient", attributes);
  }
}