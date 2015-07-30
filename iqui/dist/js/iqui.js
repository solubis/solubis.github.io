(function () {

    'use strict';

    var _config = {
        version: '0.2.4'
    };

    angular
        .module('iq.ui', [
            'ui.router',
            'ui.bootstrap',
            'ui.datetimepicker',
            'ui.utils',
            'ui.dialog',
            'ui.loadingbar',
            'ui.multiselect',
            'ui.toaster',
            'ui.select',
            'ui.sidebar',
            'ui.scrollbar',
            'ui.search',
            'ui.translate',
            'ui.organisation',
            'ui.templates'
        ])

        .value('$commonVersion', _config.version)

        .run(["$commonVersion", "$log", function ($commonVersion, $log) {
            $log.info('iQUI Framework ', $commonVersion);
        }]);
}());


/*!
 Autosize 1.18.17
 license: MIT
 http://www.jacklmoore.com/autosize
 */

/*
 TODO Refactor as Angular directives and services
 */

(function ($) {
    var
        defaults = {
            className: 'autosizejs',
            id: 'autosizejs',
            append: '\n',
            callback: false,
            resizeDelay: 10,
            placeholder: true
        };
    var copy = '<textarea tabindex="-1" style="position:absolute; top:-999px; left:0; right:auto; bottom:auto; border:0; padding: 0; -moz-box-sizing:content-box; -webkit-box-sizing:content-box; box-sizing:content-box; word-wrap:break-word; height:0 !important; min-height:0 !important; overflow:hidden; transition:none; -webkit-transition:none; -moz-transition:none;"/>';
    var typographyStyles = [
        'fontFamily',
        'fontSize',
        'fontWeight',
        'fontStyle',
        'letterSpacing',
        'textTransform',
        'wordSpacing',
        'textIndent',
        'whiteSpace'
    ];
    var mirrored;
    var mirror = $(copy).data('autosize', true)[0];

    // test that line-height can be accurately copied.
    mirror.style.lineHeight = '99px';
    if ($(mirror).css('lineHeight') === '99px') {
        typographyStyles.push('lineHeight');
    }
    mirror.style.lineHeight = '';

    $.fn.autosize = function (options) {
        if (!this.length) {
            return this;
        }

        options = $.extend({}, defaults, options || {});

        if (mirror.parentNode !== document.body) {
            $(document.body).append(mirror);
        }

        return this.each(function () {
            var
                ta = this,
                $ta = $(ta),
                maxHeight,
                minHeight,
                boxOffset = 0,
                callback = $.isFunction(options.callback),
                originalStyles = {
                    height: ta.style.height,
                    overflow: ta.style.overflow,
                    overflowY: ta.style.overflowY,
                    wordWrap: ta.style.wordWrap,
                    resize: ta.style.resize
                },
                timeout,
                width = $ta.width(),
                taResize = $ta.css('resize');

            if ($ta.data('autosize')) {
                // exit if autosize has already been applied, or if the textarea is the mirror element.
                return;
            }
            $ta.data('autosize', true);

            if ($ta.css('box-sizing') === 'border-box' || $ta.css('-moz-box-sizing') === 'border-box' || $ta.css('-webkit-box-sizing') === 'border-box') {
                boxOffset = ($ta.outerHeight() - $ta.height()) - 11;
            }

            // IE8 and lower return 'auto', which parses to NaN, if no min-height is set.
            minHeight = Math.max(parseFloat($ta.css('minHeight')) - boxOffset || 0, $ta.height());

            $ta.css({
                overflow: 'hidden',
                overflowY: 'hidden',
                wordWrap: 'break-word' // horizontal overflow is hidden, so break-word is necessary for handling words longer than the textarea width
            });

            if (taResize === 'vertical') {
                $ta.css('resize', 'none');
            } else if (taResize === 'both') {
                $ta.css('resize', 'horizontal');
            }

            // getComputedStyle is preferred here because it preserves sub-pixel values, while jQuery's .width() rounds to an integer.
            function setWidth() {
                var width;
                var style = window.getComputedStyle ? window.getComputedStyle(ta, null) : null;

                if (style) {
                    width = parseFloat(style.width);
                    if (style.boxSizing === 'border-box' || style.webkitBoxSizing === 'border-box' || style.mozBoxSizing === 'border-box') {
                        $.each(['paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth'], function(i, val) {
                            width -= parseFloat(style[val]);
                        });
                    }
                } else {
                    width = $ta.width();
                }

                mirror.style.width = Math.max(width, 0) + 'px';
            }

            function initMirror() {
                var styles = {};

                mirrored = ta;
                mirror.className = options.className;
                mirror.id = options.id;
                maxHeight = parseFloat($ta.css('maxHeight'));

                // mirror is a duplicate textarea located off-screen that
                // is automatically updated to contain the same text as the
                // original textarea.  mirror always has a height of 0.
                // This gives a cross-browser supported way getting the actual
                // height of the text, through the scrollTop property.
                $.each(typographyStyles, function(i, val) {
                    styles[val] = $ta.css(val);
                });

                $(mirror).css(styles).attr('wrap', $ta.attr('wrap'));

                setWidth();

                // Chrome-specific fix:
                // When the textarea y-overflow is hidden, Chrome doesn't reflow the text to account for the space
                // made available by removing the scrollbar. This workaround triggers the reflow for Chrome.
                if (window.chrome) {
                    var width = ta.style.width;
                    ta.style.width = '0px';
                    var ignore = ta.offsetWidth;
                    ta.style.width = width;
                }
            }

            // Using mainly bare JS in this function because it is going
            // to fire very often while typing, and needs to very efficient.
            function adjust() {
                var height, originalHeight;

                if (mirrored !== ta) {
                    initMirror();
                } else {
                    setWidth();
                }

                if (!ta.value && options.placeholder) {
                    // If the textarea is empty, copy the placeholder text into
                    // the mirror control and use that for sizing so that we
                    // don't end up with placeholder getting trimmed.
                    mirror.value = ($ta.attr("placeholder") || '');
                } else {
                    mirror.value = ta.value;
                }

                mirror.value += options.append || '';
                mirror.style.overflowY = ta.style.overflowY;
                originalHeight = parseFloat(ta.style.height) || 0;

                // Setting scrollTop to zero is needed in IE8 and lower for the next step to be accurately applied
                mirror.scrollTop = 0;

                mirror.scrollTop = 9e4;

                // Using scrollTop rather than scrollHeight because scrollHeight is non-standard and includes padding.
                height = mirror.scrollTop;

                if (maxHeight && height > maxHeight) {
                    ta.style.overflowY = 'scroll';
                    height = maxHeight;
                } else {
                    ta.style.overflowY = 'hidden';
                    if (height < minHeight) {
                        height = minHeight;
                    }
                }

                height += boxOffset;

                if (Math.abs(originalHeight - height) > 1 / 100) {
                    ta.style.height = height + 'px';

                    // Trigger a repaint for IE8 for when ta is nested 2 or more levels inside an inline-block
                    mirror.className = mirror.className;

                    if (callback) {
                        options.callback.call(ta, ta);
                    }
                    $ta.trigger('autosize.resized');
                }
            }

            function resize () {
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    var newWidth = $ta.width();

                    if (newWidth !== width) {
                        width = newWidth;
                        adjust();
                    }
                }, parseInt(options.resizeDelay, 10));
            }

            if ('onpropertychange' in ta) {
                if ('oninput' in ta) {
                    // Detects IE9.  IE9 does not fire onpropertychange or oninput for deletions,
                    // so binding to onkeyup to catch most of those occasions.  There is no way that I
                    // know of to detect something like 'cut' in IE9.
                    $ta.on('input.autosize keyup.autosize', adjust);
                } else {
                    // IE7 / IE8
                    $ta.on('propertychange.autosize', function() {
                        if (event.propertyName === 'value') {
                            adjust();
                        }
                    });
                }
            } else {
                // Modern Browsers
                $ta.on('input.autosize', adjust);
            }

            // Set options.resizeDelay to false if using fixed-width textarea elements.
            // Uses a timeout and width check to reduce the amount of times adjust needs to be called after window resize.

            if (options.resizeDelay !== false) {
                $(window).on('resize.autosize', resize);
            }

            // Event for manual triggering if needed.
            // Should only be needed when the value of the textarea is changed through JavaScript rather than user input.
            $ta.on('autosize.resize', adjust);

            // Event for manual triggering that also forces the styles to update as well.
            // Should only be needed if one of typography styles of the textarea change, and the textarea is already the target of the adjust method.
            $ta.on('autosize.resizeIncludeStyle', function() {
                mirrored = null;
                adjust();
            });

            $ta.on('autosize.destroy', function() {
                mirrored = null;
                clearTimeout(timeout);
                $(window).off('resize', resize);
                $ta
                    .off('autosize')
                    .off('.autosize')
                    .css(originalStyles)
                    .removeData('autosize');
            });

            // Call adjust in case the textarea already contains text.
            adjust();
        });
    };
}(jQuery || $)); // jQuery or jQuery-like library, such as Zepto

'use strict';

angular.module('mgcrea.ngStrap.helpers.dateFormatter', [])

    .service('$dateFormatter', ["$locale", "dateFilter", function ($locale, dateFilter) {

        // The unused `lang` arguments are on purpose. The default implementation does not
        // use them and it always uses the locale loaded into the `$locale` service.
        // Custom implementations might use it, thus allowing different directives to
        // have different languages.

        this.getDefaultLocale = function () {
            return $locale.id;
        };

        // Format is either a data format name, e.g. "shortTime" or "fullDate", or a date format
        // Return either the corresponding date format or the given date format.
        this.getDatetimeFormat = function (format, lang) {
            return $locale.DATETIME_FORMATS[format] || format;
        };

        this.weekdaysShort = function (lang) {
            return $locale.DATETIME_FORMATS.SHORTDAY;
        };

        function splitTimeFormat(format) {
            return /(h+)([:\.])?(m+)([:\.])?(s*)[ ]?(a?)/i.exec(format).slice(1);
        }

        // h:mm a => h
        this.hoursFormat = function (timeFormat) {
            return splitTimeFormat(timeFormat)[0];
        };

        // h:mm a => mm
        this.minutesFormat = function (timeFormat) {
            return splitTimeFormat(timeFormat)[2];
        };

        // h:mm:ss a => ss
        this.secondsFormat = function (timeFormat) {
            return splitTimeFormat(timeFormat)[4];
        };

        // h:mm a => :
        this.timeSeparator = function (timeFormat) {
            return splitTimeFormat(timeFormat)[1];
        };

        // h:mm:ss a => true, h:mm a => false
        this.showSeconds = function (timeFormat) {
            return !!splitTimeFormat(timeFormat)[4];
        };

        // h:mm a => true, H.mm => false
        this.showAM = function (timeFormat) {
            return !!splitTimeFormat(timeFormat)[5];
        };

        this.formatDate = function (date, format, lang, timezone) {
            return dateFilter(date, format, timezone);
        };

    }]);

'use strict';

angular.module('mgcrea.ngStrap.helpers.dateParser', [])

    .provider('$dateParser', ["$localeProvider", function ($localeProvider) {

        // define a custom ParseDate object to use instead of native Date
        // to avoid date values wrapping when setting date component values
        function ParseDate() {
            this.year = 1970;
            this.month = 0;
            this.day = 1;
            this.hours = 0;
            this.minutes = 0;
            this.seconds = 0;
            this.milliseconds = 0;
        }

        ParseDate.prototype.setMilliseconds = function (value) {
            this.milliseconds = value;
        };
        ParseDate.prototype.setSeconds = function (value) {
            this.seconds = value;
        };
        ParseDate.prototype.setMinutes = function (value) {
            this.minutes = value;
        };
        ParseDate.prototype.setHours = function (value) {
            this.hours = value;
        };
        ParseDate.prototype.getHours = function () {
            return this.hours;
        };
        ParseDate.prototype.setDate = function (value) {
            this.day = value;
        };
        ParseDate.prototype.setMonth = function (value) {
            this.month = value;
        };
        ParseDate.prototype.setFullYear = function (value) {
            this.year = value;
        };
        ParseDate.prototype.fromDate = function (value) {
            this.year = value.getFullYear();
            this.month = value.getMonth();
            this.day = value.getDate();
            this.hours = value.getHours();
            this.minutes = value.getMinutes();
            this.seconds = value.getSeconds();
            this.milliseconds = value.getMilliseconds();
            return this;
        };

        ParseDate.prototype.toDate = function () {
            return new Date(this.year, this.month, this.day, this.hours, this.minutes, this.seconds, this.milliseconds);
        };

        var proto = ParseDate.prototype;

        function noop() {
        }

        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        function indexOfCaseInsensitive(array, value) {
            var len = array.length, str = value.toString().toLowerCase();
            for (var i = 0; i < len; i++) {
                if (array[i].toLowerCase() === str) {
                    return i;
                }
            }
            return -1; // Return -1 per the "Array.indexOf()" method.
        }

        var defaults = this.defaults = {
            format: 'shortDate',
            strict: false
        };

        this.$get = ["$locale", "dateFilter", function ($locale, dateFilter) {

            var DateParserFactory = function (config) {

                var options = angular.extend({}, defaults, config);

                var $dateParser = {};

                var regExpMap = {
                    'sss': '[0-9]{3}',
                    'ss': '[0-5][0-9]',
                    's': options.strict ? '[1-5]?[0-9]' : '[0-9]|[0-5][0-9]',
                    'mm': '[0-5][0-9]',
                    'm': options.strict ? '[1-5]?[0-9]' : '[0-9]|[0-5][0-9]',
                    'HH': '[01][0-9]|2[0-3]',
                    'H': options.strict ? '1?[0-9]|2[0-3]' : '[01]?[0-9]|2[0-3]',
                    'hh': '[0][1-9]|[1][012]',
                    'h': options.strict ? '[1-9]|1[012]' : '0?[1-9]|1[012]',
                    'a': 'AM|PM',
                    'EEEE': $locale.DATETIME_FORMATS.DAY.join('|'),
                    'EEE': $locale.DATETIME_FORMATS.SHORTDAY.join('|'),
                    'dd': '0[1-9]|[12][0-9]|3[01]',
                    'd': options.strict ? '[1-9]|[1-2][0-9]|3[01]' : '0?[1-9]|[1-2][0-9]|3[01]',
                    'MMMM': $locale.DATETIME_FORMATS.MONTH.join('|'),
                    'MMM': $locale.DATETIME_FORMATS.SHORTMONTH.join('|'),
                    'MM': '0[1-9]|1[012]',
                    'M': options.strict ? '[1-9]|1[012]' : '0?[1-9]|1[012]',
                    'yyyy': '[1]{1}[0-9]{3}|[2]{1}[0-9]{3}',
                    'yy': '[0-9]{2}',
                    'y': options.strict ? '-?(0|[1-9][0-9]{0,3})' : '-?0*[0-9]{1,4}',
                };

                var setFnMap = {
                    'sss': proto.setMilliseconds,
                    'ss': proto.setSeconds,
                    's': proto.setSeconds,
                    'mm': proto.setMinutes,
                    'm': proto.setMinutes,
                    'HH': proto.setHours,
                    'H': proto.setHours,
                    'hh': proto.setHours,
                    'h': proto.setHours,
                    'EEEE': noop,
                    'EEE': noop,
                    'dd': proto.setDate,
                    'd': proto.setDate,
                    'a': function (value) {
                        var hours = this.getHours() % 12;
                        return this.setHours(value.match(/pm/i) ? hours + 12 : hours);
                    },
                    'MMMM': function (value) {
                        return this.setMonth(indexOfCaseInsensitive($locale.DATETIME_FORMATS.MONTH, value));
                    },
                    'MMM': function (value) {
                        return this.setMonth(indexOfCaseInsensitive($locale.DATETIME_FORMATS.SHORTMONTH, value));
                    },
                    'MM': function (value) {
                        return this.setMonth(1 * value - 1);
                    },
                    'M': function (value) {
                        return this.setMonth(1 * value - 1);
                    },
                    'yyyy': proto.setFullYear,
                    'yy': function (value) {
                        return this.setFullYear(2000 + 1 * value);
                    },
                    'y': proto.setFullYear
                };

                var regex, setMap;

                $dateParser.init = function () {
                    $dateParser.$format = $locale.DATETIME_FORMATS[options.format] || options.format;
                    regex = regExpForFormat($dateParser.$format);
                    setMap = setMapForFormat($dateParser.$format);
                };

                $dateParser.isValid = function (date) {
                    if (angular.isDate(date)) return !isNaN(date.getTime());
                    return regex.test(date);
                };

                $dateParser.parse = function (value, baseDate, format, timezone) {
                    // check for date format special names
                    if (format) format = $locale.DATETIME_FORMATS[format] || format;
                    if (angular.isDate(value)) value = dateFilter(value, format || $dateParser.$format, timezone);
                    var formatRegex = format ? regExpForFormat(format) : regex;
                    var formatSetMap = format ? setMapForFormat(format) : setMap;
                    var matches = formatRegex.exec(value);
                    if (!matches) return false;
                    // use custom ParseDate object to set parsed values
                    var date = baseDate && !isNaN(baseDate.getTime()) ? new ParseDate().fromDate(baseDate) : new ParseDate().fromDate(new Date(1970, 0, 1, 0));
                    for (var i = 0; i < matches.length - 1; i++) {
                        formatSetMap[i] && formatSetMap[i].call(date, matches[i + 1]);
                    }
                    // convert back to native Date object
                    var newDate = date.toDate();

                    // check new native Date object for day values overflow
                    if (parseInt(date.day, 10) !== newDate.getDate()) {
                        return false;
                    }

                    return newDate;
                };

                $dateParser.getDateForAttribute = function (key, value) {
                    var date;

                    if (value === 'today') {
                        var today = new Date();
                        date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (key === 'maxDate' ? 1 : 0), 0, 0, 0, (key === 'minDate' ? 0 : -1));
                    } else if (angular.isString(value) && value.match(/^".+"$/)) { // Support {{ dateObj }}
                        date = new Date(value.substr(1, value.length - 2));
                    } else if (isNumeric(value)) {
                        date = new Date(parseInt(value, 10));
                    } else if (angular.isString(value) && 0 === value.length) { // Reset date
                        date = key === 'minDate' ? -Infinity : +Infinity;
                    } else {
                        date = new Date(value);
                    }

                    return date;
                };

                $dateParser.getTimeForAttribute = function (key, value) {
                    var time;

                    if (value === 'now') {
                        time = new Date().setFullYear(1970, 0, 1);
                    } else if (angular.isString(value) && value.match(/^".+"$/)) {
                        time = new Date(value.substr(1, value.length - 2)).setFullYear(1970, 0, 1);
                    } else if (isNumeric(value)) {
                        time = new Date(parseInt(value, 10)).setFullYear(1970, 0, 1);
                    } else if (angular.isString(value) && 0 === value.length) { // Reset time
                        time = key === 'minTime' ? -Infinity : +Infinity;
                    } else {
                        time = $dateParser.parse(value, new Date(1970, 0, 1, 0));
                    }

                    return time;
                };

                /* Handle switch to/from daylight saving.
                 * Hours may be non-zero on daylight saving cut-over:
                 * > 12 when midnight changeover, but then cannot generate
                 * midnight datetime, so jump to 1AM, otherwise reset.
                 * @param  date  (Date) the date to check
                 * @return  (Date) the corrected date
                 *
                 * __ copied from jquery ui datepicker __
                 */
                $dateParser.daylightSavingAdjust = function (date) {
                    if (!date) {
                        return null;
                    }
                    date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
                    return date;
                };

                /* Correct the date for timezone offset.
                 * @param  date  (Date) the date to adjust
                 * @param  timezone  (string) the timezone to adjust for
                 * @param  undo  (boolean) to add or subtract timezone offset
                 * @return  (Date) the corrected date
                 */
                $dateParser.timezoneOffsetAdjust = function (date, timezone, undo) {
                    if (!date) {
                        return null;
                    }
                    // Right now, only 'UTC' is supported.
                    if (timezone && timezone === 'UTC') {
                        date = new Date(date.getTime());
                        date.setMinutes(date.getMinutes() + (undo ? -1 : 1) * date.getTimezoneOffset());
                    }
                    return date;
                };

                // Private functions

                function setMapForFormat(format) {
                    var keys = Object.keys(setFnMap), i;
                    var map = [], sortedMap = [];
                    // Map to setFn
                    var clonedFormat = format;
                    for (i = 0; i < keys.length; i++) {
                        if (format.split(keys[i]).length > 1) {
                            var index = clonedFormat.search(keys[i]);
                            format = format.split(keys[i]).join('');
                            if (setFnMap[keys[i]]) {
                                map[index] = setFnMap[keys[i]];
                            }
                        }
                    }
                    // Sort result map
                    angular.forEach(map, function (v) {
                        // conditional required since angular.forEach broke around v1.2.21
                        // related pr: https://github.com/angular/angular.js/pull/8525
                        if (v) sortedMap.push(v);
                    });
                    return sortedMap;
                }

                function escapeReservedSymbols(text) {
                    return text.replace(/\//g, '[\\/]').replace('/-/g', '[-]').replace(/\./g, '[.]').replace(/\\s/g, '[\\s]');
                }

                function regExpForFormat(format) {
                    var keys = Object.keys(regExpMap), i;

                    var re = format;
                    // Abstract replaces to avoid collisions
                    for (i = 0; i < keys.length; i++) {
                        re = re.split(keys[i]).join('${' + i + '}');
                    }
                    // Replace abstracted values
                    for (i = 0; i < keys.length; i++) {
                        re = re.split('${' + i + '}').join('(' + regExpMap[keys[i]] + ')');
                    }
                    format = escapeReservedSymbols(format);

                    return new RegExp('^' + re + '$', ['i']);
                }

                $dateParser.init();
                return $dateParser;

            };

            return DateParserFactory;

        }];

    }]);

'use strict';

