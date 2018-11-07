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

var $templateAlias2 = Soy.getTemplate('ClayButton.incrementaldom', 'render');

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
  /** @type {!goog.soy.data.SanitizedContent|string} */
  var spritemap = soy.asserts.assertType(goog.isString(opt_data.spritemap) || opt_data.spritemap instanceof goog.soy.data.SanitizedContent, 'spritemap', opt_data.spritemap, '!goog.soy.data.SanitizedContent|string');
  /** @type {!Object<!goog.soy.data.SanitizedContent|string,?>} */
  var criteria = soy.asserts.assertType(goog.isObject(opt_data.criteria), 'criteria', opt_data.criteria, '!Object<!goog.soy.data.SanitizedContent|string,?>');
  /** @type {!Object<!goog.soy.data.SanitizedContent|string,?>} */
  var conjunctions = soy.asserts.assertType(goog.isObject(opt_data.conjunctions), 'conjunctions', opt_data.conjunctions, '!Object<!goog.soy.data.SanitizedContent|string,?>');
  /** @type {!Object<!goog.soy.data.SanitizedContent|string,?>} */
  var operators = soy.asserts.assertType(goog.isObject(opt_data.operators), 'operators', opt_data.operators, '!Object<!goog.soy.data.SanitizedContent|string,?>');
  /** @type {!Array<?>} */
  var queries = soy.asserts.assertType(goog.isArray(opt_data.queries), 'queries', opt_data.queries, '!Array<?>');
  incrementalDom.elementOpenStart('div');
      incrementalDom.attr('class', 'query-builder-root');
  incrementalDom.elementOpenEnd();
  var query10List = queries;
  var query10ListLen = query10List.length;
  for (var query10Index = 0; query10Index < query10ListLen; query10Index++) {
    var query10Data = query10List[query10Index];
    if (!(query10Index == 0)) {
      var conjunction__soy16 = conjunctions[query10Data.conjunctionId];
      $templateAlias2({label: conjunction__soy16.label}, opt_ijData);
    }
    $templateAlias1({criteria: criteria, conjunctions: conjunctions, operators: operators, queries: query10Data, spritemap: spritemap}, opt_ijData);
  }
  incrementalDom.elementClose('div');
};
exports.render = $render;
/**
 * @typedef {{
 *  spritemap: (!goog.soy.data.SanitizedContent|string),
 *  criteria: !Object<!goog.soy.data.SanitizedContent|string,?>,
 *  conjunctions: !Object<!goog.soy.data.SanitizedContent|string,?>,
 *  operators: !Object<!goog.soy.data.SanitizedContent|string,?>,
 *  queries: !Array<?>,
 * }}
 */
$render.Params;
if (goog.DEBUG) {
  $render.soyTemplateName = 'ClayQueryBuilder.render';
}

exports.render.params = ["spritemap","criteria","conjunctions","operators","queries"];
exports.render.types = {"spritemap":"string","criteria":"map<string, ?>","conjunctions":"map<string, ?>","operators":"map<string, ?>","queries":"list<?>"};
templates = exports;
return exports;

});

class ClayQueryBuilder extends Component {}
Soy.register(ClayQueryBuilder, templates);
export { ClayQueryBuilder, templates };
export default templates;
/* jshint ignore:end */
