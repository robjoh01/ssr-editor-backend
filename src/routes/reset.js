"use strict"

import { ObjectId } from "mongodb"
import { getDb, resetCollection } from "@/utils/database.js"
import adminJWT from "@middlewares/adminJWT.js"

/* eslint-disable */
const initialUsers = [
    {
        _id: new ObjectId("66eae0bd0f6e02824705d72a"),
        isAdmin: true,
        email: "bYxkM@example.com",
        name: "Robin Johannesson",
        documents: [new ObjectId("67080abb97c1e14ff70913f0")],
        stats: {
            totalDocuments: 1,
            totalEdits: 5,
            totalComments: 1,
        },
        createdAt: "9/1/2020, 11:36:33 AM",
        updatedAt: "9/1/2020, 11:36:33 AM",
        lastLogin: "9/1/2020, 11:36:33 AM",
        passwordHash:
            "$2a$12$.TFOYazokOS6p6Ijm/ud5.RbT7xqGwb1PfkKWOrG4b/kuD9rxkr.a",
        profilePicture: "url_to_profile_pic_1",
    },
    {
        _id: new ObjectId("67080b1bc1f55178f0902d77"),
        isAdmin: true,
        email: "kZ8hW@example.com",
        name: "Moawya Mearza",
        documents: [new ObjectId("67080abb97c1e14ff70913f0")],
        stats: {
            totalDocuments: 1,
            totalEdits: 2,
            totalComments: 0,
        },
        createdAt: "9/1/2020, 11:36:33 AM",
        updatedAt: "9/1/2020, 11:36:33 AM",
        lastLogin: "9/1/2020, 11:36:33 AM",
        passwordHash:
            "$2a$12$fI7ELlrodWaUIo2aLAbV6.E01w2zLwaNnhj/mDgJupXoV/nWoj2K6",
        profilePicture: "url_to_profile_pic_2",
    },
    {
        _id: new ObjectId("66eae0bd0f6e02824705d72b"),
        isAdmin: false,
        email: "alice@example.com",
        name: "Alice Andersson",
        documents: [new ObjectId("67080abb97c1e14ff70913f1")],
        stats: {
            totalDocuments: 1,
            totalEdits: 3,
            totalComments: 2,
        },
        createdAt: "9/1/2021, 10:15:00 AM",
        updatedAt: "9/1/2020, 11:36:33 AM",
        lastLogin: "9/15/2021, 2:30:00 PM",
        passwordHash:
            "$2a$12$N.5uCXsE1nelgBNfNXWiGu7PNxprgjp5Xb4vbRBstr8N260yHa.8e",
        profilePicture: "url_to_profile_pic_3",
    },
    {
        _id: new ObjectId("66eae0bd0f6e02824705d72c"),
        isAdmin: false,
        email: "bob@example.com",
        name: "Bob Bergström",
        documents: [],
        stats: {
            totalDocuments: 0,
            totalEdits: 0,
            totalComments: 0,
        },
        createdAt: "9/1/2022, 11:00:00 AM",
        updatedAt: "9/1/2020, 11:36:33 AM",
        lastLogin: "9/1/2023, 11:00:00 AM",
        passwordHash:
            "$2a$12$LwT1aoWeL1bT0lAHUBGlkuN67BddII2rp2Dt6Zs4EoMsXSTRmE8ta",
        profilePicture: "url_to_profile_pic_4",
    },
]