angular.module('mgcrea.ngStrap.datepicker', [
    'mgcrea.ngStrap.helpers.dateParser',
    'mgcrea.ngStrap.helpers.dateFormatter',
    'mgcrea.ngStrap.tooltip'])

    .provider('$datepicker', function () {

        var defaults = this.defaults = {
            animation: 'am-fade',
            //uncommenting the following line will break backwards compatability
            // prefixEvent: 'datepicker',
            prefixClass: 'datepicker',
            placement: 'bottom-left',
            template: 'template/datetimepicker/datepicker.tpl.html',
            trigger: 'focus',
            container: false,
            keyboard: true,
            html: false,
            delay: 0,
            // lang: $locale.id,
            useNative: false,
            dateType: 'date',
            dateFormat: 'shortDate',
            timezone: null,
            modelDateFormat: null,
            dayFormat: 'dd',
            monthFormat: 'MMM',
            yearFormat: 'yyyy',
            monthTitleFormat: 'MMMM yyyy',
            yearTitleFormat: 'yyyy',
            strictFormat: false,
            autoclose: false,
            minDate: -Infinity,
            maxDate: +Infinity,
            startView: 0,
            minView: 0,
            startWeek: 0,
            daysOfWeekDisabled: '',
            iconLeft: 'glyphicon glyphicon-chevron-left',
            iconRight: 'glyphicon glyphicon-chevron-right'
        };

        this.$get = ["$window", "$document", "$rootScope", "$sce", "$dateFormatter", "datepickerViews", "$bsTooltip", "$timeout", function ($window, $document, $rootScope, $sce, $dateFormatter, datepickerViews, $bsTooltip, $timeout) {

            var bodyEl = angular.element($window.document.body);
            var isNative = /(ip(a|o)d|iphone|android)/ig.test($window.navigator.userAgent);
            var isTouch = ('createTouch' in $window.document) && isNative;
            if (!defaults.lang) defaults.lang = $dateFormatter.getDefaultLocale();

            function DatepickerFactory(element, controller, config) {

                var $datepicker = $bsTooltip(element, angular.extend({}, defaults, config));
                var parentScope = config.scope;
                var options = $datepicker.$options;
                var scope = $datepicker.$scope;
                if (options.startView) options.startView -= options.minView;

                // View vars

                var pickerViews = datepickerViews($datepicker);
                $datepicker.$views = pickerViews.views;
                var viewDate = pickerViews.viewDate;
                scope.$mode = options.startView;
                scope.$iconLeft = options.iconLeft;
                scope.$iconRight = options.iconRight;
                var $picker = $datepicker.$views[scope.$mode];

                // Scope methods

                scope.$select = function (date) {
                    $datepicker.select(date);
                };
                scope.$selectPane = function (value) {
                    $datepicker.$selectPane(value);
                };
                scope.$toggleMode = function () {
                    $datepicker.setMode((scope.$mode + 1) % $datepicker.$views.length);
                };

                scope.$today = function () {
                    $datepicker.select(new Date());
                };

                scope.$clear = function () {
                    controller.$setViewValue('');
                    controller.$commitViewValue();
                    controller.$modelValue = null;
                    controller.$dateValue = null;
                    controller.$render();
                    $timeout(function () {
                        $datepicker.hide(true);
                    });
                };

                scope.$close = function () {
                    $timeout(function () {
                        $datepicker.hide(true);
                    });
                };

                // Public methods

                $datepicker.update = function (date) {
                    // console.warn('$datepicker.update() newValue=%o', date);
                    if (angular.isDate(date) && !isNaN(date.getTime())) {
                        $datepicker.$date = date;
                        $picker.update.call($picker, date);
                    }
                    // Build only if pristine
                    $datepicker.$build(true);
                };

                $datepicker.updateDisabledDates = function (dateRanges) {
                    options.disabledDateRanges = dateRanges;
                    for (var i = 0, l = scope.rows.length; i < l; i++) {
                        angular.forEach(scope.rows[i], $datepicker.$setDisabledEl);
                    }
                };

                $datepicker.select = function (date, keep) {
                    // console.warn('$datepicker.select', date, scope.$mode);
                    if (!angular.isDate(controller.$dateValue)) controller.$dateValue = new Date(date);
                    if (!scope.$mode || keep) {
                        controller.$setViewValue(angular.copy(date));
                        controller.$render();
                        if (options.autoclose && !keep) {
                            $timeout(function () {
                                $datepicker.hide(true);
                            });
                        }
                    } else {
                        angular.extend(viewDate, {
                            year: date.getFullYear(),
                            month: date.getMonth(),
                            date: date.getDate()
                        });
                        $datepicker.setMode(scope.$mode - 1);
                        $datepicker.$build();
                    }
                };

                $datepicker.setMode = function (mode) {
                    // console.warn('$datepicker.setMode', mode);
                    scope.$mode = mode;
                    $picker = $datepicker.$views[scope.$mode];
                    $datepicker.$build();
                };

                // Protected methods

                $datepicker.$build = function (pristine) {
                    // console.warn('$datepicker.$build() viewDate=%o', viewDate);
                    if (pristine === true && $picker.built) return;
                    if (pristine === false && !$picker.built) return;
                    $picker.build.call($picker);
                };

                $datepicker.$updateSelected = function () {
                    for (var i = 0, l = scope.rows.length; i < l; i++) {
                        angular.forEach(scope.rows[i], updateSelected);
                    }
                };

                $datepicker.$isSelected = function (date) {
                    return $picker.isSelected(date);
                };

                $datepicker.$setDisabledEl = function (el) {
                    el.disabled = $picker.isDisabled(el.date);
                };

                $datepicker.$selectPane = function (value) {
                    var steps = $picker.steps;
                    // set targetDate to first day of month to avoid problems with
                    // date values rollover. This assumes the viewDate does not
                    // depend on the day of the month
                    var targetDate = new Date(Date.UTC(viewDate.year + ((steps.year || 0) * value), viewDate.month + ((steps.month || 0) * value), 1));
                    angular.extend(viewDate, {
                        year: targetDate.getUTCFullYear(),
                        month: targetDate.getUTCMonth(),
                        date: targetDate.getUTCDate()
                    });
                    $datepicker.$build();
                };

                $datepicker.$onMouseDown = function (evt) {
                    // Prevent blur on mousedown on .dropdown-menu
                    evt.preventDefault();
                    evt.stopPropagation();
                    // Emulate click for mobile devices
                    if (isTouch) {
                        var targetEl = angular.element(evt.target);
                        if (targetEl[0].nodeName.toLowerCase() !== 'button') {
                            targetEl = targetEl.parent();
                        }
                        targetEl.triggerHandler('click');
                    }
                };

                $datepicker.$onKeyDown = function (evt) {
                    if (!/(38|37|39|40|13)/.test(evt.keyCode) || evt.shiftKey || evt.altKey) return;
                    evt.preventDefault();
                    evt.stopPropagation();

                    if (evt.keyCode === 13) {
                        if (!scope.$mode) {
                            return $datepicker.hide(true);
                        } else {
                            return scope.$apply(function () {
                                $datepicker.setMode(scope.$mode - 1);
                            });
                        }
                    }

                    // Navigate with keyboard
                    $picker.onKeyDown(evt);
                    parentScope.$digest();
                };

                // Private

                function updateSelected(el) {
                    el.selected = $datepicker.$isSelected(el.date);
                }

                function focusElement() {
                    element[0].focus();
                }

                // Overrides

                var _init = $datepicker.init;
                $datepicker.init = function () {
                    if (isNative && options.useNative) {
                        element.prop('type', 'date');
                        element.css('-webkit-appearance', 'textfield');
                        return;
                    } else if (isTouch) {
                        element.prop('type', 'text');
                        element.attr('readonly', 'true');
                        element.on('click', focusElement);
                    }
                    _init();
                };

                var _destroy = $datepicker.destroy;
                $datepicker.destroy = function () {
                    if (isNative && options.useNative) {
                        element.off('click', focusElement);
                    }
                    _destroy();
                };

                var _show = $datepicker.show;
                $datepicker.show = function () {
                    _show();
                    // use timeout to hookup the events to prevent
                    // event bubbling from being processed imediately.
                    $timeout(function () {
                        // if $datepicker is no longer showing, don't setup events
                        if (!$datepicker.$isShown) return;
                        $datepicker.$element.on(isTouch ? 'touchstart' : 'mousedown', $datepicker.$onMouseDown);
                        if (options.keyboard) {
                            element.on('keydown', $datepicker.$onKeyDown);
                        }
                    }, 0, false);
                };

                var _hide = $datepicker.hide;
                $datepicker.hide = function (blur) {
                    if (!$datepicker.$isShown) return;
                    $datepicker.$element.off(isTouch ? 'touchstart' : 'mousedown', $datepicker.$onMouseDown);
                    if (options.keyboard) {
                        element.off('keydown', $datepicker.$onKeyDown);
                    }
                    _hide(blur);
                };

                return $datepicker;

            }

            DatepickerFactory.defaults = defaults;
            return DatepickerFactory;

        }];

    })

    .directive('bsDatepicker', ["$window", "$parse", "$q", "$dateFormatter", "$dateParser", "$datepicker", function ($window, $parse, $q, $dateFormatter, $dateParser, $datepicker) {

        var defaults = $datepicker.defaults;
        var isNative = /(ip(a|o)d|iphone|android)/ig.test($window.navigator.userAgent);

        return {
            restrict: 'EAC',
            require: 'ngModel',
            link: function postLink(scope, element, attr, controller) {

                // Directive options
                var options = {scope: scope, controller: controller};
                angular.forEach(['placement', 'container', 'delay', 'trigger', 'html', 'animation', 'template', 'autoclose', 'dateType', 'dateFormat', 'timezone', 'modelDateFormat', 'dayFormat', 'strictFormat', 'startWeek', 'startDate', 'useNative', 'lang', 'startView', 'minView', 'iconLeft', 'iconRight', 'daysOfWeekDisabled', 'id', 'prefixClass', 'prefixEvent'], function (key) {
                    if (angular.isDefined(attr[key])) options[key] = attr[key];
                });

                // use string regex match boolean attr falsy values, leave truthy values be
                var falseValueRegExp = /^(false|0|)$/i;
                angular.forEach(['html', 'container', 'autoclose', 'useNative'], function (key) {
                    if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key]))
                        options[key] = false;
                });

                // Visibility binding support
                attr.bsShow && scope.$watch(attr.bsShow, function (newValue, oldValue) {
                    if (!datepicker || !angular.isDefined(newValue)) return;
                    if (angular.isString(newValue)) newValue = !!newValue.match(/true|,?(datepicker),?/i);
                    newValue === true ? datepicker.show() : datepicker.hide();
                });

                // Initialize datepicker
                var datepicker = $datepicker(element, controller, options);
                options = datepicker.$options;
                // Set expected iOS format
                if (isNative && options.useNative) options.dateFormat = 'yyyy-MM-dd';

                var lang = options.lang;

                var formatDate = function (date, format) {
                    return $dateFormatter.formatDate(date, format, lang);
                };

                var dateParser = $dateParser({format: options.dateFormat, lang: lang, strict: options.strictFormat});

                // Observe attributes for changes
                angular.forEach(['minDate', 'maxDate'], function (key) {
                    // console.warn('attr.$observe(%s)', key, attr[key]);
                    angular.isDefined(attr[key]) && attr.$observe(key, function (newValue) {
                        // console.warn('attr.$observe(%s)=%o', key, newValue);
                        datepicker.$options[key] = dateParser.getDateForAttribute(key, newValue);
                        // Build only if dirty
                        !isNaN(datepicker.$options[key]) && datepicker.$build(false);
                        validateAgainstMinMaxDate(controller.$dateValue);
                    });
                });

                // Watch model for changes
                scope.$watch(attr.ngModel, function (newValue, oldValue) {
                    datepicker.update(controller.$dateValue);
                }, true);

                // Normalize undefined/null/empty array,
                // so that we don't treat changing from undefined->null as a change.
                function normalizeDateRanges(ranges) {
                    if (!ranges || !ranges.length) return null;
                    return ranges;
                }

                if (angular.isDefined(attr.disabledDates)) {
                    scope.$watch(attr.disabledDates, function (disabledRanges, previousValue) {
                        disabledRanges = normalizeDateRanges(disabledRanges);
                        previousValue = normalizeDateRanges(previousValue);

                        if (disabledRanges) {
                            datepicker.updateDisabledDates(disabledRanges);
                        }
                    });
                }

                function validateAgainstMinMaxDate(parsedDate) {
                    if (!angular.isDate(parsedDate)) return;
                    var isMinValid = isNaN(datepicker.$options.minDate) || parsedDate.getTime() >= datepicker.$options.minDate;
                    var isMaxValid = isNaN(datepicker.$options.maxDate) || parsedDate.getTime() <= datepicker.$options.maxDate;
                    var isValid = isMinValid && isMaxValid;
                    controller.$setValidity('date', isValid);
                    controller.$setValidity('min', isMinValid);
                    controller.$setValidity('max', isMaxValid);
                    // Only update the model when we have a valid date
                    if (isValid) controller.$dateValue = parsedDate;
                }

                // viewValue -> $parsers -> modelValue
                controller.$parsers.unshift(function (viewValue) {
                    // console.warn('$parser("%s"): viewValue=%o', element.attr('ng-model'), viewValue);
                    var date;
                    // Null values should correctly reset the model value & validity
                    if (!viewValue) {
                        controller.$setValidity('date', true);
                        // BREAKING CHANGE:
                        // return null (not undefined) when input value is empty, so angularjs 1.3
                        // ngModelController can go ahead and run validators, like ngRequired
                        return null;
                    }
                    var parsedDate = dateParser.parse(viewValue, controller.$dateValue);
                    if (!parsedDate || isNaN(parsedDate.getTime())) {
                        controller.$setValidity('date', false);
                        // return undefined, causes ngModelController to
                        // invalidate model value
                        return;
                    } else {
                        validateAgainstMinMaxDate(parsedDate);
                    }

                    if (options.dateType === 'string') {
                        date = dateParser.timezoneOffsetAdjust(parsedDate, options.timezone, true);
                        return formatDate(date, options.modelDateFormat || options.dateFormat);
                    }
                    date = dateParser.timezoneOffsetAdjust(controller.$dateValue, options.timezone, true);
                    if (options.dateType === 'number') {
                        return date.getTime();
                    } else if (options.dateType === 'unix') {
                        return date.getTime() / 1000;
                    } else if (options.dateType === 'iso') {
                        return date.toISOString();
                    } else {
                        return new Date(date);
                    }
                });

                // modelValue -> $formatters -> viewValue
                controller.$formatters.push(function (modelValue) {
                    // console.warn('$formatter("%s"): modelValue=%o (%o)', element.attr('ng-model'), modelValue, typeof modelValue);
                    var date;
                    if (angular.isUndefined(modelValue) || modelValue === null) {
                        date = NaN;
                    } else if (angular.isDate(modelValue)) {
                        date = modelValue;
                    } else if (options.dateType === 'string') {
                        date = dateParser.parse(modelValue, null, options.modelDateFormat);
                    } else if (options.dateType === 'unix') {
                        date = new Date(modelValue * 1000);
                    } else {
                        date = new Date(modelValue);
                    }
                    // Setup default value?
                    // if(isNaN(date.getTime())) {
                    //   var today = new Date();
                    //   date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
                    // }
                    controller.$dateValue = dateParser.timezoneOffsetAdjust(date, options.timezone);
                    return getDateFormattedString();
                });

                // viewValue -> element
                controller.$render = function () {
                    // console.warn('$render("%s"): viewValue=%o', element.attr('ng-model'), controller.$viewValue);
                    element.val(getDateFormattedString());
                };

                function getDateFormattedString() {
                    return !controller.$dateValue || isNaN(controller.$dateValue.getTime()) ? '' : formatDate(controller.$dateValue, options.dateFormat);
                }

                // Garbage collection
                scope.$on('$destroy', function () {
                    if (datepicker) datepicker.destroy();
                    options = null;
                    datepicker = null;
                });

            }
        };

    }])

    .provider('datepickerViews', function () {

        var defaults = this.defaults = {
            dayFormat: 'dd',
            daySplit: 7
        };

        // Split array into smaller arrays
        function split(arr, size) {
            var arrays = [];
            while (arr.length > 0) {
                arrays.push(arr.splice(0, size));
            }
            return arrays;
        }

        // Modulus operator
        function mod(n, m) {
            return ((n % m) + m) % m;
        }

        this.$get = ["$dateFormatter", "$dateParser", "$sce", function ($dateFormatter, $dateParser, $sce) {

            return function (picker) {

                var scope = picker.$scope;
                var options = picker.$options;

                var lang = options.lang;
                var formatDate = function (date, format) {
                    return $dateFormatter.formatDate(date, format, lang);
                };
                var dateParser = $dateParser({format: options.dateFormat, lang: lang, strict: options.strictFormat});

                var weekDaysMin = $dateFormatter.weekdaysShort(lang);
                var weekDaysLabels = weekDaysMin.slice(options.startWeek).concat(weekDaysMin.slice(0, options.startWeek));
                var weekDaysLabelsHtml = $sce.trustAsHtml('<th class="dow text-center">' + weekDaysLabels.join('</th><th class="dow text-center">') + '</th>');

                var startDate = picker.$date || (options.startDate ? dateParser.getDateForAttribute('startDate', options.startDate) : new Date());
                var viewDate = {year: startDate.getFullYear(), month: startDate.getMonth(), date: startDate.getDate()};

                var views = [{
                    format: options.dayFormat,
                    split: 7,
                    steps: {month: 1},
                    update: function (date, force) {
                        if (!this.built || force || date.getFullYear() !== viewDate.year || date.getMonth() !== viewDate.month) {
                            angular.extend(viewDate, {
                                year: picker.$date.getFullYear(),
                                month: picker.$date.getMonth(),
                                date: picker.$date.getDate()
                            });
                            picker.$build();
                        } else if (date.getDate() !== viewDate.date || date.getDate() === 1) {
                            // chaging picker current month will cause viewDate.date to be set to first day of the month,
                            // in $datepicker.$selectPane, so picker would not update selected day display if
                            // user picks first day of the new month.
                            // As a workaround, we are always forcing update when picked date is first day of month.
                            viewDate.date = picker.$date.getDate();
                            picker.$updateSelected();
                        }
                    },
                    build: function () {
                        var firstDayOfMonth = new Date(viewDate.year, viewDate.month, 1), firstDayOfMonthOffset = firstDayOfMonth.getTimezoneOffset();
                        var firstDate = new Date(+firstDayOfMonth - mod(firstDayOfMonth.getDay() - options.startWeek, 7) * 864e5), firstDateOffset = firstDate.getTimezoneOffset();
                        var today = dateParser.timezoneOffsetAdjust(new Date(), options.timezone).toDateString();
                        // Handle daylight time switch
                        if (firstDateOffset !== firstDayOfMonthOffset) firstDate = new Date(+firstDate + (firstDateOffset - firstDayOfMonthOffset) * 60e3);
                        var days = [], day;
                        for (var i = 0; i < 42; i++) { // < 7 * 6
                            day = dateParser.daylightSavingAdjust(new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate() + i));
                            days.push({
                                date: day,
                                isToday: day.toDateString() === today,
                                label: formatDate(day, this.format),
                                selected: picker.$date && this.isSelected(day),
                                muted: day.getMonth() !== viewDate.month,
                                disabled: this.isDisabled(day)
                            });
                        }
                        scope.title = formatDate(firstDayOfMonth, options.monthTitleFormat);
                        scope.showLabels = true;
                        scope.labels = weekDaysLabelsHtml;
                        scope.rows = split(days, this.split);
                        this.built = true;
                    },
                    isSelected: function (date) {
                        return picker.$date && date.getFullYear() === picker.$date.getFullYear() && date.getMonth() === picker.$date.getMonth() && date.getDate() === picker.$date.getDate();
                    },
                    isDisabled: function (date) {
                        var time = date.getTime();

                        // Disabled because of min/max date.
                        if (time < options.minDate || time > options.maxDate) return true;

                        // Disabled due to being a disabled day of the week
                        if (options.daysOfWeekDisabled.indexOf(date.getDay()) !== -1) return true;

                        // Disabled because of disabled date range.
                        if (options.disabledDateRanges) {
                            for (var i = 0; i < options.disabledDateRanges.length; i++) {
                                if (time >= options.disabledDateRanges[i].start && time <= options.disabledDateRanges[i].end) {
                                    return true;
                                }
                            }
                        }

                        return false;
                    },
                    onKeyDown: function (evt) {
                        if (!picker.$date) {
                            return;
                        }
                        var actualTime = picker.$date.getTime();
                        var newDate;

                        if (evt.keyCode === 37) newDate = new Date(actualTime - 1 * 864e5);
                        else if (evt.keyCode === 38) newDate = new Date(actualTime - 7 * 864e5);
                        else if (evt.keyCode === 39) newDate = new Date(actualTime + 1 * 864e5);
                        else if (evt.keyCode === 40) newDate = new Date(actualTime + 7 * 864e5);

                        if (!this.isDisabled(newDate)) picker.select(newDate, true);
                    }
                }, {
                    name: 'month',
                    format: options.monthFormat,
                    split: 4,
                    steps: {year: 1},
                    update: function (date, force) {
                        if (!this.built || date.getFullYear() !== viewDate.year) {
                            angular.extend(viewDate, {
                                year: picker.$date.getFullYear(),
                                month: picker.$date.getMonth(),
                                date: picker.$date.getDate()
                            });
                            picker.$build();
                        } else if (date.getMonth() !== viewDate.month) {
                            angular.extend(viewDate, {month: picker.$date.getMonth(), date: picker.$date.getDate()});
                            picker.$updateSelected();
                        }
                    },
                    build: function () {
                        var firstMonth = new Date(viewDate.year, 0, 1);
                        var months = [], month;
                        for (var i = 0; i < 12; i++) {
                            month = new Date(viewDate.year, i, 1);
                            months.push({
                                date: month,
                                label: formatDate(month, this.format),
                                selected: picker.$isSelected(month),
                                disabled: this.isDisabled(month)
                            });
                        }
                        scope.title = formatDate(month, options.yearTitleFormat);
                        scope.showLabels = false;
                        scope.rows = split(months, this.split);
                        this.built = true;
                    },
                    isSelected: function (date) {
                        return picker.$date && date.getFullYear() === picker.$date.getFullYear() && date.getMonth() === picker.$date.getMonth();
                    },
                    isDisabled: function (date) {
                        var lastDate = +new Date(date.getFullYear(), date.getMonth() + 1, 0);
                        return lastDate < options.minDate || date.getTime() > options.maxDate;
                    },
                    onKeyDown: function (evt) {
                        if (!picker.$date) {
                            return;
                        }
                        var actualMonth = picker.$date.getMonth();
                        var newDate = new Date(picker.$date);

                        if (evt.keyCode === 37) newDate.setMonth(actualMonth - 1);
                        else if (evt.keyCode === 38) newDate.setMonth(actualMonth - 4);
                        else if (evt.keyCode === 39) newDate.setMonth(actualMonth + 1);
                        else if (evt.keyCode === 40) newDate.setMonth(actualMonth + 4);

                        if (!this.isDisabled(newDate)) picker.select(newDate, true);
                    }
                }, {
                    name: 'year',
                    format: options.yearFormat,
                    split: 4,
                    steps: {year: 12},
                    update: function (date, force) {
                        if (!this.built || force || parseInt(date.getFullYear() / 20, 10) !== parseInt(viewDate.year / 20, 10)) {
                            angular.extend(viewDate, {
                                year: picker.$date.getFullYear(),
                                month: picker.$date.getMonth(),
                                date: picker.$date.getDate()
                            });
                            picker.$build();
                        } else if (date.getFullYear() !== viewDate.year) {
                            angular.extend(viewDate, {
                                year: picker.$date.getFullYear(),
                                month: picker.$date.getMonth(),
                                date: picker.$date.getDate()
                            });
                            picker.$updateSelected();
                        }
                    },
                    build: function () {
                        var firstYear = viewDate.year - viewDate.year % (this.split * 3);
                        var years = [], year;
                        for (var i = 0; i < 12; i++) {
                            year = new Date(firstYear + i, 0, 1);
                            years.push({
                                date: year,
                                label: formatDate(year, this.format),
                                selected: picker.$isSelected(year),
                                disabled: this.isDisabled(year)
                            });
                        }
                        scope.title = years[0].label + '-' + years[years.length - 1].label;
                        scope.showLabels = false;
                        scope.rows = split(years, this.split);
                        this.built = true;
                    },
                    isSelected: function (date) {
                        return picker.$date && date.getFullYear() === picker.$date.getFullYear();
                    },
                    isDisabled: function (date) {
                        var lastDate = +new Date(date.getFullYear() + 1, 0, 0);
                        return lastDate < options.minDate || date.getTime() > options.maxDate;
                    },
                    onKeyDown: function (evt) {
                        if (!picker.$date) {
                            return;
                        }
                        var actualYear = picker.$date.getFullYear(),
                            newDate = new Date(picker.$date);

                        if (evt.keyCode === 37) newDate.setYear(actualYear - 1);
                        else if (evt.keyCode === 38) newDate.setYear(actualYear - 4);
                        else if (evt.keyCode === 39) newDate.setYear(actualYear + 1);
                        else if (evt.keyCode === 40) newDate.setYear(actualYear + 4);

                        if (!this.isDisabled(newDate)) picker.select(newDate, true);
                    }
                }];

                return {
                    views: options.minView ? Array.prototype.slice.call(views, options.minView) : views,
                    viewDate: viewDate
                };

            };

        }];

    });

(function () {

    'use strict';

    angular.module('ui.datetimepicker', [
        'mgcrea.ngStrap.datepicker',
        'mgcrea.ngStrap.timepicker'])

        .config(["$datepickerProvider", "$timepickerProvider", function ($datepickerProvider, $timepickerProvider) {
            angular.extend($datepickerProvider.defaults, {
                dateType: 'unix',
                startWeek: 1,
                autoclose: 1
            });

            angular.extend($timepickerProvider.defaults, {
                timeFormat: 'HH:mm:ss',
                timeType: 'unix',
                length: 10,
                autoclose: 0
            });
        }])

        .directive('isDirty', function () {
            return {
                restrict: 'AE',
                require: 'ngModel',
                link: function (scope, element, attrs, ngModelCtrl) {
                    attrs.$observe('isDirty', function (value) {
                        if (value) {
                            ngModelCtrl.$setDirty();
                        }
                    })
                }
            };
        })

        .directive('datetimepicker', ["$parse", "$dateParser", "$datepicker", "$timepicker", "$locale", function ($parse, $dateParser, $datepicker, $timepicker, $locale) {

            function getTimestampFromDate(date) {
                var timestamp = date;

                if (date && angular.isDate(date)) {
                    timestamp = moment(date).unix();
                }

                return timestamp;
            }

            function getDateFromTimestamp(timestamp) {
                var date = timestamp;

                if (timestamp && !angular.isDate(timestamp)) {
                    date = moment.unix(timestamp).toDate();
                }

                return date;
            }

            function dashCase(name) {
                return name.replace(/[A-Z]/g, function (letter, pos) {
                    return (pos ? '-' : '') + letter.toLowerCase();
                });
            }

            return {
                restrict: 'EA',
                require: 'ngModel',
                replace: true,
                priority: 1,
                scope: {
                    ngModel: '='
                },
                templateUrl: 'template/datetimepicker/datetimepicker.html',
                compile: function compile(template, attrs) {
                    var inputs;
                    var dateInput;
                    var timeInput;

                    inputs = template.find('input');
                    dateInput = angular.element(inputs[0]);
                    timeInput = angular.element(inputs [1]);

                    angular.forEach(['autoclose', 'dateFormat', 'dateType', 'ngDisabled'], function (key) {
                        if (angular.isDefined(attrs[key])) {
                            dateInput.attr(dashCase(key), attrs[key]);
                        }
                    });

                    angular.forEach(['autoclose', 'timeFormat', 'timeType', 'ngDisabled'], function (key) {
                        if (angular.isDefined(attrs[key])) {
                            timeInput.attr(dashCase(key), attrs[key]);
                        }
                    });

                    if (angular.isDefined(attrs['name'])) {
                        dateInput.attr('name', attrs['name']);
                        timeInput.attr('name', attrs['name'] + 'Time');
                    }

                    return function postLink(scope, element, attrs, ngModelCtrl) {
                        var dateFormat;
                        var timeFormat;

                        element.removeClass('form-control');

                        if (angular.isDefined(attrs['dateOnly'])) {
                            scope.dateOnly = attrs['dateOnly'] === 'true';
                        }

                        if (angular.isDefined(attrs['dateFormat'])) {
                            dateFormat = attrs.dateFormat;
                        } else {
                            dateFormat = $datepicker.defaults.dateFormat;
                        }

                        scope.dateFormat = $locale.DATETIME_FORMATS[dateFormat] || dateFormat;

                        if (angular.isDefined(attrs['timeFormat'])) {
                            timeFormat = attrs.timeFormat;
                        } else {
                            timeFormat = $timepicker.defaults.timeFormat;
                        }

                        scope.timeFormat = $locale.DATETIME_FORMATS[timeFormat] || timeFormat;

                        if (angular.isDefined(attrs['dateType'])) {
                            scope.dateType = attrs.dateType;
                        } else {
                            scope.dateType = $datepicker.defaults.dateType;
                        }

                        scope.touchDate = function () {
                            scope.isDirty = true;
                        };

                        attrs.$observe('minDate', function (value) {
                            if (scope.dateType === 'unix') {
                                scope.minDate = getDateFromTimestamp(value);
                            } else {
                                scope.minDate = value;
                            }
                        });

                        attrs.$observe('maxDate', function (value) {
                            if (scope.dateType !== 'unix') {
                                scope.maxDate = getDateFromTimestamp(value);
                            } else {
                                scope.minDate = value;
                            }
                        });
                    }
                }
            }
        }]
    );

}());

'use strict';

angular.module('mgcrea.ngStrap.helpers.dimensions', [])

    .factory('dimensions', ["$document", "$window", function ($document, $window) {

        var jqLite = angular.element;
        var fn = {};

        /**
         * Test the element nodeName
         * @param element
         * @param name
         */
        var nodeName = fn.nodeName = function (element, name) {
            return element.nodeName && element.nodeName.toLowerCase() === name.toLowerCase();
        };

        /**
         * Returns the element computed style
         * @param element
         * @param prop
         * @param extra
         */
        fn.css = function (element, prop, extra) {
            var value;
            if (element.currentStyle) { //IE
                value = element.currentStyle[prop];
            } else if (window.getComputedStyle) {
                value = window.getComputedStyle(element)[prop];
            } else {
                value = element.style[prop];
            }
            return extra === true ? parseFloat(value) || 0 : value;
        };

        /**
         * Provides read-only equivalent of jQuery's offset function:
         * @required-by bootstrap-tooltip, bootstrap-affix
         * @url http://api.jquery.com/offset/
         * @param element
         */
        fn.offset = function (element) {
            var boxRect = element.getBoundingClientRect();
            var docElement = element.ownerDocument;
            return {
                width: boxRect.width || element.offsetWidth,
                height: boxRect.height || element.offsetHeight,
                top: boxRect.top + (window.pageYOffset || docElement.documentElement.scrollTop) - (docElement.documentElement.clientTop || 0),
                left: boxRect.left + (window.pageXOffset || docElement.documentElement.scrollLeft) - (docElement.documentElement.clientLeft || 0)
            };
        };

        /**
         * Provides set equivalent of jQuery's offset function:
         * @required-by bootstrap-tooltip
         * @url http://api.jquery.com/offset/
         * @param element
         * @param options
         * @param i
         */
        fn.setOffset = function (element, options, i) {
            var curPosition,
                curLeft,
                curCSSTop,
                curTop,
                curOffset,
                curCSSLeft,
                calculatePosition,
                position = fn.css(element, 'position'),
                curElem = angular.element(element),
                props = {};

            // Set position first, in-case top/left are set even on static elem
            if (position === 'static') {
                element.style.position = 'relative';
            }

            curOffset = fn.offset(element);
            curCSSTop = fn.css(element, 'top');
            curCSSLeft = fn.css(element, 'left');
            calculatePosition = (position === 'absolute' || position === 'fixed') &&
                (curCSSTop + curCSSLeft).indexOf('auto') > -1;

            // Need to be able to calculate position if either
            // top or left is auto and position is either absolute or fixed
            if (calculatePosition) {
                curPosition = fn.position(element);
                curTop = curPosition.top;
                curLeft = curPosition.left;
            } else {
                curTop = parseFloat(curCSSTop) || 0;
                curLeft = parseFloat(curCSSLeft) || 0;
            }

            if (angular.isFunction(options)) {
                options = options.call(element, i, curOffset);
            }

            if (options.top !== null) {
                props.top = (options.top - curOffset.top) + curTop;
            }
            if (options.left !== null) {
                props.left = (options.left - curOffset.left) + curLeft;
            }

            if ('using' in options) {
                options.using.call(curElem, props);
            } else {
                curElem.css({
                    top: props.top + 'px',
                    left: props.left + 'px'
                });
            }
        };

        /**
         * Provides read-only equivalent of jQuery's position function
         * @required-by bootstrap-tooltip, bootstrap-affix
         * @url http://api.jquery.com/offset/
         * @param element
         */
        fn.position = function (element) {

            var offsetParentRect = {top: 0, left: 0},
                offsetParentElement,
                offset;

            // Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
            if (fn.css(element, 'position') === 'fixed') {

                // We assume that getBoundingClientRect is available when computed position is fixed
                offset = element.getBoundingClientRect();

            } else {

                // Get *real* offsetParentElement
                offsetParentElement = offsetParent(element);

                // Get correct offsets
                offset = fn.offset(element);
                if (!nodeName(offsetParentElement, 'html')) {
                    offsetParentRect = fn.offset(offsetParentElement);
                }

                // Add offsetParent borders
                offsetParentRect.top += fn.css(offsetParentElement, 'borderTopWidth', true);
                offsetParentRect.left += fn.css(offsetParentElement, 'borderLeftWidth', true);
            }

            // Subtract parent offsets and element margins
            return {
                width: element.offsetWidth,
                height: element.offsetHeight,
                top: offset.top - offsetParentRect.top - fn.css(element, 'marginTop', true),
                left: offset.left - offsetParentRect.left - fn.css(element, 'marginLeft', true)
            };

        };

        /**
         * Returns the closest, non-statically positioned offsetParent of a given element
         * @required-by fn.position
         * @param element
         */
        var offsetParent = function offsetParentElement(element) {
            var docElement = element.ownerDocument;
            var offsetParent = element.offsetParent || docElement;
            if (nodeName(offsetParent, '#document')) return docElement.documentElement;
            while (offsetParent && !nodeName(offsetParent, 'html') && fn.css(offsetParent, 'position') === 'static') {
                offsetParent = offsetParent.offsetParent;
            }
            return offsetParent || docElement.documentElement;
        };

        /**
         * Provides equivalent of jQuery's height function
         * @required-by bootstrap-affix
         * @url http://api.jquery.com/height/
         * @param element
         * @param outer
         */
        fn.height = function (element, outer) {
            var value = element.offsetHeight;
            if (outer) {
                value += fn.css(element, 'marginTop', true) + fn.css(element, 'marginBottom', true);
            } else {
                value -= fn.css(element, 'paddingTop', true) + fn.css(element, 'paddingBottom', true) + fn.css(element, 'borderTopWidth', true) + fn.css(element, 'borderBottomWidth', true);
            }
            return value;
        };

        /**
         * Provides equivalent of jQuery's width function
         * @required-by bootstrap-affix
         * @url http://api.jquery.com/width/
         * @param element
         * @param outer
         */
        fn.width = function (element, outer) {
            var value = element.offsetWidth;
            if (outer) {
                value += fn.css(element, 'marginLeft', true) + fn.css(element, 'marginRight', true);
            } else {
                value -= fn.css(element, 'paddingLeft', true) + fn.css(element, 'paddingRight', true) + fn.css(element, 'borderLeftWidth', true) + fn.css(element, 'borderRightWidth', true);
            }
            return value;
        };

        return fn;

    }]);

'use strict';

