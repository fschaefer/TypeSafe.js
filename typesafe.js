/*
 * typesafe.js: A library for creating typed functions in JavaScript.
 * 
 * Copyright (c) 2012 Florian Schäfer (florian.schaefer@gmail.com)
 * Dual licensed under the MIT (MIT_LICENSE.txt)
 * and GPL Version 2 (GPL_LICENSE.txt) licenses.
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
        }
        if (type === null) {
            return 'Null';
        }
        return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    }

    exports.TypeSafe = function TypeSafe(returnType, argumentTypes, fn) {

        returnType = toTypeString(returnType);

        if (isType(argumentTypes, 'String')) {
            argumentTypes = [argumentTypes];
        }

        for (var i = 0; i < argumentTypes.length; i++) {
            argumentTypes[i] = toTypeString(argumentTypes[i]);
        }

        return function () {

            for (var i = 0; i < argumentTypes.length; i++) {
                if (!isType(arguments[i], argumentTypes[i])) {
                    throw 'TypeSafe: Invalid type of argument ' + (i + 1) + ': Expected ' + argumentTypes[i] + ', found ' + getType(arguments[i]) + ' instead.';
                }
            }

            var returnValue = fn.apply(this, arguments);

            if (!isType(returnValue, returnType)) {
                throw 'TypeSafe: Invalid return type: Expected ' + toTypeString(returnType) + ', found ' + getType(returnValue) + ' instead.';
            }

            return returnValue;
        };
    };

})(this, undefined);

