/* jshint ignore:start */
import Component from 'metal-component';
import Soy from 'metal-soy';

var templates;
goog.loadModule(function(exports) {
var soy = goog.require('soy');
var soydata = goog.require('soydata');
// This file was automatically generated from ClayQueryGroup.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace ClayQueryGroup.
 * @public
 */

goog.module('ClayQueryGroup.incrementaldom');

goog.require('goog.soy.data.SanitizedContent');
var incrementalDom = goog.require('incrementaldom');
goog.require('soy.asserts');
var soyIdom = goog.require('soy.idom');

var $templateAlias1 = Soy.getTemplate('ClayButton.incrementaldom', 'render');

var $templateAlias2 = Soy.getTemplate('ClayQueryRow.incrementaldom', 'render');


/**
 * @param {$render.Params} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {void}
 * @suppress {checkTypes|uselessCode}
 */
var $render = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  /** @type {!goog.soy.data.SanitizedContent|string} */
  var spritemap = soy.asserts.assertType(goog.isString(opt_data.spritemap) || opt_data.spritemap instanceof goog.soy.data.SanitizedContent, 'spritemap', opt_data.spritemap, '!goog.soy.data.SanitizedContent|string');
  /** @type {!Array<?>} */
  var criteria = soy.asserts.assertType(goog.isArray(opt_data.criteria), 'criteria', opt_data.criteria, '!Array<?>');
  /** @type {!Array<?>} */
  var conjunctions = soy.asserts.assertType(goog.isArray(opt_data.conjunctions), 'conjunctions', opt_data.conjunctions, '!Array<?>');
  /** @type {?} */
  var conjunctionSelected = opt_data.conjunctionSelected;
  /** @type {!Array<?>} */
  var operators = soy.asserts.assertType(goog.isArray(opt_data.operators), 'operators', opt_data.operators, '!Array<?>');
  /** @type {?} */
  var query = opt_data.query;
  incrementalDom.elementOpenStart('div');
      incrementalDom.attr('class', 'sheet');
  incrementalDom.elementOpenEnd();
  var item35List = query.items;
  var item35ListLen = item35List.length;
  for (var item35Index = 0; item35Index < item35ListLen; item35Index++) {
    var item35Data = item35List[item35Index];
    if (!(item35Index == 0)) {
      $templateAlias1({label: conjunctionSelected.label}, opt_ijData);
    }
    if ((item35Data.items != null)) {
      $render({criteria: criteria, conjunctions: conjunctions, operators: operators, query: item35Data, spritemap: spritemap}, opt_ijData);
    } else {
      $templateAlias2({criteria: criteria, conjunctions: conjunctions, operators: operators, query: item35Data, criteriaId: item35Data.criteriaId, operatorId: item35Data.operatorId, value: item35Data.value, spritemap: spritemap}, opt_ijData);
    }
  }
  incrementalDom.elementClose('div');
};
exports.render = $render;
/**
 * @typedef {{
 *  spritemap: (!goog.soy.data.SanitizedContent|string),
 *  criteria: !Array<?>,
 *  conjunctions: !Array<?>,
 *  conjunctionSelected: (?|undefined),
 *  operators: !Array<?>,
 *  query: ?,
 * }}
 */
$render.Params;
if (goog.DEBUG) {
  $render.soyTemplateName = 'ClayQueryGroup.render';
}

exports.render.params = ["spritemap","criteria","conjunctions","conjunctionSelected","operators","query"];
exports.render.types = {"spritemap":"string","criteria":"list<?>","conjunctions":"list<?>","conjunctionSelected":"?","operators":"list<?>","query":"?"};
templates = exports;
return exports;

});

class ClayQueryGroup extends Component {}
Soy.register(ClayQueryGroup, templates);
export { ClayQueryGroup, templates };
export default templates;
/* jshint ignore:end */
