# API for SSR Editor

## Table of Contents

- [Document](#document)
    - [Create new document](#create-new-document)
    - [Get all document](#get-all-documents)
    - [Get document by ID](#get-document-by-id)
    - [Update document](#update-document)
    - [Delete document](#delete-document)
- [Endpoints](#endpoints)
    - [Help](#help)
    - [Reset](#reset)

### Document

#### Create new document

_Create a new document in the database_

Example URI: `POST` `/api/document/create`

**Request Body:**

| Name | Type | Description | Optional |
| ---- | ---- | ----------- | -------- |
| `title` | `text` | The title of the document | **No** |
| `content` | `text` | The content of the document | **No** |
| `ownerId` | `ObjectId` | The ID of the owner | **No** |
| `collaborators` | `Array` | List of collaborators | **Yes** |
| `comments` | `Array` | List of comments | **Yes** |
| `stats` | `Object` | Document statistics (such as totalEdits, totalViews, activeComments, activeUsers) | **Yes** |

**Responses:**

- **201 Created**: The document was successfully created, and the created document is returned in the response.
- **400 Bad Request**: Missing required parameters (title or content) in the request.
- **500 Internal Server Error**: An unexpected error occurred while trying to create the document.

**Example Response (200 OK):**

```json
{
    "_id": "67080abb97c1e14ff70913f0",
    "title": "Hello World",
    "content": "Lorem Ipsum",
    "collaborators": [
        {
            "userId": "66eae0bd0f6e02824705d72a",
            "createdAt": "9/1/2020, 11:36:33 AM",
            "updatedAt": "9/1/2020, 11:36:33 AM",
            "grant": [
                "read"
            ]
        },
        {
            "userId": "67080b1bc1f55178f0902d77",
            "createdAt": "9/1/2020, 11:36:33 AM",
            "updatedAt": "9/1/2020, 11:36:33 AM",
            "grant": [
                "read"
            ]
        }
    ],
    "comments": [
        "66eae1c30f6e0282470624c7"
    ],
    "stats": {
        "totalEdits": 0,
        "totalViews": 10,
        "activeComments": 1,
        "activeUsers": 2
    },
    "createdAt": "9/1/2020, 11:36:33 AM",
    "updatedAt": "2024-10-11T09:00:19.993Z",
    "ownerId": "66eae0bd0f6e02824705d72c"
}
```

#### Get all documents

_Get list of all documents in the database._

Example URI: `GET` `/api/document/all`

**Query Parameters:**

| Name                  | Type      | Description                                                                                                                               | Optional |
| ----------------------| --------- | ------------------------------------------------------------------------------------------------------------------------------------------|----------|
| `userId`              | `ObjectId`  | Filter by either the `ownerId` or the `collaboratorId`.                                                                                 | **Yes**  |
| `grant`               | `string`  | Comma-separated list of grants (e.g., "read,write"). Filters documents where the specified collaborator has *all* of the listed grants.   | **Yes**  |
| `title`               | `string`  | Search for documents with a title that matches the provided string (case-insensitive).                                                    | **Yes**  |
| `totalViews`          | `number`  | Filter by the total number of views (exact match).                                                                                        | **Yes**  |
| `activeUsers`         | `number`  | Filter by the number of active users on a document (exact match).                                                                         | **Yes**  |
| `sort`                | `string`  | Sort the results based on the following options: `"lastUpdated"`, `"alphabetical"`.                                                       | **Yes**  |

**Responses:**

- **200 OK**: The request was successful, and the list of documents is returned in the response.
- **500 Internal Server Error**: An unexpected error occurred while trying to retrieve the documents.

**Example Response (200 OK):**

```json
[
    {
        "_id": "67080abb97c1e14ff70913f0",
        "title": "Lorem Ipsum",
        "content": "Dolor sit amet",
        "collaborators": [
            {
                "userId": "66eae0bd0f6e02824705d72a",
                "createdAt": "9/1/2020, 11:36:33 AM",
                "updatedAt": "9/1/2020, 11:36:33 AM",
                "grant": [
                    "read"
                ]
            },
            {
                "userId": "67080b1bc1f55178f0902d77",
                "createdAt": "9/1/2020, 11:36:33 AM",
                "updatedAt": "9/1/2020, 11:36:33 AM",
                "grant": [
                    "read"
                ]
            }
        ],
        "comments": [
            "66eae1c30f6e0282470624c7"
        ],
        "stats": {
            "totalEdits": 0,
            "totalViews": 10,
            "activeComments": 1,
            "activeUsers": 2
        },
        "createdAt": "9/1/2020, 11:36:33 AM",
        "updatedAt": "9/1/2020, 11:36:33 AM",
        "ownerId": "66eae0bd0f6e02824705d72c"
    },
    {
        "_id": "67080abb97c1e14ff70913f1",
        "title": "React.js",
        "content": "Why use React.js?",
        "collaborators": [],
        "comments": [],
        "stats": {
            "totalEdits": 0,
            "totalViews": 5,
            "activeComments": 0,
            "activeUsers": 1
        },
        "createdAt": "9/1/2020, 11:36:33 AM",
        "updatedAt": "9/1/2020, 11:36:33 AM",
        "ownerId": "66eae0bd0f6e02824705d72a"
    },
    ...
]
```

#### Get Document by ID

_Get a single document by ID from the database._

Example URI: `GET` `/api/document/:id`

**Request Parameters:**

| Name | Type      | Description             |
| ---- | --------- | ----------------------- |
| `id` | `ObjectId` | The unique ID of the document. |

**Responses:**

- **200 OK**: The document was successfully retrieved. The response body contains the document details.
- **400 Bad Request**: The request is missing required parameters, such as the document ID, or the ID format is invalid.
- **500 Internal Server Error**: The server encountered an error while processing the request. This could be due to a database issue or an unexpected exception.

**Example Response (200 OK):**

```json
{
    "_id": "67080abb97c1e14ff70913f0",
    "title": "Hello World",
    "content": "Lorem Ipsum",
    "collaborators": [
        {
            "userId": "66eae0bd0f6e02824705d72a",
            "createdAt": "9/1/2020, 11:36:33 AM",
            "updatedAt": "9/1/2020, 11:36:33 AM",
            "grant": [
                "read"
            ]
        },
        {
            "userId": "67080b1bc1f55178f0902d77",
            "createdAt": "9/1/2020, 11:36:33 AM",
            "updatedAt": "9/1/2020, 11:36:33 AM",
            "grant": [
                "read"
            ]
        }
    ],
    "comments": [
        "66eae1c30f6e0282470624c7"
    ],
    "stats": {
        "totalEdits": 0,
        "totalViews": 10,
        "activeComments": 1,
        "activeUsers": 2
    },
    "createdAt": "9/1/2020, 11:36:33 AM",
    "updatedAt": "2024-10-11T09:00:19.993Z",
    "ownerId": "66eae0bd0f6e02824705d72c"
}
```

#### Update document

_Update a document in the database_

Example URI: `PUT` `/api/document/:id`

**Request Parameters:**

| Name             | Type       | Description                            | Optional |
| ---------------- | ---------- | -------------------------------------- | -------- |
| `id`             | `ObjectId` | The ID of the document                 | **No**   |

**Query Parameters:**

| Name             | Type       | Description                            | Optional |
| ---------------- | ---------- | -------------------------------------- | -------- |
| `returnDocument` | `boolean`  | Whether to return the updated document | **Yes**  |

**Request Body:**

| Name           | Type      | Description                              | Optional |
| -------------- | --------- | ---------------------------------------- | -------- |
| `title`        | `text`    | The new title of the document            | **Yes**  |
| `content`      | `text`    | The new content of the document          | **Yes**  |
| `ownerId`      | `ObjectId` | The ID of the new owner of the document  | **Yes**  |
| `collaborators`| `Array`   | Updated list of collaborators            | **Yes**  |
| `comments`     | `Array`   | Updated list of comments                 | **Yes**  |
| `stats`        | `Object`  | Updated document statistics (totalEdits, totalViews, activeComments, activeUsers) | **Yes**  |

**Responses:**

- **200 OK**: The document was successfully updated.
- **400 Bad Request**: 
  - Missing ID parameter in the request.
  - No properties provided for update (title, content, ownerId).
- **500 Internal Server Error**: An unexpected error occurred while trying to update the document.

**Example Response (200 OK):**

- **When `returnDocument` is `true`:**

```json
{
    "message": "Document with ID 66f489160f6e0282477688bf was successfully updated.",
    "document": {
        "_id": "66f489160f6e0282477688bf",
        "title": "Updated Title",
        "content": "Updated content",
        "ownerId": "66eae0bd0f6e02824705d72c",
        "collaborators": [],
        "comments": [],
        "stats": {
            "totalEdits": 5,
            "totalViews": 100,
            "activeComments": 2,
            "activeUsers": 3
        },
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-02T00:00:00.000Z"
    }
}
```

**When `returnDocument` is `false`:**

```json
{
    "message": "Document with ID 66f489160f6e0282477688bf was successfully updated."
}
```

#### Delete document

_Delete a document from the database_

Example URI: `DELETE` `/api/document/:id`

**Response:** `200`

**Request Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `id` | `ObjectId` | The ID of the document |

**Responses:**

- **200 OK**: The document was successfully deleted.
- **400 Bad Request**: Missing ID parameter in the request.
- **404 Not Found**:
  - No document found with the provided ID.
  - The delete operation acknowledged, but the document to delete does not exist.
- **500 Internal Server Error**: An unexpected error occurred while trying to delete the document.

**Example Response (200 OK):**

```json
{
    "message": "Document with ID 66f489160f6e0282477688bf was successfully deleted."
}
```

### Endpoints

#### Help

_Get help on the API._

- **Example URI**: `GET` `/api/help`
- **Description**: This endpoint serves the help documentation for the API. It reads a Markdown file, converts it to HTML, and renders it on a page.

**HTTP Response Codes**:
- **200 OK**: The help page was successfully rendered and returned to the client.
- **500 Internal Server Error**: An unexpected error occurred while trying to read the Markdown file or render the help page.

#### Reset

_Reset the database._

- **Example URI**: `POST` `/api/reset`
- **Description**: This endpoint resets the database by clearing all existing documents in each collection and populating it with initial data.

**HTTP Response Codes**:
- **200 OK**: The database was successfully reset, and a confirmation message is returned.
- **500 Internal Server Error**: An unexpected error occurred while attempting to reset the database.