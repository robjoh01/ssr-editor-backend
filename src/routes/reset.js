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
        stats: {
            totalDocuments: 1,
            totalEdits: 5,
            totalComments: 1,
        },
        createdAt: "2017-10-31T02:15:00+02:00",
        updatedAt: "2017-10-31T02:15:00+02:00",
        lastLogin: "2024-10-22T21:33:43+02:00",
        passwordHash:
            "$2a$12$.TFOYazokOS6p6Ijm/ud5.RbT7xqGwb1PfkKWOrG4b/kuD9rxkr.a",
        profilePicture: "url_to_profile_pic_1",
    },
    {
        _id: new ObjectId("67080b1bc1f55178f0902d77"),
        isAdmin: true,
        email: "kZ8hW@example.com",
        name: "Moawya Mearza",
        stats: {
            totalDocuments: 1,
            totalEdits: 2,
            totalComments: 0,
        },
        createdAt: "2018-07-09T11:49:11+02:00",
        updatedAt: "2018-07-09T11:49:11+02:00",
        lastLogin: "2024-10-22T21:33:43+02:00",
        passwordHash:
            "$2a$12$fI7ELlrodWaUIo2aLAbV6.E01w2zLwaNnhj/mDgJupXoV/nWoj2K6",
        profilePicture: "url_to_profile_pic_2",
    },
    {
        _id: new ObjectId("66eae0bd0f6e02824705d72b"),
        isAdmin: false,
        email: "alice@example.com",
        name: "Alice Andersson",
        stats: {
            totalDocuments: 1,
            totalEdits: 3,
            totalComments: 2,
        },
        createdAt: "2014-11-24T08:22:43+01:00",
        updatedAt: "2014-11-24T08:22:43+01:00",
        lastLogin: "2014-11-24T08:22:43+01:00",
        passwordHash:
            "$2a$12$N.5uCXsE1nelgBNfNXWiGu7PNxprgjp5Xb4vbRBstr8N260yHa.8e",
        profilePicture: "url_to_profile_pic_3",
    },
    {
        _id: new ObjectId("66eae0bd0f6e02824705d72c"),
        isAdmin: false,
        email: "bob@example.com",
        name: "Bob Bergström",
        stats: {
            totalDocuments: 0,
            totalEdits: 0,
            totalComments: 0,
        },
        createdAt: "2020-11-03T13:02:01",
        updatedAt: "2020-11-03T13:02:01",
        lastLogin: "2020-11-03T13:02:01",
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
                grant: ["read", "write"],
            },
            {
                userId: new ObjectId("67080b1bc1f55178f0902d77"),
                grant: ["read", "write"],
            },
            {
                userId: new ObjectId("66eae0bd0f6e02824705d72b"),
                grant: ["read"],
            },
        ],
        stats: {
            totalEdits: 0,
            totalViews: 10,
            activeComments: 1,
            activeUsers: 2,
        },
        createdAt: "2019-08-22T20:00:00+02:00",
        updatedAt: "2019-08-22T20:00:00+02:00",
        ownerId: new ObjectId("66eae0bd0f6e02824705d72c"),
    },
    {
        _id: new ObjectId("67080abb97c1e14ff70913f1"),
        title: "React.js",
        content: "Why use React.js?",
        collaborators: [],
        stats: {
            totalEdits: 0,
            totalViews: 5,
            activeComments: 0,
            activeUsers: 1,
        },
        createdAt: "2020-09-01T11:36:33+02:00",
        updatedAt: "2020-09-01T11:36:33+02:00",
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
                grant: ["read", "write"],
            },
            {
                userId: new ObjectId("66eae0bd0f6e02824705d72c"),
                grant: ["read"],
            },
        ],
        stats: {
            totalEdits: 0,
            totalViews: 7,
            activeComments: 0,
            activeUsers: 1,
        },
        createdAt: "2023-05-20T14:00:00+02:00",
        updatedAt: "2023-05-20T14:00:00+02:00",
        ownerId: new ObjectId("67080b1bc1f55178f0902d77"),
    },
    {
        _id: new ObjectId("67080abb97c1e14ff70913f3"),
        title: "Node.js vs. Deno",
        content:
            "A comparison between Node.js and Deno, exploring the strengths and weaknesses of each.",
        collaborators: [
            {
                userId: new ObjectId("66eae0bd0f6e02824705d72a"),
                grant: ["read", "write"],
            },
            {
                userId: new ObjectId("67080b1bc1f55178f0902d77"),
                grant: ["read", "write"],
            },
            {
                userId: new ObjectId("66eae0bd0f6e02824705d72c"),
                grant: ["read", "write"],
            },
        ],
        stats: {
            totalEdits: 1,
            totalViews: 3,
            activeComments: 0,
            activeUsers: 1,
        },
        createdAt: "2005-01-01T20:00:00+01:00",
        updatedAt: "2005-01-01T20:00:00+01:00",
        ownerId: new ObjectId("66eae0bd0f6e02824705d72b"),
    },
]

const initialComments = [
    {
        _id: new ObjectId("66eae1c30f6e0282470624c7"),
        position: "14:28",
        content: "OK!",
        resolved: false,
        createdAt: "2021-10-05T00:00:00+02:00",
        updatedAt: "2021-10-05T00:00:00+02:00",
        documentId: new ObjectId("67080abb97c1e14ff70913f0"),
        userId: new ObjectId("66eae0bd0f6e02824705d72a"),
    },
    {
        _id: new ObjectId("66eae1c30f6e0282470624c8"),
        position: "2:15",
        content: "Great article!",
        resolved: false,
        createdAt: "2021-10-30T13:00:00+02:00",
        updatedAt: "2021-10-30T13:00:00+02:00",
        documentId: new ObjectId("67080abb97c1e14ff70913f0"),
        userId: new ObjectId("66eae0bd0f6e02824705d72b"),
    },
    {
        _id: new ObjectId("66eae1c30f6e0282470624c9"),
        position: "5:20",
        content: "I disagree with some points.",
        resolved: false,
        createdAt: "2024-02-14T13:00:00+01:00",
        updatedAt: "2024-02-14T13:00:00+01:00",
        documentId: new ObjectId("67080abb97c1e14ff70913f3"),
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
        } catch (err) {
            console.error(err)
            return res.status(500).send("Internal Server Error")
        }
    },
]
