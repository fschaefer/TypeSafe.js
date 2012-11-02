/*
 * TypeSafe.js: A library for creating typed functions in JavaScript.
 * 
 * Copyright (c) 2012 Florian Schäfer (florian.schaefer@gmail.com)
 * Released under MIT license.
 *
 * Version: 1.0
 * 
 */

(function (exports, undefined) {

    function getType(parameter) {
        return toTypeString(Object.prototype.toString.call(parameter).match(/\[object (.+)\]/)[1]);
    }

    function isType(parameter, type) {
        return getType(parameter) === toTypeString(type);
    }

    function toTypeString(type) {
        if (type === undefined) {
            return 'Undefined';
        } else if (type === null) {
            return 'Null';
        }
        return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    }

    function TypeSafe(returnType, argumentTypes, fn) {

        returnType = toTypeString(returnType);

        if (isType(argumentTypes, 'String')) {
            argumentTypes = [argumentTypes];
        }

        for (var i = 0, l = argumentTypes.length; i < l; i++) {
            argumentTypes[i] = toTypeString(argumentTypes[i]);
        }

        return function () {

            for (var i = 0, l = argumentTypes.length; i < l; i++) {
                if (!isType(arguments[i], argumentTypes[i])) {
                    throw new TypeError('Invalid type of argument ' + (i + 1) + ': Expected ' + argumentTypes[i] + ', found ' + getType(arguments[i]) + ' instead.');
                }
            }

            var returnValue = fn.apply(this, arguments);

            if (!isType(returnValue, returnType)) {
                throw new TypeError('Invalid type of return value: Expected ' + toTypeString(returnType) + ', found ' + getType(returnValue) + ' instead.');
            }

            return returnValue;
        };
    };

    exports.TypeSafe = TypeSafe;

})(this);
