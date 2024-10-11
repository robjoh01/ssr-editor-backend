"use strict"

import { getDb, resetCollection } from "@/utils/database.js"
import { ObjectId } from "mongodb"

const initialUsers = [
    {
        _id: new ObjectId("66eae0bd0f6e02824705d72a"),
        email: "bYxkM@example.com",
        name: "Robin Johannesson",
        documents: [new ObjectId("67080abb97c1e14ff70913f0")],
        stats: {
            totalDocuments: 1,
            totalEdits: 5,
            totalComments: 1,
        },
        createdAt: "9/1/2020, 11:36:33 AM",
        lastLogin: "9/1/2020, 11:36:33 AM",
        passwordHash: "hashedPassword1",
        profilePicture: "url_to_profile_pic_1",
    },
    {
        _id: new ObjectId("67080b1bc1f55178f0902d77"),
        email: "kZ8hW@example.com",
        name: "Moawya Mearza",
        documents: [new ObjectId("67080abb97c1e14ff70913f0")],
        stats: {
            totalDocuments: 1,
            totalEdits: 2,
            totalComments: 0,
        },
        createdAt: "9/1/2020, 11:36:33 AM",
        lastLogin: "9/1/2020, 11:36:33 AM",
        passwordHash: "hashedPassword2",
        profilePicture: "url_to_profile_pic_2",
    },
    {
        _id: new ObjectId("66eae0bd0f6e02824705d72b"),
        email: "alice@example.com",
        name: "Alice Andersson",
        documents: [new ObjectId("67080abb97c1e14ff70913f1")],
        stats: {
            totalDocuments: 1,
            totalEdits: 3,
            totalComments: 2,
        },
        createdAt: "9/1/2021, 10:15:00 AM",
        lastLogin: "9/15/2021, 2:30:00 PM",
        passwordHash: "hashedPassword3",
        profilePicture: "url_to_profile_pic_3",
    },
    {
        _id: new ObjectId("66eae0bd0f6e02824705d72c"),
        email: "bob@example.com",
        name: "Bob Bergström",
        documents: [],
        stats: {
            totalDocuments: 0,
            totalEdits: 0,
            totalComments: 0,
        },
        createdAt: "9/1/2022, 11:00:00 AM",
        lastLogin: "9/1/2023, 11:00:00 AM",
        passwordHash: "hashedPassword4",
        profilePicture: "url_to_profile_pic_4",
    },
]

const initialDocuments = [
    {
        _id: new ObjectId("67080abb97c1e14ff70913f0"),
        title: "Lorem Ipsum",
        content: "Dolor sit amet",
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

// Reset all collections
export const post = async (req, res) => {
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
}
