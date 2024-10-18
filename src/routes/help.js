"use strict"

import fs from "fs"
import path from "path"

import { fileURLToPath } from "url"
import { dirname } from "path"
import { Marked } from "marked"
import { markedHighlight } from "marked-highlight"
import hljs from "highlight.js"

const marked = new Marked(
    markedHighlight({
        langPrefix: "hljs language-",
        highlight(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : "plaintext"
            return hljs.highlight(code, { language }).value
        },
    })
)

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Get the help documentation.
 *
 * Example API call:
 * POST /api/help
 *
 * @async
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends the help documentation as a HTML response.
 */
export const get = (req, res) => {
    if (req.method !== "GET") return res.status(405).send("Method Not Allowed")

    try {
        const dirPath = path.join(__dirname, "/../docs/api.md")

        const file = fs.readFileSync(dirPath, "utf8")
        const htmlContent = marked.parse(file.toString())

        res.render("help", { content: htmlContent })
    } catch (err) {
        console.error(err)
        res.status(500).send("Error: " + err)
    }
}
