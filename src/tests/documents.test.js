"use strict"

process.env.NODE_ENV = "test"

// TODO: Add test cases for creating, reading, updating and removing documents

// https://medium.com/@asemiloore/nodejs-testing-with-mocha-and-code-coverage-with-nyc-9d1d6e428ac1

import { use, expect } from "chai"
import chaiAsPromised from "chai-as-promised"

// Use chai-as-promised
use(chaiAsPromised)

import { ObjectId } from "mongodb"

import sinon from "sinon"
import database from "../database.mjs"
import documents from "../documents.js"

const sampleData = [
    {
        _id: new ObjectId("64d4f734f25b650f3c9e8db0"),
        title: "Document 1",
        content: "Content 1",
        created_at: new Date("2020-08-18"),
        updated_at: new Date(),
        owner_id: new ObjectId("64d4f734f25b650f3c9e8db2"),
        is_locked: false,
    },
    {
        _id: new ObjectId("64d4f734f25b650f3c9e8db9"),
        title: "Document 2",
        content: "Content 2",
        created_at: new Date("2001-01-01"),
        updated_at: new Date("2024-09-29"),
        owner_id: new ObjectId("64d4f734f25b650f3c9e8db3"),
        is_locked: true,
    },
]

describe("Documents Service", () => {
    let getInstanceStub

    beforeEach(() => {
        getInstanceStub = sinon.stub(database, "getInstance").resolves({
            client: { close: sinon.stub() },
            collection: {
                find: sinon.stub().returns({
                    toArray: sinon.stub().resolves(sampleData),
                }),
                findOne: sinon.stub().callsFake(async (query) => {
                    const foundDoc = sampleData.find((doc) =>
                        doc._id.equals(query._id)
                    )
                    return foundDoc ? foundDoc : {}
                }),
                updateOne: sinon.stub().callsFake(async (query, update) => {
                    const doc = sampleData.find((doc) =>
                        doc._id.equals(query._id)
                    )
                    if (doc) {
                        const updateFields = update.$set
                        Object.assign(doc, updateFields)
                        return { modifiedCount: 1 } // Simulate a successful update
                    }

                    return { modifiedCount: 0 } // No document found to update
                }),
                findOne: sinon.stub().callsFake(async (query) => {
                    return (
                        sampleData.find((doc) => doc._id.equals(query._id)) ||
                        {}
                    )
                }),
                insertOne: sinon.stub().callsFake(async (newDoc) => {
                    const newDocument = {
                        _id: new ObjectId(), // Generate a new ObjectId
                        ...newDoc,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }
                    sampleData.push(newDocument) // Add the new document to the sample data
                    return documents.reformat(newDocument)
                }),
                deleteOne: sinon.stub().callsFake(async (query) => {
                    const index = sampleData.findIndex((doc) =>
                        doc._id.equals(query._id)
                    )
                    if (index !== -1) {
                        sampleData.splice(index, 1) // Remove the document from sample data
                        return { deletedCount: 1 } // Simulate a successful deletion
                    }
                    return { deletedCount: 0 } // No document found to delete
                }),
                deleteMany: sinon.stub().callsFake(async (query) => {
                    // Determine which documents to delete based on the query
                    const initialCount = sampleData.length
                    sampleData = sampleData.filter(
                        (doc) => !doc._id.equals(query._id)
                    )

                    // Calculate how many documents were deleted
                    const deletedCount = initialCount - sampleData.length

                    return { deletedCount } // Return the count of deleted documents
                }),
            },
        })
    })

    it("should retrieve all documents", async () => {
        // Retrieve all documents
        const result = await documents.getAll()

        // Expect the result to be an array of documents
        expect(result).to.be.an("array").with.lengthOf(2)

        // Expect the result to contain the expected documents
        expect(result[0]).to.have.property("title", "Document 1")
        expect(result[1]).to.have.property("title", "Document 2")

        // Ensure the getInstance function was called once during the test
        expect(getInstanceStub.calledOnce).to.be.true
    })

    it("should retrieve a document by ID", async () => {
        // Retrieve the document
        const result = await documents.get("64d4f734f25b650f3c9e8db0")

        // Expect the result to be the expected document
        expect(result).to.be.an("object")
        expect(result).to.have.property("content", "Content 1")

        // Ensure the getInstance function was called once during the test
        expect(getInstanceStub.calledOnce).to.be.true
    })

    it("should return an empty object when retrieving a non-existent document", async () => {
        // Expect the get method to be rejected with an Error
        await expect(documents.get(undefined)).to.be.rejectedWith(
            Error,
            "Missing id"
        )

        // Ensure the getInstance function was not called during the test
        expect(getInstanceStub.calledOnce).to.be.false
    })

    it("should create a new document with valid options", async () => {
        // Create a new document
        const result = await documents.create({
            title: "Hello World",
            content: "Lorem Ipsum",
            ownerId: "64d4f734f25b650f3c9e8db2",
        })

        // Expect the result to be an object
        expect(result).to.be.an("object")
        expect(result).to.have.property("content", "Lorem Ipsum")
        expect(result).to.have.property("ownerId", "64d4f734f25b650f3c9e8db2")

        // Ensure the getInstance function was called once during the test
        expect(getInstanceStub.calledOnce).to.be.true
    })

    it("should handle missing required fields during document creation", async () => {
        // Expect the create method to be rejected with an Error
        await expect(
            documents.create({
                title: undefined,
                content: undefined,
                ownerId: undefined,
            })
        ).to.be.rejectedWith(Error, "Missing required fields")

        // Ensure the getInstance function was not called during the test
        expect(getInstanceStub.calledOnce).to.be.false
    })

    it("should update an existing document", async () => {
        // Update the existing document
        const wasSuccessful = await documents.update(
            "64d4f734f25b650f3c9e8db0",
            {
                title: "Hello World",
                content: "Lorem Ipsum",
            }
        )

        // Expect the update to be successful
        expect(wasSuccessful).to.be.true

        // Retrieve the updated document to verify the changes
        const result = await documents.get("64d4f734f25b650f3c9e8db0")

        // Check that the document has been updated with the new properties
        expect(result).to.have.property("title", "Hello World")
        expect(result).to.have.property("content", "Lorem Ipsum")

        // Ensure the getInstance function was called twice during the test
        expect(getInstanceStub.calledTwice).to.be.true
    })

    it("should handle updating a document with an invalid ID", async () => {
        // Expect the update method to be rejected with an Error
        await expect(
            documents.update(undefined, {
                title: "Hello World",
            })
        ).to.be.rejectedWith(Error, "Missing id")

        // Ensure the getInstance function was not called during the test
        expect(getInstanceStub.calledOnce).to.be.false
    })

    it("should delete an existing document by ID", async () => {
        // Delete the document
        const result = await documents.delete("64d4f734f25b650f3c9e8db0")

        // Expect the delete to be successful
        expect(result).to.be.contains({ deletedCount: 1 })

        // Ensure the getInstance function was called once during the test
        expect(getInstanceStub.calledOnce).to.be.true
    })

    it("should handle deletion of a non-existent document", async () => {
        // Expect the delete method to be rejected with an Error
        await expect(documents.delete(undefined)).to.be.rejectedWith(
            Error,
            "Missing id"
        )

        // Ensure the getInstance function was not called during the test
        expect(getInstanceStub.calledOnce).to.be.false
    })

    // it("should reset the document collection and insert initial documents", async () => {
    //     // Reset the collection
    //     await documents.reset()

    //     // Expect the reset to be successful
    //     expect(sampleData).to.be.an("array").with.lengthOf(2)

    //     // Expect the insertMany method to be called with the initialDocuments
    //     expect(db.collection.insertMany.calledWith(initialDocuments)).to.be.true

    //     // Ensure the getInstance function was called once during the test
    //     expect(getInstanceStub.calledOnce).to.be.true
    // })

    afterEach(() => {
        sinon.restore()
    })
})
