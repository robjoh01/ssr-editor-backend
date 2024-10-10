"use strict"

import jq from "node-jq"

/**
 * Query JSON object with jq
 * @param {string} filter
 * @param {object} json
 * @returns {Promise<object | string>}
 */
export function queryJSON(filter, json) {
    return jq.run(filter, json, { input: "json", output: "pretty" })
}

/**
 * Query JSON string with jq
 * @param {string} filter
 * @param {string} string
 * @returns {Promise<object | string>}
 */
export function queryString(filter, string) {
    return jq.run(filter, string, { input: "string", output: "pretty" })
}
