import "clay-button";
import "clay-icon";
import "clay-select";
import Component from "metal-component";
import Soy from "metal-soy";
import { Config } from "metal-state";

import templates from "./ClayQueryRow.soy.js";

class ClayQueryRow extends Component {
	created() {
		console.log("testing query row");

		console.log("testing");
	}
}

ClayQueryRow.STATE = {
    editing: Config.bool().value(false)
}

ClayQueryRow.PROPS = {
	criteria: Config.object().required(),
	criteriaChangeable: Config.bool(),
	criteriaTypes: Config.object().required(),
	fieldTypes: Config.object().required(),
	operators: Config.array().required()
};

Soy.register(ClayQueryRow, templates);

export { ClayQueryRow };
export default ClayQueryRow;
