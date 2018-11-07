/* jshint ignore:start */
import Component from 'metal-component';
import Soy from 'metal-soy';

var templates;
goog.loadModule(function(exports) {
var soy = goog.require('soy');
var soydata = goog.require('soydata');
// This file was automatically generated from ClayQueryRow.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace ClayQueryRow.
 * @public
 */

goog.module('ClayQueryRow.incrementaldom');

goog.require('goog.soy.data.SanitizedContent');
var incrementalDom = goog.require('incrementaldom');
goog.require('soy.asserts');
var soyIdom = goog.require('soy.idom');

var $templateAlias2 = Soy.getTemplate('ClayButton.incrementaldom', 'render');

var $templateAlias1 = Soy.getTemplate('ClaySelect.incrementaldom', 'render');


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
  incrementalDom.elementOpenStart('div');
      incrementalDom.attr('class', 'query-row');
  incrementalDom.elementOpenEnd();
  incrementalDom.elementOpenStart('div');
      incrementalDom.attr('class', 'form-group-autofit');
  incrementalDom.elementOpenEnd();
  incrementalDom.elementOpenStart('div');
      incrementalDom.attr('class', 'form-group-item');
  incrementalDom.elementOpenEnd();
  $templateAlias1({multiple: false, name: 'criteria', options: [{label: 'Option 1', value: '1'}, {label: 'Option 2', value: '2'}], type: 'button'}, opt_ijData);
  incrementalDom.elementClose('div');
  incrementalDom.elementOpenStart('div');
      incrementalDom.attr('class', 'form-group-item');
  incrementalDom.elementOpenEnd();
  $templateAlias1({multiple: false, name: 'criteria', options: [{label: 'is', value: 'is'}, {label: 'is not', value: 'is not'}], type: 'button'}, opt_ijData);
  incrementalDom.elementClose('div');
  incrementalDom.elementOpenStart('div');
      incrementalDom.attr('class', 'form-group-item');
  incrementalDom.elementOpenEnd();
  incrementalDom.elementOpenStart('input');
      incrementalDom.attr('class', 'form-control');
      incrementalDom.attr('id', 'queryRowValue');
      incrementalDom.attr('type', 'text');
  incrementalDom.elementOpenEnd();
  incrementalDom.elementClose('input');
  incrementalDom.elementClose('div');
  incrementalDom.elementOpenStart('div');
      incrementalDom.attr('class', 'form-group-item form-group-item-shrink');
  incrementalDom.elementOpenEnd();
  incrementalDom.elementOpenStart('div');
      incrementalDom.attr('class', 'btn-group');
  incrementalDom.elementOpenEnd();
  incrementalDom.elementOpenStart('div');
      incrementalDom.attr('class', 'btn-group-item');
  incrementalDom.elementOpenEnd();
  $templateAlias2({icon: 'check', monospaced: true, spritemap: spritemap}, opt_ijData);
  incrementalDom.elementClose('div');
  incrementalDom.elementOpenStart('div');
      incrementalDom.attr('class', 'btn-group-item');
  incrementalDom.elementOpenEnd();
  $templateAlias2({icon: 'times', monospaced: true, spritemap: spritemap, style: 'secondary'}, opt_ijData);
  incrementalDom.elementClose('div');
  incrementalDom.elementClose('div');
  incrementalDom.elementClose('div');
  incrementalDom.elementClose('div');
  incrementalDom.elementClose('div');
};
exports.render = $render;
/**
 * @typedef {{
 *  spritemap: (!goog.soy.data.SanitizedContent|string),
 * }}
 */
$render.Params;
if (goog.DEBUG) {
  $render.soyTemplateName = 'ClayQueryRow.render';
}

exports.render.params = ["spritemap"];
exports.render.types = {"spritemap":"string"};
templates = exports;
return exports;

});

class ClayQueryRow extends Component {}
Soy.register(ClayQueryRow, templates);
export { ClayQueryRow, templates };
export default templates;
/* jshint ignore:end */
