# API for SSR Editor

## Table of Contents

- [Variable Explanations](#variable-explanations)
- [Document](#document)
    - [Create new document](#create-new-document)
    - [Get all document](#get-all-documents)
    - [Get document by ID](#get-document-by-id)
    - [Update document](#update-document)
    - [Delete document](#delete-document)
- [Endpoints](#endpoints)
    - [Help](#help)
    - [Reset](#reset)

### Variable Explanations

- **isLocked**: A boolean variable that indicates whether the document is in read-only mode. If `true`, users cannot modify the document; if `false`, the document can be edited.

- **title**: A string representing the title of the document. This is a required field when creating or updating a document.

- **content**: A string that holds the main content of the document. Like the title, this field is also required for document creation and updates.

- **ownerId**: An identifier for the user or entity that owns the document. This can be used for access control and permissions.

- **createdAt**: A timestamp indicating when the document was created. This is typically set automatically when a document is first created.

- **updatedAt**: A timestamp showing the last time the document was updated. This field is usually updated each time the document is modified.

### Document

#### Create new document

_Create a new document in the database_

Example URI: `POST` `/api/document/create`

Body:

| Name | Type | Description | Optional |
| ---- | ---- | ----------- | -------- |
| `title` | `text` | The title of the document | **No** |
| `content` | `text` | The content of the document | **No** |
| `ownerId` | `ObjectId` | The ID of the owner | **No** |
| `isLocked` | `boolean` | Whether the document is locked | **Yes** (default: `false`) |

**Responses:**

- **201 Created**: The document was successfully created, and the created document is returned in the response.
- **400 Bad Request**: Missing required parameters (title or content) in the request.
- **500 Internal Server Error**: An unexpected error occurred while trying to create the document.

**Example Response (200 OK):**

```json
{
    "id": "66f542827665fb54d5847006",
    "title": "Hello World",
    "content": "Lorem Ipsum",
    "createdAt": "2024-09-26T11:16:18.883Z",
    "updatedAt": "2024-09-26T11:16:18.883Z",
    "ownerId": null,
    "isLocked": 0
}
```

#### Get all documents

_Get list of all documents in the database._

Example URI: `GET` `/api/document/all`

**Responses:**

- **200 OK**: The request was successful, and the list of documents is returned in the response.
- **500 Internal Server Error**: An unexpected error occurred while trying to retrieve the documents.

**Example Response (200 OK):**

```json
[
    {
        "id": "66eadff20f6e028247059cdd",
        "title": "Första dokumentet",
        "content": "Dokumentets innehåll",
        "createdAt": "2024-09-25T22:01:06.494Z",
        "updatedAt": "2024-09-25T22:01:06.494Z",
        "ownerId": 0,
        "isLocked": false
    },
    {
        "id": "66f489160f6e0282477688bf",
        "title": "Andra dokumentet",
        "content": "Dokumentets innehåll",
        "createdAt": "2024-09-25T22:01:06.494Z",
        "updatedAt": "2024-09-25T22:01:06.494Z",
        "ownerId": 1,
        "isLocked": true
    }
]
```

#### Get Document by ID

_Get a single document by ID from the database._

Example URI: `GET` `/api/document/:id`

**Parameters:**

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
    "id": "66f489160f6e0282477688bf",
    "title": "Andra dokumentet",
    "content": "Dokumentets innehåll",
    "createdAt": "2024-09-25T22:01:06.494Z",
    "updatedAt": "2024-09-25T22:01:06.494Z",
    "ownerId": 1,
    "isLocked": true
}
```

#### Update document

_Update a document in the database_

Example URI: `PUT` `/api/document/:id`

Parameters:

| Name | Type | Description |
| ---- | ---- | ----------- |
| `id` | `ObjectId` | The ID of the document |

Body:

| Name | Type | Description | Optional |
| ---- | ---- | ----------- | -------- |
| `title` | `text` | The title of the document | **Yes** |
| `content` | `text` | The content of the document | **Yes** |
| `ownerId` | `ObjectId` | The ID of the owner | **Yes** |
| `isLocked` | `boolean` | Whether the document is locked | **Yes** |

**Responses:**

- **200 OK**: The document was successfully updated.
- **400 Bad Request**: 
  - Missing ID parameter in the request.
  - No properties provided for update (title, content, ownerId, or isLocked).
- **500 Internal Server Error**: An unexpected error occurred while trying to update the document.

**Example Response (200 OK):**

```json
{
    "message": "Document with ID 66f489160f6e0282477688bf was successfully updated."
}
```

#### Delete document

_Delete a document from the database_

Example URI: `DELETE` `/api/document/:id`

**Response:** `200`

Parameters:

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
- **Description**: This endpoint resets the database by clearing all existing documents and populating it with initial data.

**HTTP Response Codes**:
- **200 OK**: The database was successfully reset, and a confirmation message is returned.
- **500 Internal Server Error**: An unexpected error occurred while attempting to reset the database.