angular.module('mgcrea.ngStrap.timepicker', [
    'mgcrea.ngStrap.helpers.dateParser',
    'mgcrea.ngStrap.helpers.dateFormatter',
    'mgcrea.ngStrap.tooltip'])

    .provider('$timepicker', function () {

        var defaults = this.defaults = {
            animation: 'am-fade',
            //uncommenting the following line will break backwards compatability
            // prefixEvent: 'timepicker',
            prefixClass: 'timepicker',
            placement: 'bottom-left',
            template: 'template/datetimepicker/timepicker.tpl.html',
            trigger: 'focus',
            container: false,
            keyboard: true,
            html: false,
            delay: 0,
            // lang: $locale.id,
            useNative: true,
            timeType: 'date',
            timeFormat: 'shortTime',
            timezone: null,
            modelTimeFormat: null,
            autoclose: false,
            minTime: -Infinity,
            maxTime: +Infinity,
            length: 5,
            hourStep: 1,
            minuteStep: 5,
            secondStep: 5,
            roundDisplay: false,
            iconUp: 'glyphicon glyphicon-chevron-up',
            iconDown: 'glyphicon glyphicon-chevron-down',
            arrowBehavior: 'pager'
        };

        this.$get = ["$window", "$document", "$rootScope", "$sce", "$dateFormatter", "$bsTooltip", "$timeout", function ($window, $document, $rootScope, $sce, $dateFormatter, $bsTooltip, $timeout) {

            var bodyEl = angular.element($window.document.body);
            var isNative = /(ip(a|o)d|iphone|android)/ig.test($window.navigator.userAgent);
            var isTouch = ('createTouch' in $window.document) && isNative;
            if (!defaults.lang) defaults.lang = $dateFormatter.getDefaultLocale();

            function timepickerFactory(element, controller, config) {

                var $timepicker = $bsTooltip(element, angular.extend({}, defaults, config));
                var parentScope = config.scope;
                var options = $timepicker.$options;
                var scope = $timepicker.$scope;

                var lang = options.lang;
                var formatDate = function (date, format, timezone) {
                    return $dateFormatter.formatDate(date, format, lang, timezone);
                };

                function floorMinutes(time) {
                    // coeff used to floor current time to nearest minuteStep interval
                    var coeff = 1000 * 60 * options.minuteStep;
                    return new Date(Math.floor(time.getTime() / coeff) * coeff);
                }

                // View vars

                var selectedIndex = 0;
                var defaultDate = options.roundDisplay ? floorMinutes(new Date()) : new Date();
                var startDate = controller.$dateValue || defaultDate;
                var viewDate = {
                    hour: startDate.getHours(),
                    meridian: startDate.getHours() < 12,
                    minute: startDate.getMinutes(),
                    second: startDate.getSeconds(),
                    millisecond: startDate.getMilliseconds()
                };

                var format = $dateFormatter.getDatetimeFormat(options.timeFormat, lang);

                var hoursFormat = $dateFormatter.hoursFormat(format),
                    timeSeparator = $dateFormatter.timeSeparator(format),
                    minutesFormat = $dateFormatter.minutesFormat(format),
                    secondsFormat = $dateFormatter.secondsFormat(format),
                    showSeconds = $dateFormatter.showSeconds(format),
                    showAM = $dateFormatter.showAM(format);

                scope.$iconUp = options.iconUp;
                scope.$iconDown = options.iconDown;

                // Scope methods

                scope.$select = function (date, index) {
                    $timepicker.select(date, index);
                };
                scope.$moveIndex = function (value, index) {
                    $timepicker.$moveIndex(value, index);
                };
                scope.$switchMeridian = function (date) {
                    $timepicker.switchMeridian(date);
                };

                // Public methods

                $timepicker.update = function (date) {
                    // console.warn('$timepicker.update() newValue=%o', date);
                    if (angular.isDate(date) && !isNaN(date.getTime())) {
                        $timepicker.$date = date;
                        angular.extend(viewDate, {
                            hour: date.getHours(),
                            minute: date.getMinutes(),
                            second: date.getSeconds(),
                            millisecond: date.getMilliseconds()
                        });
                        $timepicker.$build();
                    } else if (!$timepicker.$isBuilt) {
                        $timepicker.$build();
                    }
                };

                $timepicker.select = function (date, index, keep) {
                    // console.warn('$timepicker.select', date, scope.$mode);
                    if (!controller.$dateValue || isNaN(controller.$dateValue.getTime())) controller.$dateValue = new Date(1970, 0, 1);
                    if (!angular.isDate(date)) date = new Date(date);
                    if (index === 0) controller.$dateValue.setHours(date.getHours());
                    else if (index === 1) controller.$dateValue.setMinutes(date.getMinutes());
                    else if (index === 2) controller.$dateValue.setSeconds(date.getSeconds());
                    controller.$setViewValue(angular.copy(controller.$dateValue));
                    controller.$render();
                    if (options.autoclose && !keep) {
                        $timeout(function () {
                            $timepicker.hide(true);
                        });
                    }
                };

                $timepicker.switchMeridian = function (date) {
                    if (!controller.$dateValue || isNaN(controller.$dateValue.getTime())) {
                        return;
                    }
                    var hours = (date || controller.$dateValue).getHours();
                    controller.$dateValue.setHours(hours < 12 ? hours + 12 : hours - 12);
                    controller.$setViewValue(angular.copy(controller.$dateValue));
                    controller.$render();
                };

                // Protected methods

                $timepicker.$build = function () {
                    // console.warn('$timepicker.$build() viewDate=%o', viewDate);
                    var i, midIndex = scope.midIndex = parseInt(options.length / 2, 10);
                    var hours = [], hour;
                    for (i = 0; i < options.length; i++) {
                        hour = new Date(1970, 0, 1, viewDate.hour - (midIndex - i) * options.hourStep);
                        hours.push({
                            date: hour,
                            label: formatDate(hour, hoursFormat),
                            selected: $timepicker.$date && $timepicker.$isSelected(hour, 0),
                            disabled: $timepicker.$isDisabled(hour, 0)
                        });
                    }
                    var minutes = [], minute;
                    for (i = 0; i < options.length; i++) {
                        minute = new Date(1970, 0, 1, 0, viewDate.minute - (midIndex - i) * options.minuteStep);
                        minutes.push({
                            date: minute,
                            label: formatDate(minute, minutesFormat),
                            selected: $timepicker.$date && $timepicker.$isSelected(minute, 1),
                            disabled: $timepicker.$isDisabled(minute, 1)
                        });
                    }
                    var seconds = [], second;
                    for (i = 0; i < options.length; i++) {
                        second = new Date(1970, 0, 1, 0, 0, viewDate.second - (midIndex - i) * options.secondStep);
                        seconds.push({
                            date: second,
                            label: formatDate(second, secondsFormat),
                            selected: $timepicker.$date && $timepicker.$isSelected(second, 2),
                            disabled: $timepicker.$isDisabled(second, 2)
                        });
                    }

                    var rows = [];
                    for (i = 0; i < options.length; i++) {
                        if (showSeconds) {
                            rows.push([hours[i], minutes[i], seconds[i]]);
                        } else {
                            rows.push([hours[i], minutes[i]]);
                        }
                    }
                    scope.rows = rows;
                    scope.showSeconds = showSeconds;
                    scope.showAM = showAM;
                    scope.isAM = ($timepicker.$date || hours[midIndex].date).getHours() < 12;
                    scope.timeSeparator = timeSeparator;
                    $timepicker.$isBuilt = true;
                };

                $timepicker.$isSelected = function (date, index) {
                    if (!$timepicker.$date) return false;
                    else if (index === 0) {
                        return date.getHours() === $timepicker.$date.getHours();
                    } else if (index === 1) {
                        return date.getMinutes() === $timepicker.$date.getMinutes();
                    } else if (index === 2) {
                        return date.getSeconds() === $timepicker.$date.getSeconds();
                    }
                };

                $timepicker.$isDisabled = function (date, index) {
                    var selectedTime;
                    if (index === 0) {
                        selectedTime = date.getTime() + viewDate.minute * 6e4 + viewDate.second * 1e3;
                    } else if (index === 1) {
                        selectedTime = date.getTime() + viewDate.hour * 36e5 + viewDate.second * 1e3;
                    } else if (index === 2) {
                        selectedTime = date.getTime() + viewDate.hour * 36e5 + viewDate.minute * 6e4;
                    }
                    return selectedTime < options.minTime * 1 || selectedTime > options.maxTime * 1;
                };

                scope.$arrowAction = function (value, index) {
                    if (options.arrowBehavior === 'picker') {
                        $timepicker.$setTimeByStep(value, index);
                    } else {
                        $timepicker.$moveIndex(value, index);
                    }
                };

                $timepicker.$setTimeByStep = function (value, index) {
                    var newDate = new Date($timepicker.$date);
                    var hours = newDate.getHours(), hoursLength = formatDate(newDate, hoursFormat).length;
                    var minutes = newDate.getMinutes(), minutesLength = formatDate(newDate, minutesFormat).length;
                    var seconds = newDate.getSeconds(), secondsLength = formatDate(newDate, secondsFormat).length;
                    if (index === 0) {
                        newDate.setHours(hours - (parseInt(options.hourStep, 10) * value));
                    }
                    else if (index === 1) {
                        newDate.setMinutes(minutes - (parseInt(options.minuteStep, 10) * value));
                    }
                    else if (index === 2) {
                        newDate.setSeconds(seconds - (parseInt(options.secondStep, 10) * value));
                    }
                    $timepicker.select(newDate, index, true);
                };

                $timepicker.$moveIndex = function (value, index) {
                    var targetDate;
                    if (index === 0) {
                        targetDate = new Date(1970, 0, 1, viewDate.hour + (value * options.length), viewDate.minute, viewDate.second);
                        angular.extend(viewDate, {hour: targetDate.getHours()});
                    } else if (index === 1) {
                        targetDate = new Date(1970, 0, 1, viewDate.hour, viewDate.minute + (value * options.length * options.minuteStep), viewDate.second);
                        angular.extend(viewDate, {minute: targetDate.getMinutes()});
                    } else if (index === 2) {
                        targetDate = new Date(1970, 0, 1, viewDate.hour, viewDate.minute, viewDate.second + (value * options.length * options.secondStep));
                        angular.extend(viewDate, {second: targetDate.getSeconds()});
                    }
                    $timepicker.$build();
                };

                $timepicker.$onMouseDown = function (evt) {
                    // Prevent blur on mousedown on .dropdown-menu
                    if (evt.target.nodeName.toLowerCase() !== 'input') evt.preventDefault();
                    evt.stopPropagation();
                    // Emulate click for mobile devices
                    if (isTouch) {
                        var targetEl = angular.element(evt.target);
                        if (targetEl[0].nodeName.toLowerCase() !== 'button') {
                            targetEl = targetEl.parent();
                        }
                        targetEl.triggerHandler('click');
                    }
                };

                $timepicker.$onKeyDown = function (evt) {
                    if (!/(38|37|39|40|13)/.test(evt.keyCode) || evt.shiftKey || evt.altKey) return;
                    evt.preventDefault();
                    evt.stopPropagation();

                    // Close on enter
                    if (evt.keyCode === 13) return $timepicker.hide(true);

                    // Navigate with keyboard
                    var newDate = new Date($timepicker.$date);
                    var hours = newDate.getHours(), hoursLength = formatDate(newDate, hoursFormat).length;
                    var minutes = newDate.getMinutes(), minutesLength = formatDate(newDate, minutesFormat).length;
                    var seconds = newDate.getSeconds(), secondsLength = formatDate(newDate, secondsFormat).length;
                    var sepLength = 1;
                    var lateralMove = /(37|39)/.test(evt.keyCode);
                    var count = 2 + showSeconds * 1 + showAM * 1;

                    // Navigate indexes (left, right)
                    if (lateralMove) {
                        if (evt.keyCode === 37) selectedIndex = selectedIndex < 1 ? count - 1 : selectedIndex - 1;
                        else if (evt.keyCode === 39) selectedIndex = selectedIndex < count - 1 ? selectedIndex + 1 : 0;
                    }

                    // Update values (up, down)
                    var selectRange = [0, hoursLength];
                    var incr = 0;
                    if (evt.keyCode === 38) incr = -1;
                    if (evt.keyCode === 40) incr = +1;
                    var isSeconds = selectedIndex === 2 && showSeconds;
                    var isMeridian = selectedIndex === 2 && !showSeconds || selectedIndex === 3 && showSeconds;
                    if (selectedIndex === 0) {
                        newDate.setHours(hours + incr * parseInt(options.hourStep, 10));
                        // re-calculate hours length because we have changed hours value
                        hoursLength = formatDate(newDate, hoursFormat).length;
                        selectRange = [0, hoursLength];
                    } else if (selectedIndex === 1) {
                        newDate.setMinutes(minutes + incr * parseInt(options.minuteStep, 10));
                        // re-calculate minutes length because we have changes minutes value
                        minutesLength = formatDate(newDate, minutesFormat).length;
                        selectRange = [hoursLength + sepLength, minutesLength];
                    } else if (isSeconds) {
                        newDate.setSeconds(seconds + incr * parseInt(options.secondStep, 10));
                        // re-calculate seconds length because we have changes seconds value
                        secondsLength = formatDate(newDate, secondsFormat).length;
                        selectRange = [hoursLength + sepLength + minutesLength + sepLength, secondsLength];
                    } else if (isMeridian) {
                        if (!lateralMove) $timepicker.switchMeridian();
                        selectRange = [hoursLength + sepLength + minutesLength + sepLength + (secondsLength + sepLength) * showSeconds, 2];
                    }
                    $timepicker.select(newDate, selectedIndex, true);
                    createSelection(selectRange[0], selectRange[1]);
                    parentScope.$digest();
                };

                // Private

                function createSelection(start, length) {
                    var end = start + length;
                    if (element[0].createTextRange) {
                        var selRange = element[0].createTextRange();
                        selRange.collapse(true);
                        selRange.moveStart('character', start);
                        selRange.moveEnd('character', end);
                        selRange.select();
                    } else if (element[0].setSelectionRange) {
                        element[0].setSelectionRange(start, end);
                    } else if (angular.isUndefined(element[0].selectionStart)) {
                        element[0].selectionStart = start;
                        element[0].selectionEnd = end;
                    }
                }

                function focusElement() {
                    element[0].focus();
                }

                // Overrides

                var _init = $timepicker.init;
                $timepicker.init = function () {
                    if (isNative && options.useNative) {
                        element.prop('type', 'time');
                        element.css('-webkit-appearance', 'textfield');
                        return;
                    } else if (isTouch) {
                        element.prop('type', 'text');
                        element.attr('readonly', 'true');
                        element.on('click', focusElement);
                    }
                    _init();
                };

                var _destroy = $timepicker.destroy;
                $timepicker.destroy = function () {
                    if (isNative && options.useNative) {
                        element.off('click', focusElement);
                    }
                    _destroy();
                };

                var _show = $timepicker.show;
                $timepicker.show = function () {
                    _show();
                    // use timeout to hookup the events to prevent
                    // event bubbling from being processed imediately.
                    $timeout(function () {
                        $timepicker.$element && $timepicker.$element.on(isTouch ? 'touchstart' : 'mousedown', $timepicker.$onMouseDown);
                        if (options.keyboard) {
                            element && element.on('keydown', $timepicker.$onKeyDown);
                        }
                    }, 0, false);
                };

                var _hide = $timepicker.hide;
                $timepicker.hide = function (blur) {
                    if (!$timepicker.$isShown) return;
                    $timepicker.$element && $timepicker.$element.off(isTouch ? 'touchstart' : 'mousedown', $timepicker.$onMouseDown);
                    if (options.keyboard) {
                        element && element.off('keydown', $timepicker.$onKeyDown);
                    }
                    _hide(blur);
                };

                return $timepicker;

            }

            timepickerFactory.defaults = defaults;
            return timepickerFactory;

        }];

    })


    .directive('bsTimepicker', ["$window", "$parse", "$q", "$dateFormatter", "$dateParser", "$timepicker", function ($window, $parse, $q, $dateFormatter, $dateParser, $timepicker) {

        var defaults = $timepicker.defaults;
        var isNative = /(ip(a|o)d|iphone|android)/ig.test($window.navigator.userAgent);
        var requestAnimationFrame = $window.requestAnimationFrame || $window.setTimeout;

        return {
            restrict: 'EAC',
            require: 'ngModel',
            link: function postLink(scope, element, attr, controller) {

                // Directive options
                var options = {scope: scope, controller: controller};
                angular.forEach(['placement', 'container', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'template', 'autoclose', 'timeType', 'timeFormat', 'timezone', 'modelTimeFormat', 'useNative', 'hourStep', 'minuteStep', 'secondStep', 'length', 'arrowBehavior', 'iconUp', 'iconDown', 'roundDisplay', 'id', 'prefixClass', 'prefixEvent'], function (key) {
                    if (angular.isDefined(attr[key])) options[key] = attr[key];
                });

                // use string regex match boolean attr falsy values, leave truthy values be
                var falseValueRegExp = /^(false|0|)$/i;
                angular.forEach(['html', 'container', 'autoclose', 'useNative', 'roundDisplay'], function (key) {
                    if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key]))
                        options[key] = false;
                });

                // Visibility binding support
                attr.bsShow && scope.$watch(attr.bsShow, function (newValue, oldValue) {
                    if (!timepicker || !angular.isDefined(newValue)) return;
                    if (angular.isString(newValue)) newValue = !!newValue.match(/true|,?(timepicker),?/i);
                    newValue === true ? timepicker.show() : timepicker.hide();
                });

                // Initialize timepicker
                if (isNative && (options.useNative || defaults.useNative)) options.timeFormat = 'HH:mm';
                var timepicker = $timepicker(element, controller, options);
                options = timepicker.$options;

                var lang = options.lang;
                var formatDate = function (date, format, timezone) {
                    return $dateFormatter.formatDate(date, format, lang, timezone);
                };

                // Initialize parser
                var dateParser = $dateParser({format: options.timeFormat, lang: lang});

                // Observe attributes for changes
                angular.forEach(['minTime', 'maxTime'], function (key) {
                    // console.warn('attr.$observe(%s)', key, attr[key]);
                    angular.isDefined(attr[key]) && attr.$observe(key, function (newValue) {
                        timepicker.$options[key] = dateParser.getTimeForAttribute(key, newValue);
                        !isNaN(timepicker.$options[key]) && timepicker.$build();
                        validateAgainstMinMaxTime(controller.$dateValue);
                    });
                });

                // Watch model for changes
                scope.$watch(attr.ngModel, function (newValue, oldValue) {
                    // console.warn('scope.$watch(%s)', attr.ngModel, newValue, oldValue, controller.$dateValue);
                    timepicker.update(controller.$dateValue);
                }, true);

                function validateAgainstMinMaxTime(parsedTime) {
                    if (!angular.isDate(parsedTime)) return;
                    var isMinValid = isNaN(options.minTime) || new Date(parsedTime.getTime()).setFullYear(1970, 0, 1) >= options.minTime;
                    var isMaxValid = isNaN(options.maxTime) || new Date(parsedTime.getTime()).setFullYear(1970, 0, 1) <= options.maxTime;
                    var isValid = isMinValid && isMaxValid;
                    controller.$setValidity('date', isValid);
                    controller.$setValidity('min', isMinValid);
                    controller.$setValidity('max', isMaxValid);
                    // Only update the model when we have a valid date
                    if (!isValid) {
                        return;
                    }
                    controller.$dateValue = parsedTime;
                }

                // viewValue -> $parsers -> modelValue
                controller.$parsers.unshift(function (viewValue) {
                    // console.warn('$parser("%s"): viewValue=%o', element.attr('ng-model'), viewValue);
                    var date;
                    // Null values should correctly reset the model value & validity
                    if (!viewValue) {
                        // BREAKING CHANGE:
                        // return null (not undefined) when input value is empty, so angularjs 1.3
                        // ngModelController can go ahead and run validators, like ngRequired
                        controller.$setValidity('date', true);
                        return null;
                    }
                    var parsedTime = angular.isDate(viewValue) ? viewValue : dateParser.parse(viewValue, controller.$dateValue);
                    if (!parsedTime || isNaN(parsedTime.getTime())) {
                        controller.$setValidity('date', false);
                        // return undefined, causes ngModelController to
                        // invalidate model value
                        return;
                    } else {
                        validateAgainstMinMaxTime(parsedTime);
                    }

                    if (options.timeType === 'string') {
                        date = dateParser.timezoneOffsetAdjust(parsedTime, options.timezone, true);
                        return formatDate(date, options.modelTimeFormat || options.timeFormat);
                    }
                    date = dateParser.timezoneOffsetAdjust(controller.$dateValue, options.timezone, true);
                    if (options.timeType === 'number') {
                        return date.getTime();
                    } else if (options.timeType === 'unix') {
                        return date.getTime() / 1000;
                    } else if (options.timeType === 'iso') {
                        return date.toISOString();
                    } else {
                        return new Date(date);
                    }
                });

                // modelValue -> $formatters -> viewValue
                controller.$formatters.push(function (modelValue) {
                    // console.warn('$formatter("%s"): modelValue=%o (%o)', element.attr('ng-model'), modelValue, typeof modelValue);
                    var date;
                    if (angular.isUndefined(modelValue) || modelValue === null) {
                        date = NaN;
                    } else if (angular.isDate(modelValue)) {
                        date = modelValue;
                    } else if (options.timeType === 'string') {
                        date = dateParser.parse(modelValue, null, options.modelTimeFormat);
                    } else if (options.timeType === 'unix') {
                        date = new Date(modelValue * 1000);
                    } else {
                        date = new Date(modelValue);
                    }
                    // Setup default value?
                    // if(isNaN(date.getTime())) date = new Date(new Date().setMinutes(0) + 36e5);
                    controller.$dateValue = dateParser.timezoneOffsetAdjust(date, options.timezone);
                    return getTimeFormattedString();
                });

                // viewValue -> element
                controller.$render = function () {
                    // console.warn('$render("%s"): viewValue=%o', element.attr('ng-model'), controller.$viewValue);
                    element.val(getTimeFormattedString());
                };

                function getTimeFormattedString() {
                    return !controller.$dateValue || isNaN(controller.$dateValue.getTime()) ? '' : formatDate(controller.$dateValue, options.timeFormat);
                }

                // Garbage collection
                scope.$on('$destroy', function () {
                    if (timepicker) timepicker.destroy();
                    options = null;
                    timepicker = null;
                });

            }
        };

    }]);

'use strict';

