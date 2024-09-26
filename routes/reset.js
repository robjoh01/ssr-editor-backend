"use strict"

import documents from "../src/documents.js"

const initialDocuments = [
    {
        id: "66eadff20f6e028247059cdd",
        title: "Första dokumentet",
        content: "Dokumentets innehåll",
        created_at: "9/1/2020, 11:36:33 AM",
        updated_at: "9/25/2024, 9:40:59 PM",
        owner_id: 0,
        is_locked: false,
    },
    {
        id: "66f489160f6e0282477688bf",
        title: "Andra dokumentet",
        content: "Dokumentets innehåll",
        created_at: "9/1/2000, 11:36:33 AM",
        updated_at: "9/25/2024, 9:40:59 PM",
        owner_id: 1,
        is_locked: true,
    },
]

// Reset all documents
export const post = async (req, res) => {
    try {
        await documents.reset(initialDocuments)
        return res.status(200).send("All documents were reset.")
    } catch (e) {
        console.error(e)
        return res.status(500).send("Internal Server Error")
    }
}
