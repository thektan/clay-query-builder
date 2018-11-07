import "clay-button";
import "clay-icon";
import "clay-select";
import Component from "metal-component";
import Soy from "metal-soy";
import { Config } from "metal-state";

import templates from "./ClayQueryRow.soy.js";

class ClayQueryRow extends Component {
	created() {}
}

ClayQueryRow.STATE = {
	editing: Config.bool().value(false)
};

Soy.register(ClayQueryRow, templates);

export { ClayQueryRow };
export default ClayQueryRow;
