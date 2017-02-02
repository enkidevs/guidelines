(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.GitBookPlugin = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function blacklist (src) {
  var copy = {}
  var filter = arguments[1]

  if (typeof filter === 'string') {
    filter = {}
    for (var i = 1; i < arguments.length; i++) {
      filter[arguments[i]] = true
    }
  }

  for (var key in src) {
    // blacklist?
    if (filter[key]) continue

    copy[key] = src[key]
  }

  return copy
}

},{}],2:[function(require,module,exports){
'use strict';

var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

module.exports = function (str) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	return str.replace(matchOperatorsRe, '\\$&');
};

},{}],3:[function(require,module,exports){
var React = require('react');
var RegExpPropType = require('./regExpPropType');
var escapeStringRegexp = require('escape-string-regexp');
var blacklist = require('blacklist');

var Highlighter = React.createClass({displayName: "Highlighter",
  count: 0,

  propTypes: {
    search: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.bool,
      RegExpPropType
    ]).isRequired,
    caseSensitive: React.PropTypes.bool,
    matchElement: React.PropTypes.string,
    matchClass: React.PropTypes.string,
    matchStyle: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      caseSensitive: false,
      matchElement: 'strong',
      matchClass: 'highlight',
      matchStyle: {}
    }
  },

  render: function() {
    var props = blacklist(this.props, 'search', 'caseSensitive', 'matchElement', 'matchClass', 'matchStyle');

    return React.createElement('span', props, this.renderElement(this.props.children));
  },

  /**
   * A wrapper to the highlight method to determine when the highlighting
   * process should occur.
   *
   * @param  {string} subject
   *   The body of text that will be searched for highlighted words.
   *
   * @return {Array}
   *   An array of ReactElements
   */
  renderElement: function(subject) {
    if (this.isScalar() && this.hasSearch()) {
      var search = this.getSearch();
      return this.highlightChildren(subject, search);
    }

    return this.props.children;
  },

  /**
   * Determine if props are valid types for processing.
   *
   * @return {Boolean}
   */
  isScalar: function() {
    return (/string|number|boolean/).test(typeof this.props.children);
  },

  /**
   * Determine if required search prop is defined and valid.
   *
   * @return {Boolean}
   */
  hasSearch: function() {
    return (typeof this.props.search !== 'undefined') && this.props.search;
  },

  /**
   * Get the search prop, but always in the form of a regular expression. Use
   * this as a proxy to this.props.search for consistency.
   *
   * @return {RegExp}
   */
  getSearch: function() {
    if (this.props.search instanceof RegExp) {
      return this.props.search;
    }

    var flags = '';
    if (!this.props.caseSensitive) {
      flags +='i';
    }

    var search = this.props.search;
    if (typeof this.props.search === 'string') {
      search = escapeStringRegexp(search);
    }

    return new RegExp(search, flags);
  },

  /**
   * Get the indexes of the first and last characters of the matched string.
   *
   * @param  {string} subject
   *   The string to search against.
   *
   * @param  {RegExp} search
   *   The regex search query.
   *
   * @return {Object}
   *   An object consisting of "first" and "last" properties representing the
   *   indexes of the first and last characters of a matching string.
   */
  getMatchBoundaries: function(subject, search) {
    var matches = search.exec(subject);
    if (matches) {
      return {
        first: matches.index,
        last: matches.index + matches[0].length
      };
    }
  },

  /**
   * Determines which strings of text should be highlighted or not.
   *
   * @param  {string} subject
   *   The body of text that will be searched for highlighted words.
   * @param  {string} search
   *   The search used to search for highlighted words.
   *
   * @return {Array}
   *   An array of ReactElements
   */
  highlightChildren: function(subject, search) {
    var children = [];
    var matchElement = this.props.matchElement;
    var remaining = subject;

    while (remaining) {
      if (!search.test(remaining)) {
        children.push(this.renderPlain(remaining));
        return children;
      }

      var boundaries = this.getMatchBoundaries(remaining, search);

      // Capture the string that leads up to a match...
      var nonMatch = remaining.slice(0, boundaries.first);
      if (nonMatch) {
        children.push(this.renderPlain(nonMatch));
      }

      // Now, capture the matching string...
      var match = remaining.slice(boundaries.first, boundaries.last);
      if (match) {
        children.push(this.renderHighlight(match, matchElement));
      }

      // And if there's anything left over, recursively run this method again.
      remaining = remaining.slice(boundaries.last);

    }

    return children;
  },

  /**
   * Responsible for rending a non-highlighted element.
   *
   * @param  {string} string
   *   A string value to wrap an element around.
   *
   * @return {ReactElement}
   */
  renderPlain: function(string) {
    this.count++;
    return React.DOM.span({'key': this.count}, string);
  },

  /**
   * Responsible for rending a highlighted element.
   *
   * @param  {string} string
   *   A string value to wrap an element around.
   *
   * @return {ReactElement}
   */
  renderHighlight: function(string) {
    this.count++;
    return React.DOM[this.props.matchElement]({
      key: this.count,
      className: this.props.matchClass,
      style: this.props.matchStyle
    }, string);
  }
});

