"use strict"

const typeDefs = `#graphql
    scalar JSON

    type Comment {
        id: ID!

        position: String!
        content: String
        resolved: Boolean

        createdAt: String!
        updatedAt: String!

        document: Document!
        user: User!
    }

    type DocumentCollaborator {
        user: User!
        grant: [String!]!
    }

    type DocumentStats {
        totalEdits: Int!
        totalViews: Int!
        activeComments: Int!
        activeUsers: Int!
    }

    type Document {
        id: ID!

        title: String!
        content: JSON

        collaborators: [DocumentCollaborator!]
        comments: [Comment!]
        stats: DocumentStats!

        createdAt: String!
        updatedAt: String!

        owner: User!
    }

    type UserStats {
        totalDocuments: Int!
        totalEdits: Int!
        totalComments: Int!
    }

    type User {
        id: ID!

        isAdmin: Boolean!

        name: String!
        email: String!
        stats: UserStats!
        profilePicture: String!

        createdAt: String!
        updatedAt: String!
        lastLogin: String!

        comments: [Comment!]
        ownedDocuments: [Document!]
        sharedDocuments: [Document!]
    }

    type Query {
        # Admin only
        comments: [Comment]
        comment(id: ID!): Comment

        # Admin only
        documents: [Document]
        document(id: ID!): Document

        # Admin only
        user(id: ID!): User
        users: [User]

        # Non-admin
        myself: User
    }

    type Mutation {
        # Admin only
        createComment(documentId: ID!, position: String!, content: String!): Comment
        updateComment(id: ID!, content: String!): Comment
        deleteComment(id: ID!): Comment
        
        # Admin only
        createDocument(title: String!, content: JSON): Document
        updateDocument(id: ID!, title: String, content: JSON): Document
        deleteDocument(id: ID!): Document

        # Admin only
        createUser(name: String!, email: String!, password: String!): User
        updateUser(id: ID!, name: String, email: String, password: String, profilePicture: String, stats: JSON): User
        deleteUser(id: ID!): User

        # Non-admin
        updateMyself(name: String, email: String, password: String, profilePicture: String, stats: JSON): User
        deleteMyself: User
    }
`

export default typeDefs
