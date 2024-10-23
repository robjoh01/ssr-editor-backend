/* eslint-disable */

"use strict"

import { ObjectId } from "mongodb"
import { getDb } from "@utils/database.js"
import { validateCommentPosition } from "@utils/regex.js"

import validator from "validator"

const resolvers = {
    Query: {
        async comments(parent, args, context) {
            if (!context.isValid) throw new Error("Invalid user")

            if (!context.user.isAdmin)
                throw new Error(
                    "Access denied! Not an admin. If you want to accees your comments, try query 'myself.ownedDocuments.comments' or 'myself.sharedDocuments.comments' instead."
                )

            const { db } = await getDb() // Get DB connection

            try {
                return await db.collection("comments").find().toArray()
            } catch (err) {
                console.error(err)
                return []
            } finally {
                await db.client.close()
            }
        },

        async comment(parent, args, context) {
            if (!context.isValid) throw new Error("Invalid user")

            if (!context.user.isAdmin)
                throw new Error(
                    "Access denied! Not an admin. If you want to accees your comments, try query 'myself.ownedDocuments.comments' or 'myself.sharedDocuments.comments' instead."
                )

            const { id } = args

            if (!id) throw new Error("Missing id")
            if (!ObjectId.isValid(id)) throw new Error("Invalid id")

            const { db } = await getDb()

            try {
                // Fetch the comment
                return await db
                    .collection("comments")
                    .findOne({ _id: new ObjectId(id) })
            } catch (err) {
                console.error(err)
                return null
            } finally {
                await db.client.close()
            }
        },

        async documents(parent, args, context) {
            if (!context.isValid) throw new Error("Invalid user")

            if (!context.user.isAdmin)
                throw new Error(
                    "Access denied! Not an admin. If you want to accees your documents, try query 'myself.ownedDocuments' or 'myself.sharedDocuments' instead."
                )

            const { db } = await getDb()

            try {
                return await db.collection("documents").find().toArray()
            } catch (err) {
                console.error(err)
                return []
            } finally {
                await db.client.close()
            }
        },

        async document(parent, args, context) {
            if (!context.isValid) throw new Error("Invalid user")

            if (!context.user.isAdmin)
                throw new Error(
                    "Access denied! Not an admin. If you want to accees your documents, try query 'myself.ownedDocuments' or 'myself.sharedDocuments' instead."
                )

            const { id } = args

            if (!id) throw new Error("Missing id")
            if (!ObjectId.isValid(id)) throw new Error("Invalid id")

            const { db } = await getDb()

            try {
                // Fetch the document
                return await db
                    .collection("documents")
                    .findOne({ _id: new ObjectId(id) })
            } catch (err) {
                console.error(err)
                return null
            } finally {
                await db.client.close()
            }
        },

        async users(parent, args, context) {
            if (!context.isValid) throw new Error("Invalid user")

            if (!context.user.isAdmin)
                throw new Error(
                    "Access denied! Not an admin. If you want to accees your documents, try query 'myself' instead."
                )

            const { db } = await getDb()

            try {
                return await db.collection("users").find().toArray()
            } catch (err) {
                console.error(err)
                return []
            } finally {
                await db.client.close()
            }
        },

        async user(parent, args, context) {
            if (!context.isValid) throw new Error("Invalid user")

            if (!context.user.isAdmin)
                throw new Error(
                    "Access denied! Not an admin. If you want to accees your documents, try query 'myself' instead."
                )

            const { id } = args

            if (!id) throw new Error("Missing id")
            if (!ObjectId.isValid(id)) throw new Error("Invalid id")

            const { db } = await getDb()

            try {
                // Fetch the user
                return await db
                    .collection("users")
                    .findOne({ _id: new ObjectId(id) })
            } catch (err) {
                console.error(err)
                return null
            } finally {
                await db.client.close()
            }
        },

        async usersByEmail(parent, args, context) {
            if (!context.isValid) throw new Error("Invalid user")

            const { email } = args

            if (!email) throw new Error("Missing email")
            if (!validator.isEmail(email)) throw new Error("Invalid email")

            const { db } = await getDb()

            try {
                // Fetch the users
                return await db.collection("users").find({ email }).toArray()
            } catch (err) {
                console.error(err)
                return []
            } finally {
                await db.client.close()
            }
        },

        async userByEmail(parent, args, context) {
            if (!context.isValid) throw new Error("Invalid user")

            const { email } = args

            if (!email) throw new Error("Missing email")
            if (!validator.isEmail(email)) throw new Error("Invalid email")

            const { db } = await getDb()

            try {
                // Fetch the user
                return await db.collection("users").findOne({ email })
            } catch (err) {
                console.error(err)
                return null
            } finally {
                await db.client.close()
            }
        },

        async myself(parent, args, context) {
            if (!context.isValid) throw new Error("Invalid user")

            const { db } = await getDb()

            try {
                return await db
                    .collection("users")
                    .findOne({ _id: new ObjectId(context.user._id) })
            } catch (err) {
                console.error(err)
                return null
            } finally {
                await db.client.close()
            }
        },
    },
    Mutation: {
        async createComment(parent, args, context) {
            if (!context.user.isAdmin)
                throw new Error("Access denied! Not an admin.")

            const { position, content } = args

            if (!validateCommentPosition(position))
                throw new Error("Invalid position format.")

            const { db } = await getDb()

            try {
                await db.collection("comments").insertOne({ position, content })
            } catch (err) {
                console.error(err)
            }
        },

        async updateComment(parent, args, context) {
            if (!context.user.isAdmin)
                throw new Error("Access denied! Not an admin.")

            const { id, content = null } = args

            if (!ObjectId.isValid(id)) throw new Error("Invalid id")

            const { db } = await getDb()

            try {
                await db
                    .collection("comments")
                    .updateOne({ _id: new ObjectId(id) }, { $set: { content } })
            } catch (err) {
                console.error(err)
            }
        },

        async deleteComment(parent, args, context) {
            if (!context.user.isAdmin)
                throw new Error("Access denied! Not an admin.")

            const { id } = args

            if (!ObjectId.isValid(id)) throw new Error("Invalid id")

            const { db } = await getDb()

            try {
                await db
                    .collection("comments")
                    .deleteOne({ _id: new ObjectId(id) })
            } catch (err) {
                console.error(err)
            }
        },

        async createDocument(parent, args, context) {
            if (!context.user.isAdmin)
                throw new Error("Access denied! Not an admin.")

            const { db } = await getDb()

            try {
                await db.collection("documents").insertOne(args)
            } catch (err) {
                console.error(err)
            }
        },

        async updateDocument(parent, args, context) {
            if (!context.user.isAdmin)
                throw new Error("Access denied! Not an admin.")

            const { id, title = null, content = null } = args

            if (!ObjectId.isValid(id)) throw new Error("Invalid id")

            const { db } = await getDb()

            try {
                await db
                    .collection("documents")
                    .updateOne(
                        { _id: new ObjectId(id) },
                        { $set: { title, content } }
                    )
            } catch (err) {
                console.error(err)
            }
        },

        async deleteDocument(parent, args, context) {
            if (!context.user.isAdmin)
                throw new Error("Access denied! Not an admin.")

            const { id } = args

            if (!ObjectId.isValid(id)) throw new Error("Invalid id")

            const { db } = await getDb()

            try {
                await db
                    .collection("documents")
                    .deleteOne({ _id: new ObjectId(id) })
            } catch (err) {
                console.error(err)
            }
        },

        async createUser(parent, args, context) {
            if (!context.user.isAdmin)
                throw new Error("Access denied! Not an admin.")

            const { name, email, password } = args

            if (!validator.isEmail(email)) throw new Error("Invalid email")

            if (!validator.isStrongPassword(password))
                throw new Error("Invalid password")

            const { db } = await getDb()

            try {
                await db
                    .collection("users")
                    .insertOne({ name, email, password })
            } catch (err) {
                console.error(err)
            }
        },

        async updateUser(parent, args, context) {
            if (!context.user.isAdmin)
                throw new Error("Access denied! Not an admin.")

            const {
                id,
                name = null,
                email = null,
                password = null,
                profilePicture = null,
                stats = null,
            } = args

            if (!ObjectId.isValid(id)) throw new Error("Invalid id")

            if (email && !validator.isEmail(email))
                throw new Error("Invalid email")

            if (password && !validator.isStrongPassword(password))
                throw new Error("Invalid password")

            const { db } = await getDb()

            try {
                await db.collection("users").updateOne(
                    { _id: new ObjectId(id) },
                    {
                        $set: {
                            name,
                            email,
                            password,
                            profilePicture,
                            stats,
                        },
                    }
                )
            } catch (err) {
                console.error(err)
            }
        },

        async deleteUser(parent, args, context) {
            if (!context.user.isAdmin)
                throw new Error("Access denied! Not an admin.")

            const { id } = args

            if (!ObjectId.isValid(id)) throw new Error("Invalid id")

            const { db } = await getDb()

            try {
                await db
                    .collection("users")
                    .deleteOne({ _id: new ObjectId(id) })
            } catch (err) {
                console.error(err)
            }
        },

        async updateMyself(parent, args, context) {
            const { db } = await getDb()

            try {
                await db
                    .collection("users")
                    .updateOne(
                        { _id: new ObjectId(context.user._id) },
                        { $set: args }
                    )
            } catch (err) {
                console.error(err)
            }
        },

        async deleteMyself(parent, args, context) {
            const { db } = await getDb()

            try {
                await db
                    .collection("users")
                    .deleteOne({ _id: new ObjectId(context.user._id) })
            } catch (err) {
                console.error(err)
            }
        },
    },
    Comment: {
        id: ({ _id }) => _id,

        async document(parent, args, context) {
            const { documentId } = parent // Assuming 'documentId' is a field in your comment

            if (!documentId) return null // Return null if documentId is missing

            const { db } = await getDb() // Get DB connection

            try {
                // Fetch the document details based on documentId
                return await db
                    .collection("documents")
                    .findOne({ _id: new ObjectId(documentId) })
            } catch (err) {
                console.error(err)
                return null // Return null on error
            } finally {
                await db.client.close()
            }
        },

        async user(parent, args, context) {
            const { userId } = parent // Assuming 'userId' is a field in your comment

            if (!userId) return null // Return null if userId is missing

            const { db } = await getDb() // Get DB connection

            try {
                // Fetch the user details based on userId
                return await db
                    .collection("users")
                    .findOne({ _id: new ObjectId(userId) })
            } catch (err) {
                console.error(err)
                return null // Return null on error
            } finally {
                await db.client.close()
            }
        },
    },
    Document: {
        id: ({ _id }) => _id,

        async owner(parent, args, context) {
            const { ownerId } = parent // Assuming 'ownerId' is a field in your document

            if (!ownerId) return null // Return null if ownerId is missing

            const { db } = await getDb() // Get DB connection

            try {
                // Fetch the owner details based on ownerId
                const user = await db
                    .collection("users")
                    .findOne({ _id: new ObjectId(ownerId) })

                // If the user is an admin, return the owner
                if (context.user.isAdmin) return user

                return {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                }
            } catch (err) {
                console.error(err)
                return null // Return null on error
            } finally {
                await db.client.close()
            }
        },

        async comments(parent, args, context) {
            const { db } = await getDb()

            try {
                return await db
                    .collection("comments")
                    .find({ documentId: new ObjectId(parent._id) })
                    .toArray()
            } catch (err) {
                console.error(err)
                return []
            } finally {
                await db.client.close()
            }
        },
    },
    DocumentCollaborator: {
        async user(parent, args, context) {
            const { userId } = parent // Assuming 'userId' is a field in your document collaborator

            if (!userId) return null // Return null if userId is missing

            const { db } = await getDb() // Get DB connection

            try {
                // Fetch the user details based on userId
                const user = await db
                    .collection("users")
                    .findOne({ _id: new ObjectId(userId) })

                // If the user is an admin, return the owner
                if (context.user.isAdmin) return user

                return {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                }
            } catch (err) {
                console.error(err)
                return null // Return null on error
            } finally {
                await db.client.close()
            }
        },
    },
    User: {
        id: ({ _id }) => _id,

        async ownedDocuments(parent, args, context) {
            const { db } = await getDb()

            try {
                return await db
                    .collection("documents")
                    .find({ ownerId: new ObjectId(context.user._id) })
                    .toArray()
            } catch (err) {
                console.error(err)
                return []
            } finally {
                await db.client.close()
            }
        },

        async sharedDocuments(parent, args, context) {
            const { db } = await getDb()

            try {
                return await db
                    .collection("documents")
                    .find({
                        collaborators: {
                            $elemMatch: {
                                userId: new ObjectId(context.user._id),
                            },
                        },
                    })
                    .toArray()
            } catch (err) {
                console.error(err)
                return []
            } finally {
                await db.client.close()
            }
        },

        async comments(parent, args, context) {
            const { db } = await getDb()

            try {
                return await db
                    .collection("comments")
                    .find({ userId: new ObjectId(context.user._id) })
                    .toArray()
            } catch (err) {
                console.error(err)
                return []
            } finally {
                await db.client.close()
            }
        },
    },
}

export default resolvers
