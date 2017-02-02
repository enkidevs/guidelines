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
module.exports = Date.now || now

function now() {
    return new Date().getTime()
}

},{}],3:[function(require,module,exports){

/**
 * Module dependencies.
 */

var now = require('date-now');

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 *
 * @source underscore.js
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 */

module.exports = function debounce(func, wait, immediate){
  var timeout, args, context, timestamp, result;
  if (null == wait) wait = 100;

  function later() {
    var last = now() - timestamp;

    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function debounced() {
    context = this;
    args = arguments;
    timestamp = now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
};

},{"date-now":2}],4:[function(require,module,exports){
'use strict';

var ActionTypes = require('./types');

/**
 * Toggle the sidebar
 * @return {Action}
 */
function toggle() {
    return { type: ActionTypes.TOGGLE_SIDEBAR };
}

module.exports = {
    toggle: toggle
};

},{"./types":5}],5:[function(require,module,exports){
'use strict';

module.exports = {
    TOGGLE_SIDEBAR: 'theme-default/sidebar/toggle'
};

},{}],6:[function(require,module,exports){
'use strict';

var debounce = require('debounce');
var GitBook = require('gitbook-core');
var React = GitBook.React;


var Page = require('./Page');
var Toolbar = require('./Toolbar');

var HEADINGS_SELECTOR = 'h1[id],h2[id],h3[id],h4[id]';

/**
 * Get offset of an element relative to a parent container.
 * @param  {DOMElement} container
 * @param  {DOMElement} element
 * @return {Number} offset
 */
function getOffset(container, element) {
    var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Top';

    var parent = element.parentElement;
    var base = 0;

    if (parent != container) {
        base = getOffset(container, parent, type);
    }

    return base + element['offset' + type];
}

/**
 * Find the current heading anchor for a scroll position.
 * @param  {DOMElement} container
 * @param  {Number} top
 * @return {String}
 */
function getHeadingID(container, top) {
    var id = void 0;
    var headings = container.querySelectorAll(HEADINGS_SELECTOR);

    headings.forEach(function (heading) {
        if (id) {
            return;
        }

        var offset = getOffset(container, heading);

        if (offset > top) {
            id = heading.getAttribute('id');
        }
    });

    return id;
}

var Body = React.createClass({
    displayName: 'Body',

    propTypes: {
        page: GitBook.PropTypes.Page,
        readme: GitBook.PropTypes.Readme,
        history: GitBook.PropTypes.History,
        updateURI: React.PropTypes.func
    },

    getInitialState: function getInitialState() {
        this.debouncedOnScroll = debounce(this.onScroll, 300);
        return {};
    },


    /**
     * User is scrolling the page, update the location with current section's ID.
     */
    onScroll: function onScroll() {
        var scrollContainer = this.scrollContainer;
        var _props = this.props,
            history = _props.history,
            updateURI = _props.updateURI;
        var location = history.location;

        // Find the id matching the current scroll position

        var hash = getHeadingID(scrollContainer, scrollContainer.scrollTop);

        // Update url if changed
        if (hash !== location.hash) {
            updateURI(location.merge({ hash: hash }));
        }
    },


    /**
     * Component has been updated with a new location,
     * scroll to the right anchor.
     */
    componentDidUpdate: function componentDidUpdate() {},
    render: function render() {
        var _this = this;

        var _props2 = this.props,
            page = _props2.page,
            readme = _props2.readme;


        return React.createElement(
            GitBook.InjectedComponent,
            { matching: { role: 'body:wrapper' } },
            React.createElement(
                'div',
                {
                    className: 'Body page-wrapper',
                    onScroll: this.debouncedOnScroll,
                    ref: function ref(div) {
                        return _this.scrollContainer = div;
                    }
                },
                React.createElement(
                    GitBook.InjectedComponent,
                    { matching: { role: 'toolbar:wrapper' } },
                    React.createElement(Toolbar, { title: page.title, readme: readme })
                ),
                React.createElement(
                    GitBook.InjectedComponent,
                    { matching: { role: 'page:wrapper' } },
                    React.createElement(Page, { page: page })
                )
            )
        );
    }
});

module.exports = GitBook.connect(Body, function () {
    return {};
}, function (_ref, dispatch) {
    var History = _ref.History;

    return {
        updateURI: function updateURI(location) {
            return dispatch(History.replace(location));
        }
    };
});

},{"./Page":8,"./Toolbar":12,"debounce":3,"gitbook-core":"gitbook-core"}],7:[function(require,module,exports){
'use strict';

var GitBook = require('gitbook-core');
var React = GitBook.React;

/**
 * Displays a progress bar (YouTube-like) at the top of container
 * Based on https://github.com/lonelyclick/react-loading-bar/blob/master/src/Loading.jsx
 */

var LoadingBar = React.createClass({
    displayName: 'LoadingBar',

    propTypes: {
        show: React.PropTypes.bool
    },

    getDefaultProps: function getDefaultProps() {
        return {
            show: false
        };
    },
    getInitialState: function getInitialState() {
        return {
            size: 0,
            disappearDelayHide: false, // when dispappear, first transition then display none
            percent: 0,
            appearDelayWidth: 0 // when appear, first display block then transition width
        };
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        var show = nextProps.show;


        if (show) {
            this.show();
        } else {
            this.hide();
        }
    },
    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
        return true; // !shallowEqual(nextState, this.state)
    },
    show: function show() {
        var _this = this;

        var _state = this.state,
            size = _state.size,
            percent = _state.percent;


        var appearDelayWidth = size === 0;
        percent = calculatePercent(percent);

        this.setState({
            size: ++size,
            appearDelayWidth: appearDelayWidth,
            percent: percent
        });

        if (appearDelayWidth) {
            setTimeout(function () {
                _this.setState({
                    appearDelayWidth: false
                });
            });
        }
    },
    hide: function hide() {
        var _this2 = this;

        var size = this.state.size;


        if (--size < 0) {
            this.setState({ size: 0 });
            return;
        }

        this.setState({
            size: 0,
            disappearDelayHide: true,
            percent: 1
        });

        setTimeout(function () {
            _this2.setState({
                disappearDelayHide: false,
                percent: 0
            });
        }, 500);
    },
    getBarStyle: function getBarStyle() {
        var _state2 = this.state,
            disappearDelayHide = _state2.disappearDelayHide,
            appearDelayWidth = _state2.appearDelayWidth,
            percent = _state2.percent;


        return {
            width: appearDelayWidth ? 0 : percent * 100 + '%',
            display: disappearDelayHide || percent > 0 ? 'block' : 'none'
        };
    },
    getShadowStyle: function getShadowStyle() {
        var _state3 = this.state,
            percent = _state3.percent,
            disappearDelayHide = _state3.disappearDelayHide;


        return {
            display: disappearDelayHide || percent > 0 ? 'block' : 'none'
        };
    },
    render: function render() {
        return React.createElement(
            'div',
            { className: 'LoadingBar' },
            React.createElement(
                'div',
                { className: 'LoadingBar-Bar', style: this.getBarStyle() },
                React.createElement('div', { className: 'LoadingBar-Shadow',
                    style: this.getShadowStyle() })
            )
        );
    }
});

function calculatePercent(percent) {
    percent = percent || 0;

    // How much of remaining bar we advance
    var progress = 0.1 + Math.random() * 0.3;

    return percent + progress * (1 - percent);
}

module.exports = LoadingBar;

},{"gitbook-core":"gitbook-core"}],8:[function(require,module,exports){
'use strict';

var GitBook = require('gitbook-core');
var React = GitBook.React;


var Page = React.createClass({
    displayName: 'Page',

    propTypes: {
        page: GitBook.PropTypes.Page
    },

    render: function render() {
        var page = this.props.page;


        return React.createElement(
            'div',
            { className: 'PageContainer' },
            React.createElement(
                GitBook.InjectedComponent,
                { matching: { role: 'search:container:results' }, props: this.props },
                React.createElement(
                    'div',
                    { className: 'Page' },
                    React.createElement(GitBook.InjectedComponentSet, { matching: { role: 'page:header' }, props: this.props }),
                    React.createElement(
                        GitBook.InjectedComponent,
                        { matching: { role: 'page:container' }, props: this.props },
                        React.createElement(GitBook.HTMLContent, { html: page.content })
                    ),
                    React.createElement(GitBook.InjectedComponentSet, { matching: { role: 'page:footer' }, props: this.props })
                )
            )
        );
    }
});

module.exports = Page;

},{"gitbook-core":"gitbook-core"}],9:[function(require,module,exports){
'use strict';

var GitBook = require('gitbook-core');
var React = GitBook.React;


var Summary = require('./Summary');

/**
 * The GitBook trademark.
 * @type {ReactClass}
 */
var GitBookTrademark = React.createClass({
    displayName: 'GitBookTrademark',
    render: function render() {
        return React.createElement(
            'a',
            { className: 'GitBookTrademark', href: 'https://www.gitbook.com/?utm_source=gitbook&utm_medium=trademark', target: '_blank' },
            React.createElement(
                'span',
                null,
                'Published with ',
                React.createElement(
                    'b',
                    null,
                    'GitBook'
                )
            ),
            React.createElement(GitBook.Image, { src: 'gitbook/theme-default/images/logo.svg' })
        );
    }
});

/**
 * Sidebar containing a serch bar, the table of contents, and the GitBook trademark.
 * @type {ReactClass}
 */
var Sidebar = React.createClass({
    displayName: 'Sidebar',

    propTypes: {
        summary: GitBook.PropTypes.Summary
    },

    render: function render() {
        var summary = this.props.summary;


        return React.createElement(
            'div',
            { className: 'Sidebar-Flex' },
            React.createElement(
                'div',
                { className: 'Sidebar book-summary' },
                React.createElement(GitBook.InjectedComponent, { matching: { role: 'search:container:input' } }),
                React.createElement(Summary, { summary: summary }),
                React.createElement(GitBookTrademark, null)
            )
        );
    }
});

module.exports = Sidebar;

},{"./Summary":10,"gitbook-core":"gitbook-core"}],10:[function(require,module,exports){
'use strict';

var classNames = require('classnames');
var GitBook = require('gitbook-core');
var React = GitBook.React;


var SummaryArticle = React.createClass({
    displayName: 'SummaryArticle',

    propTypes: {
        active: React.PropTypes.bool,
        article: GitBook.PropTypes.SummaryArticle
    },

    render: function render() {
        var _props = this.props,
            article = _props.article,
            active = _props.active;

        var className = classNames('SummaryArticle', {
            active: active
        });

        return React.createElement(
            GitBook.InjectedComponent,
            { matching: { role: 'summary:article' }, props: this.props },
            React.createElement(
                'li',
                { className: className },
                article.ref ? React.createElement(
                    GitBook.Link,
                    { to: article },
                    article.title
                ) : React.createElement(
                    'span',
                    null,
                    article.title
                )
            )
        );
    }
});
SummaryArticle = GitBook.connect(SummaryArticle, function (_ref, _ref2) {
    var page = _ref.page;
    var article = _ref2.article;

    return {
        active: page.level === article.level
    };
});

var SummaryArticles = React.createClass({
    displayName: 'SummaryArticles',

    propTypes: {
        articles: GitBook.PropTypes.listOf(GitBook.PropTypes.SummaryArticle)
    },

    render: function render() {
        var articles = this.props.articles;


        return React.createElement(
            GitBook.InjectedComponent,
            { matching: { role: 'summary:articles' }, props: this.props },
            React.createElement(
                'ul',
                { className: 'SummaryArticles' },
                articles.map(function (article) {
                    return React.createElement(SummaryArticle, { key: article.level, article: article });
                })
            )
        );
    }
});

var SummaryPart = React.createClass({
    displayName: 'SummaryPart',

    propTypes: {
        part: GitBook.PropTypes.SummaryPart
    },

    render: function render() {
        var part = this.props.part;
        var title = part.title,
            articles = part.articles;


        var titleEL = title ? React.createElement(
            'h2',
            { className: 'SummaryPart-Title' },
            title
        ) : null;

        return React.createElement(
            GitBook.InjectedComponent,
            { matching: { role: 'summary:part' }, props: this.props },
            React.createElement(
                'div',
                { className: 'SummaryPart' },
                titleEL,
                React.createElement(SummaryArticles, { articles: articles })
            )
        );
    }
});

var SummaryParts = React.createClass({
    displayName: 'SummaryParts',

    propTypes: {
        parts: GitBook.PropTypes.listOf(GitBook.PropTypes.SummaryPart)
    },

    render: function render() {
        var parts = this.props.parts;


        return React.createElement(
            GitBook.InjectedComponent,
            { matching: { role: 'summary:parts' }, props: this.props },
            React.createElement(
                'div',
                { className: 'SummaryParts' },
                parts.map(function (part, i) {
                    return React.createElement(SummaryPart, { key: i, part: part });
                })
            )
        );
    }
});

var Summary = React.createClass({
    displayName: 'Summary',

    propTypes: {
        summary: GitBook.PropTypes.Summary
    },

    render: function render() {
        var summary = this.props.summary;
        var parts = summary.parts;


        return React.createElement(
            GitBook.InjectedComponent,
            { matching: { role: 'summary:container' }, props: this.props },
            React.createElement(
                'div',
                { className: 'Summary book-summary' },
                React.createElement(SummaryParts, { parts: parts })
            )
        );
    }
});

module.exports = Summary;

},{"classnames":1,"gitbook-core":"gitbook-core"}],11:[function(require,module,exports){
'use strict';

var GitBook = require('gitbook-core');
var React = GitBook.React,
    ReactCSSTransitionGroup = GitBook.ReactCSSTransitionGroup;


var Sidebar = require('./Sidebar');
var Body = require('./Body');
var LoadingBar = require('./LoadingBar');

var Theme = React.createClass({
    displayName: 'Theme',

    propTypes: {
        // State
        file: GitBook.PropTypes.File,
        page: GitBook.PropTypes.Page,
        summary: GitBook.PropTypes.Summary,
        readme: GitBook.PropTypes.Readme,
        history: GitBook.PropTypes.History,
        sidebar: React.PropTypes.object,
        // Other props
        children: React.PropTypes.node
    },

    render: function render() {
        var _props = this.props,
            file = _props.file,
            page = _props.page,
            summary = _props.summary,
            children = _props.children,
            sidebar = _props.sidebar,
            readme = _props.readme,
            history = _props.history;


        return React.createElement(
            GitBook.FlexLayout,
            { column: true, className: 'GitBook book' },
            React.createElement(LoadingBar, { show: history.loading }),
            React.createElement(GitBook.Head, {
                title: page.title,
                titleTemplate: '%s - GitBook',
                link: [{ rel: 'shortcut icon', href: file.relative('gitbook/theme-default/images/favicon.ico') }]
            }),
            React.createElement(GitBook.ImportCSS, { href: 'gitbook/theme-default/theme.css' }),
            React.createElement(
                GitBook.FlexBox,
                null,
                React.createElement(
                    ReactCSSTransitionGroup,
                    {
                        component: GitBook.FlexLayout,
                        transitionName: 'Layout',
                        transitionEnterTimeout: 300,
                        transitionLeaveTimeout: 300 },
                    sidebar.open ? React.createElement(Sidebar, { key: 0, summary: summary }) : null,
                    React.createElement(
                        'div',
                        { key: 1, className: 'Body-Flex' },
                        React.createElement(Body, {
                            page: page,
                            readme: readme,
                            history: history
                        })
                    )
                )
            ),
            children
        );
    }
});

module.exports = GitBook.connect(Theme, function (_ref) {
    var file = _ref.file,
        page = _ref.page,
        summary = _ref.summary,
        sidebar = _ref.sidebar,
        readme = _ref.readme,
        history = _ref.history;

    return { file: file, page: page, summary: summary, sidebar: sidebar, readme: readme, history: history };
});

},{"./Body":6,"./LoadingBar":7,"./Sidebar":9,"gitbook-core":"gitbook-core"}],12:[function(require,module,exports){
'use strict';

var GitBook = require('gitbook-core');
var React = GitBook.React;


var sidebar = require('../actions/sidebar');

var Toolbar = React.createClass({
    displayName: 'Toolbar',

    propTypes: {
        title: React.PropTypes.string.isRequired,
        dispatch: React.PropTypes.func,
        readme: GitBook.PropTypes.Readme
    },

    onToggle: function onToggle() {
        var dispatch = this.props.dispatch;

        dispatch(sidebar.toggle());
    },
    render: function render() {
        var _props = this.props,
            title = _props.title,
            readme = _props.readme;


        return React.createElement(
            GitBook.FlexLayout,
            { className: 'Toolbar' },
            React.createElement(
                GitBook.FlexBox,
                { className: 'Toolbar-left' },
                React.createElement(
                    GitBook.InjectedComponentSet,
                    { align: 'flex-end', matching: { role: 'toolbar:buttons:left' } },
                    React.createElement(
                        GitBook.Button,
                        { onClick: this.onToggle },
                        React.createElement(GitBook.Icon, { id: 'align-justify' })
                    )
                )
            ),
            React.createElement(
                GitBook.FlexBox,
                { auto: true },
                React.createElement(
                    'h1',
                    { className: 'Toolbar-Title' },
                    React.createElement(
                        GitBook.Link,
                        { to: readme.file },
                        title
                    )
                )
            ),
            React.createElement(
                GitBook.FlexBox,
                { className: 'Toolbar-right' },
                React.createElement(GitBook.InjectedComponentSet, { align: 'flex-end', matching: { role: 'toolbar:buttons:right' } })
            )
        );
    }
});

module.exports = GitBook.connect(Toolbar);

},{"../actions/sidebar":4,"gitbook-core":"gitbook-core"}],13:[function(require,module,exports){
module.exports={
    "LANGS_CHOOSE": "اختيار اللغة",
    "GLOSSARY": "قاموس مصطلحات",
    "GLOSSARY_INDEX": "مؤشر المصطلحات",
    "GLOSSARY_OPEN": "قاموس مصطلحات",
    "GITBOOK_LINK": "نشرت مع GitBook",
    "SUMMARY": "جدول المحتويات",
    "SUMMARY_INTRODUCTION": "مقدمة",
    "SUMMARY_TOGGLE": "جدول المحتويات",
    "SEARCH_TOGGLE": "بحث",
    "SEARCH_PLACEHOLDER": "اكتب للبحث",
    "FONTSETTINGS_TOGGLE": "إعدادات الخط",
    "SHARE_TOGGLE": "حصة",
    "SHARE_ON": "على {{platform}} حصة",
    "FONTSETTINGS_WHITE": "أبيض",
    "FONTSETTINGS_SEPIA": "بني داكن",
    "FONTSETTINGS_NIGHT": "ليل",
    "FONTSETTINGS_SANS": "بلا",
    "FONTSETTINGS_SERIF": "الرقيق"
}

},{}],14:[function(require,module,exports){
module.exports={
    "LANGS_CHOOSE": "ভাষা নির্বাচন করুন",
    "GLOSSARY": "গ্লোসারি",
    "GLOSSARY_INDEX": "ইন্ডেক্স",
    "GLOSSARY_OPEN": "গ্লোসারি",
    "GITBOOK_LINK": "গিটবুকের মাধ্যমে প্রকাশিত",
    "SUMMARY": "সূচিপত্র",
    "SUMMARY_INTRODUCTION": "সূচনা",
    "SUMMARY_TOGGLE": "সূচিপত্র",
    "SEARCH_TOGGLE": "অনুসন্ধান",
    "SEARCH_PLACEHOLDER": "অনুসন্ধান",
    "FONTSETTINGS_TOGGLE": "ফন্ট সেটিংস",
    "SHARE_TOGGLE": "শেয়ার",
    "SHARE_ON": "{{platform}}-এ শেয়ার",
    "FONTSETTINGS_WHITE": "সাদা",
    "FONTSETTINGS_SEPIA": "সেপিয়া",
    "FONTSETTINGS_NIGHT": "রাত",
    "FONTSETTINGS_SANS": "স্যান্স",
    "FONTSETTINGS_SERIF": "শেরিফ"
}

},{}],15:[function(require,module,exports){
module.exports={
    "LANGS_CHOOSE": "Selecciona un idioma",
    "GLOSSARY": "Glossari",
    "GLOSSARY_INDEX": "Índex",
    "GLOSSARY_OPEN": "Glossari",
    "GITBOOK_LINK": "Publicat amb GitBook",
    "SUMMARY": "Taula de contingut",
    "SUMMARY_INTRODUCTION": "Introducció",
    "SUMMARY_TOGGLE": "Taula de contingut",
    "SEARCH_TOGGLE": "Cercar",
    "SEARCH_PLACEHOLDER": "Escriu per cercar",
    "FONTSETTINGS_TOGGLE": "Configuració de font",
    "SHARE_TOGGLE": "Compartir",
    "SHARE_ON": "Compartir en {{platform}}",
    "FONTSETTINGS_WHITE": "Clar",
    "FONTSETTINGS_SEPIA": "Sèpia",
    "FONTSETTINGS_NIGHT": "Nit",
    "FONTSETTINGS_SANS": "Sans",
    "FONTSETTINGS_SERIF": "Serif"
}

},{}],16:[function(require,module,exports){
module.exports={
    "LANGS_CHOOSE": "Zvolte jazyk",
    "GLOSSARY": "Slovníček",
    "GLOSSARY_INDEX": "Rejstřík",
    "GLOSSARY_OPEN": "Slovníček",
    "GITBOOK_LINK": "Publikováno pomocí GitBook",
    "SUMMARY": "Obsah",
    "SUMMARY_INTRODUCTION": "Úvod",
    "SUMMARY_TOGGLE": "Obsah",
    "SEARCH_TOGGLE": "Hledání",
    "SEARCH_PLACEHOLDER": "Vyhledat",
    "FONTSETTINGS_TOGGLE": "Nastavení písma",
    "SHARE_TOGGLE": "Sdílet",
    "SHARE_ON": "Sdílet na {{platform}}",
    "FONTSETTINGS_WHITE": "Bílá",
    "FONTSETTINGS_SEPIA": "Sépie",
    "FONTSETTINGS_NIGHT": "Noc",
    "FONTSETTINGS_SANS": "Bezpatkové",
    "FONTSETTINGS_SERIF": "Patkové"
}

},{}],17:[function(require,module,exports){
module.exports={
    "LANGS_CHOOSE": "Sprache auswählen",
    "GLOSSARY": "Glossar",
    "GLOSSARY_INDEX": "Index",
    "GLOSSARY_OPEN": "Glossar",
    "GITBOOK_LINK": "Veröffentlicht mit GitBook",
    "SUMMARY": "Inhaltsverzeichnis",
    "SUMMARY_INTRODUCTION": "Einleitung",
    "SUMMARY_TOGGLE": "Inhaltsverzeichnis",
    "SEARCH_TOGGLE": "Suche",
    "SEARCH_PLACEHOLDER": "Suchbegriff eingeben",
    "FONTSETTINGS_TOGGLE": "Schrifteinstellungen",
    "SHARE_TOGGLE": "Teilen",
    "SHARE_ON": "Auf {{platform}} teilen",
    "FONTSETTINGS_WHITE": "Hell",
    "FONTSETTINGS_SEPIA": "Sepia",
    "FONTSETTINGS_NIGHT": "Nacht",
    "FONTSETTINGS_SANS": "Sans",
    "FONTSETTINGS_SERIF": "Serif"
}
},{}],18:[function(require,module,exports){
module.exports={
    "LANGS_CHOOSE": "Επιλογή γλώσσας",
    "GLOSSARY": "Γλωσσάρι",
    "GLOSSARY_INDEX": "Ευρετήριο",
    "GLOSSARY_OPEN": "Γλωσσάρι",
    "GITBOOK_LINK": "Δημοσιεύτηκε με το GitBook",
    "SUMMARY": "Πίνακας Περιεχομένων",
    "SUMMARY_INTRODUCTION": "Εισαγωγή",
    "SUMMARY_TOGGLE": "Πίνακας Περιεχομένων",
    "SEARCH_TOGGLE": "Αναζήτηση",
    "SEARCH_PLACEHOLDER": "Αναζήτηση για ...",
    "FONTSETTINGS_TOGGLE": "Επιλογές γραμματοσειράς",
    "SHARE_TOGGLE": "Κοινοποίηση",
    "SHARE_ON": "Κοινοποίηση σε {{platform}}",
    "FONTSETTINGS_WHITE": "Λευκό",
    "FONTSETTINGS_SEPIA": "Καστανόχρους",
    "FONTSETTINGS_NIGHT": "Βραδινό",
    "FONTSETTINGS_SANS": "Χωρίς πατούρες",
    "FONTSETTINGS_SERIF": "Με πατούρες"
}

},{}],19:[function(require,module,exports){
module.exports={
    "LANGS_CHOOSE": "Choose a language",
    "GLOSSARY": "Glossary",
    "GLOSSARY_INDEX": "Index",
    "GLOSSARY_OPEN": "Glossary",
    "GITBOOK_LINK": "Published with GitBook",
    "SUMMARY": "Table of Contents",
    "SUMMARY_INTRODUCTION": "Introduction",
    "SUMMARY_TOGGLE": "Table of Contents",
    "SEARCH_TOGGLE": "Search",
    "SEARCH_PLACEHOLDER": "Type to search",
    "SEARCH_RESULTS_TITLE": "{count, plural, =0 {No results} one {1 result} other {{count} results}} matching \"{query}\"",
    "FONTSETTINGS_TOGGLE": "Font Settings",
    "SHARE_TOGGLE": "Share",
    "SHARE_ON": "Share on {{platform}}",
    "FONTSETTINGS_WHITE": "White",
    "FONTSETTINGS_SEPIA": "Sepia",
    "FONTSETTINGS_NIGHT": "Night",
    "FONTSETTINGS_SANS": "Sans",
    "FONTSETTINGS_SERIF": "Serif"
}

},{}],20:[function(require,module,exports){
module.exports={
    "LANGS_CHOOSE": "Selecciona un idioma",
    "GLOSSARY": "Glosario",
    "GLOSSARY_INDEX": "Índice",
    "GLOSSARY_OPEN": "Glosario",
    "GITBOOK_LINK": "Publicado con GitBook",
    "SUMMARY": "Tabla de contenido",
    "SUMMARY_INTRODUCTION": "Introducción",
    "SUMMARY_TOGGLE": "Tabla de contenido",
    "SEARCH_TOGGLE": "Buscar",
    "SEARCH_PLACEHOLDER": "Escribe para buscar",
    "FONTSETTINGS_TOGGLE": "Configuración de fuente",
    "SHARE_TOGGLE": "Compartir",
    "SHARE_ON": "Compartir en {{platform}}",
    "FONTSETTINGS_WHITE": "Claro",
    "FONTSETTINGS_SEPIA": "Sépia",
    "FONTSETTINGS_NIGHT": "Noche",
    "FONTSETTINGS_SANS": "Sans",
    "FONTSETTINGS_SERIF": "Serif"
}

},{}],21:[function(require,module,exports){
module.exports={
    "LANGS_CHOOSE": "انتخاب زبان",
    "GLOSSARY": "واژه‌نامه",
    "GLOSSARY_INDEX": "فهرست واژه‌ها",
    "GLOSSARY_OPEN": "واژه‌نامه",
    "GITBOOK_LINK": "انتشار یافته توسط GitBook",
    "SUMMARY": "فهرست مطالب",
    "SUMMARY_INTRODUCTION": "مقدمه",
    "SUMMARY_TOGGLE": "فهرست مطالب",
    "SEARCH_TOGGLE": "جستجو",
    "SEARCH_PLACEHOLDER": "چیزی برای جستجو بنویسید",
    "FONTSETTINGS_TOGGLE": "تنظیمات فونت",
    "SHARE_TOGGLE": "اشتراک",
    "SHARE_ON": "در {{platform}} به اشتراک بگذارید",
    "FONTSETTINGS_WHITE": "سفید",
    "FONTSETTINGS_SEPIA": "سپیا",
    "FONTSETTINGS_NIGHT": "شب",
    "FONTSETTINGS_SANS": "سنس",
    "FONTSETTINGS_SERIF": "سریف"
}

},{}],22:[function(require,module,exports){
module.exports={
    "LANGS_CHOOSE": "Valitse kieli",
    "GLOSSARY": "Sanasto",
    "GLOSSARY_INDEX": "Hakemisto",
    "GLOSSARY_OPEN": "Sanasto",
    "GITBOOK_LINK": "Julkaistu GitBookilla",
    "SUMMARY": "Sisällysluettelo",
    "SUMMARY_INTRODUCTION": "Johdanto",
    "SUMMARY_TOGGLE": "Sisällysluettelu",
    "SEARCH_TOGGLE": "Etsi",
    "SEARCH_PLACEHOLDER": "Kirjoita hakusana",
    "FONTSETTINGS_TOGGLE": "Fonttivalinnat",
    "SHARE_TOGGLE": "Jaa",
    "SHARE_ON": "Jaa {{platform}}ssa",
    "FONTSETTINGS_WHITE": "Valkoinen",
    "FONTSETTINGS_SEPIA": "Seepia",
    "FONTSETTINGS_NIGHT": "Yö",
    "FONTSETTINGS_SANS": "Sans",
    "FONTSETTINGS_SERIF": "Serif"
}

},{}],23:[function(require,module,exports){
module.exports={
    "LANGS_CHOOSE": "Choisissez une langue",
    "GLOSSARY": "Glossaire",
    "GLOSSARY_INDEX": "Index",
    "GLOSSARY_OPEN": "Glossaire",
    "GITBOOK_LINK": "Publié avec GitBook",
    "SUMMARY": "Table des matières",
    "SUMMARY_INTRODUCTION": "Introduction",
    "SUMMARY_TOGGLE": "Table des matières",
    "SEARCH_TOGGLE": "Recherche",
    "SEARCH_PLACEHOLDER": "Tapez pour rechercher",
    "FONTSETTINGS_TOGGLE": "Paramètres de Police",
    "SHARE_TOGGLE": "Partage",
    "SHARE_ON": "Partager sur {{platform}}",
    "FONTSETTINGS_WHITE": "Clair",
    "FONTSETTINGS_SEPIA": "Sépia",
    "FONTSETTINGS_NIGHT": "Nuit",
    "FONTSETTINGS_SANS": "Sans",
    "FONTSETTINGS_SERIF": "Serif"
}
},{}],24:[function(require,module,exports){
module.exports={
    "LANGS_CHOOSE": "בחר שפה",
    "GLOSSARY": "מונחים",
    "GLOSSARY_INDEX": "מפתח",
    "GLOSSARY_OPEN": "מונחים",
    "GITBOOK_LINK": "הוצאה לאור באמצעות גיט-בוק GITBOOK",
    "SUMMARY": "תוכן העניינים",
    "SUMMARY_INTRODUCTION": "הוראות",
    "SUMMARY_TOGGLE": "תקציר",
    "SEARCH_TOGGLE": "חיפוש",
    "SEARCH_PLACEHOLDER": "סוג החיפוש",
    "FONTSETTINGS_TOGGLE": "הגדרת אותיות",
    "SHARE_TOGGLE": "שתף",
    "SHARE_ON": "{{platform}} שתף ב",
    "FONTSETTINGS_WHITE": "בהיר",
    "FONTSETTINGS_SEPIA": "חום כהה",
    "FONTSETTINGS_NIGHT": "מצב לילה",
    "FONTSETTINGS_SANS": "Sans",
    "FONTSETTINGS_SERIF": "Serif"
}

},{}],25:[function(require,module,exports){
'use strict';

module.exports = {
    ar: require('./ar'),
    bn: require('./bn'),
    ca: require('./ca'),
    cs: require('./cs'),
    de: require('./de'),
    el: require('./el'),
    en: require('./en'),
    es: require('./es'),
    fa: require('./fa'),
    fi: require('./fi'),
    fr: require('./fr'),
    he: require('./he'),
    it: require('./it'),
    ja: require('./ja'),
    ko: require('./ko'),
    nl: require('./nl'),
    no: require('./no'),
    pl: require('./pl'),
    pt: require('./pt'),
    ro: require('./ro'),
    ru: require('./ru'),
    sv: require('./sv'),
    tr: require('./tr'),
    uk: require('./uk'),
    vi: require('./vi'),
    'zh-hans': require('./zh-hans'),
    'zh-tw': require('./zh-tw')
};

},{"./ar":13,"./bn":14,"./ca":15,"./cs":16,"./de":17,"./el":18,"./en":19,"./es":20,"./fa":21,"./fi":22,"./fr":23,"./he":24,"./it":26,"./ja":27,"./ko":28,"./nl":29,"./no":30,"./pl":31,"./pt":32,"./ro":33,"./ru":34,"./sv":35,"./tr":36,"./uk":37,"./vi":38,"./zh-hans":39,"./zh-tw":40}],26:[function(require,module,exports){
module.exports={
    "LANGS_CHOOSE": "Scegli una lingua",
    "GLOSSARY": "Glossario",
    "GLOSSARY_INDEX": "Indice",
    "GLOSSARY_OPEN": "Glossario",
    "GITBOOK_LINK": "Pubblicato con GitBook",
    "SUMMARY": "Sommario",
    "SUMMARY_INTRODUCTION": "Introduzione",
    "SUMMARY_TOGGLE": "Sommario",
    "SEARCH_TOGGLE": "Cerca",
    "SEARCH_PLACEHOLDER": "Scrivi per cercare",
    "FONTSETTINGS_TOGGLE": "Impostazioni dei caratteri",
    "SHARE_TOGGLE": "Condividi",
    "SHARE_ON": "Condividi su {{platform}}",
    "FONTSETTINGS_WHITE": "Bianco",
    "FONTSETTINGS_SEPIA": "Seppia",
    "FONTSETTINGS_NIGHT": "Notte",
    "FONTSETTINGS_SANS": "Sans",
    "FONTSETTINGS_SERIF": "Serif"
}
},{}],27:[function(require,module,exports){
module.exports={
    "LANGS_CHOOSE": "言語を選択",
    "GLOSSARY": "用語集",
    "GLOSSARY_INDEX": "索引",
    "GLOSSARY_OPEN": "用語集",
    "GITBOOK_LINK": "GitBookで公開 ",
    "SUMMARY": "目次",
    "SUMMARY_INTRODUCTION": "はじめに",
    "SUMMARY_TOGGLE": "目次",
    "SEARCH_TOGGLE": "検索",
    "SEARCH_PLACEHOLDER": "検索すると入力",
    "FONTSETTINGS_TOGGLE": "フォント設定",
    "SHARE_TOGGLE": "シェア",
    "SHARE_ON": "{{platform}}でシェア",
    "FONTSETTINGS_WHITE": "白",
    "FONTSETTINGS_SEPIA": "セピア",
    "FONTSETTINGS_NIGHT": "夜",
    "FONTSETTINGS_SANS": "ゴシック体",
    "FONTSETTINGS_SERIF": "明朝体"
}

},{}],28:[function(require,module,exports){
module.exports={
    "LANGS_CHOOSE": "언어를 선택하세요",
    "GLOSSARY": "어휘",
    "GLOSSARY_INDEX": "색인",
    "GLOSSARY_OPEN": "어휘",
    "GITBOOK_LINK": "GitBook에 게시",
    "SUMMARY": "차례",
    "SUMMARY_INTRODUCTION": "소개",
    "SUMMARY_TOGGLE": "차례",
    "SEARCH_TOGGLE": "검색",
    "SEARCH_PLACEHOLDER": "검색어 입력",
    "FONTSETTINGS_TOGGLE": "글꼴 설정",
    "SHARE_TOGGLE": "공유",
    "SHARE_ON": "{{platform}}에 공유",
    "FONTSETTINGS_WHITE": "화이트",
    "FONTSETTINGS_SEPIA": "세피아",
    "FONTSETTINGS_NIGHT": "나이트",
    "FONTSETTINGS_SANS": "고딕",
    "FONTSETTINGS_SERIF": "명조"
}

},{}],29:[function(require,module,exports){
module.exports={
    "LANGS_CHOOSE": "Kies een taal",
    "GLOSSARY": "Begrippenlijst",
    "GLOSSARY_INDEX": "Index",
    "GLOSSARY_OPEN": "Begrippenlijst",
    "GITBOOK_LINK": "Gepubliceerd met GitBook",
    "SUMMARY": "Inhoudsopgave",
    "SUMMARY_INTRODUCTION": "Inleiding",
    "SUMMARY_TOGGLE": "Inhoudsopgave",
    "SEARCH_TOGGLE": "Zoeken",
    "SEARCH_PLACEHOLDER": "Zoeken",
    "FONTSETTINGS_TOGGLE": "Lettertype instellingen",
    "SHARE_TOGGLE": "Delen",
    "SHARE_ON": "Delen op {{platform}}",
    "FONTSETTINGS_WHITE": "Wit",
    "FONTSETTINGS_SEPIA": "Sepia",
    "FONTSETTINGS_NIGHT": "Zwart",
    "FONTSETTINGS_SANS": "Schreefloos",
    "FONTSETTINGS_SERIF": "Schreef"
}

},{}],30:[function(require,module,exports){
module.exports={
    "LANGS_CHOOSE": "Velg språk",
    "GLOSSARY": "Register",
    "GLOSSARY_INDEX": "Indeks",
    "GLOSSARY_OPEN": "Register",
    "GITBOOK_LINK": "Publisert med GitBook",
    "SUMMARY": "Innholdsfortegnelse",
    "SUMMARY_INTRODUCTION": "Innledning",
    "SUMMARY_TOGGLE": "Innholdsfortegnelse",
    "SEARCH_TOGGLE": "Søk",
    "SEARCH_PLACEHOLDER": "Skriv inn søkeord",
    "FONTSETTINGS_TOGGLE": "Tekstinnstillinger",
    "SHARE_TOGGLE": "Del",
    "SHARE_ON": "Del på {{platform}}",
    "FONTSETTINGS_WHITE": "Lys",
    "FONTSETTINGS_SEPIA": "Sepia",
    "FONTSETTINGS_NIGHT": "Mørk",
    "FONTSETTINGS_SANS": "Sans",
    "FONTSETTINGS_SERIF": "Serif"
}

},{}],31:[function(require,module,exports){
module.exports={
    "LANGS_CHOOSE": "Wybierz język",
    "GLOSSARY": "Glosariusz",
    "GLOSSARY_INDEX": "Indeks",
    "GLOSSARY_OPEN": "Glosariusz",
    "GITBOOK_LINK": "Opublikowano dzięki GitBook",
    "SUMMARY": "Spis treści",
    "SUMMARY_INTRODUCTION": "Wstęp",
    "SUMMARY_TOGGLE": "Spis treści",
    "SEARCH_TOGGLE": "Szukaj",
    "SEARCH_PLACEHOLDER": "Wpisz szukaną frazę",
    "FONTSETTINGS_TOGGLE": "Ustawienia czcionki",
    "SHARE_TOGGLE": "Udostępnij",
    "SHARE_ON": "Udostępnij na {{platform}}",
    "FONTSETTINGS_WHITE": "Jasny",
    "FONTSETTINGS_SEPIA": "Sepia",
    "FONTSETTINGS_NIGHT": "Noc",
    "FONTSETTINGS_SANS": "Bezszeryfowa",
    "FONTSETTINGS_SERIF": "Szeryfowa"
}

},{}],32:[function(require,module,exports){
module.exports={
    "LANGS_CHOOSE": "Escolher sua língua",
    "GLOSSARY": "Glossário",
    "GLOSSARY_INDEX": "Índice",
    "GLOSSARY_OPEN": "Glossário",
    "GITBOOK_LINK": "Publicado com GitBook",
    "SUMMARY": "Tabela de conteúdos",
    "SUMMARY_INTRODUCTION": "Introdução",
    "SUMMARY_TOGGLE": "Tabela de conteúdos",
    "SEARCH_TOGGLE": "Pesquise",
    "SEARCH_PLACEHOLDER": "Escreva para pesquisar",
    "FONTSETTINGS_TOGGLE": "Configurações de fonte",
    "SHARE_TOGGLE": "Compartilhar",
    "SHARE_ON": "Compartilhar no {{platform}}",
    "FONTSETTINGS_WHITE": "Claro",
    "FONTSETTINGS_SEPIA": "Sépia",
    "FONTSETTINGS_NIGHT": "Noite",
    "FONTSETTINGS_SANS": "Sans",
    "FONTSETTINGS_SERIF": "Serif"
}

},{}],33:[function(require,module,exports){
module.exports={
    "LANGS_CHOOSE": "Alege o limba",
    "GLOSSARY": "Glosar",
    "GLOSSARY_INDEX": "Index",
    "GLOSSARY_OPEN": "Glosar",
    "GITBOOK_LINK": "Publicata cu GitBook",
    "SUMMARY": "Cuprins",
    "SUMMARY_INTRODUCTION": "Introducere",
    "SUMMARY_TOGGLE": "Cuprins",
    "SEARCH_TOGGLE": "Cauta",
    "SEARCH_PLACEHOLDER": "Ce cauti",
    "FONTSETTINGS_TOGGLE": "Setari de font",
    "SHARE_TOGGLE": "Distribuie",
    "SHARE_ON": "Distribuie pe {{platform}}",
    "FONTSETTINGS_WHITE": "Alb",
    "FONTSETTINGS_SEPIA": "Sepia",
    "FONTSETTINGS_NIGHT": "Noapte",
    "FONTSETTINGS_SANS": "Sans",
    "FONTSETTINGS_SERIF": "Serif"
}

},{}],34:[function(require,module,exports){
module.exports={
    "LANGS_CHOOSE": "Выберите язык",
    "GLOSSARY": "Алфавитный указатель",
    "GLOSSARY_INDEX": "Алфавитный указатель",
    "GLOSSARY_OPEN": "Алфавитный указатель",
    "GITBOOK_LINK": "Опубликовано с помощью GitBook",
    "SUMMARY": "Содержание",
    "SUMMARY_INTRODUCTION": "Введение",
    "SUMMARY_TOGGLE": "Содержание",
    "SEARCH_TOGGLE": "Поиск",
    "SEARCH_PLACEHOLDER": "Введите условия поиска",
    "FONTSETTINGS_TOGGLE": "Шрифт",
    "SHARE_TOGGLE": "Поделиться",
    "SHARE_ON": "Поделиться в {{platform}}",
    "FONTSETTINGS_WHITE": "Светлый",
    "FONTSETTINGS_SEPIA": "Сепия",
    "FONTSETTINGS_NIGHT": "Тёмный",
    "FONTSETTINGS_SANS": "Sans",
    "FONTSETTINGS_SERIF": "Serif"
}
},{}],35:[function(require,module,exports){
module.exports={
    "LANGS_CHOOSE": "Välj språk",
    "GLOSSARY": "Gloslista",
    "GLOSSARY_INDEX": "Index",
    "GLOSSARY_OPEN": "Gloslista",
    "GITBOOK_LINK": "Publicera med GitBook",
    "SUMMARY": "Innehållsförteckning",
    "SUMMARY_INTRODUCTION": "Inledning",
    "SUMMARY_TOGGLE": "Innehållsförteckning",
    "SEARCH_TOGGLE": "Sök",
    "SEARCH_PLACEHOLDER": "Skriv sökord",
    "FONTSETTINGS_TOGGLE": "Textinställningar",
    "SHARE_TOGGLE": "Dela",
    "SHARE_ON": "Dela på {{platform}}",
    "FONTSETTINGS_WHITE": "Ljus",
    "FONTSETTINGS_SEPIA": "Sepia",
    "FONTSETTINGS_NIGHT": "Mörk",
    "FONTSETTINGS_SANS": "Sans",
    "FONTSETTINGS_SERIF": "Serif"
}

},{}],36:[function(require,module,exports){
module.exports={
    "LANGS_CHOOSE": "Dil seçimi",
    "GLOSSARY": "Sözlük",
    "GLOSSARY_INDEX": "Dizin",
    "GLOSSARY_OPEN": "Sözlük",
    "GITBOOK_LINK": "GitBook ile yayınla",
    "SUMMARY": "İçindekiler",
    "SUMMARY_INTRODUCTION": "Giriş",
    "SUMMARY_TOGGLE": "İçindekiler",
    "SEARCH_TOGGLE": "Arama",
    "SEARCH_PLACEHOLDER": "Aramak istediğiniz",
    "FONTSETTINGS_TOGGLE": "Font Ayarları",
    "SHARE_TOGGLE": "Paylaş",
    "SHARE_ON": "{{platform}} ile paylaş",
    "FONTSETTINGS_WHITE": "Beyaz",
    "FONTSETTINGS_SEPIA": "Sepya",
    "FONTSETTINGS_NIGHT": "Karanlık",
    "FONTSETTINGS_SANS": "Sans",
    "FONTSETTINGS_SERIF": "Serif"
}

},{}],37:[function(require,module,exports){
module.exports={
    "LANGS_CHOOSE": "Виберіть мову",
    "GLOSSARY": "Алфавітний покажчик",
    "GLOSSARY_INDEX": "Алфавітний покажчик",
    "GLOSSARY_OPEN": "Алфавітний покажчик",
    "GITBOOK_LINK": "Опубліковано за допомогою GitBook",
    "SUMMARY": "Зміст",
    "SUMMARY_INTRODUCTION": "Вступ",
    "SUMMARY_TOGGLE": "Зміст",
    "SEARCH_TOGGLE": "Пошук",
    "SEARCH_PLACEHOLDER": "Введіть для пошуку",
    "FONTSETTINGS_TOGGLE": "Шрифт",
    "SHARE_TOGGLE": "Поділитися",
    "SHARE_ON": "Поділитися в {{platform}}",
    "FONTSETTINGS_WHITE": "Світлий",
    "FONTSETTINGS_SEPIA": "Сепія",
    "FONTSETTINGS_NIGHT": "Темний",
    "FONTSETTINGS_SANS": "Sans",
    "FONTSETTINGS_SERIF": "Serif"
}
},{}],38:[function(require,module,exports){
module.exports={
    "LANGS_CHOOSE": "Lựa chọn ngôn ngữ",
    "GLOSSARY": "Chú giải",
    "GLOSSARY_INDEX": "Chỉ mục",
    "GLOSSARY_OPEN": "Chú giải",
    "GITBOOK_LINK": "Xuất bản với GitBook",
    "SUMMARY": "Mục Lục",
    "SUMMARY_INTRODUCTION": "Giới thiệu",
    "SUMMARY_TOGGLE": "Mục Lục",
    "SEARCH_TOGGLE": "Tìm kiếm",
    "SEARCH_PLACEHOLDER": "Nhập thông tin cần tìm",
    "FONTSETTINGS_TOGGLE": "Tùy chỉnh phông chữ",
    "SHARE_TOGGLE": "Chia sẻ",
    "SHARE_ON": "Chia sẻ trên {{platform}}",
    "FONTSETTINGS_WHITE": "Sáng",
    "FONTSETTINGS_SEPIA": "Vàng nâu",
    "FONTSETTINGS_NIGHT": "Tối",
    "FONTSETTINGS_SANS": "Sans",
    "FONTSETTINGS_SERIF": "Serif"
}

},{}],39:[function(require,module,exports){
module.exports={
    "LANGS_CHOOSE": "选择一种语言",
    "GLOSSARY": "术语表",
    "GLOSSARY_INDEX": "索引",
    "GLOSSARY_OPEN": "术语表",
    "GITBOOK_LINK": "本书使用 GitBook 发布",
    "SUMMARY": "目录",
    "SUMMARY_INTRODUCTION": "介绍",
    "SUMMARY_TOGGLE": "目录",
    "SEARCH_TOGGLE": "搜索",
    "SEARCH_PLACEHOLDER": "输入并搜索",
    "FONTSETTINGS_TOGGLE": "字体设置",
    "SHARE_TOGGLE": "分享",
    "SHARE_ON": "分享到 {{platform}}",
    "FONTSETTINGS_WHITE": "白色",
    "FONTSETTINGS_SEPIA": "棕褐色",
    "FONTSETTINGS_NIGHT": "夜间",
    "FONTSETTINGS_SANS": "无衬线体",
    "FONTSETTINGS_SERIF": "衬线体"
}

},{}],40:[function(require,module,exports){
module.exports={
    "LANGS_CHOOSE": "選擇一種語言",
    "GLOSSARY": "術語表",
    "GLOSSARY_INDEX": "索引",
    "GLOSSARY_OPEN": "術語表",
    "GITBOOK_LINK": "本書使用 GitBook 釋出",
    "SUMMARY": "目錄",
    "SUMMARY_INTRODUCTION": "介紹",
    "SUMMARY_TOGGLE": "目錄",
    "SEARCH_TOGGLE": "搜尋",
    "SEARCH_PLACEHOLDER": "輸入並搜尋",
    "FONTSETTINGS_TOGGLE": "字型設定",
    "SHARE_TOGGLE": "分享",
    "SHARE_ON": "分享到 {{platform}}",
    "FONTSETTINGS_WHITE": "白色",
    "FONTSETTINGS_SEPIA": "棕褐色",
    "FONTSETTINGS_NIGHT": "夜間",
    "FONTSETTINGS_SANS": "無襯線體",
    "FONTSETTINGS_SERIF": "襯線體"
}

},{}],41:[function(require,module,exports){
'use strict';

var GitBook = require('gitbook-core');

var Theme = require('./components/Theme');
var reduceState = require('./reducers');
var locales = require('./i18n');

module.exports = GitBook.createPlugin({
    activate: function activate(dispatch, state, _ref) {
        var Components = _ref.Components,
            I18n = _ref.I18n;

        dispatch(Components.registerComponent(Theme, { role: 'website:body' }));
        dispatch(I18n.registerLocales(locales));
    },
    reduce: reduceState
});

},{"./components/Theme":11,"./i18n":25,"./reducers":42,"gitbook-core":"gitbook-core"}],42:[function(require,module,exports){
'use strict';

var GitBook = require('gitbook-core');

module.exports = GitBook.composeReducer(GitBook.createReducer('sidebar', require('./sidebar')));

},{"./sidebar":43,"gitbook-core":"gitbook-core"}],43:[function(require,module,exports){
'use strict';

var GitBook = require('gitbook-core');
var Record = GitBook.Immutable.Record;

var ActionTypes = require('../actions/types');

var SidebarState = Record({
    open: true
});

function reduceSidebar() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : SidebarState();
    var action = arguments[1];

    switch (action.type) {
        case ActionTypes.TOGGLE_SIDEBAR:
            return state.set('open', !state.get('open'));
        default:
            return state;
    }
}

module.exports = reduceSidebar;

},{"../actions/types":5,"gitbook-core":"gitbook-core"}]},{},[41])(41)
});