angular.module('mgcrea.ngStrap.tooltip', ['mgcrea.ngStrap.helpers.dimensions'])

    .provider('$bsTooltip', function () {

        var defaults = this.defaults = {
            animation: 'am-fade',
            customClass: '',
            prefixClass: 'tooltip',
            prefixEvent: 'tooltip',
            container: false,
            target: false,
            placement: 'top',
            template: 'template/datetimepicker/tooltip.tpl.html',
            contentTemplate: false,
            trigger: 'hover focus',
            keyboard: false,
            html: false,
            show: false,
            title: '',
            type: '',
            delay: 0,
            autoClose: false,
            bsEnabled: true,
            viewport: {
                selector: 'body',
                padding: 0
            }
        };

        this.$get = ["$window", "$rootScope", "$compile", "$q", "$templateCache", "$http", "$animate", "$sce", "dimensions", "$$rAF", "$timeout", function ($window, $rootScope, $compile, $q, $templateCache, $http, $animate, $sce, dimensions, $$rAF, $timeout) {

            var trim = String.prototype.trim;
            var isTouch = 'createTouch' in $window.document;
            var htmlReplaceRegExp = /ng-bind="/ig;
            var $body = angular.element($window.document);

            function TooltipFactory(element, config) {

                var $tooltip = {};

                // Common vars
                var nodeName = element[0].nodeName.toLowerCase();
                var options = $tooltip.$options = angular.extend({}, defaults, config);
                $tooltip.$promise = fetchTemplate(options.template);
                var scope = $tooltip.$scope = options.scope && options.scope.$new() || $rootScope.$new();
                if (options.delay && angular.isString(options.delay)) {
                    var split = options.delay.split(',').map(parseFloat);
                    options.delay = split.length > 1 ? {show: split[0], hide: split[1]} : split[0];
                }

                // store $id to identify the triggering element in events
                // give priority to options.id, otherwise, try to use
                // element id if defined
                $tooltip.$id = options.id || element.attr('id') || '';

                // Support scope as string options
                if (options.title) {
                    scope.title = $sce.trustAsHtml(options.title);
                }

                // Provide scope helpers
                scope.$setEnabled = function (isEnabled) {
                    scope.$$postDigest(function () {
                        $tooltip.setEnabled(isEnabled);
                    });
                };
                scope.$hide = function () {
                    scope.$$postDigest(function () {
                        $tooltip.hide();
                    });
                };
                scope.$show = function () {
                    scope.$$postDigest(function () {
                        $tooltip.show();
                    });
                };
                scope.$toggle = function () {
                    scope.$$postDigest(function () {
                        $tooltip.toggle();
                    });
                };
                // Publish isShown as a protected var on scope
                $tooltip.$isShown = scope.$isShown = false;

                // Private vars
                var timeout, hoverState;

                // Support contentTemplate option
                if (options.contentTemplate) {
                    $tooltip.$promise = $tooltip.$promise.then(function (template) {
                        var templateEl = angular.element(template);
                        return fetchTemplate(options.contentTemplate)
                            .then(function (contentTemplate) {
                                var contentEl = findElement('[ng-bind="content"]', templateEl[0]);
                                if (!contentEl.length) contentEl = findElement('[ng-bind="title"]', templateEl[0]);
                                contentEl.removeAttr('ng-bind').html(contentTemplate);
                                return templateEl[0].outerHTML;
                            });
                    });
                }

                // Fetch, compile then initialize tooltip
                var tipLinker, tipElement, tipTemplate, tipContainer, tipScope;
                $tooltip.$promise.then(function (template) {
                    if (angular.isObject(template)) template = template.data;
                    if (options.html) template = template.replace(htmlReplaceRegExp, 'ng-bind-html="');
                    template = trim.apply(template);
                    tipTemplate = template;
                    tipLinker = $compile(template);
                    $tooltip.init();
                });

                $tooltip.init = function () {

                    // Options: delay
                    if (options.delay && angular.isNumber(options.delay)) {
                        options.delay = {
                            show: options.delay,
                            hide: options.delay
                        };
                    }

                    // Replace trigger on touch devices ?
                    // if(isTouch && options.trigger === defaults.trigger) {
                    //   options.trigger.replace(/hover/g, 'click');
                    // }

                    // Options : container
                    if (options.container === 'self') {
                        tipContainer = element;
                    } else if (angular.isElement(options.container)) {
                        tipContainer = options.container;
                    } else if (options.container) {
                        tipContainer = findElement(options.container);
                    }

                    // Options: trigger
                    bindTriggerEvents();

                    // Options: target
                    if (options.target) {
                        options.target = angular.isElement(options.target) ? options.target : findElement(options.target);
                    }

                    // Options: show
                    if (options.show) {
                        scope.$$postDigest(function () {
                            options.trigger === 'focus' ? element[0].focus() : $tooltip.show();
                        });
                    }

                };

                $tooltip.destroy = function () {

                    // Unbind events
                    unbindTriggerEvents();

                    // Remove element
                    destroyTipElement();

                    // Destroy scope
                    scope.$destroy();

                };

                $tooltip.enter = function () {

                    clearTimeout(timeout);
                    hoverState = 'in';
                    if (!options.delay || !options.delay.show) {
                        return $tooltip.show();
                    }

                    timeout = setTimeout(function () {
                        if (hoverState === 'in') $tooltip.show();
                    }, options.delay.show);

                };

                $tooltip.show = function () {
                    if (!options.bsEnabled || $tooltip.$isShown) return;

                    scope.$emit(options.prefixEvent + '.show.before', $tooltip);
                    var parent, after;
                    if (options.container) {
                        parent = tipContainer;
                        if (tipContainer[0].lastChild) {
                            after = angular.element(tipContainer[0].lastChild);
                        } else {
                            after = null;
                        }
                    } else {
                        parent = null;
                        after = element;
                    }


                    // Hide any existing tipElement
                    if (tipElement) destroyTipElement();
                    // Fetch a cloned element linked from template
                    tipScope = $tooltip.$scope.$new();
                    tipElement = $tooltip.$element = tipLinker(tipScope, function (clonedElement, scope) {
                    });

                    // Set the initial positioning.  Make the tooltip invisible
                    // so IE doesn't try to focus on it off screen.
                    tipElement.css({
                        top: '-9999px',
                        left: '-9999px',
                        right: 'auto',
                        display: 'block',
                        visibility: 'hidden'
                    });

                    // Options: animation
                    if (options.animation) tipElement.addClass(options.animation);
                    // Options: type
                    if (options.type) tipElement.addClass(options.prefixClass + '-' + options.type);
                    // Options: custom classes
                    if (options.customClass) tipElement.addClass(options.customClass);

                    // Append the element, without any animations.  If we append
                    // using $animate.enter, some of the animations cause the placement
                    // to be off due to the transforms.
                    after ? after.after(tipElement) : parent.prepend(tipElement);

                    $tooltip.$isShown = scope.$isShown = true;
                    safeDigest(scope);

                    // Now, apply placement
                    $tooltip.$applyPlacement();

                    // Once placed, animate it.
                    // Support v1.2+ $animate
                    // https://github.com/angular/angular.js/issues/11713
                    if (angular.version.minor <= 2) {
                        $animate.enter(tipElement, parent, after, enterAnimateCallback);
                    } else {
                        $animate.enter(tipElement, parent, after).then(enterAnimateCallback);
                    }
                    safeDigest(scope);

                    $$rAF(function () {
                        // Once the tooltip is placed and the animation starts, make the tooltip visible
                        if (tipElement) tipElement.css({visibility: 'visible'});
                    });

                    // Bind events
                    if (options.keyboard) {
                        if (options.trigger !== 'focus') {
                            $tooltip.focus();
                        }
                        bindKeyboardEvents();
                    }

                    if (options.autoClose) {
                        bindAutoCloseEvents();
                    }

                };

                function enterAnimateCallback() {
                    scope.$emit(options.prefixEvent + '.show', $tooltip);
                }

                $tooltip.leave = function () {

                    clearTimeout(timeout);
                    hoverState = 'out';
                    if (!options.delay || !options.delay.hide) {
                        return $tooltip.hide();
                    }
                    timeout = setTimeout(function () {
                        if (hoverState === 'out') {
                            $tooltip.hide();
                        }
                    }, options.delay.hide);

                };

                var _blur;
                var _tipToHide;
                $tooltip.hide = function (blur) {

                    if (!$tooltip.$isShown) return;
                    scope.$emit(options.prefixEvent + '.hide.before', $tooltip);

                    // store blur value for leaveAnimateCallback to use
                    _blur = blur;

                    // store current tipElement reference to use
                    // in leaveAnimateCallback
                    _tipToHide = tipElement;

                    // Support v1.2+ $animate
                    // https://github.com/angular/angular.js/issues/11713
                    if (angular.version.minor <= 2) {
                        $animate.leave(tipElement, leaveAnimateCallback);
                    } else {
                        $animate.leave(tipElement).then(leaveAnimateCallback);
                    }

                    $tooltip.$isShown = scope.$isShown = false;
                    safeDigest(scope);

                    // Unbind events
                    if (options.keyboard && tipElement !== null) {
                        unbindKeyboardEvents();
                    }

                    if (options.autoClose && tipElement !== null) {
                        unbindAutoCloseEvents();
                    }
                };

                function leaveAnimateCallback() {
                    scope.$emit(options.prefixEvent + '.hide', $tooltip);

                    // check if current tipElement still references
                    // the same element when hide was called
                    if (tipElement === _tipToHide) {
                        // Allow to blur the input when hidden, like when pressing enter key
                        if (_blur && options.trigger === 'focus') {
                            return element[0].blur();
                        }

                        // clean up child scopes
                        destroyTipElement();
                    }
                }

                $tooltip.toggle = function () {
                    $tooltip.$isShown ? $tooltip.leave() : $tooltip.enter();
                };

                $tooltip.focus = function () {
                    tipElement[0].focus();
                };

                $tooltip.setEnabled = function (isEnabled) {
                    options.bsEnabled = isEnabled;
                };

                $tooltip.setViewport = function (viewport) {
                    options.viewport = viewport;
                };

                // Protected methods

                $tooltip.$applyPlacement = function () {
                    if (!tipElement) return;

                    // Determine if we're doing an auto or normal placement
                    var placement = options.placement,
                        autoToken = /\s?auto?\s?/i,
                        autoPlace = autoToken.test(placement);

                    if (autoPlace) {
                        placement = placement.replace(autoToken, '') || defaults.placement;
                    }

                    // Need to add the position class before we get
                    // the offsets
                    tipElement.addClass(options.placement);

                    // Get the position of the target element
                    // and the height and width of the tooltip so we can center it.
                    var elementPosition = getPosition(),
                        tipWidth = tipElement.prop('offsetWidth'),
                        tipHeight = tipElement.prop('offsetHeight');

                    // If we're auto placing, we need to check the positioning
                    if (autoPlace) {
                        var originalPlacement = placement;
                        var container = options.container ? findElement(options.container) : element.parent();
                        var containerPosition = getPosition(container);

                        // Determine if the vertical placement
                        if (originalPlacement.indexOf('bottom') >= 0 && elementPosition.bottom + tipHeight > containerPosition.bottom) {
                            placement = originalPlacement.replace('bottom', 'top');
                        } else if (originalPlacement.indexOf('top') >= 0 && elementPosition.top - tipHeight < containerPosition.top) {
                            placement = originalPlacement.replace('top', 'bottom');
                        }

                        // Determine the horizontal placement
                        // The exotic placements of left and right are opposite of the standard placements.  Their arrows are put on the left/right
                        // and flow in the opposite direction of their placement.
                        if ((originalPlacement === 'right' || originalPlacement === 'bottom-left' || originalPlacement === 'top-left') &&
                            elementPosition.right + tipWidth > containerPosition.width) {

                            placement = originalPlacement === 'right' ? 'left' : placement.replace('left', 'right');
                        } else if ((originalPlacement === 'left' || originalPlacement === 'bottom-right' || originalPlacement === 'top-right') &&
                            elementPosition.left - tipWidth < containerPosition.left) {

                            placement = originalPlacement === 'left' ? 'right' : placement.replace('right', 'left');
                        }

                        tipElement.removeClass(originalPlacement).addClass(placement);
                    }

                    // Get the tooltip's top and left coordinates to center it with this directive.
                    var tipPosition = getCalculatedOffset(placement, elementPosition, tipWidth, tipHeight);
                    applyPlacement(tipPosition, placement);
                };

                $tooltip.$onKeyUp = function (evt) {
                    if (evt.which === 27 && $tooltip.$isShown) {
                        $tooltip.hide();
                        evt.stopPropagation();
                    }
                };

                $tooltip.$onFocusKeyUp = function (evt) {
                    if (evt.which === 27) {
                        element[0].blur();
                        evt.stopPropagation();
                    }
                };

                $tooltip.$onFocusElementMouseDown = function (evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    // Some browsers do not auto-focus buttons (eg. Safari)
                    $tooltip.$isShown ? element[0].blur() : element[0].focus();
                };

                // bind/unbind events
                function bindTriggerEvents() {
                    var triggers = options.trigger.split(' ');
                    angular.forEach(triggers, function (trigger) {
                        if (trigger === 'click') {
                            element.on('click', $tooltip.toggle);
                        } else if (trigger !== 'manual') {
                            element.on(trigger === 'hover' ? 'mouseenter' : 'focus', $tooltip.enter);
                            element.on(trigger === 'hover' ? 'mouseleave' : 'blur', $tooltip.leave);
                            nodeName === 'button' && trigger !== 'hover' && element.on(isTouch ? 'touchstart' : 'mousedown', $tooltip.$onFocusElementMouseDown);
                        }
                    });
                }

                function unbindTriggerEvents() {
                    var triggers = options.trigger.split(' ');
                    for (var i = triggers.length; i--;) {
                        var trigger = triggers[i];
                        if (trigger === 'click') {
                            element.off('click', $tooltip.toggle);
                        } else if (trigger !== 'manual') {
                            element.off(trigger === 'hover' ? 'mouseenter' : 'focus', $tooltip.enter);
                            element.off(trigger === 'hover' ? 'mouseleave' : 'blur', $tooltip.leave);
                            nodeName === 'button' && trigger !== 'hover' && element.off(isTouch ? 'touchstart' : 'mousedown', $tooltip.$onFocusElementMouseDown);
                        }
                    }
                }

                function bindKeyboardEvents() {
                    if (options.trigger !== 'focus') {
                        tipElement.on('keyup', $tooltip.$onKeyUp);
                    } else {
                        element.on('keyup', $tooltip.$onFocusKeyUp);
                    }
                }

                function unbindKeyboardEvents() {
                    if (options.trigger !== 'focus') {
                        tipElement.off('keyup', $tooltip.$onKeyUp);
                    } else {
                        element.off('keyup', $tooltip.$onFocusKeyUp);
                    }
                }

                var _autoCloseEventsBinded = false;

                function bindAutoCloseEvents() {
                    // use timeout to hookup the events to prevent
                    // event bubbling from being processed imediately.
                    $timeout(function () {
                        // Stop propagation when clicking inside tooltip
                        tipElement.on('click', stopEventPropagation);

                        // Hide when clicking outside tooltip
                        $body.on('click', $tooltip.hide);

                        _autoCloseEventsBinded = true;
                    }, 0, false);
                }

                function unbindAutoCloseEvents() {
                    if (_autoCloseEventsBinded) {
                        tipElement.off('click', stopEventPropagation);
                        $body.off('click', $tooltip.hide);
                        _autoCloseEventsBinded = false;
                    }
                }

                function stopEventPropagation(event) {
                    event.stopPropagation();
                }

                // Private methods

                function getPosition($element) {
                    $element = $element || (options.target || element);

                    var el = $element[0],
                        isBody = el.tagName === 'BODY';

                    var elRect = el.getBoundingClientRect();
                    var rect = {};

                    // IE8 has issues with angular.extend and using elRect directly.
                    // By coping the values of elRect into a new object, we can continue to use extend
                    for (var p in elRect) {
                        // DO NOT use hasOwnProperty when inspecting the return of getBoundingClientRect.
                        rect[p] = elRect[p];
                    }

                    if (rect.width === null) {
                        // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
                        rect = angular.extend({}, rect, {
                            width: elRect.right - elRect.left,
                            height: elRect.bottom - elRect.top
                        });
                    }
                    var elOffset = isBody ? {top: 0, left: 0} : dimensions.offset(el),
                        scroll = {scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.prop('scrollTop') || 0},
                        outerDims = isBody ? {
                            width: document.documentElement.clientWidth,
                            height: $window.innerHeight
                        } : null;

                    return angular.extend({}, rect, scroll, outerDims, elOffset);
                }

                function getCalculatedOffset(placement, position, actualWidth, actualHeight) {
                    var offset;
                    var split = placement.split('-');

                    switch (split[0]) {
                        case 'right':
                            offset = {
                                top: position.top + position.height / 2 - actualHeight / 2,
                                left: position.left + position.width
                            };
                            break;
                        case 'bottom':
                            offset = {
                                top: position.top + position.height,
                                left: position.left + position.width / 2 - actualWidth / 2
                            };
                            break;
                        case 'left':
                            offset = {
                                top: position.top + position.height / 2 - actualHeight / 2,
                                left: position.left - actualWidth
                            };
                            break;
                        default:
                            offset = {
                                top: position.top - actualHeight,
                                left: position.left + position.width / 2 - actualWidth / 2
                            };
                            break;
                    }

                    if (!split[1]) {
                        return offset;
                    }

                    // Add support for corners @todo css
                    if (split[0] === 'top' || split[0] === 'bottom') {
                        switch (split[1]) {
                            case 'left':
                                offset.left = position.left;
                                break;
                            case 'right':
                                offset.left = position.left + position.width - actualWidth;
                        }
                    } else if (split[0] === 'left' || split[0] === 'right') {
                        switch (split[1]) {
                            case 'top':
                                offset.top = position.top - actualHeight;
                                break;
                            case 'bottom':
                                offset.top = position.top + position.height;
                        }
                    }

                    return offset;
                }

                function applyPlacement(offset, placement) {
                    var tip = tipElement[0],
                        width = tip.offsetWidth,
                        height = tip.offsetHeight;

                    // manually read margins because getBoundingClientRect includes difference
                    var marginTop = parseInt(dimensions.css(tip, 'margin-top'), 10),
                        marginLeft = parseInt(dimensions.css(tip, 'margin-left'), 10);

                    // we must check for NaN for ie 8/9
                    if (isNaN(marginTop)) marginTop = 0;
                    if (isNaN(marginLeft)) marginLeft = 0;

                    offset.top = offset.top + marginTop;
                    offset.left = offset.left + marginLeft;

                    // dimensions setOffset doesn't round pixel values
                    // so we use setOffset directly with our own function
                    dimensions.setOffset(tip, angular.extend({
                        using: function (props) {
                            tipElement.css({
                                top: Math.round(props.top) + 'px',
                                left: Math.round(props.left) + 'px',
                                right: ''
                            });
                        }
                    }, offset), 0);

                    // check to see if placing tip in new offset caused the tip to resize itself
                    var actualWidth = tip.offsetWidth,
                        actualHeight = tip.offsetHeight;

                    if (placement === 'top' && actualHeight !== height) {
                        offset.top = offset.top + height - actualHeight;
                    }

                    // If it's an exotic placement, exit now instead of
                    // applying a delta and changing the arrow
                    if (/top-left|top-right|bottom-left|bottom-right/.test(placement)) return;

                    var delta = getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);

                    if (delta.left) {
                        offset.left += delta.left;
                    } else {
                        offset.top += delta.top;
                    }

                    dimensions.setOffset(tip, offset);

                    if (/top|right|bottom|left/.test(placement)) {
                        var isVertical = /top|bottom/.test(placement),
                            arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight,
                            arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight';

                        replaceArrow(arrowDelta, tip[arrowOffsetPosition], isVertical);
                    }
                }

                function getViewportAdjustedDelta(placement, position, actualWidth, actualHeight) {
                    var delta = {top: 0, left: 0},
                        $viewport = options.viewport && findElement(options.viewport.selector || options.viewport);

                    if (!$viewport) {
                        return delta;
                    }

                    var viewportPadding = options.viewport && options.viewport.padding || 0,
                        viewportDimensions = getPosition($viewport);

                    if (/right|left/.test(placement)) {
                        var topEdgeOffset = position.top - viewportPadding - viewportDimensions.scroll,
                            bottomEdgeOffset = position.top + viewportPadding - viewportDimensions.scroll + actualHeight;
                        if (topEdgeOffset < viewportDimensions.top) { // top overflow
                            delta.top = viewportDimensions.top - topEdgeOffset;
                        } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
                            delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset;
                        }
                    } else {
                        var leftEdgeOffset = position.left - viewportPadding,
                            rightEdgeOffset = position.left + viewportPadding + actualWidth;
                        if (leftEdgeOffset < viewportDimensions.left) { // left overflow
                            delta.left = viewportDimensions.left - leftEdgeOffset;
                        } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
                            delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset;
                        }
                    }

                    return delta;
                }

                function replaceArrow(delta, dimension, isHorizontal) {
                    var $arrow = findElement('.tooltip-arrow, .arrow', tipElement[0]);

                    $arrow.css(isHorizontal ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
                        .css(isHorizontal ? 'top' : 'left', '');
                }

                function destroyTipElement() {
                    // Cancel pending callbacks
                    clearTimeout(timeout);

                    if ($tooltip.$isShown && tipElement !== null) {
                        if (options.autoClose) {
                            unbindAutoCloseEvents();
                        }

                        if (options.keyboard) {
                            unbindKeyboardEvents();
                        }
                    }

                    if (tipScope) {
                        tipScope.$destroy();
                        tipScope = null;
                    }

                    if (tipElement) {
                        tipElement.remove();
                        tipElement = $tooltip.$element = null;
                    }
                }

                return $tooltip;

            }

            // Helper functions

            function safeDigest(scope) {
                scope.$$phase || (scope.$root && scope.$root.$$phase) || scope.$digest();
            }

            function findElement(query, element) {
                return angular.element((element || document).querySelectorAll(query));
            }

            var fetchPromises = {};

            function fetchTemplate(template) {
                if (fetchPromises[template]) return fetchPromises[template];
                return (fetchPromises[template] = $http.get(template, {cache: $templateCache}).then(function (res) {
                    return res.data;
                }));
            }

            return TooltipFactory;

        }];

    })

    .directive('bsTooltip', ["$window", "$location", "$sce", "$tooltip", "$$rAF", function ($window, $location, $sce, $tooltip, $$rAF) {

        return {
            restrict: 'EAC',
            scope: true,
            link: function postLink(scope, element, attr, transclusion) {

                // Directive options
                var options = {scope: scope};
                angular.forEach(['template', 'contentTemplate', 'placement', 'container', 'delay', 'trigger', 'html', 'animation', 'backdropAnimation', 'type', 'customClass', 'id'], function (key) {
                    if (angular.isDefined(attr[key])) options[key] = attr[key];
                });

                // use string regex match boolean attr falsy values, leave truthy values be
                var falseValueRegExp = /^(false|0|)$/i;
                angular.forEach(['html', 'container'], function (key) {
                    if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key]))
                        options[key] = false;
                });

                // should not parse target attribute (anchor tag), only data-target #1454
                var dataTarget = element.attr('data-target');
                if (angular.isDefined(dataTarget)) {
                    if (falseValueRegExp.test(dataTarget))
                        options.target = false;
                    else
                        options.target = dataTarget;
                }

                // overwrite inherited title value when no value specified
                // fix for angular 1.3.1 531a8de72c439d8ddd064874bf364c00cedabb11
                if (!scope.hasOwnProperty('title')) {
                    scope.title = '';
                }

                // Observe scope attributes for change
                attr.$observe('title', function (newValue) {
                    if (angular.isDefined(newValue) || !scope.hasOwnProperty('title')) {
                        var oldValue = scope.title;
                        scope.title = $sce.trustAsHtml(newValue);
                        angular.isDefined(oldValue) && $$rAF(function () {
                            tooltip && tooltip.$applyPlacement();
                        });
                    }
                });

                // Support scope as an object
                attr.bsTooltip && scope.$watch(attr.bsTooltip, function (newValue, oldValue) {
                    if (angular.isObject(newValue)) {
                        angular.extend(scope, newValue);
                    } else {
                        scope.title = newValue;
                    }
                    angular.isDefined(oldValue) && $$rAF(function () {
                        tooltip && tooltip.$applyPlacement();
                    });
                }, true);

                // Visibility binding support
                attr.bsShow && scope.$watch(attr.bsShow, function (newValue, oldValue) {
                    if (!tooltip || !angular.isDefined(newValue)) return;
                    if (angular.isString(newValue)) newValue = !!newValue.match(/true|,?(tooltip),?/i);
                    newValue === true ? tooltip.show() : tooltip.hide();
                });

                // Enabled binding support
                attr.bsEnabled && scope.$watch(attr.bsEnabled, function (newValue, oldValue) {
                    // console.warn('scope.$watch(%s)', attr.bsEnabled, newValue, oldValue);
                    if (!tooltip || !angular.isDefined(newValue)) return;
                    if (angular.isString(newValue)) newValue = !!newValue.match(/true|1|,?(tooltip),?/i);
                    newValue === false ? tooltip.setEnabled(false) : tooltip.setEnabled(true);
                });

                // Viewport support
                attr.viewport && scope.$watch(attr.viewport, function (newValue) {
                    if (!tooltip || !angular.isDefined(newValue)) return;
                    tooltip.setViewport(newValue);
                });

                // Initialize popover
                var tooltip = $tooltip(element, options);

                // Garbage collection
                scope.$on('$destroy', function () {
                    if (tooltip) tooltip.destroy();
                    options = null;
                    tooltip = null;
                });

            }
        };

    }]);

(function () {

    'use strict';

    angular
        .module('ui.dialog', [

            'ui.bootstrap.modal',
            'ui.bootstrap.transition',
            'ui.bootstrap.tpls'])

        .factory('$dialog', ["$modal", function ($modal) {
            var _api = {};
            var _instance;
            var _result;
            var _isOpened = false;

            _api.open = function (options, flag) {
                if (_instance && flag) {
                    _instance.close();
                }
                _instance = $modal.open(options);

                return _instance.result;
            };

            _api.alert = function (title, message, acceptButtonLabel, cancelButtonLabel) {
                return _api.open({
                    backdrop: 'static',
                    size: 'sm',
                    template: '<div class="alert-dialog" ng-escape="cancel()">\n    <div class="modal-header">\n <h4 class="modal-title">{{title}}</h4>\n    </div>\n\n    <div class="modal-body" ng-bind-html="message">\n    </div>\n\n    <div class="modal-footer">\n        <button class="btn btn-link" ng-class="acceptButtonLabel ? \'btn-default\':\'btn-primary\'" ng-click="cancel()">\n            {{cancelButtonLabel}}\n        </button>\n        <button class="btn btn-primary" ng-click="accept()" ng-if="acceptButtonLabel">{{acceptButtonLabel}}\n        </button>\n    </div>\n</div>\n',
                    controller: function ($scope, $modalInstance) {
                        $scope.title = title;
                        $scope.message = message;
                        $scope.cancelButtonLabel = cancelButtonLabel || 'Zamknij';
                        $scope.acceptButtonLabel = acceptButtonLabel;

                        $scope.cancel = function () {
                            $modalInstance.dismiss(false);
                        };

                        $scope.accept = function () {
                            $modalInstance.close(true);
                        };
                    }
                });
            };

            return _api;
        }])

        .factory('$ask', ["$dialog", "$translate", "$format", function ($dialog, $translate, $format) {

            function ask(title, message) {
                var params = Array.prototype.slice.call(arguments, 1);
                var acceptButtonLabel = $translate('Yes');
                var cancelButtonLabel = $translate('No');

                message = $format.apply(null, params);
                title = $translate(title);

                return $dialog.alert.call(null, title, message, acceptButtonLabel, cancelButtonLabel);
            };

            return ask;
        }])
}());

/*
 * angular-loading-bar
 *
 * intercepts XHR requests and creates a loading bar.
 * Based on the excellent nprogress work by rstacruz (more info in readme)
 *
 * (c) 2013 Wes Cruver
 * License: MIT
 */


(function () {

    'use strict';

    // Alias the loading bar for various backwards compatibilities since the project has matured:
    angular.module('ui.loadingbar', ['ui.loadingBarInterceptor']);


    /**
     * loadingBarInterceptor service
     *
     * Registers itself as an Angular interceptor and listens for XHR requests.
     */
    angular.module('ui.loadingBarInterceptor', ['ui.loadingBar'])
        .config(['$httpProvider', function ($httpProvider) {

            var interceptor = ['$q', '$cacheFactory', '$timeout', '$rootScope', '$loadingBar', function ($q, $cacheFactory, $timeout, $rootScope, $loadingBar) {

                /**
                 * The total number of requests made
                 */
                var reqsTotal = 0;

                /**
                 * The number of requests completed (either successfully or not)
                 */
                var reqsCompleted = 0;

                /**
                 * The amount of time spent fetching before showing the loading bar
                 */
                var latencyThreshold = $loadingBar.latencyThreshold;

                /**
                 * $timeout handle for latencyThreshold
                 */
                var startTimeout;


                /**
                 * calls $loadingBar.complete() which removes the
                 * loading bar from the DOM.
                 */
                function setComplete() {
                    $timeout.cancel(startTimeout);
                    $loadingBar.complete();
                    reqsCompleted = 0;
                    reqsTotal = 0;
                }

                /**
                 * Determine if the response has already been cached
                 * @param  {Object}  config the config option from the request
                 * @return {Boolean} retrns true if cached, otherwise false
                 */
                function isCached(config) {
                    var cache;
                    var defaultCache = $cacheFactory.get('$http');
                    var defaults = $httpProvider.defaults;

                    // Choose the proper cache source. Borrowed from angular: $http service
                    if ((config.cache || defaults.cache) && config.cache !== false &&
                        (config.method === 'GET' || config.method === 'JSONP')) {
                        cache = angular.isObject(config.cache) ? config.cache
                            : angular.isObject(defaults.cache) ? defaults.cache
                            : defaultCache;
                    }

                    var cached = cache !== undefined ?
                    cache.get(config.url) !== undefined : false;

                    if (config.cached !== undefined && cached !== config.cached) {
                        return config.cached;
                    }
                    config.cached = cached;
                    return cached;
                }

                return {
                    'request': function (config) {
                        // Check to make sure this request hasn't already been cached and that
                        // the requester didn't explicitly ask us to ignore this request:
                        if (!config.ignoreLoadingBar && !isCached(config)) {
                            $rootScope.$broadcast('$loadingBar:loading', {url: config.url});
                            if (reqsTotal === 0) {
                                startTimeout = $timeout(function () {
                                    $loadingBar.start();
                                }, latencyThreshold);
                            }
                            reqsTotal++;
                            $loadingBar.set(reqsCompleted / reqsTotal);
                        }
                        return config;
                    },

                    'response': function (response) {
                        if (!response.config.ignoreLoadingBar && !isCached(response.config)) {
                            reqsCompleted++;
                            $rootScope.$broadcast('$loadingBar:loaded', {url: response.config.url});
                            if (reqsCompleted >= reqsTotal) {
                                setComplete();
                            } else {
                                $loadingBar.set(reqsCompleted / reqsTotal);
                            }
                        }
                        return response;
                    },

                    'responseError': function (rejection) {
                        if (!rejection.config.ignoreLoadingBar && !isCached(rejection.config)) {
                            reqsCompleted++;
                            $rootScope.$broadcast('$loadingBar:loaded', {url: rejection.config.url});
                            if (reqsCompleted >= reqsTotal) {
                                setComplete();
                            } else {
                                $loadingBar.set(reqsCompleted / reqsTotal);
                            }
                        }
                        return $q.reject(rejection);
                    }
                };
            }];

            $httpProvider.interceptors.push(interceptor);
        }]);


    /**
     * Loading Bar
     *
     * This service handles adding and removing the actual element in the DOM.
     * Generally, best practices for DOM manipulation is to take place in a
     * directive, but because the element itself is injected in the DOM only upon
     * XHR requests, and it's likely needed on every view, the best option is to
     * use a service.
     */
    angular.module('ui.loadingBar', [])
        .provider('$loadingBar', function () {

            this.includeSpinner = true;
            this.includeBar = true;
            this.latencyThreshold = 100;
            this.startSize = 0.02;
            this.parentSelector = 'body';
            this.spinnerTemplate = '<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>';
            this.loadingBarTemplate = '<div id="loading-bar"><div class="bar"><div class="peg"></div></div></div>';

            this.$get = ['$injector', '$document', '$timeout', '$rootScope', function ($injector, $document, $timeout, $rootScope) {
                var $animate;
                var $parentSelector = this.parentSelector,
                    loadingBarContainer = angular.element(this.loadingBarTemplate),
                    loadingBar = loadingBarContainer.find('div').eq(0),
                    spinner = angular.element(this.spinnerTemplate);

                var incTimeout,
                    completeTimeout,
                    started = false,
                    status = 0;

                var includeSpinner = this.includeSpinner;
                var includeBar = this.includeBar;
                var startSize = this.startSize;

                /**
                 * Inserts the loading bar element into the dom, and sets it to 2%
                 */
                function _start() {
                    if (!$animate) {
                        $animate = $injector.get('$animate');
                    }

                    var $parent = $document.find($parentSelector).eq(0);
                    $timeout.cancel(completeTimeout);

                    // do not continually broadcast the started event:
                    if (started) {
                        return;
                    }

                    $rootScope.$broadcast('$loadingBar.started');
                    started = true;

                    if (includeBar) {
                        $animate.enter(loadingBarContainer, $parent);
                    }

                    if (includeSpinner) {
                        $animate.enter(spinner, $parent);
                    }

                    _set(startSize);
                }

                /**
                 * Set the loading bar's width to a certain percent.
                 *
                 * @param n any value between 0 and 1
                 */
                function _set(n) {
                    if (!started) {
                        return;
                    }
                    var pct = (n * 100) + '%';
                    loadingBar.css('width', pct);
                    status = n;

                    // increment loadingbar to give the illusion that there is always
                    // progress but make sure to cancel the previous timeouts so we don't
                    // have multiple incs running at the same time.
                    $timeout.cancel(incTimeout);
                    incTimeout = $timeout(function () {
                        _inc();
                    }, 250);
                }

                /**
                 * Increments the loading bar by a random amount
                 * but slows down as it progresses
                 */
                function _inc() {
                    if (_status() >= 1) {
                        return;
                    }

                    var rnd = 0;

                    // TODO: do this mathmatically instead of through conditions

                    var stat = _status();
                    if (stat >= 0 && stat < 0.25) {
                        // Start out between 3 - 6% increments
                        rnd = (Math.random() * (5 - 3 + 1) + 3) / 100;
                    } else if (stat >= 0.25 && stat < 0.65) {
                        // increment between 0 - 3%
                        rnd = (Math.random() * 3) / 100;
                    } else if (stat >= 0.65 && stat < 0.9) {
                        // increment between 0 - 2%
                        rnd = (Math.random() * 2) / 100;
                    } else if (stat >= 0.9 && stat < 0.99) {
                        // finally, increment it .5 %
                        rnd = 0.005;
                    } else {
                        // after 99%, don't increment:
                        rnd = 0;
                    }

                    var pct = _status() + rnd;
                    _set(pct);
                }

                function _status() {
                    return status;
                }

                function _completeAnimation() {
                    status = 0;
                    started = false;
                }

                function _complete() {
                    if (!$animate) {
                        $animate = $injector.get('$animate');
                    }

                    $rootScope.$broadcast('$loadingBar.completed');
                    _set(1);

                    $timeout.cancel(completeTimeout);

                    // Attempt to aggregate any start/complete calls within 500ms:
                    completeTimeout = $timeout(function () {
                        var promise = $animate.leave(loadingBarContainer, _completeAnimation);
                        if (promise && promise.then) {
                            promise.then(_completeAnimation);
                        }
                        $animate.leave(spinner);
                    }, 500);
                }

                return {
                    start: _start,
                    set: _set,
                    status: _status,
                    inc: _inc,
                    complete: _complete,
                    includeSpinner: this.includeSpinner,
                    latencyThreshold: this.latencyThreshold,
                    parentSelector: this.parentSelector,
                    startSize: this.startSize
                };


            }];     //
        });       // wtf javascript. srsly
})();       //

