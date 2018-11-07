import Component from "metal-component";
import defineWebComponent from "metal-web-component";
import Soy from "metal-soy";
import { Config } from "metal-state";

import templates from "./ClayQueryGroup.soy.js";

class ClayQueryGroup extends Component {}

Soy.register(ClayQueryGroup, templates);

export { ClayQueryGroup };
export default ClayQueryGroup;
