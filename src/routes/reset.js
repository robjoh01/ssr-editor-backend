"use strict"

import { ObjectId } from "mongodb"
import { getDb, resetCollection } from "@utils/database.js"
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
                    attributes: {
                        bold: true,
                    },
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
                    insert: ". Och är en av Sveriges enda högskolekurser i JavaScript ramverk. Källkoden till denna webbplats finns på ",
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
                    insert: "-applikation tillsammans två och två. Vi tar en titt på hur detta samarbetet kan bli optimalt och vilka tekniker och verktyg som finns för att samarbeta om vidareutveckling av kod.\n\n",
                },
            ],
        },
        collaborators: [
            {
                userId: new ObjectId("66eae0bd0f6e02824705d72a"),
                canWrite: true,
            },
            {
                userId: new ObjectId("67080b1bc1f55178f0902d77"),
                canWrite: true,
            },
            {
                userId: new ObjectId("66eae0bd0f6e02824705d72b"),
                canWrite: false,
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
        content: {
            ops: [
                {
                    attributes: {
                        bold: true,
                    },
                    insert: "React.js is a powerful JavaScript library for building user interfaces.",
                },
                {
                    attributes: {
                        header: 1,
                    },
                    insert: "\n",
                },
                {
                    insert: "\nIt allows developers to create large web applications that can change data, without reloading the page. Its key feature is the ability to manage components efficiently.\n\nLearn more about React's core concepts in this ",
                },
                {
                    attributes: {
                        link: "https://react.dev/learn",
                    },
                    insert: "official documentation.",
                },
            ],
        },
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
        content: {
            ops: [
                {
                    attributes: {
                        bold: true,
                    },
                    insert: "Express.js is a fast, unopinionated, minimalist web framework for Node.js.",
                },
                {
                    attributes: {
                        header: 1,
                    },
                    insert: "\n",
                },
                {
                    insert: "\nIt is designed for building web applications and APIs. Its robust set of features makes it ideal for web development.\n\nExplore more about Express.js in this comprehensive guide: ",
                },
                {
                    attributes: {
                        link: "https://expressjs.com/en/starter/installing.html",
                    },
                    insert: "Getting Started with Express.js",
                },
                {
                    insert: "\n\n",
                },
                {
                    attributes: {
                        italic: true,
                    },
                    insert: "You can watch this informative video on Express.js here",
                },
                {
                    insert: ": ",
                },
                {
                    attributes: {
                        link: "www.youtube.com/watch?v=CnH3kAXSrmU",
                    },
                    insert: "Express Crash Course",
                },
                {
                    insert: "\n\n",
                },
                {
                    insert: {
                        video: "https://www.youtube.com/embed/CnH3kAXSrmU?showinfo=0",
                    },
                },
                {
                    insert: "\n",
                },
            ],
        },
        collaborators: [
            {
                userId: new ObjectId("66eae0bd0f6e02824705d72a"),
                canWrite: true,
            },
            {
                userId: new ObjectId("66eae0bd0f6e02824705d72c"),
                canWrite: false,
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
        title: "Report a bug",
        content: {
            ops: [
                {
                    attributes: {
                        bold: true,
                    },
                    insert: "Reporting a bug is an essential part of the development process.",
                },
                {
                    attributes: {
                        header: 1,
                    },
                    insert: "\n",
                },
                {
                    insert: "\nEffectively reporting bugs is crucial for ensuring a smooth development process. In this article, we will go through the steps to identify and report a bug correctly.\n\nStep 1: Identify the Bug",
                },
                {
                    attributes: {
                        header: 2,
                    },
                    insert: "\n",
                },
                {
                    insert: "Before reporting a bug, make sure you have identified it correctly. Look for:\n",
                },
                {
                    attributes: {
                        bold: true,
                    },
                    insert: "Unexpected Behavior",
                },
                {
                    insert: ": Is the application not functioning as expected? Document what you expected versus what actually happened.",
                },
                {
                    attributes: {
                        list: "bullet",
                    },
                    insert: "\n",
                },
                {
                    attributes: {
                        bold: true,
                    },
                    insert: "Error Messages",
                },
                {
                    insert: ": Pay attention to any error messages or warnings. Note them down, as they can be helpful for diagnostics.",
                },
                {
                    attributes: {
                        list: "bullet",
                    },
                    insert: "\n",
                },
                {
                    attributes: {
                        bold: true,
                    },
                    insert: "Environment",
                },
                {
                    insert: ": Note in which environment the bug occurred (e.g., production, staging, development).",
                },
                {
                    attributes: {
                        list: "bullet",
                    },
                    insert: "\n",
                },
                {
                    attributes: {
                        header: 2,
                    },
                    insert: "\n",
                },
                {
                    insert: "Step 2: Gather Information",
                },
                {
                    attributes: {
                        header: 2,
                    },
                    insert: "\n",
                },
                {
                    insert: "Collect as much information as possible about the bug:\n",
                },
                {
                    attributes: {
                        bold: true,
                    },
                    insert: "Steps to reproduce",
                },
                {
                    insert: ": Clarify the steps taken before the bug occurred. This helps the development team to reproduce the issue.",
                },
                {
                    attributes: {
                        list: "bullet",
                    },
                    insert: "\n",
                },
                {
                    attributes: {
                        bold: true,
                    },
                    insert: "Screenshots/Screen Recordings",
                },
                {
                    insert: ": Visual aids can be very helpful. Consider including images or videos of the bug. You can use tools like ",
                },
                {
                    attributes: {
                        color: "#2915a3",
                        link: "https://www.loom.com/",
                    },
                    insert: "Loom",
                },
                {
                    insert: " for screen recordings.",
                },
                {
                    attributes: {
                        list: "bullet",
                    },
                    insert: "\n",
                },
                {
                    attributes: {
                        bold: true,
                    },
                    insert: "System Information",
                },
                {
                    insert: ": Include details such as browser version, operating system, and device type. This information can help with diagnostics.",
                },
                {
                    attributes: {
                        list: "bullet",
                    },
                    insert: "\n",
                },
                {
                    attributes: {
                        header: 2,
                    },
                    insert: "\n",
                },
                {
                    insert: "Step 3: Report the Bug",
                },
                {
                    attributes: {
                        header: 2,
                    },
                    insert: "\n",
                },
                {
                    insert: "Once you have all the information, report the bug to your team or the appropriate platform (e.g., JIRA, GitHub, etc.). Be sure to include:\n",
                },
                {
                    attributes: {
                        bold: true,
                    },
                    insert: "Title",
                },
                {
                    insert: ": A brief and descriptive title for the bug.",
                },
                {
                    attributes: {
                        list: "bullet",
                    },
                    insert: "\n",
                },
                {
                    attributes: {
                        bold: true,
                    },
                    insert: "Description",
                },
                {
                    insert: ": Summarize the issue, including all gathered information. Use bullet points for clarity.",
                },
                {
                    attributes: {
                        list: "bullet",
                    },
                    insert: "\n",
                },
                {
                    attributes: {
                        bold: true,
                    },
                    insert: "Links",
                },
                {
                    insert: ": Provide links to relevant resources, such as project documentation or the bug reporting system.",
                },
                {
                    attributes: {
                        list: "bullet",
                    },
                    insert: "\n",
                },
                {
                    attributes: {
                        header: 2,
                    },
                    insert: "\n",
                },
                {
                    insert: "Step 4: Follow Up",
                },
                {
                    attributes: {
                        header: 2,
                    },
                    insert: "\n",
                },
                {
                    insert: "After reporting the bug, keep an eye on any updates or requests for further information from the development team. Being responsive can help expedite the resolution of the issue.\n",
                },
            ],
        },
        collaborators: [
            {
                userId: new ObjectId("66eae0bd0f6e02824705d72a"),
                canWrite: true,
            },
            {
                userId: new ObjectId("67080b1bc1f55178f0902d77"),
                canWrite: true,
            },
            {
                userId: new ObjectId("66eae0bd0f6e02824705d72c"),
                canWrite: true,
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
 *  - `Authorization` (required): The access token of the user.
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
            return res.status(500).send("Internal Server Error")
        }
    },
]