(function () {

    'use strict';

    angular.module('ui.multiselect', ['ng', 'ui.translate'])

        .run(["$rootScope", "$translate", function ($rootScope, $translate) {
            $rootScope.multiSelectLabels = {
                selectAll: $translate('selectAll'),
                selectNone: $translate('selectNone'),
                reset: $translate('reset'),
                search: $translate('search'),
                nothingSelected: $translate('nothingSelected')
            };
        }])

        .directive('multiSelect', ['$sce', '$timeout', '$templateCache', function ($sce, $timeout, $templateCache) {
            return {
                restrict: 'AE',

                scope: {
                    // models
                    inputModel: '=',
                    outputModel: '=',

                    // settings based on attribute
                    isDisabled: '=',

                    // callbacks
                    onClear: '&',
                    onClose: '&',
                    onSearchChange: '&',
                    onItemClick: '&',
                    onOpen: '&',
                    onReset: '&',
                    onSelectAll: '&',
                    onSelectNone: '&',

                    // i18n
                    translation: '='
                },

                /*
                 * The rest are attributes. They don't need to be parsed / binded, so we can safely access them by value.
                 * - buttonLabel, directiveId, helperElements, itemLabel, maxLabels, orientation, selectionMode, minSearchLength,
                 *   tickProperty, disableProperty, groupProperty, searchProperty, maxHeight, outputProperties
                 */

                templateUrl: 'isteven-multi-select.htm',

                link: function ($scope, element, attrs) {

                    $scope.backUp = [];
                    $scope.varButtonLabel = '';
                    $scope.spacingProperty = '';
                    $scope.indexProperty = '';
                    $scope.orientationH = false;
                    $scope.orientationV = true;
                    $scope.filteredModel = [];
                    $scope.inputLabel = {labelFilter: ''};
                    $scope.tabIndex = 0;
                    $scope.lang = {};
                    $scope.helperStatus = {
                        all: true,
                        none: true,
                        reset: true,
                        filter: true
                    };

                    var
                        prevTabIndex = 0,
                        helperItems = [],
                        helperItemsLength = 0,
                        checkBoxLayer = '',
                        scrolled = false,
                        selectedItems = [],
                        formElements = [],
                        vMinSearchLength = 0,
                        clickedItem = null

                    // v3.0.0
                    // clear button clicked
                    $scope.clearClicked = function (e) {
                        $scope.inputLabel.labelFilter = '';
                        $scope.updateFilter();
                        $scope.select('clear', e);
                    }

                    // A little hack so that AngularJS ng-repeat can loop using start and end index like a normal loop
                    // http://stackoverflow.com/questions/16824853/way-to-ng-repeat-defined-number-of-times-instead-of-repeating-over-array
                    $scope.numberToArray = function (num) {
                        return new Array(num);
                    }

                    // Call this function when user type on the filter field
                    $scope.searchChanged = function () {
                        if ($scope.inputLabel.labelFilter.length < vMinSearchLength && $scope.inputLabel.labelFilter.length > 0) {
                            return false;
                        }
                        $scope.updateFilter();
                    }

                    $scope.updateFilter = function () {
                        // we check by looping from end of input-model
                        $scope.filteredModel = [];
                        var i = 0;

                        if (typeof $scope.inputModel === 'undefined') {
                            return false;
                        }

                        for (i = $scope.inputModel.length - 1; i >= 0; i--) {

                            // if it's group end, we push it to filteredModel[];
                            if (typeof $scope.inputModel[i][attrs.groupProperty] !== 'undefined' && $scope.inputModel[i][attrs.groupProperty] === false) {
                                $scope.filteredModel.push($scope.inputModel[i]);
                            }

                            // if it's data
                            var gotData = false;
                            if (typeof $scope.inputModel[i][attrs.groupProperty] === 'undefined') {

                                // If we set the search-key attribute, we use this loop.
                                if (typeof attrs.searchProperty !== 'undefined' && attrs.searchProperty !== '') {

                                    for (var key in $scope.inputModel[i]) {
                                        if (
                                            typeof $scope.inputModel[i][key] !== 'boolean'
                                            && String($scope.inputModel[i][key]).toUpperCase().indexOf($scope.inputLabel.labelFilter.toUpperCase()) >= 0
                                            && attrs.searchProperty.indexOf(key) > -1
                                        ) {
                                            gotData = true;
                                            break;
                                        }
                                    }
                                }
                                // if there's no search-key attribute, we use this one. Much better on performance.
                                else {
                                    for (var key in $scope.inputModel[i]) {
                                        if (
                                            typeof $scope.inputModel[i][key] !== 'boolean'
                                            && String($scope.inputModel[i][key]).toUpperCase().indexOf($scope.inputLabel.labelFilter.toUpperCase()) >= 0
                                        ) {
                                            gotData = true;
                                            break;
                                        }
                                    }
                                }

                                if (gotData === true) {
                                    // push
                                    $scope.filteredModel.push($scope.inputModel[i]);
                                }
                            }

                            // if it's group start
                            if (typeof $scope.inputModel[i][attrs.groupProperty] !== 'undefined' && $scope.inputModel[i][attrs.groupProperty] === true) {

                                if (typeof $scope.filteredModel[$scope.filteredModel.length - 1][attrs.groupProperty] !== 'undefined'
                                    && $scope.filteredModel[$scope.filteredModel.length - 1][attrs.groupProperty] === false) {
                                    $scope.filteredModel.pop();
                                }
                                else {
                                    $scope.filteredModel.push($scope.inputModel[i]);
                                }
                            }
                        }

                        $scope.filteredModel.reverse();

                        $timeout(function () {

                            $scope.getFormElements();

                            // Callback: on filter change
                            if ($scope.inputLabel.labelFilter.length > vMinSearchLength) {

                                var filterObj = [];

                                angular.forEach($scope.filteredModel, function (value, key) {
                                    if (typeof value !== 'undefined') {
                                        if (typeof value[attrs.groupProperty] === 'undefined') {
                                            var tempObj = angular.copy(value);
                                            var index = filterObj.push(tempObj);
                                            delete filterObj[index - 1][$scope.indexProperty];
                                            delete filterObj[index - 1][$scope.spacingProperty];
                                        }
                                    }
                                });

                                $scope.onSearchChange({
                                    data: {
                                        keyword: $scope.inputLabel.labelFilter,
                                        result: filterObj
                                    }
                                });
                            }
                        }, 0);
                    };

                    // List all the input elements. We need this for our keyboard navigation.
                    // This function will be called everytime the filter is updated.
                    // Depending on the size of filtered mode, might not good for performance, but oh well..
                    $scope.getFormElements = function () {
                        formElements = [];

                        var
                            selectButtons = [],
                            inputField = [],
                            checkboxes = [],
                            clearButton = [];

                        // If available, then get select all, select none, and reset buttons
                        if ($scope.helperStatus.all || $scope.helperStatus.none || $scope.helperStatus.reset) {
                            selectButtons = element.children().children().next().children().children()[0].getElementsByTagName('button');
                            // If available, then get the search box and the clear button
                            if ($scope.helperStatus.filter) {
                                // Get helper - search and clear button.
                                inputField = element.children().children().next().children().children().next()[0].getElementsByTagName('input');
                                clearButton = element.children().children().next().children().children().next()[0].getElementsByTagName('button');
                            }
                        }
                        else {
                            if ($scope.helperStatus.filter) {
                                // Get helper - search and clear button.
                                inputField = element.children().children().next().children().children()[0].getElementsByTagName('input');
                                clearButton = element.children().children().next().children().children()[0].getElementsByTagName('button');
                            }
                        }

                        // Get checkboxes
                        if (!$scope.helperStatus.all && !$scope.helperStatus.none && !$scope.helperStatus.reset && !$scope.helperStatus.filter) {
                            checkboxes = element.children().children().next()[0].getElementsByTagName('input');
                        }
                        else {
                            checkboxes = element.children().children().next().children().next()[0].getElementsByTagName('input');
                        }

                        // Push them into global array formElements[]
                        for (var i = 0; i < selectButtons.length; i++) {
                            formElements.push(selectButtons[i]);
                        }
                        for (var i = 0; i < inputField.length; i++) {
                            formElements.push(inputField[i]);
                        }
                        for (var i = 0; i < clearButton.length; i++) {
                            formElements.push(clearButton[i]);
                        }
                        for (var i = 0; i < checkboxes.length; i++) {
                            formElements.push(checkboxes[i]);
                        }
                    }

                    // check if an item has attrs.groupProperty (be it true or false)
                    $scope.isGroupMarker = function (item, type) {
                        if (typeof item[attrs.groupProperty] !== 'undefined' && item[attrs.groupProperty] === type) return true;
                        return false;
                    }

                    $scope.removeGroupEndMarker = function (item) {
                        if (typeof item[attrs.groupProperty] !== 'undefined' && item[attrs.groupProperty] === false) return false;
                        return true;
                    }

                    // call this function when an item is clicked
                    $scope.syncItems = function (item, e, ng_repeat_index) {

                        e.preventDefault();
                        e.stopPropagation();

                        // if the directive is globaly disabled, do nothing
                        if (typeof attrs.disableProperty !== 'undefined' && item[attrs.disableProperty] === true) {
                            return false;
                        }

                        // if item is disabled, do nothing
                        if (typeof attrs.isDisabled !== 'undefined' && $scope.isDisabled === true) {
                            return false;
                        }

                        // if end group marker is clicked, do nothing
                        if (typeof item[attrs.groupProperty] !== 'undefined' && item[attrs.groupProperty] === false) {
                            return false;
                        }

                        var index = $scope.filteredModel.indexOf(item);

                        // if the start of group marker is clicked ( only for multiple selection! )
                        // how it works:
                        // - if, in a group, there are items which are not selected, then they all will be selected
                        // - if, in a group, all items are selected, then they all will be de-selected
                        if (typeof item[attrs.groupProperty] !== 'undefined' && item[attrs.groupProperty] === true) {

                            // this is only for multiple selection, so if selection mode is single, do nothing
                            if (typeof attrs.selectionMode !== 'undefined' && attrs.selectionMode.toUpperCase() === 'SINGLE') {
                                return false;
                            }

                            var i, j, k;
                            var startIndex = 0;
                            var endIndex = $scope.filteredModel.length - 1;
                            var tempArr = [];

                            // nest level is to mark the depth of the group.
                            // when you get into a group (start group marker), nestLevel++
                            // when you exit a group (end group marker), nextLevel--
                            var nestLevel = 0;

                            // we loop throughout the filtered model (not whole model)
                            for (i = index; i < $scope.filteredModel.length; i++) {

                                // this break will be executed when we're done processing each group
                                if (nestLevel === 0 && i > index) {
                                    break;
                                }

                                if (typeof $scope.filteredModel[i][attrs.groupProperty] !== 'undefined' && $scope.filteredModel[i][attrs.groupProperty] === true) {

                                    // To cater multi level grouping
                                    if (tempArr.length === 0) {
                                        startIndex = i + 1;
                                    }
                                    nestLevel = nestLevel + 1;
                                }

                                // if group end
                                else if (typeof $scope.filteredModel[i][attrs.groupProperty] !== 'undefined' && $scope.filteredModel[i][attrs.groupProperty] === false) {

                                    nestLevel = nestLevel - 1;

                                    // cek if all are ticked or not
                                    if (tempArr.length > 0 && nestLevel === 0) {

                                        var allTicked = true;

                                        endIndex = i;

                                        for (j = 0; j < tempArr.length; j++) {
                                            if (typeof tempArr[j][$scope.tickProperty] !== 'undefined' && tempArr[j][$scope.tickProperty] === false) {
                                                allTicked = false;
                                                break;
                                            }
                                        }

                                        if (allTicked === true) {
                                            for (j = startIndex; j <= endIndex; j++) {
                                                if (typeof $scope.filteredModel[j][attrs.groupProperty] === 'undefined') {
                                                    if (typeof attrs.disableProperty === 'undefined') {
                                                        $scope.filteredModel[j][$scope.tickProperty] = false;
                                                        // we refresh input model as well
                                                        inputModelIndex = $scope.filteredModel[j][$scope.indexProperty];
                                                        $scope.inputModel[inputModelIndex][$scope.tickProperty] = false;
                                                    }
                                                    else if ($scope.filteredModel[j][attrs.disableProperty] !== true) {
                                                        $scope.filteredModel[j][$scope.tickProperty] = false;
                                                        // we refresh input model as well
                                                        inputModelIndex = $scope.filteredModel[j][$scope.indexProperty];
                                                        $scope.inputModel[inputModelIndex][$scope.tickProperty] = false;
                                                    }
                                                }
                                            }
                                        }

                                        else {
                                            for (j = startIndex; j <= endIndex; j++) {
                                                if (typeof $scope.filteredModel[j][attrs.groupProperty] === 'undefined') {
                                                    if (typeof attrs.disableProperty === 'undefined') {
                                                        $scope.filteredModel[j][$scope.tickProperty] = true;
                                                        // we refresh input model as well
                                                        inputModelIndex = $scope.filteredModel[j][$scope.indexProperty];
                                                        $scope.inputModel[inputModelIndex][$scope.tickProperty] = true;

                                                    }
                                                    else if ($scope.filteredModel[j][attrs.disableProperty] !== true) {
                                                        $scope.filteredModel[j][$scope.tickProperty] = true;
                                                        // we refresh input model as well
                                                        inputModelIndex = $scope.filteredModel[j][$scope.indexProperty];
                                                        $scope.inputModel[inputModelIndex][$scope.tickProperty] = true;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                                // if data
                                else {
                                    tempArr.push($scope.filteredModel[i]);
                                }
                            }
                        }

                        // if an item (not group marker) is clicked
                        else {

                            // If it's single selection mode
                            if (typeof attrs.selectionMode !== 'undefined' && attrs.selectionMode.toUpperCase() === 'SINGLE') {

                                // first, set everything to false
                                for (i = 0; i < $scope.filteredModel.length; i++) {
                                    $scope.filteredModel[i][$scope.tickProperty] = false;
                                }
                                for (i = 0; i < $scope.inputModel.length; i++) {
                                    $scope.inputModel[i][$scope.tickProperty] = false;
                                }

                                // then set the clicked item to true
                                $scope.filteredModel[index][$scope.tickProperty] = true;
                            }

                            // Multiple
                            else {
                                $scope.filteredModel[index][$scope.tickProperty] = !$scope.filteredModel[index][$scope.tickProperty];
                            }

                            // we refresh input model as well
                            var inputModelIndex = $scope.filteredModel[index][$scope.indexProperty];
                            $scope.inputModel[inputModelIndex][$scope.tickProperty] = $scope.filteredModel[index][$scope.tickProperty];
                        }

                        // we execute the callback function here
                        clickedItem = angular.copy(item);
                        if (clickedItem !== null) {
                            $timeout(function () {
                                delete clickedItem[$scope.indexProperty];
                                delete clickedItem[$scope.spacingProperty];
                                $scope.onItemClick({data: clickedItem});
                                clickedItem = null;
                            }, 0);
                        }

                        $scope.refreshOutputModel();
                        $scope.refreshButton();

                        // We update the index here
                        prevTabIndex = $scope.tabIndex;
                        $scope.tabIndex = ng_repeat_index + helperItemsLength;

                        // Set focus on the hidden checkbox
                        e.target.focus();

                        // set & remove CSS style
                        $scope.removeFocusStyle(prevTabIndex);
                        $scope.setFocusStyle($scope.tabIndex);

                        if (typeof attrs.selectionMode !== 'undefined' && attrs.selectionMode.toUpperCase() === 'SINGLE') {
                            // on single selection mode, we then hide the checkbox layer
                            $scope.toggleCheckboxes(e);
                        }
                    }

                    // update $scope.outputModel
                    $scope.refreshOutputModel = function () {

                        $scope.outputModel = [];
                        var
                            outputProps = [],
                            tempObj = {};

                        // v4.0.0
                        if (typeof attrs.outputProperties !== 'undefined') {
                            outputProps = attrs.outputProperties.split(' ');
                            angular.forEach($scope.inputModel, function (value, key) {
                                if (
                                    typeof value !== 'undefined'
                                    && typeof value[attrs.groupProperty] === 'undefined'
                                    && value[$scope.tickProperty] === true
                                ) {
                                    tempObj = {};
                                    angular.forEach(value, function (value1, key1) {
                                        if (outputProps.indexOf(key1) > -1) {
                                            tempObj[key1] = value1;
                                        }
                                    });
                                    var index = $scope.outputModel.push(tempObj);
                                    delete $scope.outputModel[index - 1][$scope.indexProperty];
                                    delete $scope.outputModel[index - 1][$scope.spacingProperty];
                                }
                            });
                        }
                        else {
                            angular.forEach($scope.inputModel, function (value, key) {
                                if (
                                    typeof value !== 'undefined'
                                    && typeof value[attrs.groupProperty] === 'undefined'
                                    && value[$scope.tickProperty] === true
                                ) {
                                    var temp = angular.copy(value);
                                    var index = $scope.outputModel.push(temp);
                                    delete $scope.outputModel[index - 1][$scope.indexProperty];
                                    delete $scope.outputModel[index - 1][$scope.spacingProperty];
                                }
                            });
                        }
                    }

                    // refresh button label
                    $scope.refreshButton = function () {

                        $scope.varButtonLabel = '';
                        var ctr = 0;

                        // refresh button label...
                        if ($scope.outputModel.length === 0) {
                            // https://github.com/isteven/angular-multi-select/pull/19
                            $scope.varButtonLabel = $scope.lang.nothingSelected;
                        }
                        else {
                            var tempMaxLabels = $scope.outputModel.length;
                            if (typeof attrs.maxLabels !== 'undefined' && attrs.maxLabels !== '') {
                                tempMaxLabels = attrs.maxLabels;
                            }

                            // if max amount of labels displayed..
                            if ($scope.outputModel.length > tempMaxLabels) {
                                $scope.more = true;
                            }
                            else {
                                $scope.more = false;
                            }

                            angular.forEach($scope.inputModel, function (value, key) {
                                if (typeof value !== 'undefined' && value[attrs.tickProperty] === true) {
                                    if (ctr < tempMaxLabels) {
                                        $scope.varButtonLabel += ( $scope.varButtonLabel.length > 0 ? '</div>, <div class="buttonLabel">' : '<div class="buttonLabel">') + $scope.writeLabel(value, 'buttonLabel');
                                    }
                                    ctr++;
                                }
                            });

                            if ($scope.more === true) {
                                // https://github.com/isteven/angular-multi-select/pull/16
                                if (tempMaxLabels > 0) {
                                    $scope.varButtonLabel += ', ... ';
                                }
                                $scope.varButtonLabel += '(' + $scope.outputModel.length + ')';
                            }
                        }
                        $scope.varButtonLabel = $sce.trustAsHtml($scope.varButtonLabel + '<span class="caret"></span>');
                    }

                    // Check if a checkbox is disabled or enabled. It will check the granular control (disableProperty) and global control (isDisabled)
                    // Take note that the granular control has higher priority.
                    $scope.itemIsDisabled = function (item) {

                        if (typeof attrs.disableProperty !== 'undefined' && item[attrs.disableProperty] === true) {
                            return true;
                        }
                        else {
                            if ($scope.isDisabled === true) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        }

                    }

                    // A simple function to parse the item label settings. Used on the buttons and checkbox labels.
                    $scope.writeLabel = function (item, type) {

                        // type is either 'itemLabel' or 'buttonLabel'
                        var temp = attrs[type].split(' ');
                        var label = '';

                        angular.forEach(temp, function (value, key) {
                            item[value] && ( label += '&nbsp;' + value.split('.').reduce(function (prev, current) {
                                    return prev[current];
                                }, item));
                        });

                        if (type.toUpperCase() === 'BUTTONLABEL') {
                            return label;
                        }
                        return $sce.trustAsHtml(label);
                    }

                    // UI operations to show/hide checkboxes based on click event..
                    $scope.toggleCheckboxes = function (e) {

                        // We grab the button
                        var clickedEl = element.children()[0];

                        // Just to make sure.. had a bug where key events were recorded twice
                        angular.element(document).off('click', $scope.externalClickListener);
                        angular.element(document).off('keydown', $scope.keyboardListener);

                        // The idea below was taken from another multi-select directive - https://github.com/amitava82/angular-multiselect
                        // His version is awesome if you need a more simple multi-select approach.

                        // close
                        if (angular.element(checkBoxLayer).hasClass('show')) {

                            angular.element(checkBoxLayer).removeClass('show');
                            angular.element(clickedEl).removeClass('buttonClicked');
                            angular.element(document).off('click', $scope.externalClickListener);
                            angular.element(document).off('keydown', $scope.keyboardListener);

                            // clear the focused element;
                            $scope.removeFocusStyle($scope.tabIndex);
                            if (typeof formElements[$scope.tabIndex] !== 'undefined') {
                                formElements[$scope.tabIndex].blur();
                            }

                            // close callback
                            $timeout(function () {
                                $scope.onClose();
                            }, 0);

                            // set focus on button again
                            element.children().children()[0].focus();
                        }
                        // open
                        else {
                            // clear filter
                            $scope.inputLabel.labelFilter = '';
                            $scope.updateFilter();

                            helperItems = [];
                            helperItemsLength = 0;

                            angular.element(checkBoxLayer).addClass('show');
                            angular.element(clickedEl).addClass('buttonClicked');

                            // Attach change event listener on the input filter.
                            // We need this because ng-change is apparently not an event listener.
                            angular.element(document).on('click', $scope.externalClickListener);
                            angular.element(document).on('keydown', $scope.keyboardListener);

                            // to get the initial tab index, depending on how many helper elements we have.
                            // priority is to always focus it on the input filter
                            $scope.getFormElements();
                            $scope.tabIndex = 0;

                            var helperContainer = angular.element(element[0].querySelector('.helperContainer'))[0];

                            if (typeof helperContainer !== 'undefined') {
                                for (var i = 0; i < helperContainer.getElementsByTagName('BUTTON').length; i++) {
                                    helperItems[i] = helperContainer.getElementsByTagName('BUTTON')[i];
                                }
                                helperItemsLength = helperItems.length + helperContainer.getElementsByTagName('INPUT').length;
                            }

                            // focus on the filter element on open.
                            if (element[0].querySelector('.inputFilter')) {
                                element[0].querySelector('.inputFilter').focus();
                                $scope.tabIndex = $scope.tabIndex + helperItemsLength - 2;
                                // blur button in vain
                                angular.element(element).children()[0].blur();
                            }
                            // if there's no filter then just focus on the first checkbox item
                            else {
                                if (!$scope.isDisabled) {
                                    $scope.tabIndex = $scope.tabIndex + helperItemsLength;
                                    if ($scope.inputModel.length > 0) {
                                        formElements[$scope.tabIndex].focus();
                                        $scope.setFocusStyle($scope.tabIndex);
                                        // blur button in vain
                                        angular.element(element).children()[0].blur();
                                    }
                                }
                            }

                            // open callback
                            $scope.onOpen();
                        }
                    }

                    // handle clicks outside the button / multi select layer
                    $scope.externalClickListener = function (e) {

                        var targetsArr = element.find(e.target.tagName);
                        for (var i = 0; i < targetsArr.length; i++) {
                            if (e.target == targetsArr[i]) {
                                return;
                            }
                        }

                        angular.element(checkBoxLayer.previousSibling).removeClass('buttonClicked');
                        angular.element(checkBoxLayer).removeClass('show');
                        angular.element(document).off('click', $scope.externalClickListener);
                        angular.element(document).off('keydown', $scope.keyboardListener);

                        // close callback
                        $timeout(function () {
                            $scope.onClose();
                        }, 0);

                        // set focus on button again
                        element.children().children()[0].focus();
                    }

                    // select All / select None / reset buttons
                    $scope.select = function (type, e) {

                        var helperIndex = helperItems.indexOf(e.target);
                        $scope.tabIndex = helperIndex;

                        switch (type.toUpperCase()) {
                            case 'ALL':
                                angular.forEach($scope.filteredModel, function (value, key) {
                                    if (typeof value !== 'undefined' && value[attrs.disableProperty] !== true) {
                                        if (typeof value[attrs.groupProperty] === 'undefined') {
                                            value[$scope.tickProperty] = true;
                                        }
                                    }
                                });
                                $scope.refreshOutputModel();
                                $scope.refreshButton();
                                $scope.onSelectAll();
                                break;
                            case 'NONE':
                                angular.forEach($scope.filteredModel, function (value, key) {
                                    if (typeof value !== 'undefined' && value[attrs.disableProperty] !== true) {
                                        if (typeof value[attrs.groupProperty] === 'undefined') {
                                            value[$scope.tickProperty] = false;
                                        }
                                    }
                                });
                                $scope.refreshOutputModel();
                                $scope.refreshButton();
                                $scope.onSelectNone();
                                break;
                            case 'RESET':
                                angular.forEach($scope.filteredModel, function (value, key) {
                                    if (typeof value[attrs.groupProperty] === 'undefined' && typeof value !== 'undefined' && value[attrs.disableProperty] !== true) {
                                        var temp = value[$scope.indexProperty];
                                        value[$scope.tickProperty] = $scope.backUp[temp][$scope.tickProperty];
                                    }
                                });
                                $scope.refreshOutputModel();
                                $scope.refreshButton();
                                $scope.onReset();
                                break;
                            case 'CLEAR':
                                $scope.tabIndex = $scope.tabIndex + 1;
                                $scope.onClear();
                                break;
                            case 'FILTER':
                                $scope.tabIndex = helperItems.length - 1;
                                break;
                            default:
                        }
                    }

                    // just to create a random variable name
                    function genRandomString(length) {
                        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
                        var temp = '';
                        for (var i = 0; i < length; i++) {
                            temp += possible.charAt(Math.floor(Math.random() * possible.length));
                        }
                        return temp;
                    }

                    // count leading spaces
                    $scope.prepareGrouping = function () {
                        var spacing = 0;
                        angular.forEach($scope.filteredModel, function (value, key) {
                            value[$scope.spacingProperty] = spacing;
                            if (value[attrs.groupProperty] === true) {
                                spacing += 2;
                            }
                            else if (value[attrs.groupProperty] === false) {
                                spacing -= 2;
                            }
                        });
                    }

                    // prepare original index
                    $scope.prepareIndex = function () {
                        var ctr = 0;
                        angular.forEach($scope.filteredModel, function (value, key) {
                            value[$scope.indexProperty] = ctr;
                            ctr++;
                        });
                    }

                    // navigate using up and down arrow
                    $scope.keyboardListener = function (e) {

                        var key = e.keyCode ? e.keyCode : e.which;
                        var isNavigationKey = false;

                        // ESC key (close)
                        if (key === 27) {
                            e.preventDefault();
                            e.stopPropagation();
                            $scope.toggleCheckboxes(e);
                        }


                        // next element ( tab, down & right key )
                        else if (key === 40 || key === 39 || ( !e.shiftKey && key == 9 )) {

                            isNavigationKey = true;
                            prevTabIndex = $scope.tabIndex;
                            $scope.tabIndex++;
                            if ($scope.tabIndex > formElements.length - 1) {
                                $scope.tabIndex = 0;
                                prevTabIndex = formElements.length - 1;
                            }
                            while (formElements[$scope.tabIndex].disabled === true) {
                                $scope.tabIndex++;
                                if ($scope.tabIndex > formElements.length - 1) {
                                    $scope.tabIndex = 0;
                                }
                                if ($scope.tabIndex === prevTabIndex) {
                                    break;
                                }
                            }
                        }

                        // prev element ( shift+tab, up & left key )
                        else if (key === 38 || key === 37 || ( e.shiftKey && key == 9 )) {
                            isNavigationKey = true;
                            prevTabIndex = $scope.tabIndex;
                            $scope.tabIndex--;
                            if ($scope.tabIndex < 0) {
                                $scope.tabIndex = formElements.length - 1;
                                prevTabIndex = 0;
                            }
                            while (formElements[$scope.tabIndex].disabled === true) {
                                $scope.tabIndex--;
                                if ($scope.tabIndex === prevTabIndex) {
                                    break;
                                }
                                if ($scope.tabIndex < 0) {
                                    $scope.tabIndex = formElements.length - 1;
                                }
                            }
                        }

                        if (isNavigationKey === true) {

                            e.preventDefault();

                            // set focus on the checkbox
                            formElements[$scope.tabIndex].focus();
                            var actEl = document.activeElement;

                            if (actEl.type.toUpperCase() === 'CHECKBOX') {
                                $scope.setFocusStyle($scope.tabIndex);
                                $scope.removeFocusStyle(prevTabIndex);
                            }
                            else {
                                $scope.removeFocusStyle(prevTabIndex);
                                $scope.removeFocusStyle(helperItemsLength);
                                $scope.removeFocusStyle(formElements.length - 1);
                            }
                        }

                        isNavigationKey = false;
                    }

                    // set (add) CSS style on selected row
                    $scope.setFocusStyle = function (tabIndex) {
                        angular.element(formElements[tabIndex]).parent().parent().parent().addClass('multiSelectFocus');
                    }

                    // remove CSS style on selected row
                    $scope.removeFocusStyle = function (tabIndex) {
                        angular.element(formElements[tabIndex]).parent().parent().parent().removeClass('multiSelectFocus');
                    }

                    /*********************
                     *********************
                     *
                     * 1) Initializations
                     *
                     *********************
                     *********************/

                        // attrs to $scope - attrs-$scope - attrs - $scope
                        // Copy some properties that will be used on the template. They need to be in the $scope.
                    $scope.groupProperty = attrs.groupProperty;
                    $scope.tickProperty = attrs.tickProperty;
                    $scope.directiveId = attrs.directiveId;

                    // Unfortunately I need to add these grouping properties into the input model
                    var tempStr = genRandomString(5);
                    $scope.indexProperty = 'idx_' + tempStr;
                    $scope.spacingProperty = 'spc_' + tempStr;

                    // set orientation css
                    if (typeof attrs.orientation !== 'undefined') {

                        if (attrs.orientation.toUpperCase() === 'HORIZONTAL') {
                            $scope.orientationH = true;
                            $scope.orientationV = false;
                        }
                        else {
                            $scope.orientationH = false;
                            $scope.orientationV = true;
                        }
                    }

                    // get elements required for DOM operation
                    checkBoxLayer = element.children().children().next()[0];

                    // set max-height property if provided
                    if (typeof attrs.maxHeight !== 'undefined') {
                        var layer = element.children().children().children()[0];
                        angular.element(layer).attr("style", "height:" + attrs.maxHeight + "; overflow-y:scroll;");
                    }

                    // some flags for easier checking
                    for (var property in $scope.helperStatus) {
                        if ($scope.helperStatus.hasOwnProperty(property)) {
                            if (
                                typeof attrs.helperElements !== 'undefined'
                                && attrs.helperElements.toUpperCase().indexOf(property.toUpperCase()) === -1
                            ) {
                                $scope.helperStatus[property] = false;
                            }
                        }
                    }
                    if (typeof attrs.selectionMode !== 'undefined' && attrs.selectionMode.toUpperCase() === 'SINGLE') {
                        $scope.helperStatus['all'] = false;
                        $scope.helperStatus['none'] = false;
                    }

                    // helper button icons.. I guess you can use html tag here if you want to.
                    $scope.icon = {};
                    $scope.icon.selectAll = '&#10003;';    // a tick icon
                    $scope.icon.selectNone = '&times;';     // x icon
                    $scope.icon.reset = '&#8630;';     // undo icon
                    // this one is for the selected items
                    $scope.icon.tickMark = '<i class="md md-done"></i>';    // a tick icon

                    // configurable button labels
                    if (typeof attrs.translation !== 'undefined') {
                        $scope.lang.selectAll = $sce.trustAsHtml($scope.icon.selectAll + '&nbsp;&nbsp;' + $scope.translation.selectAll);
                        $scope.lang.selectNone = $sce.trustAsHtml($scope.icon.selectNone + '&nbsp;&nbsp;' + $scope.translation.selectNone);
                        $scope.lang.reset = $sce.trustAsHtml($scope.icon.reset + '&nbsp;&nbsp;' + $scope.translation.reset);
                        $scope.lang.search = $scope.translation.search;
                        $scope.lang.nothingSelected = $sce.trustAsHtml($scope.translation.nothingSelected);
                    }
                    else {
                        $scope.lang.selectAll = $sce.trustAsHtml($scope.icon.selectAll + '&nbsp;&nbsp;Select All');
                        $scope.lang.selectNone = $sce.trustAsHtml($scope.icon.selectNone + '&nbsp;&nbsp;Select None');
                        $scope.lang.reset = $sce.trustAsHtml($scope.icon.reset + '&nbsp;&nbsp;Reset');
                        $scope.lang.search = 'Search...';
                        $scope.lang.nothingSelected = 'None Selected';
                    }
                    $scope.icon.tickMark = $sce.trustAsHtml($scope.icon.tickMark);

                    // min length of keyword to trigger the filter function
                    if (typeof attrs.MinSearchLength !== 'undefined' && parseInt(attrs.MinSearchLength) > 0) {
                        vMinSearchLength = Math.floor(parseInt(attrs.MinSearchLength));
                    }

                    /*******************************************************
                     *******************************************************
                     *
                     * 2) Logic starts here, initiated by watch 1 & watch 2
                     *
                     *******************************************************
                     *******************************************************/

                        // watch1, for changes in input model property
                        // updates multi-select when user select/deselect a single checkbox programatically
                        // https://github.com/isteven/angular-multi-select/issues/8
                    $scope.$watch('inputModel', function (newVal) {
                        if (newVal) {
                            $scope.refreshOutputModel();
                            $scope.refreshButton();
                        }
                    }, true);

                    // watch2 for changes in input model as a whole
                    // this on updates the multi-select when a user load a whole new input-model. We also update the $scope.backUp variable
                    $scope.$watch('inputModel', function (newVal) {
                        if (newVal) {
                            $scope.backUp = angular.copy($scope.inputModel);
                            $scope.updateFilter();
                            $scope.prepareGrouping();
                            $scope.prepareIndex();
                            $scope.refreshOutputModel();
                            $scope.refreshButton();
                        }
                    });

                    // watch for changes in directive state (disabled or enabled)
                    $scope.$watch('isDisabled', function (newVal) {
                        $scope.isDisabled = newVal;
                    });

                    // this is for touch enabled devices. We don't want to hide checkboxes on scroll.
                    var onTouchStart = function (e) {
                        $scope.$apply(function () {
                            $scope.scrolled = false;
                        });
                    };
                    angular.element(document).bind('touchstart', onTouchStart);
                    var onTouchMove = function (e) {
                        $scope.$apply(function () {
                            $scope.scrolled = true;
                        });
                    };
                    angular.element(document).bind('touchmove', onTouchMove);

                    // unbind document events to prevent memory leaks
                    $scope.$on('$destroy', function () {
                        angular.element(document).unbind('touchstart', onTouchStart);
                        angular.element(document).unbind('touchmove', onTouchMove);
                    });
                }
            }
        }])
        .run(['$templateCache', function ($templateCache) {
            var template =
                '<span class="multiSelect inlineBlock">' +
                    // main button
                '<button id="{{directiveId}}" type="button"' +
                'ng-click="toggleCheckboxes( $event ); refreshSelectedItems(); refreshButton(); prepareGrouping; prepareIndex();"' +
                'ng-bind-html="varButtonLabel"' +
                'ng-disabled="disable-button"' +
                '>' +
                '</button>' +
                    // overlay layer
                '<div class="checkboxLayer">' +
                    // container of the helper elements
                '<div class="helperContainer" ng-if="helperStatus.filter || helperStatus.all || helperStatus.none || helperStatus.reset ">' +
                    // container of the first 3 buttons, select all, none and reset
                '<div class="line" ng-if="helperStatus.all || helperStatus.none || helperStatus.reset ">' +
                    // select all
                '<button type="button" class="helperButton"' +
                'ng-disabled="isDisabled"' +
                'ng-if="helperStatus.all"' +
                'ng-click="select( \'all\', $event );"' +
                'ng-bind-html="lang.selectAll">' +
                '</button>' +
                    // select none
                '<button type="button" class="helperButton"' +
                'ng-disabled="isDisabled"' +
                'ng-if="helperStatus.none"' +
                'ng-click="select( \'none\', $event );"' +
                'ng-bind-html="lang.selectNone">' +
                '</button>' +
                    // reset
                '<button type="button" class="helperButton reset"' +
                'ng-disabled="isDisabled"' +
                'ng-if="helperStatus.reset"' +
                'ng-click="select( \'reset\', $event );"' +
                'ng-bind-html="lang.reset">' +
                '</button>' +
                '</div>' +
                    // the search box
                '<div class="line" style="position:relative" ng-if="helperStatus.filter">' +
                    // textfield
                '<input placeholder="{{lang.search}}" type="text"' +
                'ng-click="select( \'filter\', $event )" ' +
                'ng-model="inputLabel.labelFilter" ' +
                'ng-change="searchChanged()" class="inputFilter"' +
                '/>' +
                    // clear button
                '<button type="button" class="clearButton" ng-click="clearClicked( $event )" >×</button> ' +
                '</div> ' +
                '</div> ' +
                    // selection items
                '<div class="checkBoxContainer">' +
                '<div ' +
                'ng-repeat="item in filteredModel | filter:removeGroupEndMarker" class="multiSelectItem"' +
                'ng-class="{selected: item[ tickProperty ], horizontal: orientationH, vertical: orientationV, multiSelectGroup:item[ groupProperty ], disabled:itemIsDisabled( item )}"' +
                'ng-click="syncItems( item, $event, $index );" ' +
                'ng-mouseleave="removeFocusStyle( tabIndex );"> ' +
                    // this is the spacing for grouped items
                '<div class="acol" ng-if="item[ spacingProperty ] > 0" ng-repeat="i in numberToArray( item[ spacingProperty ] ) track by $index">' +
                '</div>  ' +
                '<div class="acol">' +
                '<label>' +
                    // input, so that it can accept focus on keyboard click
                '<input class="checkbox focusable" type="checkbox" ' +
                'ng-disabled="itemIsDisabled( item )" ' +
                'ng-checked="item[ tickProperty ]" ' +
                'ng-click="syncItems( item, $event, $index )" />' +
                    // item label using ng-bind-hteml
                '<span ' +
                'ng-class="{disabled:itemIsDisabled( item )}" ' +
                'ng-bind-html="writeLabel( item, \'itemLabel\' )">' +
                '</span>' +
                '</label>' +
                '</div>' +
                    // the tick/check mark
                '<span class="tickMark" ng-if="item[ groupProperty ] !== true && item[ tickProperty ] === true" ng-bind-html="icon.tickMark"></span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</span>';
            $templateCache.put('isteven-multi-select.htm', template);
        }]);

}());


(function (angular, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['angular'], function (angular) {
            return factory(angular);
        });
    } else {
        return factory(angular);
    }
}(angular || null, function (angular) {
    'use strict';
    /**
     * ngTable: Table + Angular JS
     *
     * @author Vitalii Savchuk <esvit666@gmail.com>
     * @url https://github.com/esvit/ng-table/
     * @license New BSD License <http://creativecommons.org/licenses/BSD/>
     */

    /**
     * @ngdoc module
     * @name ngTable
     * @description ngTable: Table + Angular JS
     * @example
     <doc:example>
     <doc:source>
     <script>
     var app = angular.module('myApp', ['ngTable']);
     app.controller('MyCtrl', function($scope) {
                    $scope.users = [
                        {name: "Moroni", age: 50},
                        {name: "Tiancum", age: 43},
                        {name: "Jacob", age: 27},
                        {name: "Nephi", age: 29},
                        {name: "Enos", age: 34}
                    ];
                });
     </script>
     <table ng-table class="table">
     <tr ng-repeat="user in users">
     <td data-title="'Name'">{{user.name}}</td>
     <td data-title="'Age'">{{user.age}}</td>
     </tr>
     </table>
     </doc:source>
     </doc:example>
     */
    var app = angular.module('ngTable', []);
    /**
     * ngTable: Table + Angular JS
     *
     * @author Vitalii Savchuk <esvit666@gmail.com>
     * @url https://github.com/esvit/ng-table/
     * @license New BSD License <http://creativecommons.org/licenses/BSD/>
     */

    /**
     * @ngdoc value
     * @name ngTable.value:ngTableDefaultParams
     * @description Default Parameters for ngTable
     */
    app.value('ngTableDefaults', {
        params: {},
        settings: {}
    });

    /**
     * @ngdoc service
     * @name ngTable.factory:NgTableParams
     * @description Parameters manager for ngTable
     */

    app.factory('NgTableParams', ['$q', '$log', 'ngTableDefaults', function ($q, $log, ngTableDefaults) {
        var isNumber = function (n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        };
        var NgTableParams = function (baseParameters, baseSettings) {
            var self = this,
                log = function () {
                    if (settings.debugMode && $log.debug) {
                        $log.debug.apply(this, arguments);
                    }
                };

            this.data = [];

            /**
             * @ngdoc method
             * @name ngTable.factory:NgTableParams#parameters
             * @methodOf ngTable.factory:NgTableParams
             * @description Set new parameters or get current parameters
             *
             * @param {string} newParameters      New parameters
             * @param {string} parseParamsFromUrl Flag if parse parameters like in url
             * @returns {Object} Current parameters or `this`
             */
            this.parameters = function (newParameters, parseParamsFromUrl) {
                parseParamsFromUrl = parseParamsFromUrl || false;
                if (angular.isDefined(newParameters)) {
                    for (var key in newParameters) {
                        var value = newParameters[key];
                        if (parseParamsFromUrl && key.indexOf('[') >= 0) {
                            var keys = key.split(/\[(.*)\]/).reverse()
                            var lastKey = '';
                            for (var i = 0, len = keys.length; i < len; i++) {
                                var name = keys[i];
                                if (name !== '') {
                                    var v = value;
                                    value = {};
                                    value[lastKey = name] = (isNumber(v) ? parseFloat(v) : v);
                                }
                            }
                            if (lastKey === 'sorting') {
                                params[lastKey] = {};
                            }
                            params[lastKey] = angular.extend(params[lastKey] || {}, value[lastKey]);
                        } else {
                            params[key] = (isNumber(newParameters[key]) ? parseFloat(newParameters[key]) : newParameters[key]);
                        }
                    }
                    log('ngTable: set parameters', params);
                    return this;
                }
                return params;
            };

            /**
             * @ngdoc method
             * @name ngTable.factory:NgTableParams#settings
             * @methodOf ngTable.factory:NgTableParams
             * @description Set new settings for table
             *
             * @param {string} newSettings New settings or undefined
             * @returns {Object} Current settings or `this`
             */
            this.settings = function (newSettings) {
                if (angular.isDefined(newSettings)) {
                    if (angular.isArray(newSettings.data)) {
                        //auto-set the total from passed in data
                        newSettings.total = newSettings.data.length;
                    }
                    settings = angular.extend(settings, newSettings);
                    log('ngTable: set settings', settings);
                    return this;
                }
                return settings;
            };

            /**
             * @ngdoc method
             * @name ngTable.factory:NgTableParams#page
             * @methodOf ngTable.factory:NgTableParams
             * @description If parameter page not set return current page else set current page
             *
             * @param {string} page Page number
             * @returns {Object|Number} Current page or `this`
             */
            this.page = function (page) {
                return angular.isDefined(page) ? this.parameters({
                    'page': page
                }) : params.page;
            };

            /**
             * @ngdoc method
             * @name ngTable.factory:NgTableParams#total
             * @methodOf ngTable.factory:NgTableParams
             * @description If parameter total not set return current quantity else set quantity
             *
             * @param {string} total Total quantity of items
             * @returns {Object|Number} Current page or `this`
             */
            this.total = function (total) {
                return angular.isDefined(total) ? this.settings({
                    'total': total
                }) : settings.total;
            };

            /**
             * @ngdoc method
             * @name ngTable.factory:NgTableParams#count
             * @methodOf ngTable.factory:NgTableParams
             * @description If parameter count not set return current count per page else set count per page
             *
             * @param {string} count Count per number
             * @returns {Object|Number} Count per page or `this`
             */
            this.count = function (count) {
                // reset to first page because can be blank page
                return angular.isDefined(count) ? this.parameters({
                    'count': count,
                    'page': 1
                }) : params.count;
            };

            /**
             * @ngdoc method
             * @name ngTable.factory:NgTableParams#filter
             * @methodOf ngTable.factory:NgTableParams
             * @description If parameter page not set return current filter else set current filter
             *
             * @param {string} filter New filter
             * @returns {Object} Current filter or `this`
             */
            this.filter = function (filter) {
                return angular.isDefined(filter) ? this.parameters({
                    'filter': filter,
                    'page': 1
                }) : params.filter;
            };

            /**
             * @ngdoc method
             * @name ngTable.factory:NgTableParams#sorting
             * @methodOf ngTable.factory:NgTableParams
             * @description If 'sorting' parameter is not set, return current sorting. Otherwise set current sorting.
             *
             * @param {string} sorting New sorting
             * @returns {Object} Current sorting or `this`
             */
            this.sorting = function (sorting) {
                if (arguments.length == 2) {
                    var sortArray = {};
                    sortArray[sorting] = arguments[1];
                    this.parameters({
                        'sorting': sortArray
                    });
                    return this;
                }
                return angular.isDefined(sorting) ? this.parameters({
                    'sorting': sorting
                }) : params.sorting;
            };

            /**
             * @ngdoc method
             * @name ngTable.factory:NgTableParams#isSortBy
             * @methodOf ngTable.factory:NgTableParams
             * @description Checks sort field
             *
             * @param {string} field     Field name
             * @param {string} direction Direction of sorting 'asc' or 'desc'
             * @returns {Array} Return true if field sorted by direction
             */
            this.isSortBy = function (field, direction) {
                return angular.isDefined(params.sorting[field]) && angular.equals(params.sorting[field], direction);
            };

            /**
             * @ngdoc method
             * @name ngTable.factory:NgTableParams#orderBy
             * @methodOf ngTable.factory:NgTableParams
             * @description Return object of sorting parameters for angular filter
             *
             * @returns {Array} Array like: [ '-name', '+age' ]
             */
            this.orderBy = function () {
                var sorting = [];
                for (var column in params.sorting) {
                    sorting.push((params.sorting[column] === "asc" ? "+" : "-") + column);
                }
                return sorting;
            };

            /**
             * @ngdoc method
             * @name ngTable.factory:NgTableParams#getData
             * @methodOf ngTable.factory:NgTableParams
             * @description Called when updated some of parameters for get new data
             *
             * @param {Object} $defer promise object
             * @param {Object} params New parameters
             */
            this.getData = function ($defer, params) {
                if (angular.isArray(this.data) && angular.isObject(params)) {
                    $defer.resolve(this.data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                } else {
                    $defer.resolve([]);
                }
                return $defer.promise;
            };

            /**
             * @ngdoc method
             * @name ngTable.factory:NgTableParams#getGroups
             * @methodOf ngTable.factory:NgTableParams
             * @description Return groups for table grouping
             */
            this.getGroups = function ($defer, column) {
                var defer = $q.defer();

                defer.promise.then(function (data) {
                    var groups = {};
                    angular.forEach(data, function (item) {
                        var groupName = angular.isFunction(column) ? column(item) : item[column];

                        groups[groupName] = groups[groupName] || {
                            data: []
                        };
                        groups[groupName]['value'] = groupName;
                        groups[groupName].data.push(item);
                    });
                    var result = [];
                    for (var i in groups) {
                        result.push(groups[i]);
                    }
                    log('ngTable: refresh groups', result);
                    $defer.resolve(result);
                });
                return this.getData(defer, self);
            };

            /**
             * @ngdoc method
             * @name ngTable.factory:NgTableParams#generatePagesArray
             * @methodOf ngTable.factory:NgTableParams
             * @description Generate array of pages
             *
             * @param {boolean} currentPage which page must be active
             * @param {boolean} totalItems  Total quantity of items
             * @param {boolean} pageSize    Quantity of items on page
             * @returns {Array} Array of pages
             */
            this.generatePagesArray = function (currentPage, totalItems, pageSize) {
                var maxBlocks, maxPage, maxPivotPages, minPage, numPages, pages;
                maxBlocks = 6;
                pages = [];
                numPages = Math.ceil(totalItems / pageSize);
                if (numPages > 1) {
                    pages.push({
                        type: 'prev',
                        number: Math.max(1, currentPage - 1),
                        active: currentPage > 1
                    });
                    pages.push({
                        type: 'first',
                        number: 1,
                        active: currentPage > 1,
                        current: currentPage === 1
                    });
                    maxPivotPages = Math.round((maxBlocks - 5) / 2);
                    minPage = Math.max(2, currentPage - maxPivotPages);
                    maxPage = Math.min(numPages - 1, currentPage + maxPivotPages * 2 - (currentPage - minPage));
                    minPage = Math.max(2, minPage - (maxPivotPages * 2 - (maxPage - minPage)));
                    var i = minPage;
                    while (i <= maxPage) {
                        if ((i === minPage && i !== 2) || (i === maxPage && i !== numPages - 1)) {
                            pages.push({
                                type: 'more',
                                active: false
                            });
                        } else {
                            pages.push({
                                type: 'page',
                                number: i,
                                active: currentPage !== i,
                                current: currentPage === i
                            });
                        }
                        i++;
                    }
                    pages.push({
                        type: 'last',
                        number: numPages,
                        active: currentPage !== numPages,
                        current: currentPage === numPages
                    });
                    pages.push({
                        type: 'next',
                        number: Math.min(numPages, currentPage + 1),
                        active: currentPage < numPages
                    });
                }
                return pages;
            };

            /**
             * @ngdoc method
             * @name ngTable.factory:NgTableParams#url
             * @methodOf ngTable.factory:NgTableParams
             * @description Return groups for table grouping
             *
             * @param {boolean} asString flag indicates return array of string or object
             * @returns {Array} If asString = true will be return array of url string parameters else key-value object
             */
            this.url = function (asString) {
                asString = asString || false;
                var pairs = (asString ? [] : {});
                for (var key in params) {
                    if (params.hasOwnProperty(key)) {
                        var item = params[key],
                            name = encodeURIComponent(key);
                        if (typeof item === "object") {
                            for (var subkey in item) {
                                if (!angular.isUndefined(item[subkey]) && item[subkey] !== "") {
                                    var pname = name + "[" + encodeURIComponent(subkey) + "]";
                                    if (asString) {
                                        pairs.push(pname + "=" + item[subkey]);
                                    } else {
                                        pairs[pname] = item[subkey];
                                    }
                                }
                            }
                        } else if (!angular.isFunction(item) && !angular.isUndefined(item) && item !== "") {
                            if (asString) {
                                pairs.push(name + "=" + encodeURIComponent(item));
                            } else {
                                pairs[name] = encodeURIComponent(item);
                            }
                        }
                    }
                }
                return pairs;
            };

            /**
             * @ngdoc method
             * @name ngTable.factory:NgTableParams#reload
             * @methodOf ngTable.factory:NgTableParams
             * @description Reload table data
             */
            this.reload = function () {
                var $defer = $q.defer(),
                    self = this,
                    pData = null;

                if (!settings.$scope) {
                    return;
                }

                settings.$loading = true;
                if (settings.groupBy) {
                    pData = settings.getGroups($defer, settings.groupBy, this);
                } else {
                    pData = settings.getData($defer, this);
                }
                log('ngTable: reload data');

                if (!pData) {
                    // If getData resolved the $defer, and didn't promise us data,
                    //   create a promise from the $defer. We need to return a promise.
                    pData = $defer.promise;
                }
                return pData.then(function (data) {
                    settings.$loading = false;
                    log('ngTable: current scope', settings.$scope);
                    if (settings.groupBy) {
                        self.data = data;
                        if (settings.$scope) settings.$scope.$groups = data;
                    } else {
                        self.data = data;
                        if (settings.$scope) settings.$scope.$data = data;
                    }
                    if (settings.$scope) settings.$scope.pages = self.generatePagesArray(self.page(), self.total(), self.count());
                    settings.$scope.$emit('ngTableAfterReloadData');
                    return data;
                });
            };

            this.reloadPages = function () {
                var self = this;
                settings.$scope.pages = self.generatePagesArray(self.page(), self.total(), self.count());
            };

            var params = this.$params = {
                page: 1,
                count: 1,
                filter: {},
                sorting: {},
                group: {},
                groupBy: null
            };
            angular.extend(params, ngTableDefaults.params);

            var settings = {
                $scope: null, // set by ngTable controller
                $loading: false,
                data: null, //allows data to be set when table is initialized
                total: 0,
                defaultSort: 'desc',
                filterDelay: 750,
                counts: [10, 25, 50, 100],
                sortingIndicator: 'span',
                getGroups: this.getGroups,
                getData: this.getData
            };
            angular.extend(settings, ngTableDefaults.settings);

            this.settings(baseSettings);
            this.parameters(baseParameters, true);
            return this;
        };
        return NgTableParams;
    }]);

    /**
     * @ngdoc service
     * @name ngTable.factory:ngTableParams
     * @description Backwards compatible shim for lowercase 'n' in NgTableParams
     */
    app.factory('ngTableParams', ['NgTableParams', function (NgTableParams) {
        return NgTableParams;
    }]);

    /**
     * ngTable: Table + Angular JS
     *
     * @author Vitalii Savchuk <esvit666@gmail.com>
     * @url https://github.com/esvit/ng-table/
     * @license New BSD License <http://creativecommons.org/licenses/BSD/>
     */

    /**
     * @ngdoc object
     * @name ngTable.directive:ngTable.ngTableController
     *
     * @description
     * Each {@link ngTable.directive:ngTable ngTable} directive creates an instance of `ngTableController`
     */
    app.controller('ngTableController', ['$scope', 'NgTableParams', '$timeout', '$parse', '$compile', '$attrs', '$element',
        'ngTableColumn',
        function ($scope, NgTableParams, $timeout, $parse, $compile, $attrs, $element, ngTableColumn) {
            var isFirstTimeLoad = true;
            $scope.$filterRow = {};
            $scope.$loading = false;

            // until such times as the directive uses an isolated scope, we need to ensure that the check for
            // the params field only consults the "own properties" of the $scope. This is to avoid seeing the params
            // field on a $scope higher up in the prototype chain
            if (!$scope.hasOwnProperty("params")) {
                $scope.params = new NgTableParams();
                $scope.params.isNullInstance = true;
            }
            $scope.params.settings().$scope = $scope;

            var delayFilter = (function () {
                var timer = 0;
                return function (callback, ms) {
                    $timeout.cancel(timer);
                    timer = $timeout(callback, ms);
                };
            })();

            function resetPage() {
                $scope.params.$params.page = 1;
            }

            $scope.$watch('params.$params', function (newParams, oldParams) {

                if (newParams === oldParams) {
                    return;
                }

                $scope.params.settings().$scope = $scope;

                if (!angular.equals(newParams.filter, oldParams.filter)) {
                    var maybeResetPage = isFirstTimeLoad ? angular.noop : resetPage;
                    delayFilter(function () {
                        maybeResetPage();
                        $scope.params.reload();
                    }, $scope.params.settings().filterDelay);
                } else {
                    $scope.params.reload();
                }

                if (!$scope.params.isNullInstance) {
                    isFirstTimeLoad = false;
                }

            }, true);

            this.getParams = function () {
                return $scope.params;
            };

            this.compileDirectiveTemplates = function () {
                if (!$element.hasClass('ng-table')) {
                    $scope.templates = {
                        header: ($attrs.templateHeader ? $attrs.templateHeader : 'ng-table/header.html'),
                        pagination: ($attrs.templatePagination ? $attrs.templatePagination : 'ng-table/pager.html')
                    };
                    $element.addClass('ng-table');
                    var headerTemplate = null;
                    if ($element.find('> thead').length === 0) {
                        headerTemplate = angular.element(document.createElement('thead')).attr('ng-include', 'templates.header');
                        $element.prepend(headerTemplate);
                    }
                    var paginationTemplate = angular.element(document.createElement('div')).attr({
                        'ng-table-pagination': 'params',
                        'template-url': 'templates.pagination'
                    });
                    $element.after(paginationTemplate);
                    if (headerTemplate) {
                        $compile(headerTemplate)($scope);
                    }
                    $compile(paginationTemplate)($scope);
                }
            };

            this.loadFilterData = function ($columns) {
                angular.forEach($columns, function ($column) {
                    var def;
                    def = $column.filterData($scope, {
                        $column: $column
                    });
                    if (!def) {
                        delete $column.filterData;
                        return;
                    }

                    // if we're working with a deferred object, let's wait for the promise
                    if ((angular.isObject(def) && angular.isObject(def.promise))) {
                        delete $column.filterData;
                        return def.promise.then(function (data) {
                            // our deferred can eventually return arrays, functions and objects
                            if (!angular.isArray(data) && !angular.isFunction(data) && !angular.isObject(data)) {
                                // if none of the above was found - we just want an empty array
                                data = [];
                            } else if (angular.isArray(data)) {
                                data.unshift({
                                    title: '-',
                                    id: ''
                                });
                            }
                            $column.data = data;
                        });
                    }
                    // otherwise, we just return what the user gave us. It could be a function, array, object, whatever
                    else {
                        return $column.data = def;
                    }
                });
            };

            this.buildColumns = function (columns) {
                return columns.map(function (col) {
                    return ngTableColumn.buildColumn(col, $scope)
                })
            };

            this.setupBindingsToInternalScope = function (tableParamsExpr) {

                // note: this we're setting up watches to simulate angular's isolated scope bindings

                // note: is REALLY important to watch for a change to the ngTableParams *reference* rather than
                // $watch for value equivalence. This is because ngTableParams references the current page of data as
                // a field and it's important not to watch this
                var tableParamsGetter = $parse(tableParamsExpr);
                $scope.$watch(tableParamsGetter, (function (params) {
                    if (angular.isUndefined(params)) {
                        return;
                    }
                    $scope.paramsModel = tableParamsGetter;
                    $scope.params = params;
                }), false);

                if ($attrs.showFilter) {
                    $scope.$parent.$watch($attrs.showFilter, function (value) {
                        $scope.show_filter = value;
                    });
                }
                if ($attrs.disableFilter) {
                    $scope.$parent.$watch($attrs.disableFilter, function (value) {
                        $scope.$filterRow.disabled = value;
                    });
                }
            };

            $scope.sortBy = function ($column, event) {
                var parsedSortable = $column.sortable && $column.sortable();
                if (!parsedSortable) {
                    return;
                }
                var defaultSort = $scope.params.settings().defaultSort;
                var inverseSort = (defaultSort === 'asc' ? 'desc' : 'asc');
                var sorting = $scope.params.sorting() && $scope.params.sorting()[parsedSortable] && ($scope.params.sorting()[parsedSortable] === defaultSort);
                var sortingParams = (event.ctrlKey || event.metaKey) ? $scope.params.sorting() : {};
                sortingParams[parsedSortable] = (sorting ? inverseSort : defaultSort);
                $scope.params.parameters({
                    sorting: sortingParams
                });
            };
        }]);


    /**
     * @ngdoc service
     * @name ngTable.factory:ngTableColumn
     *
     * @description
     * Service to construct a $column definition used by {@link ngTable.directive:ngTable ngTable} directive
     */
    app.factory('ngTableColumn', [function () {

        var defaults = {
            'class': function () {
                return '';
            },
            filter: function () {
                return false;
            },
            filterData: angular.noop,
            headerTemplateURL: function () {
                return false;
            },
            headerTitle: function () {
                return ' ';
            },
            sortable: function () {
                return false;
            },
            show: function () {
                return true;
            },
            title: function () {
                return ' ';
            },
            titleAlt: function () {
                return '';
            }
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableColumn#buildColumn
         * @methodOf ngTable.factory:ngTableColumn
         * @description Creates a $column for use within a header template
         *
         * @param {Object} column an existing $column or simple column data object
         * @param {Scope} defaultScope the $scope to supply to the $column getter methods when not supplied by caller
         * @returns {Object} a $column object
         */
        function buildColumn(column, defaultScope) {
            // note: we're not modifying the original column object. This helps to avoid unintended side affects
            var extendedCol = Object.create(column);
            for (var prop in defaults) {
                if (extendedCol[prop] === undefined) {
                    extendedCol[prop] = defaults[prop];
                }
                if (!angular.isFunction(extendedCol[prop])) {
                    // wrap raw field values with "getter" functions
                    // - this is to ensure consistency with how ngTable.compile builds columns
                    // - note that the original column object is being "proxied"; this is important
                    //   as it ensure that any changes to the original object will be returned by the "getter"
                    (function (prop1) {
                        extendedCol[prop1] = function () {
                            return column[prop1];
                        };
                    })(prop);
                }
                (function (prop1) {
                    // satisfy the arguments expected by the function returned by parsedAttribute in the ngTable directive
                    var getterFn = extendedCol[prop1];
                    extendedCol[prop1] = function () {
                        if (arguments.length === 0) {
                            return getterFn.call(column, defaultScope);
                        } else {
                            return getterFn.apply(column, arguments);
                        }
                    };
                })(prop);
            }
            return extendedCol;
        }

        return {
            buildColumn: buildColumn
        };
    }]);

    /**
     * ngTable: Table + Angular JS
     *
     * @author Vitalii Savchuk <esvit666@gmail.com>
     * @url https://github.com/esvit/ng-table/
     * @license New BSD License <http://creativecommons.org/licenses/BSD/>
     */

    /**
     * @ngdoc directive
     * @name ngTable.directive:ngTable
     * @restrict A
     *
     * @description
     * Directive that instantiates {@link ngTable.directive:ngTable.ngTableController ngTableController}.
     */
    app.directive('ngTable', ['$q', '$parse',
        function ($q, $parse) {
            'use strict';

            return {
                restrict: 'A',
                priority: 1001,
                scope: true,
                controller: 'ngTableController',
                compile: function (element) {
                    var columns = [],
                        i = 0,
                        row = null;

                    // IE 8 fix :not(.ng-table-group) selector
                    angular.forEach(angular.element(element.find('tr')), function (tr) {
                        tr = angular.element(tr);
                        if (!tr.hasClass('ng-table-group') && !row) {
                            row = tr;
                        }
                    });
                    if (!row) {
                        return;
                    }
                    angular.forEach(row.find('td'), function (item) {
                        var el = angular.element(item);
                        if (el.attr('ignore-cell') && 'true' === el.attr('ignore-cell')) {
                            return;
                        }

                        var getAttrValue = function (attr) {
                            return el.attr('x-data-' + attr) || el.attr('data-' + attr) || el.attr(attr);
                        };

                        var parsedAttribute = function (attr) {
                            var expr = getAttrValue(attr);
                            if (!expr) {
                                return undefined;
                            }
                            return function (scope, locals) {
                                return $parse(expr)(scope, angular.extend(locals || {}, {
                                    $columns: columns
                                }));
                            };
                        };

                        var titleExpr = getAttrValue('title-alt') || getAttrValue('title');
                        if (titleExpr) {
                            el.attr('data-title-text', '{{' + titleExpr + '}}'); // this used in responsive table
                        }
                        // NOTE TO MAINTAINERS: if you add extra fields to a $column be sure to extend ngTableColumn with
                        // a corresponding "safe" default
                        columns.push({
                            id: i++,
                            title: parsedAttribute('title'),
                            titleAlt: parsedAttribute('title-alt'),
                            headerTitle: parsedAttribute('header-title'),
                            sortable: parsedAttribute('sortable'),
                            'class': parsedAttribute('header-class'),
                            filter: parsedAttribute('filter'),
                            headerTemplateURL: parsedAttribute('header'),
                            filterData: parsedAttribute('filter-data'),
                            show: (el.attr("ng-show") ? function (scope) {
                                return $parse(el.attr("ng-show"))(scope);
                            } : undefined)
                        });
                    });
                    return function (scope, element, attrs, controller) {
                        scope.$columns = columns = controller.buildColumns(columns);

                        controller.setupBindingsToInternalScope(attrs.ngTable);
                        controller.loadFilterData(columns);
                        controller.compileDirectiveTemplates();
                    };
                }
            }
        }
    ]);

    app.directive('ngTableSortHeader', function () {
        return {
            scope: {
                ngTableSortHeader: '@'
            },
            restrict: 'AE',
            require: '^ngTable',
            transclude: true,
            replace: true,

            link: function (scope, element, attrs, ngTable) {
                var tableParams = ngTable.getParams();

                scope.$watch(function () {
                    return ngTable.getParams();
                }, function (params) {
                    tableParams = params;
                });

                scope.isSortBy = function (order) {
                    return tableParams.isSortBy(scope.ngTableSortHeader, order);
                };

                scope.sorting = function () {
                    var sort = {};

                    sort[scope.ngTableSortHeader] = scope.isSortBy('asc') ? 'desc' : 'asc';

                    tableParams.sorting(sort);
                };

            },
            template: '<th class="sortable"\n    ng-class="{\'sort-asc\': isSortBy(\'asc\'), \'sort-desc\': isSortBy(\'desc\')}"\n    ng-click="sorting()">\n    <div class="sort-indicator" ng-transclude>\n        \n    </div>\n</th>'
        };
    });

    /**
     * @ngdoc directive
     * @name ngTable.directive:ngTableDynamic
     * @restrict A
     *
     * @description
     * A dynamic version of the {@link ngTable.directive:ngTable ngTable} directive that accepts a dynamic list of columns
     * definitions to render
     */
    app.directive('ngTableDynamic', ['$parse', function ($parse) {

        function parseDirectiveExpression(attr) {
            if (!attr || attr.indexOf(" with ") > -1) {
                var parts = attr.split(/\s+with\s+/);
                return {
                    tableParams: parts[0],
                    columns: parts[1]
                };
            } else {
                throw new Error('Parse error (expected example: ng-table-dynamic=\'tableParams with cols\')');
            }
        }

        return {
            restrict: 'A',
            priority: 1001,
            scope: true,
            controller: 'ngTableController',
            compile: function (tElement) {
                var row;

                // IE 8 fix :not(.ng-table-group) selector
                angular.forEach(angular.element(tElement.find('tr')), function (tr) {
                    tr = angular.element(tr);
                    if (!tr.hasClass('ng-table-group') && !row) {
                        row = tr;
                    }
                });
                if (!row) {
                    return;
                }

                angular.forEach(row.find('td'), function (item) {
                    var el = angular.element(item);
                    var getAttrValue = function (attr) {
                        return el.attr('x-data-' + attr) || el.attr('data-' + attr) || el.attr(attr);
                    };

                    // this used in responsive table
                    var titleExpr = getAttrValue('title');
                    if (!titleExpr) {
                        el.attr('data-title-text', '{{$columns[$index].titleAlt(this) || $columns[$index].title(this)}}');
                    }
                    var showExpr = el.attr('ng-show');
                    if (!showExpr) {
                        el.attr('ng-show', '$columns[$index].show(this)');
                    }
                });

                return function (scope, element, attrs, controller) {
                    var expr = parseDirectiveExpression(attrs.ngTableDynamic);
                    var columns = $parse(expr.columns)(scope) || [];
                    scope.$columns = controller.buildColumns(columns);

                    controller.setupBindingsToInternalScope(expr.tableParams);
                    controller.loadFilterData(scope.$columns);
                    controller.compileDirectiveTemplates();
                };
            }
        };
    }]);

    /**
     * ngTable: Table + Angular JS
     *
     * @author Vitalii Savchuk <esvit666@gmail.com>
     * @url https://github.com/esvit/ng-table/
     * @license New BSD License <http://creativecommons.org/licenses/BSD/>
     */

    /**
     * @ngdoc directive
     * @name ngTable.directive:ngTablePagination
     * @restrict A
     */
    app.directive('ngTablePagination', ['$compile',
        function ($compile) {
            'use strict';

            return {
                restrict: 'A',
                scope: {
                    'params': '=ngTablePagination',
                    'templateUrl': '='
                },
                replace: false,
                link: function (scope, element, attrs) {

                    scope.params.settings().$scope.$on('ngTableAfterReloadData', function () {
                        scope.pages = scope.params.generatePagesArray(scope.params.page(), scope.params.total(), scope.params.count());
                    }, true);

                    scope.$watch('templateUrl', function (templateUrl) {
                        if (angular.isUndefined(templateUrl)) {
                            return;
                        }
                        var template = angular.element(document.createElement('div'))
                        template.attr({
                            'ng-include': 'templateUrl'
                        });
                        element.append(template);
                        $compile(template)(scope);
                    });
                }
            };
        }
    ]);
    angular.module('ngTable').run(['$templateCache', function ($templateCache) {
        $templateCache.put('ng-table/filters/select-multiple.html', '<select ng-options="data.id as data.title for data in $column.data" ng-disabled="$filterRow.disabled" multiple ng-multiple="true" ng-model="params.filter()[name]" ng-show="filter==\'select-multiple\'" class="filter filter-select-multiple form-control" name="{{name}}"> </select>');
        $templateCache.put('ng-table/filters/select.html', '<select ng-options="data.id as data.title for data in $column.data" ng-disabled="$filterRow.disabled" ng-model="params.filter()[name]" ng-show="filter==\'select\'" class="filter filter-select form-control" name="{{name}}"> </select>');
        $templateCache.put('ng-table/filters/text.html', '<input type="text" name="{{name}}" ng-disabled="$filterRow.disabled" ng-model="params.filter()[name]" ng-if="filter==\'text\'" class="input-filter form-control"/>');
        $templateCache.put('ng-table/header.html', '<tr> <th title="{{$column.headerTitle(this)}}" ng-repeat="$column in $columns" ng-class="{ \'sortable\': $column.sortable(this), \'sort-asc\': params.sorting()[$column.sortable(this)]==\'asc\', \'sort-desc\': params.sorting()[$column.sortable(this)]==\'desc\' }" ng-click="sortBy($column, $event)" ng-show="$column.show(this)" ng-init="template=$column.headerTemplateURL(this)" class="header {{$column.class(this)}}"> <div ng-if="!template" ng-show="!template" class="ng-table-header" ng-class="{\'sort-indicator\': params.settings().sortingIndicator==\'div\'}"> <span ng-bind="$column.title(this)" ng-class="{\'sort-indicator\': params.settings().sortingIndicator==\'span\'}"></span> </div> <div ng-if="template" ng-show="template" ng-include="template"></div> </th> </tr> <tr ng-show="show_filter" class="ng-table-filters"> <th data-title-text="{{$column.titleAlt(this) || $column.title(this)}}" ng-repeat="$column in $columns" ng-show="$column.show(this)" class="filter"> <div ng-repeat="(name, filter) in $column.filter(this)"> <div ng-if="filter.indexOf(\'/\') !==-1" ng-include="filter"></div> <div ng-if="filter.indexOf(\'/\')===-1" ng-include="\'ng-table/filters/\' + filter + \'.html\'"></div> </div> </th> </tr> ');
        $templateCache.put('ng-table/pager.html', '<div class="ng-cloak ng-table-pager" ng-if="params.data.length">\n  <ul ng-if="params.settings().counts.length" class="ng-table-counts pagination pull-right">\n    <li ng-repeat="count in params.settings().counts"\n        ng-class="{\'active\':params.count()==count}"\n        ng-click="params.count(count)">\n      <a href="" ng-bind="count"></a>\n    </li>\n  </ul>\n\n  <ul class="pagination ng-table-pagination">\n    <li ng-class="{\'disabled\': !page.active && !page.current, \'active\': page.current}"\n        ng-repeat="page in pages"\n        ng-switch="page.type">\n      <a ng-switch-when="prev" ng-click="params.page(page.number)" href=""><i class="md md-chevron-left"></i></a>\n      <a ng-switch-when="first" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a>\n      <a ng-switch-when="page" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a>\n      <a ng-switch-when="more" ng-click="params.page(page.number)" href="">&#8230;</a>\n      <a ng-switch-when="last" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a>\n      <a ng-switch-when="next" ng-click="params.page(page.number)" href=""><i class="md md-chevron-right"></i></a>\n    </li>\n  </ul>\n</div> ');
    }]);
    return app;
}));

(function () {

    'use strict';

    angular.module('ui.organisation', [])

        .factory('Tree', function () {
            function Tree(structure) {
                forEach(structure, function (node) {
                    for (var i = 0; node.children && i < node.children.length; i++) {
                        node.children[i].parent = node;
                    }
                });

                this.structure = structure;
            }

            /*
             Make tree from organisation where organisation is :
             [
             {name:'H1', groups:[{name:'G1, users:['U1','U2']},{}]},
             {name:'H2': groups:[]
             ]
             */

            Tree.fromOrganisation = function (organisation) {
                var tree;

                function convertUser(userName) {
                    return {name: userName, type: 'user'};
                }

                function convertGroup(group) {
                    var node = {type: 'group', name: group.name, children: []};

                    angular.forEach(group.groups, function (item, name) {
                        node.children.push(convertGroup(item));
                    });

                    angular.forEach(group.users, function (item, name) {
                        node.children.push(convertUser(item));
                    });

                    return node;
                }

                function convertGroups(groupsArray) {
                    var nodes = [];

                    angular.forEach(groupsArray, function (group) {
                        nodes.push(convertGroup(group));
                    });

                    return nodes;
                }

                tree = {type: 'root', name: 'Hierarchies', expanded: true, children: []};

                angular.forEach(organisation, function (hierarchy) {
                    tree.children.push({
                        type: 'hierarchy',
                        children: convertGroups(hierarchy.groups),
                        name: hierarchy.name
                    });
                });

                return new Tree(tree);
            };

            function shallowCopy(src, dst) {
                if (angular.isArray(src)) {
                    dst = dst || [];

                    for (var i = 0; i < src.length; i++) {
                        dst[i] = src[i];
                    }
                } else if (angular.isObject(src)) {
                    dst = dst || {};

                    for (var key in src) {
                        if (src.hasOwnProperty(key) && !(key.charAt(0) === '$' && key.charAt(1) === '$')) {
                            dst[key] = src[key];
                        }
                    }
                }

                return dst || src;
            }

            function forEach(node, callback) {
                var result = null;

                if (!node) {
                    return;
                }

                if (typeof callback === 'function') {
                    callback(node);
                }

                if (node.children != null) {
                    for (var i = 0; result === null && i < node.children.length; i++) {
                        result = forEach(node.children[i], callback);
                    }
                }

                return result;
            }

            function forEachParent(node, callback) {
                var current = node;

                if (!node) {
                    return;
                }

                while (current.parent) {
                    current = current.parent;
                    if (typeof callback === 'function') {
                        callback(current);
                    }
                }
            }

            function searchNode(node, text) {
                var result = null;
                var child;
                var children = [];
                var regex = new RegExp(text, 'i');

                if (!node) {
                    return;
                }

                if (node.children != null) {
                    for (var i = 0; i < node.children.length; i++) {
                        child = searchNode(node.children[i], text);

                        if (child !== null) {
                            children.push(child);
                        }
                    }
                }

                if (node.name.match(regex) || children.length) {
                    result = shallowCopy(node);
                    result.expanded = true;

                    if (children.length) {
                        result.children = children;
                    }
                }

                return result;
            }

            function getFirstNode(node, text) {
                var result = null;
                var regex = new RegExp(text, 'i');

                if (!node) {
                    return null;
                }

                if (node.name.match(regex)) {
                    return node;
                }

                if (node.children != null) {
                    for (var i = 0; result === null && i < node.children.length; i++) {
                        result = getFirstNode(node.children[i], text);
                    }
                }

                return result;
            }

            function toArray(node, level) {
                var result;
                var child;

                if (!node) {
                    return;
                }

                result = [node];

                if (node.children != null) {
                    for (var i = 0; i < node.children.length; i++) {
                        child = toArray(node.children[i], level + 1);

                        if (child !== null) {
                            result = result.concat(child);
                        }
                    }
                }

                return result;
            }

            Tree.prototype.search = function (text) {
                return (text ? searchNode(this.structure, text) : this.structure);
            };

            Tree.prototype.toArray = function () {
                return toArray(this.structure, 0);
            };

            Tree.prototype.getNodeInGroup = function (hierarchyName, groupName, nodeName) {
                var hierarchy = getFirstNode(this.structure, hierarchyName);
                var group = getFirstNode(hierarchy, groupName);
                var node = getFirstNode(group, nodeName);

                forEachParent(node || group || hierarchy, function (node) {
                    node.expanded = true;
                });

                return node || group || hierarchy;
            };

            return Tree;
        })

        .directive('selectOrganisation', ["Tree", function (Tree) {
            return {
                restrict: 'AE',
                require: ['ngModel', '^form'],
                scope: {
                    assignee: '=ngModel',
                    organisation: '=selectOrganisation',
                    ngDisabled: '=',
                    requiredSelection: '@'
                },
                link: function (scope, element, attrs, controllers) {
                    var ngModelController = controllers[0];
                    var formController = controllers[1];
                    var requiredFields = scope.requiredSelection ? scope.requiredSelection.split(',') : [];

                    scope.$watch('assignee', function (newValue, oldValue) {
                        var valid = true;

                        if (requiredFields.length) {
                            angular.forEach(requiredFields, function (fieldName) {
                                if (!newValue || !newValue[fieldName]) {
                                    valid = false;
                                }
                            });

                            ngModelController.$setValidity('required', valid);
                        }

                        if (newValue !== oldValue) {
                            ngModelController.$setDirty();
                        }
                    });

                    element.bind('keydown', function (e) {
                        if (/(40|32)/.test(e.which)) {

                            e.preventDefault();
                            e.stopPropagation();

                            if (!scope.isDropdownOpen) {
                                scope.$apply(function () {
                                    scope.isDropdownOpen = true
                                });
                            }
                        }
                    });

                    formController.$addControl(ngModelController);
                },
                controller: ["$scope", "$element", function ($scope, $element) {
                    var tree;
                    var selectedNode;

                    function onDblClick(node) {
                        $scope.isDropdownOpen = false;
                    }

                    function getIconClass(node) {
                        return node.type === 'user' ? 'md md-person' : (node.type === 'root' ? 'md md-home' : 'md md-group-work');
                    }

                    $element.find('input').bind('click', function (evt) {
                        evt.preventDefault();
                        evt.stopPropagation();
                    });

                    $scope.searchTree = function () {
                        $scope.tree = tree.search($scope.search);
                    };

                    $scope.$watch('organisation', function (value) {
                        if (value) {
                            tree = Tree.fromOrganisation(value);
                            $scope.searchTree();

                            if ($scope.assignee) {
                                selectedNode = tree.getNodeInGroup($scope.assignee.hierarchy, $scope.assignee.group, $scope.assignee.user);

                                if (selectedNode) {
                                    selectedNode.selected = true;
                                }
                            }
                        }
                    });

                    $scope.options = {
                        collapsible: true,
                        showRoot: false,
                        getIconClass: getIconClass,
                        nodeClassProperty: 'type',
                        displayProperty: 'name',
                        onDblClick: onDblClick
                    };
                }],
                templateUrl: 'template/organisation/select-organisation.tpl.html'
            };
        }])

        .value('treeViewDefaults', {
            iconClassProperty: 'type',
            displayProperty: 'name',
            collapsible: true
        })

        .directive('treeView', ["$q", "treeViewDefaults", "Tree", function ($q, treeViewDefaults, Tree) {
            return {
                restrict: 'EA',
                scope: {
                    treeView: '=',
                    treeViewOptions: '=',
                    ngModel: '='
                },
                replace: true,
                template: '<div class="tree"><div tree-view-node="treeView" tabindex="-1"></div></div>',
                controller: ["$scope", "$element", function ($scope, $element) {
                    var self = this;
                    var selectedNode;
                    var options;
                    var nodes = new Tree($scope.treeView).toArray();

                    options = angular.extend({}, treeViewDefaults, $scope.treeViewOptions);

                    $scope.$watch('treeViewOptions', function (treeViewOptions) {
                        angular.extend(options, treeViewOptions);
                    });

                    this.selectNode = function (node) {
                        selectedNode = node;

                        if (typeof options.onNodeSelect === 'function') {
                            options.onNodeSelect(node);
                        }

                        self.updateModel(node);
                    };

                    this.dblClicked = function (node) {
                        if (typeof options.onDblClick === 'function') {
                            options.onDblClick(node);
                        }
                    };

                    this.updateModel = function (node) {
                        var current;
                        var model = {};

                        model.user = (node.type === 'user' ? node.name : null);
                        model.group = (node.type === 'group' ? node.name : (node.parent && node.parent.type === 'group' ? node.parent.name : null));

                        current = node;

                        while (current && current.type !== 'hierarchy') {
                            current = current.parent;
                        }

                        model.hierarchy = current && current.name;

                        $scope.ngModel = model;
                    };

                    this.isSelected = function (node) {
                        return node === selectedNode;
                    };

                    this.getOptions = function () {
                        return options;
                    };

                    this.selectNextNode = function () {
                        var index = nodes.indexOf(selectedNode);

                        if (index < nodes.length - 1) {
                            self.selectNode(nodes[index + 1]);
                        }
                    };

                    this.selectPreviousNode = function () {
                        var index = nodes.indexOf(selectedNode);

                        if (index > 0) {
                            self.selectNode(nodes[index - 1]);
                        }
                    };

                    $element.bind('keydown', function (e) {
                        if (/(38|40|13)/.test(e.which)) {

                            e.preventDefault();
                            e.stopPropagation();

                            $scope.$apply(function () {

                                switch (e.keyCode) {
                                    case (13):
                                        self.dblClicked();
                                        break;
                                    case (40):
                                        self.selectNextNode();
                                        break;
                                    case (38):
                                        self.selectPreviousNode();
                                        break;
                                }
                            });
                        }
                    });
                }]
            };
        }])

        .directive('treeViewNode', ['$q', '$compile', function ($q, $compile) {
            return {
                restrict: 'A',
                require: '^treeView',
                scope: {
                    node: '=treeViewNode'
                },
                link: function (scope, element, attrs, controller) {
                    var options = controller.getOptions();
                    var template;

                    scope.$watch('node', function (node) {
                        if (node) {
                            scope.expanded = node.expanded || options.collapsible === false;

                            angular.forEach(node.children, function (child) {
                                child.parent = scope.node;
                            });

                            if (node.selected) {
                                controller.selectNode(node, element);
                            }
                        }
                    });

                    scope.getIconClass = (typeof options.getIconClass === 'function') ? options.getIconClass : function (node) {
                        return (node[options.iconClassProperty] ? node[options.iconClassProperty] : 'md md-insert-drive-file');
                    };

                    scope.getNodeClass = (typeof options.getNodeClass === 'function') ? options.getNodeClass : function (node) {
                        return (node[options.nodeClassProperty] ? node[options.nodeClassProperty] : 'node');
                    };

                    scope.hasChildren = function () {
                        return Boolean(scope.node && (scope.node.children && scope.node.children.length));
                    };

                    scope.selectNode = function (event) {
                        event.preventDefault();

                        if (options.collapsible) {
                            scope.expanded = !scope.expanded;
                        }

                        controller.selectNode(scope.node, element);
                    };

                    scope.dblClickNode = function (event) {
                        event.preventDefault();
                        event.stopPropagation();

                        controller.dblClicked(scope.node);
                    };

                    scope.isSelected = function (node) {
                        return controller.isSelected(node);
                    };

                    template = '<div ng-if="node" class="tree-node" ng-class="getNodeClass(node)">' +
                        '<div ng-if="node.show !== false" class="tree-node-header" ng-click="selectNode($event)" ng-dblclick="dblClickNode($event)" ng-class="{ selected: isSelected(node) }">' +
                        '<i ng-class="getIconClass(node)"></i> ' +
                        '<span class="tree-node-name">{{ node.' + options.displayProperty + ' }}</span> ' +
                        '</div>' +
                        '<div class="tree-node-content"' + (options.collapsible ? ' ng-show="expanded"' : '') + '>' +
                        '<div ng-repeat="child in node.children" tree-view-node="child" tabindex="-1">' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div ng-if="!node" translate class="loading">No items match your query</div>';

                    $compile(template)(scope, function (clone) {
                        element.append(clone);
                    });
                }
            };
        }]);

})();

/*
 * Custom Scrollbars
 */

(function () {

    'use strict';

    angular
        .module('ui.scrollbar', [])

        .service('nicescrollService', function () {
            var ns = {};

            ns.niceScroll = function (selector, color, cursorWidth) {
                $(selector).niceScroll({
                    cursorcolor: color,
                    cursorborder: 0,
                    cursorborderradius: 0,
                    cursorwidth: cursorWidth,
                    bouncescroll: true,
                    mousescrollstep: 100,
                    autohidemode: false
                });
            };

            return ns;
        })

        .directive('scrollbar', ["nicescrollService", function (nicescrollService) {
            return {
                restrict: 'AE',
                link: function (scope, element, attrs) {
                    element.niceScroll({
                        cursorcolor: attrs['scrollbarColor'] || 'rgba(0,0,0,0.5)',
                        cursorborder: 0,
                        cursorborderradius: 0,
                        cursorwidth: attrs['scrollbarWidth'] || '5px',
                        bouncescroll: true,
                        mousescrollstep: 100
                    });
                }
            };
        }])

        .directive('html', ["nicescrollService", function (nicescrollService) {
            return {
                restrict: 'E',
                link: function (scope, element) {
                    if (!element.hasClass('ismobile')) {
                        if (!$('.login-content')[0]) {
                            nicescrollService.niceScroll(element, 'rgba(0,0,0,0.3)', '5px');
                        }
                    }
                }
            }
        }])

        //Table

        .directive('tableResponsive', ["nicescrollService", function (nicescrollService) {
            return {
                restrict: 'C',
                link: function (scope, element) {
                    if (!$('html').hasClass('ismobile')) {
                        nicescrollService.niceScroll(element, 'rgba(0,0,0,0.3)', '5px');
                    }
                }
            }
        }])

        .directive('chosenResults', ["nicescrollService", function (nicescrollService) {
            return {
                restrict: 'C',
                link: function (scope, element) {
                    if (!$('html').hasClass('ismobile')) {
                        nicescrollService.niceScroll(element, 'rgba(0,0,0,0.3)', '5px');
                    }
                }
            }
        }])

        .directive('tabNav', ["nicescrollService", function (nicescrollService) {
            return {
                restrict: 'C',
                link: function (scope, element) {
                    if (!$('html').hasClass('ismobile')) {
                        nicescrollService.niceScroll(element, 'rgba(0,0,0,0.3)', '1px');
                    }
                }
            }
        }])

        //For custom class

        .directive('cOverflow', ["nicescrollService", function (nicescrollService) {
            return {
                restrict: 'C',
                link: function (scope, element) {
                    if (!$('html').hasClass('ismobile')) {
                        nicescrollService.niceScroll(element, 'rgba(0,0,0,0.4)', '5px');
                    }
                }
            }
        }])
}());

(function () {

    'use strict';

    angular.module('ui.search', ['ui.bootstrap.typeahead'])
        .directive('iqSearch', ['$timeout', function ($timeout) {
            return {
                restrict: 'E',
                template: '<div class="search search-{{ theme }}-theme"\n ng-class="{ \'search-is-focused\': model,\n                 \'search-is-closed\': closed }">\n    <div class="search-container">\n        <label class="search-label"><i class="md md-search"></i></label>\n        <input type="text" class="search-input" \n               placeholder="{{ placeholder }}"\n               ng-model="model">\n        <span class="search-cancel" ng-click="clear()"><i class="md md-cancel"></i></span>\n    </div>\n</div>',
                scope: true,

                compile: function compile(template, attrs) {
                    var $input = template.find('.search-input');

                    if (attrs.ngEnter) {
                        $input.attr('ng-enter', attrs.ngEnter);
                    }

                    angular.forEach(attrs.$attr, function (key, name) {
                        var rest = key.substring(4);

                        if (name.indexOf('find') == 0) {
                            $input.attr('typeahead' + rest, attrs[name]);
                        }
                    });

                    return function postLink(scope, element, attrs, controller, transclude) {
                        var $input = element.find('.search-input');
                        var $label = element.find('.search-label');
                        var $searchFilter = element.find('.search');
                        var $searchFilterContainer = element.find('.search-container');

                        scope.find = attrs.find;
                        scope.findTemplateUrl = attrs.findTemplateUrl;
                        scope.theme = attrs.theme;
                        scope.placeholder = attrs.placeholder;
                        scope.closeWithValue = attrs.closeWithValue;

                        scope.closed = angular.isDefined(attrs.closed);

                        if (angular.isUndefined(scope.theme)) {
                            scope.theme = 'dark';
                        }

                        attrs.$observe('filterWidth', function (filterWidth) {
                            $searchFilterContainer.css({width: filterWidth});
                        });

                        // Events
                        $input
                            .on('blur', function () {
                                if (angular.isDefined(attrs.closed) && (!$input.val() || scope.closeWithValue)) {
                                    if (scope.closeWithValue) {
                                        scope.$apply(function () {
                                            scope.model = undefined;
                                        })
                                    }
                                    $searchFilter.velocity({
                                        width: 40
                                    }, {
                                        duration: 400,
                                        easing: 'easeOutQuint',
                                        queue: false
                                    });

                                }
                            });

                        $label.on('click', function () {
                            if (angular.isDefined(attrs.closed)) {
                                $searchFilter.velocity({
                                    width: attrs.filterWidth ? attrs.filterWidth : 240
                                }, {
                                    duration: 400,
                                    easing: 'easeOutQuint',
                                    queue: false
                                });

                                $timeout(function () {
                                    $input.focus();
                                }, 401);
                            } else {
                                $input.focus();
                            }
                        });

                        scope.clear = function () {
                            scope.model = undefined;

                            $input.focus();
                        };
                    }
                }
            };
        }]);

}());

angular.module('ui.select', [])
    .directive('selectpicker', function () {
        return {
            restrict: 'C',
            priority: 100,
            link: function (scope, element, attrs) {
                element.selectpicker();
            }
        };
    })
    .directive('tagSelect', function () {
        return {
            restrict: 'C',
            link: function (scope, element, attrs) {
                element.chosen({
                    width: '100%',
                    'allow_single_deselect': true
                });
            }
        }
    });

(function () {

    'use strict';

    angular
        .module('ui.sidebar', [])

        .run(["$rootScope", "$sidebar", function ($rootScope, $sidebar) {
            $rootScope.$on('$stateChangeStart', function () {
                $sidebar.close();
            })
        }])

        .directive('sidebarSwitch', function () {
            return {
                restrict: 'AE',
                replace: true,
                scope: {},
                link: function (scope, element, attrs) {
                    var localStorageKey = 'iqui-sidebar-switched';

                    scope.$watch(function () {
                        return localStorage.getItem(localStorageKey);
                    }, function (value) {
                        scope.isOn = value === 'on';

                        if (value === 'on') {
                            $('body').addClass('toggled sw-toggled');
                            $('#header').removeClass('sidebar-toggled');
                        } else {
                            $('body').removeClass('toggled sw-toggled');
                        }
                    });

                    scope.onChange = function () {
                        localStorage.setItem(localStorageKey, scope.isOn ? 'on' : 'off');
                    }

                },
                template: '<div class="toggle-switch sidebar-switch">\n    <input id="tw-switch" type="checkbox" hidden="hidden" ng-change="onChange()" ng-model="isOn">\n    <label for="tw-switch" class="ts-helper"></label>\n</div>'
            };
        })

        .factory('$sidebar', ["$rootScope", "$document", "$timeout", "$injector", "$controller", "$q", "$compile", "$templateRequest", function ($rootScope, $document, $timeout, $injector, $controller, $q, $compile, $templateRequest) {
            var _api = {};
            var body = $document.find('body').eq(0);

            function _getTemplatePromise(options) {
                return options.template ? $q.when(options.template) :
                    $templateRequest(angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl);
            }

            function _getResolvePromises(options) {
                var promisesArr = [];

                angular.forEach(options.resolve, function (value) {
                    if (angular.isFunction(value)) {
                        promisesArr.push($q.when($injector.invoke(value)));
                    } else {
                        promisesArr.push($q.when(value));
                    }
                });

                return promisesArr;
            }

            function _createScope(options, resolves) {
                var scope;
                var ctrlLocals = {};
                var ctrlInstance;
                var i;

                options.scope = options.scope || $rootScope;

                scope = options.scope.$new();

                if (options.controller) {
                    ctrlLocals.$scope = scope;

                    i = 1;

                    angular.forEach(options.resolve, function (value, key) {
                        ctrlLocals[key] = resolves[i++];
                    });

                    ctrlInstance = $controller(options.controller, ctrlLocals);

                    if (options.controllerAs) {
                        scope[options.controllerAs] = ctrlInstance;
                    }
                } else {
                    i = 1;

                    angular.forEach(options.resolve, function (value, key) {
                        scope[key] = resolves[i++];
                    });
                }

                return scope;
            }

            function _onClickOutside(sidebar) {
                return function (event) {
                    if (!$(event.target).closest($(sidebar.element[0])).length) {
                        $timeout(function () {
                            sidebar.hide();
                        });
                    }
                }
            }

            function Sidebar(options) {
                var _this = this;
                var resolvePromise;

                options.resolve = options.resolve || {};

                if (!options.template && !options.templateUrl) {
                    throw new Error('One of template or templateUrl options is required.');
                }

                resolvePromise = $q.all([_getTemplatePromise(options)].concat(_getResolvePromises(options)));

                resolvePromise
                    .then(function (resolves) {
                        var sidebarTemplate = '<aside class="sidebar"></aside>';
                        var element = angular.element(sidebarTemplate);

                        _this.content = resolves[0];

                        _this.scope = _createScope(options, resolves);

                        _this.scope.$parent.$on('$destroy', function () {
                            _this.destroy();
                        });

                        element.html(_this.content);

                        element.addClass(options.side || 'left');

                        _this.element = $compile(element)(_this.scope);

                        body.append(_this.element);
                    });

                this.options = options;

                this.isHidden = true;

                this.$promise = resolvePromise;
            }

            Sidebar.prototype.show = function open() {
                var _this = this;
                var deferred = $q.defer();

                this.scope.$close = function (data) {
                    deferred.resolve(data);
                    _this.hide();
                };

                this.scope.$dismiss = function (data) {
                    deferred.reject(data);
                    _this.hide();
                };

                this.clickHandler = _onClickOutside(this);

                $document.on('mouseup', this.clickHandler);

                this.element.addClass('toggled');

                this.isHidden = false;

                return deferred.promise;
            };

            Sidebar.prototype.hide = function () {
                this.element.removeClass('toggled');

                this.isHidden = true;

                $document.off('mouseup', this.clickHandler);
            };

            Sidebar.prototype.toggle = function () {
                if (this.isHidden) {
                    this.show();
                } else {
                    this.hide();
                }
            };

            Sidebar.prototype.destroy = function () {
                this.hide();
            };

            _api.create = function create(options) {
                return new Sidebar(options);
            };

            _api.close = function () {
                $('#sidebar').removeClass('toggled');
                $('#header').removeClass('sidebar-toggled');
                $('#sidebar-trigger').removeClass('open');
            };

            return _api;
        }]);

    /**
     Deprecated management of jquery sidebar
     */

    /**
     TODO Refactor as sidebar directive and service
     */

    $('body').on('click', '#sidebar-trigger', function (e) {

        var x = $(this).data('trigger');
        var $sidebar = '#sidebar';
        var $trigger = '#sidebar-trigger';

        e.preventDefault();

        $(x).toggleClass('toggled');
        $(this).toggleClass('open');
        $('#header').toggleClass('sidebar-toggled');

        $('.sub-menu.toggled').not('.active').each(function () {
            $(this).removeClass('toggled');
            $(this).find('ul').hide();
        });

        $('.profile-menu .main-menu').hide();

        //When clicking outside
        if ($('#header').hasClass('sidebar-toggled')) {
            $(document).on('click', function (e) {
                if (($(e.target).closest($sidebar).length === 0) && ($(e.target).closest($trigger).length === 0)) {
                    setTimeout(function () {
                        $($sidebar).removeClass('toggled');
                        $('#header').removeClass('sidebar-toggled');
                        $($trigger).removeClass('open');
                    });
                }
            });
        }
    });

    //Submenu
    $('body').on('click', '.sub-menu > a', function (e) {
        e.preventDefault();
        $(this).next().slideToggle(200);
        $(this).parent().toggleClass('toggled');
    });

    $('#sidebar').removeClass('toggled');
    $('#header').removeClass('sidebar-toggled');
    $('#sidebar-trigger').removeClass('open');

}());


(function () {

    'use strict';

    angular
        .module('ui.toaster', [
            'ngAnimate',
            'ngSanitize'])

        .provider('$toaster', function () {
            var _config;

            _config = {
                'limit': 3,
                'tap-to-dismiss': true,
                'newest-on-top': true,
                'time-out': 5000,
                'aggregate': false,
                'icon-classes': {
                    error: 'toast-error',
                    info: 'toast-info',
                    success: 'toast-success',
                    warning: 'toast-warning'
                },
                'body-output-type': 'trustedHtml', //  'trustedHtml', 'template'
                'body-template': 'toasterBodyTmpl.html',
                'icon-class': 'toast-info',
                'position-class': 'toast-bottom-right',
                'title-class': 'toast-title',
                'message-class': 'toast-message'
            };

            this.config = function (config) {
                angular.extend(_config, config);

                return this;
            };

            this.$get = ["$rootScope", function ($rootScope) {
                var _api;

                function _handleError(event, title) {
                    $rootScope.$on(event, function (event, message) {
                        _show('error', title, message, 0);
                    });
                }

                if (_config.errors) {
                    for (var key in _config.errors) {
                        if (_config.errors.hasOwnProperty(key)) {
                            _handleError(key, _config.errors[key]);
                        }
                    }
                }

                function _show(type, title, body, timeout, bodyOutputType) {
                    if (!body) {
                        _api.toast = {
                            type: type,
                            body: title,
                            timeout: timeout,
                            bodyOutputType: bodyOutputType
                        };
                    } else {
                        _api.toast = {
                            type: type,
                            title: title,
                            body: body,
                            timeout: timeout,
                            bodyOutputType: bodyOutputType
                        };
                    }
                    $rootScope.$broadcast('toaster-newToast');
                }

                function _showType(type) {
                    return function (title, text) {
                        if (angular.isObject(text)) {
                            text = JSON.stringify(text);
                        }
                        _show(type, title, text, _config['time-out'], 'trustedHtml');
                    };
                }

                function _clear() {
                    $rootScope.$broadcast('toaster-clearToasts');
                }

                _api = {
                    show: _show,
                    alert: _showType('warning'),
                    warn: _showType('warning'),
                    warning: _showType('warning'),
                    error: _showType('error'),
                    info: _showType('info'),
                    success: _showType('success'),
                    clear: _clear,
                    config: _config
                };

                return _api;
            }];
        })

        .directive('toaster', ["$compile", "$timeout", "$sce", "$toaster", function ($compile, $timeout, $sce, $toaster) {
            return {
                replace: true,
                restrict: 'EA',
                scope: true,
                link: function (scope, element, attrs) {

                    var id = 0;
                    var mergedConfig = $toaster.config;

                    if (attrs.toasterOptions) {
                        mergedConfig = angular.extend({}, $toaster.config, scope.$eval(attrs.toasterOptions));
                    }

                    scope.config = {
                        position: mergedConfig['position-class'],
                        title: mergedConfig['title-class'],
                        message: mergedConfig['message-class'],
                        tap: mergedConfig['tap-to-dismiss']
                    };

                    scope.configureTimer = function configureTimer(toast) {
                        var timeout = typeof (toast.timeout) === 'number' ? toast.timeout : mergedConfig['time-out'];
                        if (timeout > 0) {
                            toast.timeout = $timeout(function () {
                                scope.removeToast(toast.id);
                            }, timeout);
                        }
                    };

                    function addToast(toast) {
                        toast.type = mergedConfig['icon-classes'][toast.type];
                        if (!toast.type) {
                            toast.type = mergedConfig['icon-class'];
                        }

                        id++;
                        angular.extend(toast, {id: id});

                        // Set the toast.bodyOutputType to the default if it isn't set
                        toast.bodyOutputType = toast.bodyOutputType || mergedConfig['body-output-type'];
                        switch (toast.bodyOutputType) {
                            case 'trustedHtml':
                                toast.html = $sce.trustAsHtml(toast.body);
                                break;
                            case 'template':
                                toast.bodyTemplate = toast.body || mergedConfig['body-template'];
                                break;
                        }

                        scope.configureTimer(toast);

                        if (mergedConfig['newest-on-top'] === true) {
                            scope.toasters.unshift(toast);
                            if (mergedConfig.limit > 0 && scope.toasters.length > mergedConfig.limit) {
                                scope.toasters.pop();
                            }
                        } else {
                            scope.toasters.push(toast);
                            if (mergedConfig.limit > 0 && scope.toasters.length > mergedConfig.limit) {
                                scope.toasters.shift();
                            }
                        }
                    }

                    scope.toasters = [];
                    scope.$on('toaster-newToast', function () {
                        if (!mergedConfig.aggregate || scope.toasters.length === 0) {
                            addToast($toaster.toast);
                        }
                    });

                    scope.$on('toaster-clearToasts', function () {
                        scope.toasters.splice(0, scope.toasters.length);
                    });
                },
                controller: ["$scope", function ($scope) {

                    $scope.stopTimer = function (toast) {
                        if (toast.timeout) {
                            $timeout.cancel(toast.timeout);
                            toast.timeout = null;
                        }
                    };

                    $scope.restartTimer = function (toast) {
                        if (!toast.timeout) {
                            $scope.configureTimer(toast);
                        }
                    };

                    $scope.removeToast = function (id) {
                        var i = 0;
                        for (i; i < $scope.toasters.length; i++) {
                            if ($scope.toasters[i].id === id) {
                                break;
                            }
                        }
                        $scope.toasters.splice(i, 1);
                    };

                    $scope.remove = function (id) {
                        if ($scope.config.tap === true) {
                            $scope.removeToast(id);
                        }
                    };
                }],
                template: '<div  id="toast-container" ng-class="config.position">' +
                '<div ng-repeat="toaster in toasters" class="toast" ng-class="toaster.type" ng-click="remove(toaster.id)" ng-mouseover="stopTimer(toaster)"  ng-mouseout="restartTimer(toaster)">' +
                '<div ng-class="config.title">{{toaster.title}}</div>' +
                '<div ng-class="config.message" ng-switch on="toaster.bodyOutputType">' +
                '<div ng-switch-when="trustedHtml" ng-bind-html="toaster.html"></div>' +
                '<div ng-switch-when="template"><div ng-include="toaster.bodyTemplate"></div></div>' +
                '<div ng-switch-default >{{toaster.body}}</div>' +
                '</div>' +
                '</div>' +
                '</div>'
            };
        }])

}());

/*
 TODO Refactor as Angular directives and services
 */


/*
 * Top Search
 */
(function () {
    $('body').on('click', '#top-search > a', function (e) {
        e.preventDefault();

        $('#top-search-wrap > input').focus();

        $('#header').addClass('search-toggled');

        $('#top-search-wrap > input').keydown(function (e) {
            if (e.keyCode == 27) {
                $('#header').removeClass('search-toggled');
                e.stopPropagation();
            }
        });
    });

    $('body').on('click', '#top-search-close', function (e) {
        e.preventDefault();

        $('#header').removeClass('search-toggled');
    });
})();

(function () {

    'use strict';

    var _i18n = window['IQ_I18N'] || {pl: {}};

    angular
        .module('ui.translate', ['ui.toaster'])

        .factory('$i18n', function () {
            return _i18n;
        })

        .provider('$translate', function () {
            var _language = 'pl';

            this.language = function (language) {
                _language = language;

                return this;
            };

            this.$get = function () {

                function translate(key) {
                    var value;

                    if (!angular.isDefined(key) || key === null) {
                        return '';
                    }

                    if (typeof key.trim === 'function') {
                        key = key.trim();
                    }

                    value = _i18n[_language][key];

                    return value ? value : key;
                }

                return translate;
            };
        })

        .filter('translate', ["$translate", function ($translate) {
            return function (value) {
                return $translate(value);
            };
        }])

        .directive('translate', ["$translate", function ($translate) {
            return {
                restrict: 'AE',
                link: function (scope, element, attrs) {
                    element.html($translate(element.html()));
                }
            };
        }])

        .factory('$format', ["$translate", function ($translate) {

            function formatString() {
                var format = arguments[0];
                var params = Array.prototype.slice.call(arguments, 1);
                var message;

                format = $translate(format);

                message = format.replace(/{(\d+)}/g, function (match, number) {
                    var replacement = 'No value';

                    if (typeof(params[number]) === 'undefined') {
                        replacement = match;
                    } else if (params[number] === null) {
                        replacement = '(' + $translate('No value') + ')';
                    } else {
                        replacement = $translate(params[number]);
                    }

                    return replacement;
                });

                return message;
            }

            return formatString;
        }])

        .factory('$toast', ["$toaster", "$format", function ($toaster, $format) {

            function show(type) {
                var toasterFn = $toaster[type];

                return function () {
                    var message = $format.apply(this, arguments);
                    var colon = message.indexOf(':');

                    message = message.slice(0, colon + 1) + '<strong>' + message.slice(colon + 1) + '</strong>';

                    toasterFn.call(null, message);
                }
            }

            return {
                error: show('error'),
                info: show('info'),
                warn: show('warn'),
                success: show('success')
            };
        }])

}());

(function () {

    'use strict';

    angular
        .module('ui.utils', [])

    /**
     * Service for scrolling window
     */
        .factory('$scroll', function () {
            var _api = {};

            _api.toBottom = function () {
                window.scrollTo(0, document.body.scrollHeight);
            };

            _api.toTop = function () {
                window.scrollTo(0, 0);
            };

            return _api;
        })

    /**
     * Service for formatting Bytes using MB, GB, B, KB etc.
     *
     * @method filesize
     * @param  {Mixed}   arg        String, Int or Float to transform
     * @param  {Object}  descriptor [Optional] Flags
     * @return {String}             Readable file size String
     *
     * Descriptor:
     *
     * base (number) Number base, default is 2
     * bits (boolean) Enables bit sizes, default is false
     * exponent (number) Specifies the SI suffix via exponent, e.g. 2 is MB for bytes, default is -1
     * output (string) Output of function (array, exponent, object, or string), default is string
     * round (number) Decimal place, default is 2
     * spacer (string) Character between the result and suffix, default is " "
     * suffixes (object) Dictionary of SI suffixes to replace for localization, defaults to english if no match is found
     * unix (boolean) Enables unix style human readable output, e.g ls -lh, default is false
     */
        .factory('$fileSize', function () {
            var bit = /b$/;
            var si = {
                bits: ['B', 'kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'],
                bytes: ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
            };

            function fileSize(arg) {
                var descriptor = arguments[1] === undefined ? {} : arguments[1];

                var result = [];
                var skip = false;
                var val = 0;
                var e = undefined;
                var base = undefined;
                var bits = undefined;
                var ceil = undefined;
                var neg = undefined;
                var num = undefined;
                var output = undefined;
                var round = undefined;
                var unix = undefined;
                var spacer = undefined;
                var suffixes = undefined;

                if (isNaN(arg)) {
                    throw new Error('Invalid arguments');
                }

                bits = descriptor.bits === true;
                unix = descriptor.unix === true;
                base = descriptor.base !== undefined ? descriptor.base : 2;
                round = descriptor.round !== undefined ? descriptor.round : unix ? 1 : 2;
                spacer = descriptor.spacer !== undefined ? descriptor.spacer : unix ? '' : ' ';
                suffixes = descriptor.suffixes !== undefined ? descriptor.suffixes : {};
                output = descriptor.output !== undefined ? descriptor.output : 'string';
                e = descriptor.exponent !== undefined ? descriptor.exponent : -1;
                num = Number(arg);
                neg = num < 0;
                ceil = base > 2 ? 1000 : 1024;

                // Flipping a negative number to determine the size
                if (neg) {
                    num = -num;
                }

                // Zero is now a special case because bytes divide by 1
                if (num === 0) {
                    result[0] = 0;

                    if (unix) {
                        result[1] = '';
                    } else {
                        result[1] = 'B';
                    }
                } else {
                    // Determining the exponent
                    if (e === -1 || isNaN(e)) {
                        e = Math.floor(Math.log(num) / Math.log(ceil));
                    }

                    // Exceeding supported length, time to reduce & multiply
                    if (e > 8) {
                        val = val * (1000 * (e - 8));
                        e = 8;
                    }

                    if (base === 2) {
                        val = num / Math.pow(2, e * 10);
                    } else {
                        val = num / Math.pow(1000, e);
                    }

                    if (bits) {
                        val = val * 8;

                        if (val > ceil) {
                            val = val / ceil;
                            e++;
                        }
                    }

                    result[0] = Number(val.toFixed(e > 0 ? round : 0));
                    result[1] = si[bits ? 'bits' : 'bytes'][e];

                    if (!skip && unix) {
                        if (bits && bit.test(result[1])) {
                            result[1] = result[1].toLowerCase();
                        }

                        result[1] = result[1].charAt(0);

                        if (result[1] === 'B') {
                            result[0] = Math.floor(result[0]);
                            result[1] = '';
                        } else if (!bits && result[1] === 'k') {
                            result[1] = 'K';
                        }
                    }
                }

                // Decorating a 'diff'
                if (neg) {
                    result[0] = -result[0];
                }

                // Applying custom suffix
                result[1] = suffixes[result[1]] || result[1];

                // Returning Array, Object, or String (default)
                if (output === 'array') {
                    return result;
                }

                if (output === 'exponent') {
                    return e;
                }

                if (output === 'object') {
                    return {value: result[0], suffix: result[1]};
                }

                return result.join(spacer);
            }

            return fileSize;
        })

        .filter('fileSize', ["$fileSize", function ($fileSize) {
            return function (value, config) {
                return value ? $fileSize(value, config) : '';
            };
        }])

        /*
         Directive for indeteriminate checkbox value
         */

        .directive('indeterminate', function () {
            return {
                require: '?ngModel',
                link: function (scope, element, attrs, ngModelCtrl) {
                    ngModelCtrl.$formatters = [];
                    ngModelCtrl.$parsers = [];

                    ngModelCtrl.$render = function () {
                        var value = ngModelCtrl.$viewValue;

                        element.data('checked', value);

                        switch (value) {
                            case true:
                                element.prop('indeterminate', false);
                                element.prop('checked', true);
                                break;
                            case false:
                                element.prop('indeterminate', false);
                                element.prop('checked', false);
                                break;
                            default:
                                element.prop('indeterminate', true);
                        }
                    };

                    element.bind('click', function () {
                        var value;

                        switch (element.data('checked')) {
                            case false:
                                value = true;
                                break;
                            case true:
                                value = null;
                                break;
                            default:
                                value = false;
                        }
                        ngModelCtrl.$setViewValue(value);

                        scope.$apply(ngModelCtrl.$render);
                    });
                }
            };
        })

        .directive('btnWave', function () {
            return {
                restrict: 'C',
                link: function (scope, element) {
                    Waves.attach(element);
                    Waves.init();
                }
            }
        })

        .directive('btn', ["$timeout", function ($timeout) {
            return {
                restrict: 'C',
                link: function (scope, element) {
                    if (!element.is('input') && !element.hasClass('no-waves')) {
                        if (element.is('a') || element.hasClass('btn-link')) {
                            element.addClass('waves-effect waves-button');
                        } else {
                            element.addClass('waves-effect');
                        }
                    }

                    $timeout(function () {
                        Waves.init();
                    });
                }
            }
        }])

        .directive('fgLine', function () {
            return {
                restrict: 'C',
                link: function (scope, element) {
                    if ($('.fg-line')[0]) {
                        $('body').on('focus', '.form-control', function () {
                            $(this).closest('.fg-line').addClass('fg-toggled');
                        });

                        $('body').on('blur', '.form-control', function () {
                            var p = $(this).closest('.form-group');
                            var i = p.find('.form-control').val();

                            if (p.hasClass('fg-float')) {
                                if (i.length == 0) {
                                    $(this).closest('.fg-line').removeClass('fg-toggled');
                                }
                            }
                            else {
                                $(this).closest('.fg-line').removeClass('fg-toggled');
                            }
                        });
                    }

                }
            }

        })

        .directive('autosize', ["$timeout", function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    $timeout(function () {
                        element.autosize();
                    });
                }
            };
        }])

        .directive('tagSelect', function () {
            return {
                restrict: 'A',
                link: function (scope, element) {
                    if (element[0]) {
                        element.chosen({
                            width: '100%',
                            'allow_single_deselect': true
                        });
                    }
                }
            }
        })

        .directive('toggleSwitch', function () {
            var id = 1;

            return {
                restrict: 'AE',
                replace: true,
                transclude: true,
                scope: {
                    ngModel: '=',
                    ngChange: '&',
                    ngDisabled: '=',
                    name: '@',
                    on:'@',
                    off:'@'
                },
                link: function (scope, element, attrs) {
                    scope.id = id++;
                },
                template: '<div class="toggle-switch" ng-class="{active: ngModel}">\n    <label for="toggle-{{ id }}" ng-if="!off && !on" class="ts-label" ng-transclude> </label>\n    <label for="toggle-{{ id }}" ng-if="off" class="ts-label before" > {{ off }}</label>\n    \n    <input id="toggle-{{ id }}" type="checkbox" hidden="hidden" name="{{ name }}" ng-model="ngModel" ng-disabled="ngDisabled" ng-change="ngChange()">\n    <label for="toggle-{{ id }}" class="ts-helper"></label>\n    \n    <label for="toggle-{{ id }}" ng-if="on" class="ts-label after" > {{ on }}</label>\n</div>'
            };
        })

        .directive('navTabs', function () {
            return {
                restrict: 'C',
                link: function (scope, element, attrs) {
                    element.addClass('tab-nav');
                }
            };
        })

        .directive('errSrc', function () {
            return {
                link: function (scope, element, attrs) {
                    scope.$watch(function () {
                        return attrs['ngSrc'];
                    }, function (value) {
                        if (!value) {
                            element.attr('src', attrs.errSrc);
                        }
                    });

                    element.bind('error', function () {
                        element.attr('src', attrs.errSrc);
                    });
                }
            }
        })

        .directive('prettyCode', ["$timeout", function ($timeout) {
            return {
                restrict: 'AE',
                transclude: true,
                replace: true,
                link: function (scope, element, attrs) {
                    var codeElement = element.find('code')[0];

                    if (!window.prettyPrintOne) {
                        return;
                    }

                    $timeout(function () {
                        codeElement.innerHTML = window.prettyPrintOne(codeElement.innerText)
                    });
                },
                template: '<pre class="prettyprint"><code class="language-yaml" ng-transclude></code></pre>'
            };
        }])

        .directive('fileUpload', ["$utils", function ($utils) {
            return {
                restrict: 'E',
                template: '<div class="fileinput">\n    <div class="btn btn-primary btn-file">\n        <span class="fileinput-label">Wybierz plik</span>\n        <input type="hidden" value="" name="...">\n        <input type="file" name="">\n    </div>\n    <div class="fileinput-fileinfo alert alert-info alert-dismissible" ng-show="file">\n        <button type="button" class="close" ng-click="clear()"><span aria-hidden="true">&times;</span></button>\n        \n        <dl class="dl-horizontal">\n            <dt>Nazwa: </dt>\n            <dd>{{ file.name}}</dd>\n            <dt>Wielkość: </dt>\n            <dd>{{ file.size | fileSize}}</dd>\n            <dt>Typ: </dt>\n            <dd>{{ file.type }}</dd>\n        </dl>\n    </div>\n    \n</div>',
                require: 'ngModel',
                scope: {
                    validate: '&',
                    file: '=ngModel'
                },
                replace: true,
                link: function (scope, element, attr, ctrl) {
                    var input;

                    input = element.find('input');

                    if (typeof scope.validate !== 'function') {
                        scope.validate = function () {
                            return true
                        };
                    }

                    var listener = function () {
                        scope.$apply(function () {
                            var file = input[1].files[0];

                            if (file && scope.validate({$file: file})) {
                                scope.file = file;
                            }
                        });
                    };

                    input.bind('change', listener);

                    scope.clear = function () {
                        scope.file = undefined;
                    };
                }
            }
        }])

        .directive('ngEnter', function () {
            return function (scope, element, attrs) {
                element.bind('keydown keypress', function (event) {
                    if (event.which === 13) {
                        scope.$apply(function () {
                            scope.$eval(attrs.ngEnter, {'event': event});
                        });

                        event.preventDefault();
                    }
                });
            };
        })

        .directive('ngEscape', ["$document", function ($document) {
            var handlers = [];

            function unbind(handler) {
                $document.unbind('keydown keypress', handler);
            }

            function bind(handler) {
                var handlersCount = handlers.length;

                if (handlersCount > 0) {
                    unbind(handlers[handlersCount - 1]);
                }

                $document.bind('keydown keypress', handler);

                handlers.push(handler);
            }

            return function (scope, element, attrs) {
                function clickHandler(event) {
                    if (event.which === 27) {
                        scope.$apply(function () {
                            scope.$eval(attrs.ngEscape, {'event': event});
                        });

                        event.preventDefault();
                    }
                }

                bind(clickHandler);

                scope.$on('$destroy', function () {
                    unbind(clickHandler);
                    handlers.pop();
                    bind(handlers[handlers.length - 1]);
                });
            };
        }])

        .directive('spinner', function () {
            return {
                restrict: 'AE',
                replace: true,
                template: '<div class="spinner spinner-wave">\n          <div class="rect1"></div>\n          <div class="rect2"></div>\n          <div class="rect3"></div>\n          <div class="rect4"></div>\n          <div class="rect5"></div>\n        </div>'
            };
        })

        .directive('radioButton', function () {
            return {
                restrict: 'AE',
                transclude: true,
                replace: true,
                scope: {
                    ngModel: '=',
                    value: '@'
                },
                controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {
                }],
                link: function (scope, element, attrs) {
                },
                template: '<label class="radio">' +
                '<input type="radio" name="radioGroup" ' +
                'value="{{value}}" data-toggle="radio" ' +
                'ng-model="ngModel" class="custom-radio">' +
                '<span class="icons">' +
                '<span class="icon-unchecked"></span>' +
                '<span class="icon-checked"></span>' +
                '</span>' +

                '<span ng-transclude></span>' +
                '</label>'
            };
        })

}());

angular.module('ui.templates', ['template/datetimepicker/datepicker.tpl.html', 'template/datetimepicker/datetimepicker.html', 'template/datetimepicker/timepicker.tpl.html', 'template/datetimepicker/tooltip.tpl.html', 'template/organisation/select-organisation.tpl.html', 'template/tabs/tabset.html']);

angular.module('template/datetimepicker/datepicker.tpl.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('template/datetimepicker/datepicker.tpl.html',
    '<div class="dropdown-menu datepicker" ng-class="\'datepicker-mode-\' + $mode" style="max-width: 210px;">\n' +
    '    <table style="table-layout: fixed; height: 100%; width: 100%;">\n' +
    '        <thead>\n' +
    '        <tr class="text-center">\n' +
    '            <th>\n' +
    '                <button tabindex="-1" type="button" class="btn btn-link pull-left" ng-click="$selectPane(-1)">\n' +
    '                    <i class="{{$iconLeft}}"></i>\n' +
    '                </button>\n' +
    '            </th>\n' +
    '            <th colspan="{{ rows[0].length - 2 }}">\n' +
    '                <button tabindex="-1" type="button" class="btn btn-link btn-block text-strong"\n' +
    '                        ng-click="$toggleMode()">\n' +
    '                    <strong style="text-transform: capitalize;" ng-bind="title"></strong>\n' +
    '                </button>\n' +
    '            </th>\n' +
    '            <th>\n' +
    '                <button tabindex="-1" type="button" class="btn btn-link pull-right" ng-click="$selectPane(+1)">\n' +
    '                    <i class="{{$iconRight}}"></i>\n' +
    '                </button>\n' +
    '            </th>\n' +
    '        </tr>\n' +
    '        <tr ng-show="showLabels" ng-bind-html="labels"></tr>\n' +
    '        </thead>\n' +
    '        <tbody>\n' +
    '        <tr ng-repeat="(i, row) in rows" height="{{ 100 / rows.length }}%">\n' +
    '            <td class="text-center" ng-repeat="(j, el) in row">\n' +
    '                <button tabindex="-1" type="button" class="btn btn-link btn-sm"\n' +
    '                        ng-class="{\'btn-primary\': el.selected, \'btn-info btn-today\': el.isToday && !el.selected}"\n' +
    '                        ng-click="$select(el.date)" ng-disabled="el.disabled">\n' +
    '                    <span ng-class="{\'text-muted\': el.muted}" ng-bind="el.label"></span>\n' +
    '                </button>\n' +
    '            </td>\n' +
    '        </tr>\n' +
    '        </tbody>\n' +
    '    </table>\n' +
    '\n' +
    '    <div style="padding:10px 0px 20px 0px">\n' +
    '		<span class="pull-left">\n' +
    '			<button type="button" class="btn btn-icon" tabindex="-1" ng-click="$today()" tooltip="Dziś" tooltip-placement="bottom"><i class="md md-event c-blue"></i></button>\n' +
    '			<button type="button" class="btn btn-icon" tabindex="-1" ng-click="$clear()" tooltip="Kasuj" tooltip-placement="bottom"><i class="md md-clear c-red"></i></button>\n' +
    '		</span>\n' +
    '        <button type="button" class="btn btn-icon pull-right"  tabindex="-1" ng-click="$close()" tooltip="Zamknij" tooltip-placement="bottom"><i class="md md-done c-green"></i></button>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('template/datetimepicker/datetimepicker.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('template/datetimepicker/datetimepicker.html',
    '<div class="datetimepicker form-inline">\n' +
    '\n' +
    '    <div class="form-group">\n' +
    '        <input type="text"\n' +
    '               class="date form-control"\n' +
    '               size="11"\n' +
    '               ng-model="ngModel"\n' +
    '               is-dirty="{{ isDirty }}"\n' +
    '               min-date="{{ minDate }}"\n' +
    '               max-date="{{ maxDate }}"\n' +
    '               placeholder="{{ dateFormat }}"\n' +
    '               bs-datepicker>\n' +
    '    </div>\n' +
    '\n' +
    '\n' +
    '    <div class="form-group">\n' +
    '        <input type="text"\n' +
    '               class="time form-control"\n' +
    '               size="8"\n' +
    '               ng-change="touchDate()"\n' +
    '               ng-model="ngModel"\n' +
    '               ng-show="!dateOnly"\n' +
    '               placeholder="{{ timeFormat }}"\n' +
    '               bs-timepicker>\n' +
    '    </div>\n' +
    '\n' +
    '</div>\n' +
    '');
}]);