module.exports = Highlighter;

},{"./regExpPropType":4,"blacklist":1,"escape-string-regexp":2,"react":"react"}],4:[function(require,module,exports){
var regExpPropType = function (props, propName, componentName, location) {
  if (!(props[propName] instanceof RegExp)) {
    var propType = typeof props[propName];

    return new Error(
      ("Invalid " + location + " `" + propName + "` of type `" + propType + "` ") +
        ("supplied to `" + componentName + "`, expected `RegExp`.")
    );
  }
};

module.exports = regExpPropType;

},{}],5:[function(require,module,exports){
'use strict';

var _require = require('gitbook-core'),
    Promise = _require.Promise,
    Immutable = _require.Immutable;

var List = Immutable.List;


var TYPES = require('./types');
var Result = require('../models/Result');

/*
    Search workflow:

    1. Typing in the search input
    2. Trigger an update of the url
    3. An update of the url, trigger an update of search results
 */

/**
 * Start a search query
 * @param {String} q
 * @return {Action}
 */
function query(q) {
    return function (dispatch, getState, _ref) {
        var History = _ref.History;

        var searchState = getState().search;
        var currentQuery = searchState.query;

        var queryString = q ? { q: q } : {};

        if (currentQuery && q) {
            dispatch(History.replace({ query: queryString }));
        } else {
            dispatch(History.push({ query: queryString }));
        }
    };
}

/**
 * Update results for a query
 * @param {String} q
 * @return {Action}
 */
function handleQuery(q) {
    if (!q) {
        return clear();
    }

    return function (dispatch, getState, actions) {
        var handlers = getState().search.handlers;


        dispatch({ type: TYPES.START, query: q });

        return Promise.reduce(handlers.toArray(), function (results, handler) {
            return Promise.resolve(handler(q, dispatch, getState, actions)).then(function (handlerResults) {
                return handlerResults.map(function (result) {
                    return new Result(result);
                });
            }).then(function (handlerResults) {
                return results.concat(handlerResults);
            });
        }, List()).then(function (results) {
            dispatch({ type: TYPES.END, query: q, results: results });
        });
    };
}

/**
 * Refresh current search (when handlers have changed)
 * @return {Action}
 */
function refresh() {
    return function (dispatch, getState) {
        var q = getState().search.query;
        if (q) {
            dispatch(handleQuery(q));
        }
    };
}

/**
 * Clear the whole search
 * @return {Action}
 */
function clear() {
    return { type: TYPES.CLEAR };
}

/**
 * Register a search handler
 * @param {String} name
 * @param {Function} handler
 * @return {Action}
 */
function registerHandler(name, handler) {
    return function (dispatch) {
        dispatch({ type: TYPES.REGISTER_HANDLER, name: name, handler: handler });
        dispatch(refresh());
    };
}

/**
 * Unregister a search handler
 * @param {String} name
 * @return {Action}
 */
function unregisterHandler(name) {
    return function (dispatch) {
        dispatch({ type: TYPES.UNREGISTER_HANDLER, name: name });
        dispatch(refresh());
    };
}

module.exports = {
    clear: clear,
    query: query,
    handleQuery: handleQuery,
    registerHandler: registerHandler,
    unregisterHandler: unregisterHandler
};

},{"../models/Result":10,"./types":6,"gitbook-core":"gitbook-core"}],6:[function(require,module,exports){
'use strict';

module.exports = {
    CLEAR: 'search/clear',
    REGISTER_HANDLER: 'search/handlers/register',
    UNREGISTER_HANDLER: 'search/handlers/unregister',
    START: 'search/start',
    END: 'search/end'
};

},{}],7:[function(require,module,exports){
'use strict';

var GitBook = require('gitbook-core');
var React = GitBook.React;


var search = require('../actions/search');

var ESCAPE = 27;

var SearchInput = React.createClass({
    displayName: 'SearchInput',

    propTypes: {
        query: React.PropTypes.string,
        i18n: GitBook.PropTypes.I18n,
        dispatch: GitBook.PropTypes.dispatch
    },

    onChange: function onChange(event) {
        var dispatch = this.props.dispatch;
        var value = event.currentTarget.value;


        dispatch(search.query(value));
    },


    /**
     * On Escape key down, clear the search field
     */
    onKeyDown: function onKeyDown(e) {
        var query = this.props.query;

        if (e.keyCode == ESCAPE && query != '') {
            e.preventDefault();
            e.stopPropagation();
            this.clearSearch();
        }
    },
    clearSearch: function clearSearch() {
        this.props.dispatch(search.query(''));
    },
    render: function render() {
        var _props = this.props,
            i18n = _props.i18n,
            query = _props.query;


        var clear = void 0;
        if (query != '') {
            clear = React.createElement(
                'span',
                { className: 'Search-Clear',
                    onClick: this.clearSearch },
                '\u2715'
            );
            // clear = <GitBook.Icon id="x" onClick={this.clearSearch}/>;
        }

        return React.createElement(
            'div',
            { className: 'Search-Input' },
            React.createElement('input', {
                type: 'text',
                onKeyDown: this.onKeyDown,
                value: query,
                placeholder: i18n.t('SEARCH_PLACEHOLDER'),
                onChange: this.onChange
            }),
            clear
        );
    }
});

var mapStateToProps = function mapStateToProps(state) {
    var query = state.search.query;

    return { query: query };
};

module.exports = GitBook.connect(SearchInput, mapStateToProps);

},{"../actions/search":5,"gitbook-core":"gitbook-core"}],8:[function(require,module,exports){
'use strict';

var GitBook = require('gitbook-core');
var React = GitBook.React;

var Highlight = require('react-highlighter');

var MAX_DESCRIPTION_SIZE = 500;

var Result = React.createClass({
    displayName: 'Result',

    propTypes: {
        result: React.PropTypes.object,
        query: React.PropTypes.string
    },

    render: function render() {
        var _props = this.props,
            result = _props.result,
            query = _props.query;


        var summary = result.body.trim();
        if (summary.length > MAX_DESCRIPTION_SIZE) {
            summary = summary.slice(0, MAX_DESCRIPTION_SIZE).trim() + '...';
        }

        return React.createElement(
            'div',
            { className: 'Search-ResultContainer' },
            React.createElement(
                GitBook.InjectedComponent,
                { matching: { role: 'search:result' }, props: { result: result, query: query } },
                React.createElement(
                    'div',
                    { className: 'Search-Result' },
                    React.createElement(
                        'h3',
                        null,
                        React.createElement(
                            GitBook.Link,
                            { to: result.url },
                            result.title
                        )
                    ),
                    React.createElement(
                        'p',
                        null,
                        React.createElement(
                            Highlight,
                            {
                                matchElement: 'span',
                                matchClass: 'Search-MatchSpan',
                                search: query },
                            summary
                        )
                    )
                )
            )
        );
    }
});

var SearchResults = React.createClass({
    displayName: 'SearchResults',

    propTypes: {
        i18n: GitBook.PropTypes.I18n,
        results: GitBook.PropTypes.list,
        query: React.PropTypes.string,
        children: React.PropTypes.node
    },

    render: function render() {
        var _props2 = this.props,
            i18n = _props2.i18n,
            query = _props2.query,
            results = _props2.results,
            children = _props2.children;


        if (!query) {
            return React.Children.only(children);
        }

        return React.createElement(
            'div',
            { className: 'Search-ResultsContainer' },
            React.createElement(
                GitBook.InjectedComponent,
                { matching: { role: 'search:results' }, props: { results: results, query: query } },
                React.createElement(
                    'div',
                    { className: 'Search-Results' },
                    React.createElement(
                        'h1',
                        null,
                        i18n.t('SEARCH_RESULTS_TITLE', { query: query, count: results.size })
                    ),
                    React.createElement(
                        'div',
                        { className: 'Search-Results' },
                        results.map(function (result, i) {
                            return React.createElement(Result, { key: i, result: result, query: query });
                        })
                    )
                )
            )
        );
    }
});

var mapStateToProps = function mapStateToProps(state) {
    var _state$search = state.search,
        results = _state$search.results,
        query = _state$search.query;

    return { results: results, query: query };
};

module.exports = GitBook.connect(SearchResults, mapStateToProps);

},{"gitbook-core":"gitbook-core","react-highlighter":3}],9:[function(require,module,exports){
'use strict';

var GitBook = require('gitbook-core');

var SearchInput = require('./components/Input');
var SearchResults = require('./components/Results');
var reducers = require('./reducers');
var Search = require('./actions/search');

/**
 * Url of the page changed, we update the search according to this.
 * @param  {GitBook.Location} location
 * @param  {Function} dispatch
 */
var onLocationChange = function onLocationChange(location, dispatch) {
    var query = location.query;

    var q = query.get('q');

    dispatch(Search.handleQuery(q));
};

module.exports = GitBook.createPlugin({
    activate: function activate(dispatch, getState, _ref) {
        var History = _ref.History,
            Components = _ref.Components;

        // Register the navigation handler
        dispatch(History.listen(onLocationChange));

        // Register components
        dispatch(Components.registerComponent(SearchInput, { role: 'search:container:input' }));
        dispatch(Components.registerComponent(SearchResults, { role: 'search:container:results' }));
    },
    reduce: reducers,
    actions: {
        Search: Search
    }
});

},{"./actions/search":5,"./components/Input":7,"./components/Results":8,"./reducers":11,"gitbook-core":"gitbook-core"}],10:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GitBook = require('gitbook-core');
var Record = GitBook.Immutable.Record;


