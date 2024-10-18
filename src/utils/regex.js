"use strict"

/**
 * @function validateCommentPosition
 * @description Validate a string as a line number and column number.
 * @param {string} position - The string to validate.
 * @returns {boolean} True if the string is a valid line number and column number.
 */
export function validateCommentPosition(position) {
    const re = /^\d+:\d+$/ // Example: 14:28
    return re.test(position)
}