angular.module('template/datetimepicker/timepicker.tpl.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('template/datetimepicker/timepicker.tpl.html',
    '<div class="dropdown-menu timepicker" style="min-width: 0px;width: auto;">\n' +
    '    <table height="100%">\n' +
    '        <thead>\n' +
    '        <tr class="text-center">\n' +
    '            <th>\n' +
    '                <button tabindex="-1" type="button" class="btn btn-link pull-left no-waves" ng-click="$arrowAction(-1, 0)">\n' +
    '                    <i class="{{ $iconUp }}"></i>\n' +
    '                </button>\n' +
    '            </th>\n' +
    '            <th>\n' +
    '                &nbsp;\n' +
    '            </th>\n' +
    '            <th>\n' +
    '                <button tabindex="-1" type="button" class="btn btn-link pull-left no-waves" ng-click="$arrowAction(-1, 1)">\n' +
    '                    <i class="{{ $iconUp }}"></i>\n' +
    '                </button>\n' +
    '            </th>\n' +
    '            <th>\n' +
    '                &nbsp;\n' +
    '            </th>\n' +
    '            <th>\n' +
    '                <button ng-if="showSeconds" tabindex="-1" type="button" class="btn btn-link pull-left no-waves"\n' +
    '                        ng-click="$arrowAction(-1, 2)">\n' +
    '                    <i class="{{ $iconUp }}"></i>\n' +
    '                </button>\n' +
    '            </th>\n' +
    '        </tr>\n' +
    '        </thead>\n' +
    '        <tbody>\n' +
    '        <tr ng-repeat="(i, row) in rows">\n' +
    '            <td class="text-center">\n' +
    '                <button tabindex="-1"  type="button" class="btn btn-link btn-sm"\n' +
    '                        ng-class="{\'btn-primary\': row[0].selected}" ng-click="$select(row[0].date, 0)"\n' +
    '                        ng-disabled="row[0].disabled">\n' +
    '                    <span ng-class="{\'text-muted\': row[0].muted}" ng-bind="row[0].label"></span>\n' +
    '                </button>\n' +
    '            </td>\n' +
    '            <td>\n' +
    '                <span ng-bind="i == midIndex ? timeSeparator : \' \'"></span>\n' +
    '            </td>\n' +
    '            <td class="text-center">\n' +
    '                <button tabindex="-1" ng-if="row[1].date"  type="button" class="btn btn-link btn-sm"\n' +
    '                        ng-class="{\'btn-primary\': row[1].selected}" ng-click="$select(row[1].date, 1)"\n' +
    '                        ng-disabled="row[1].disabled">\n' +
    '                    <span ng-class="{\'text-muted\': row[1].muted}" ng-bind="row[1].label"></span>\n' +
    '                </button>\n' +
    '            </td>\n' +
    '            <td>\n' +
    '                <span ng-bind="i == midIndex ? timeSeparator : \' \'"></span>\n' +
    '            </td>\n' +
    '            <td class="text-center">\n' +
    '                <button tabindex="-1" ng-if="showSeconds && row[2].date"  type="button"\n' +
    '                        class="btn btn-link btn-sm" ng-class="{\'btn-primary\': row[2].selected}"\n' +
    '                        ng-click="$select(row[2].date, 2)" ng-disabled="row[2].disabled">\n' +
    '                    <span ng-class="{\'text-muted\': row[2].muted}" ng-bind="row[2].label"></span>\n' +
    '                </button>\n' +
    '            </td>\n' +
    '            <td ng-if="showAM">\n' +
    '                &nbsp;\n' +
    '            </td>\n' +
    '            <td ng-if="showAM">\n' +
    '                <button tabindex="-1" ng-show="i == midIndex - !isAM * 1"  type="button"\n' +
    '                        ng-class="{\'btn-primary\': !!isAM}" class="btn btn-link btn-sm" ng-click="$switchMeridian()"\n' +
    '                        ng-disabled="el.disabled">AM\n' +
    '                </button>\n' +
    '                <button tabindex="-1" ng-show="i == midIndex + 1 - !isAM * 1"  type="button"\n' +
    '                        ng-class="{\'btn-primary\': !isAM}" class="btn btn-link btn-sm" ng-click="$switchMeridian()"\n' +
    '                        ng-disabled="el.disabled">PM\n' +
    '                </button>\n' +
    '            </td>\n' +
    '        </tr>\n' +
    '        </tbody>\n' +
    '        <tfoot>\n' +
    '        <tr class="text-center">\n' +
    '            <th>\n' +
    '                <button tabindex="-1" type="button" class="btn btn-link  pull-left no-waves" ng-click="$arrowAction(1, 0)">\n' +
    '                    <i class="{{ $iconDown }}"></i>\n' +
    '                </button>\n' +
    '            </th>\n' +
    '            <th>\n' +
    '                &nbsp;\n' +
    '            </th>\n' +
    '            <th>\n' +
    '                <button tabindex="-1" type="button" class="btn btn-link  pull-left no-waves" ng-click="$arrowAction(1, 1)">\n' +
    '                    <i class="{{ $iconDown }}"></i>\n' +
    '                </button>\n' +
    '            </th>\n' +
    '            <th>\n' +
    '                &nbsp;\n' +
    '            </th>\n' +
    '            <th>\n' +
    '                <button ng-if="showSeconds" tabindex="-1" type="button" class="btn btn-link  pull-left no-waves"\n' +
    '                        ng-click="$arrowAction(1, 2)">\n' +
    '                    <i class="{{ $iconDown }}"></i>\n' +
    '                </button>\n' +
    '            </th>\n' +
    '        </tr>\n' +
    '        </tfoot>\n' +
    '    </table>\n' +
    '</div>\n' +
    '');
}]);

