(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.GitBookPlugin = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

// All the sharing platforms
var SITES = {

    // One sharing platform
    'facebook': {
        // Displayed name
        label: 'Facebook',

        // Font-awesome icon id
        icon: 'facebook',

        /**
         * Share a page on this platform
         * @param {String} url The url to share
         * @param {String} title The title of the url page
         */
        onShare: function onShare(url, title) {
            url = encodeURIComponent(url);
            window.open('http://www.facebook.com/sharer/sharer.php?s=100&p[url]=' + url);
        }
    },

    'twitter': {
        label: 'Twitter',
        icon: 'twitter',
        onShare: function onShare(url, title) {
            var status = encodeURIComponent(title + ' ' + url);
            window.open('http://twitter.com/home?status=' + status);
        }
    },

    'google': {
        label: 'Google+',
        icon: 'google-plus',
        onShare: function onShare(url, title) {
            url = encodeURIComponent(url);
            window.open('https://plus.google.com/share?url=' + url);
        }
    },

    'weibo': {
        label: 'Weibo',
        icon: 'weibo',
        onShare: function onShare(url, title) {
            url = encodeURIComponent(url);
            title = encodeURIComponent(title);
            window.open('http://service.weibo.com/share/share.php?content=utf-8&url=' + url + '&title=' + title);
        }
    },

    'instapaper': {
        label: 'Instapaper',
        icon: 'instapaper',
        onShare: function onShare(url, title) {
            url = encodeURIComponent(url);
            window.open('http://www.instapaper.com/text?u=' + url);
        }
    },

    'vk': {
        label: 'VK',
        icon: 'vk',
        onShare: function onShare(url, title) {
            url = encodeURIComponent(url);
            window.open('http://vkontakte.ru/share.php?url=' + url);
        }
    }
};

SITES.ALL = Object.keys(SITES);

module.exports = SITES;

},{}],2:[function(require,module,exports){
'use strict';

var GitBook = require('gitbook-core');
var React = GitBook.React,
    Dropdown = GitBook.Dropdown,
    Backdrop = GitBook.Backdrop;


var SITES = require('../SITES');

// Share button with dropdown list of sites
var ShareButton = React.createClass({
    displayName: 'ShareButton',

    propTypes: {
        siteIds: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
        onShare: React.PropTypes.func.isRequired
    },

    getInitialState: function getInitialState() {
        return { open: false };
    },
    onToggle: function onToggle() {
        var open = this.state.open;

        this.setState({ open: !open });
    },
    render: function render() {
        var _props = this.props,
            siteIds = _props.siteIds,
            onShare = _props.onShare;
        var open = this.state.open;


        return React.createElement(
            Dropdown.Container,
            null,
            open ? React.createElement(Backdrop, { onClose: this.onToggle }) : null,
            React.createElement(
                GitBook.Button,
                { onClick: this.onToggle },
                React.createElement(GitBook.Icon, { id: 'share-alt' })
            ),
            open ? React.createElement(
                Dropdown.Menu,
                null,
                siteIds.map(function (id) {
                    return React.createElement(
                        Dropdown.ItemLink,
                        { onClick: function onClick() {
                                return onShare(SITES[id]);
                            }, key: id },
                        SITES[id].label
                    );
                })
            ) : null
        );
    }
});

module.exports = ShareButton;

},{"../SITES":1,"gitbook-core":"gitbook-core"}],3:[function(require,module,exports){
'use strict';

var GitBook = require('gitbook-core');
var React = GitBook.React;


var SITES = require('../SITES');
var optionsShape = require('../shapes/options');
var SiteButton = require('./SiteButton');
var ShareButton = require('./ShareButton');

/**
 * Displays the group of sharing buttons
 */
var SharingButtons = React.createClass({
    displayName: 'SharingButtons',

    propTypes: {
        options: optionsShape.isRequired,
        page: GitBook.PropTypes.Page.isRequired
    },

    onShare: function onShare(site) {
        site.onShare(location.href, this.props.page.title);
    },
    render: function render() {
        var _this = this;

        var options = this.props.options;

        // Highlighted sites

        var mainButtons = SITES.ALL.filter(function (id) {
            return options[id];
        }).map(function (id) {
            return React.createElement(SiteButton, { key: id, onShare: _this.onShare, site: SITES[id] });
        });

        // Other sites
        var shareButton = undefined;
        if (options.all.length > 0) {
            shareButton = React.createElement(ShareButton, { siteIds: options.all,
                onShare: this.onShare });
        }

        return React.createElement(
            GitBook.ButtonGroup,
            null,
            mainButtons,
            shareButton
        );
    }
});

function mapStateToProps(state) {
    var options = state.config.getIn(['pluginsConfig', 'sharing']);
    if (options) {
        options = options.toJS();
    } else {
        options = { all: [] };
    }

    return {
        page: state.page,
        options: options
    };
}

module.exports = GitBook.connect(SharingButtons, mapStateToProps);

},{"../SITES":1,"../shapes/options":6,"./ShareButton":2,"./SiteButton":4,"gitbook-core":"gitbook-core"}],4:[function(require,module,exports){
'use strict';

var GitBook = require('gitbook-core');
var React = GitBook.React;


var siteShape = require('../shapes/site');

// An individual site sharing button
var SiteButton = React.createClass({
    displayName: 'SiteButton',

    propTypes: {
        site: siteShape.isRequired,
        onShare: React.PropTypes.func.isRequired
    },

    onClick: function onClick(e) {
        e.preventDefault();
        this.props.onShare(this.props.site);
    },
    render: function render() {
        var site = this.props.site;


        return React.createElement(
            GitBook.Button,
            { onClick: this.onClick },
            React.createElement(GitBook.Icon, { id: site.icon })
        );
    }
});

module.exports = SiteButton;

},{"../shapes/site":7,"gitbook-core":"gitbook-core"}],5:[function(require,module,exports){
'use strict';

var GitBook = require('gitbook-core');
var SharingButtons = require('./components/SharingButtons');

module.exports = GitBook.createPlugin({
    activate: function activate(dispatch, getState, _ref) {
        var Components = _ref.Components;

        // Dispatch initialization actions
        dispatch(Components.registerComponent(SharingButtons, { role: 'toolbar:buttons:right' }));
    }
});

},{"./components/SharingButtons":3,"gitbook-core":"gitbook-core"}],6:[function(require,module,exports){
'use strict';

var _require$React$PropTy = require('gitbook-core').React.PropTypes,
    bool = _require$React$PropTy.bool,
    arrayOf = _require$React$PropTy.arrayOf,
    oneOf = _require$React$PropTy.oneOf,
    shape = _require$React$PropTy.shape;

var _require = require('../SITES'),
    ALL = _require.ALL;

var optionsShape = shape({
    facebook: bool,
    twitter: bool,
    google: bool,
    weibo: bool,
    instapaper: bool,
    vk: bool,
    all: arrayOf(oneOf(ALL)).isRequired
});

module.exports = optionsShape;

},{"../SITES":1,"gitbook-core":"gitbook-core"}],7:[function(require,module,exports){
'use strict';

var _require$React$PropTy = require('gitbook-core').React.PropTypes,
    string = _require$React$PropTy.string,
    func = _require$React$PropTy.func,
    shape = _require$React$PropTy.shape;

var siteShape = shape({
    label: string.isRequired,
    icon: string.isRequired,
    onShare: func.isRequired
});

module.exports = siteShape;

},{"gitbook-core":"gitbook-core"}]},{},[5])(5)
});