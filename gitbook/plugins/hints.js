(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.GitBookPlugin = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],2:[function(require,module,exports){
'use strict';

var classNames = require('classnames');
var GitBook = require('gitbook-core');
var React = GitBook.React;


var STYLE_TO_ICON = {
    info: 'info-circle',
    tip: 'question',
    success: 'check-circle',
    danger: 'exclamation-circle',
    warning: 'exclamation-triangle'
};

var HintAlert = React.createClass({
    displayName: 'HintAlert',

    propTypes: {
        icon: React.PropTypes.string,
        style: React.PropTypes.string,
        children: React.PropTypes.node
    },

    render: function render() {
        var _props = this.props,
            children = _props.children,
            style = _props.style,
            icon = _props.icon;

        var className = classNames('HintAlert', 'HintAlert-Style-' + style, 'alert', 'alert-' + style);

        return React.createElement(
            'div',
            { className: className },
            React.createElement(GitBook.ImportCSS, { href: 'gitbook/hints/plugin.css' }),
            React.createElement(
                'div',
                { className: 'HintAlert-Icon' },
                React.createElement(GitBook.Icon, { id: icon || STYLE_TO_ICON[style] })
            ),
            React.createElement(
                'div',
                { className: 'HintAlert-Content' },
                children
            )
        );
    }
});

module.exports = GitBook.createPlugin({
    activate: function activate(dispatch, getState, _ref) {
        var Components = _ref.Components;

        dispatch(Components.registerComponent(HintAlert, { role: 'block:hint' }));
    }
});

},{"classnames":1,"gitbook-core":"gitbook-core"}]},{},[2])(2)
});