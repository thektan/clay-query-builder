/* jshint ignore:start */
import Component from 'metal-component';
import Soy from 'metal-soy';

var templates;
goog.loadModule(function(exports) {
var soy = goog.require('soy');
var soydata = goog.require('soydata');
// This file was automatically generated from ClayQueryBuilder.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace ClayQueryBuilder.
 * @public
 */

goog.module('ClayQueryBuilder.incrementaldom');

goog.require('goog.soy.data.SanitizedContent');
var incrementalDom = goog.require('incrementaldom');
goog.require('soy.asserts');
var soyIdom = goog.require('soy.idom');

var $templateAlias1 = Soy.getTemplate('ClayQueryGroup.incrementaldom', 'render');


/**
 * @param {$render.Params} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {void}
 * @suppress {checkTypes|uselessCode}
 */
var $render = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  /** @type {!Array<?>} */
  var conjunctions = soy.asserts.assertType(goog.isArray(opt_data.conjunctions), 'conjunctions', opt_data.conjunctions, '!Array<?>');
  /** @type {!Array<?>} */
  var criteria = soy.asserts.assertType(goog.isArray(opt_data.criteria), 'criteria', opt_data.criteria, '!Array<?>');
  /** @type {!Array<?>} */
  var operators = soy.asserts.assertType(goog.isArray(opt_data.operators), 'operators', opt_data.operators, '!Array<?>');
  /** @type {?} */
  var query = opt_data.query;
  /** @type {!goog.soy.data.SanitizedContent|string} */
  var spritemap = soy.asserts.assertType(goog.isString(opt_data.spritemap) || opt_data.spritemap instanceof goog.soy.data.SanitizedContent, 'spritemap', opt_data.spritemap, '!goog.soy.data.SanitizedContent|string');
  incrementalDom.elementOpenStart('div');
      incrementalDom.attr('class', 'query-builder-root');
  incrementalDom.elementOpenEnd();
  $templateAlias1({criteria: criteria, conjunctions: conjunctions, operators: operators, query: query, spritemap: spritemap}, opt_ijData);
  incrementalDom.elementClose('div');
};
exports.render = $render;
/**
 * @typedef {{
 *  conjunctions: !Array<?>,
 *  criteria: !Array<?>,
 *  operators: !Array<?>,
 *  query: (?|undefined),
 *  spritemap: (!goog.soy.data.SanitizedContent|string),
 * }}
 */
$render.Params;
if (goog.DEBUG) {
  $render.soyTemplateName = 'ClayQueryBuilder.render';
}

exports.render.params = ["conjunctions","criteria","operators","query","spritemap"];
exports.render.types = {"conjunctions":"list<?>","criteria":"list<?>","operators":"list<?>","query":"?","spritemap":"string"};
templates = exports;
return exports;

});

class ClayQueryBuilder extends Component {}
Soy.register(ClayQueryBuilder, templates);
export { ClayQueryBuilder, templates };
export default templates;
/* jshint ignore:end */