var DEFAULTS = {
    url: String(''),
    title: String(''),
    body: String('')
};

var Result = function (_Record) {
    _inherits(Result, _Record);

    function Result(spec) {
        _classCallCheck(this, Result);

        if (!spec.url || !spec.title) {
            throw new Error('"url" and "title" are required to create a search result');
        }

        return _possibleConstructorReturn(this, (Result.__proto__ || Object.getPrototypeOf(Result)).call(this, spec));
    }

    return Result;
}(Record(DEFAULTS));

module.exports = Result;

},{"gitbook-core":"gitbook-core"}],11:[function(require,module,exports){
'use strict';

var GitBook = require('gitbook-core');

module.exports = GitBook.createReducer('search', require('./search'));

},{"./search":12,"gitbook-core":"gitbook-core"}],12:[function(require,module,exports){
'use strict';

var GitBook = require('gitbook-core');
var _GitBook$Immutable = GitBook.Immutable,
    Record = _GitBook$Immutable.Record,
    List = _GitBook$Immutable.List,
    OrderedMap = _GitBook$Immutable.OrderedMap;


var TYPES = require('../actions/types');

var SearchState = Record({
    // Is the search being processed
    loading: Boolean(false),
    // Current query
    query: String(''),
    // Current list of results
    results: List(),
    // Search handlers
    handlers: OrderedMap()
});

module.exports = function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : SearchState();
    var action = arguments[1];

    switch (action.type) {

        case TYPES.CLEAR:
            return state.merge({
                loading: false,
                query: '',
                results: List()
            });

        case TYPES.START:
            return state.merge({
                loading: true,
                query: action.query
            });

        case TYPES.END:
            if (action.query !== state.query) {
                return state;
            }

            return state.merge({
                loading: false,
                results: action.results
            });

        case TYPES.REGISTER_HANDLER:
            return state.merge({
                handlers: state.handlers.set(action.name, action.handler)
            });

        case TYPES.UNREGISTER_HANDLER:
            return state.merge({
                handlers: state.handlers.remove(action.name)
            });

        default:
            return state;
    }
};

},{"../actions/types":6,"gitbook-core":"gitbook-core"}]},{},[9])(9)
});