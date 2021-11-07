#!/usr/bin/env node
'use strict';

var chalk = require('chalk');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);

function log(...args) {
    console.log(chalk__default["default"].green(...args));
}

/**
 * For named arguments, use the tiny `minimist` package
 */
const args = process.argv.slice(2);
log(args);
//# sourceMappingURL=index.js.map