const initialDocuments = [
    {
        _id: new ObjectId("67080abb97c1e14ff70913f0"),
        title: "DV1677 - JavaScript-baserade webbramverk",
        content: {
            ops: [
                {
                    insert: "Detta är kursen DV1677 JavaScript-baserade webbramverk.",
                },
                {
                    attributes: {
                        header: 1,
                    },
                    insert: "\n",
                },
                {
                    insert: "\nVi ska i denna kurs använda oss av JavaScript ramverk både på frontend och backend för att vidareutveckla en befintlig applikation.\nKursen ges till ",
                },
                {
                    attributes: {
                        color: "#2915a3",
                        link: "https://dbwebb.se/",
                    },
                    insert: "webbprogrammeringsstudenter",
                },
                {
                    insert: " vid ",
                },
                {
                    attributes: {
                        color: "#2915a3",
                        link: "https://bth.se/",
                    },
                    insert: "Blekinge Tekniska Högskola",
                },
                {
                    insert: ". Och är en av Sveriges enda högskolekurser i JavaScript ramverk.\n\nKällkoden till denna webbplats finns på ",
                },
                {
                    attributes: {
                        color: "#2915a3",
                        link: "https://github.com/emilfolino/jsramverk.se",
                    },
                    insert: "GitHub emilfolino/jsramverk.se",
                },
                {
                    insert: "\n\nI kursen bygger vi vidare på en ",
                },
                {
                    attributes: {
                        italic: true,
                    },
                    insert: '"real-time collaborative text-editor"',
                },
                {
                    insert: "-applikation tillsammans två och två. Vi tar en titt på hur detta samarbetet kan bli optimalt och vilka tekniker och verktyg som finns för att samarbeta om vidareutveckling av kod.\n\n\n",
                },
            ],
        },
        collaborators: [
            {
                userId: new ObjectId("66eae0bd0f6e02824705d72a"),
                createdAt: "9/1/2020, 11:36:33 AM",
                updatedAt: "9/1/2020, 11:36:33 AM",
                grant: ["read"],
            },
            {
                userId: new ObjectId("67080b1bc1f55178f0902d77"),
                createdAt: "9/1/2020, 11:36:33 AM",
                updatedAt: "9/1/2020, 11:36:33 AM",
                grant: ["read"],
            },
        ],
        comments: [new ObjectId("66eae1c30f6e0282470624c7")],
        stats: {
            totalEdits: 0,
            totalViews: 10,
            activeComments: 1,
            activeUsers: 2,
        },
        createdAt: "9/1/2020, 11:36:33 AM",
        updatedAt: "9/1/2020, 11:36:33 AM",
        ownerId: new ObjectId("66eae0bd0f6e02824705d72c"),
    },
    {
        _id: new ObjectId("67080abb97c1e14ff70913f1"),
        title: "React.js",
        content: "Why use React.js?",
        collaborators: [],
        comments: [],
        stats: {
            totalEdits: 0,
            totalViews: 5,
            activeComments: 0,
            activeUsers: 1,
        },
        createdAt: "9/1/2020, 11:36:33 AM",
        updatedAt: "9/1/2020, 11:36:33 AM",
        ownerId: new ObjectId("66eae0bd0f6e02824705d72a"),
    },
    {
        _id: new ObjectId("67080abb97c1e14ff70913f2"),
        title: "Why use Express.js?",
        content:
            "Express.js is an open-source web framework, built on top of Node.js. The main goal of Express is to provide a simple and flexible framework for building web applications.",
        collaborators: [
            {
                userId: new ObjectId("66eae0bd0f6e02824705d72a"),
                createdAt: "9/1/2020, 11:36:33 AM",
                updatedAt: "9/1/2020, 11:36:33 AM",
                grant: ["read"],
            },
        ],
        comments: [],
        stats: {
            totalEdits: 0,
            totalViews: 7,
            activeComments: 0,
            activeUsers: 1,
        },
        createdAt: "9/1/2020, 11:36:33 AM",
        updatedAt: "9/1/2020, 11:36:33 AM",
        ownerId: new ObjectId("67080b1bc1f55178f0902d77"),
    },
    {
        _id: new ObjectId("67080abb97c1e14ff70913f3"),
        title: "Node.js vs. Deno",
        content:
            "A comparison between Node.js and Deno, exploring the strengths and weaknesses of each.",
        collaborators: [
            {
                userId: new ObjectId("66eae0bd0f6e02824705d72b"),
                createdAt: "9/15/2021, 10:15:00 AM",
                updatedAt: "9/15/2021, 10:15:00 AM",
                grant: ["read", "write"],
            },
        ],
        comments: [],
        stats: {
            totalEdits: 1,
            totalViews: 3,
            activeComments: 0,
            activeUsers: 1,
        },
        createdAt: "9/15/2021, 10:15:00 AM",
        updatedAt: "9/15/2021, 10:15:00 AM",
        ownerId: new ObjectId("66eae0bd0f6e02824705d72b"),
    },
]

const initialComments = [
    {
        _id: new ObjectId("66eae1c30f6e0282470624c7"),
        position: "14:28",
        content: "OK!",
        createdAt: "9/1/2020, 11:36:33 AM",
        documentId: new ObjectId("67080abb97c1e14ff70913f0"),
        resolved: false,
        userId: new ObjectId("66eae0bd0f6e02824705d72a"),
    },
    {
        _id: new ObjectId("66eae1c30f6e0282470624c8"),
        position: "2:15",
        content: "Great article!",
        createdAt: "9/1/2020, 11:40:00 AM",
        documentId: new ObjectId("67080abb97c1e14ff70913f0"),
        resolved: false,
        userId: new ObjectId("66eae0bd0f6e02824705d72b"),
    },
    {
        _id: new ObjectId("66eae1c30f6e0282470624c9"),
        position: "5:20",
        content: "I disagree with some points.",
        createdAt: "9/1/2021, 10:30:00 AM",
        documentId: new ObjectId("67080abb97c1e14ff70913f3"),
        resolved: false,
        userId: new ObjectId("66eae0bd0f6e02824705d72c"),
    },
]

/* eslint-enable */

/**
 * Reset the database.
 *
 * Request Headers:
 *  - `accessToken` (required): The access token of the user.
 *
 * Example API call:
 * POST /api/reset
 *
 * @async
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends a success message if the user was created, or an error message if not.
 */
export const post = [
    adminJWT(),
    async (req, res) => {
        try {
            const { db } = await getDb()

            await resetCollection(db, "documents", initialDocuments)
            await resetCollection(db, "users", initialUsers)
            await resetCollection(db, "comments", initialComments)

            return res.status(200).send("All collections were reset.")
        } catch (e) {
            console.error(e)
            return res.status(500).send("Internal Server Error")
        }
    },
]