angular.module('template/datetimepicker/tooltip.tpl.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('template/datetimepicker/tooltip.tpl.html',
    '<div class="tooltip in" ng-show="title">\n' +
    '  <div class="tooltip-arrow"></div>\n' +
    '  <div class="tooltip-inner" ng-bind="title"></div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('template/organisation/select-organisation.tpl.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('template/organisation/select-organisation.tpl.html',
    '<div class="dropdown" dropdown auto-close="outsideClick" is-open="isDropdownOpen">\n' +
    '    <a href="" class="dropdown-toggle form-control" dropdown-toggle ng-disabled="ngDisabled" ng-required="ngRequired">\n' +
    '        {{ assignee.user || \'Select element...\' | translate}}\n' +
    '    </a>\n' +
    '\n' +
    '    <div class="dropdown-menu dropdown-menu-lg">\n' +
    '        <div class="search-wrapper">\n' +
    '            <input type="text"\n' +
    '                   class="form-control search-input"\n' +
    '                   placeholder="{{ \'Search...\' | translate}}"\n' +
    '                   ng-model="search"\n' +
    '                   ng-enter="false"\n' +
    '                   tabindex="1"\n' +
    '                   ng-change="searchTree()">\n' +
    '        </div>\n' +
    '\n' +
    '        <input ng-model="assignee" style="display: none;" name="assignee">\n' +
    '\n' +
    '        <div tree-view="tree"\n' +
    '             tree-view-options="options"\n' +
    '             focus-if="isDropdownOpen"\n' +
    '             tabindex="2"\n' +
    '             ng-model="assignee"></div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('template/tabs/tabset.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('template/tabs/tabset.html',
    '<div>\n' +
    '    <ul class="tab-nav" ng-class="{\'nav-stacked\': vertical, \'nav-justified\': justified}" ng-transclude></ul>\n' +
    '    <div class="tab-content">\n' +
    '        <div class="tab-pane"\n' +
    '             ng-repeat="tab in tabs"\n' +
    '             ng-class="{active: tab.active}"\n' +
    '             tab-content-transclude="tab">\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
