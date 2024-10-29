# API for SSR Editor

## Table of Contents

- [Document](#document)
    - [Create new document](#create-new-document)
    - [Get all document](#get-all-documents)
    - [Get document by ID](#get-document-by-id)
    - [Update document](#update-document)
    - [Delete document](#delete-document)
- [User](#user)
    - [Create new user](#create-new-user)
    - [Get all users](#get-all-users)
    - [Get user by ID](#get-user-by-id)
    - [Update user](#update-user)
    - [Delete user](#delete-user)
- [Comment](#comment)
    - [Create new comment](#create-new-comment)
    - [Get all comments](#get-all-comments)
    - [Get comment by ID](#get-comment-by-id)
    - [Update comment](#update-comment)
    - [Delete comment](#delete-comment)
- [Auth](#auth)
    - [Login](#login)
    - [Logout](#logout)
    - [Refresh](#refresh)
    - [Sign up](#sign-up)
        - [Verify](#verify)
        - [Complete](#complete)
    - [Myself](#myself)
        - [Fetch](#fetch)
        - [Update](#update)
        - [Delete](#delete)
- [Endpoints](#endpoints)
    - [Help](#help)
    - [Reset](#reset)

### Document

#### Create new document

_Create a new document in the database_

Example URI: `POST` `/api/documents`

**Request Headers:**

| Name | Type | Description | Optional |
| ---- | ---- | ----------- | -------- |
| `accessToken` | `JWT` | The token of the user | **No** |

**Request Headers:**

| Name | Type | Description | Optional |
| ---- | ---- | ----------- | -------- |
| `token` | `text` | The token of the user | **No** |

**Request Body:**

| Name | Type | Description | Optional |
| ---- | ---- | ----------- | -------- |
| `title` | `text` | The title of the document | **No** |
| `content` | `text` | The content of the document | **No** |
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
            "canWrite": false
        },
        {
            "userId": "67080b1bc1f55178f0902d77",
            "createdAt": "9/1/2020, 11:36:33 AM",
            "updatedAt": "9/1/2020, 11:36:33 AM",
            "canWrite": false
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

Example URI: `GET` `/api/documents`

**Request Headers:**

| Name | Type | Description | Optional |
| ---- | ---- | ----------- | -------- |
| `accessToken` | `JWT` | The token of the user | **No** |

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

Example URI: `GET` `/api/documents/:id`

**Request Headers:**

| Name | Type | Description | Optional |
| ---- | ---- | ----------- | -------- |
| `accessToken` | `JWT` | The token of the user | **No** |

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

Example URI: `PUT` `/api/documents/:id`

**Request Headers:**

| Name | Type | Description | Optional |
| ---- | ---- | ----------- | -------- |
| `accessToken` | `JWT` | The token of the user | **No** |

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

```Document with ID 66f489160f6e0282477688bf was successfully updated.```

#### Delete document

_Delete a document from the database_

Example URI: `DELETE` `/api/documents/:id`

**Request Headers:**

| Name | Type | Description | Optional |
| ---- | ---- | ----------- | -------- |
| `accessToken` | `JWT` | The token of the user | **No** |

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

```Document with ID 66f489160f6e0282477688bf was successfully deleted.```

### User

#### Create new user

_Create a new user in the database_

Example URI: `POST` `/api/users`

**Request Headers:**

| Name | Type | Description | Optional |
| ---- | ---- | ----------- | -------- |
| `accessToken` | `JWT` | The token of the user | **No** |

**Request Headers:**

| Name | Type | Description | Optional |
| ---- | ---- | ----------- | -------- |
| `accessToken` | `JWT` | The token of the user | **No** |

**Request Body:**

| Name | Type | Description | Optional |
| ---- | ---- | ----------- | -------- |
| `title` | `text` | The title of the document | **No** |
| `content` | `text` | The content of the document | **No** |
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

}
```

#### Get all users

_Get list of all users in the database._

Example URI: `GET` `/api/users`

**Request Headers:**

| Name | Type | Description | Optional |
| ---- | ---- | ----------- | -------- |
| `accessToken` | `JWT` | The token of the user | **No** |

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
        
    },
    {

    },
    ...
]
```

#### Get user by ID

_Get a single user by ID from the database._

Example URI: `GET` `/api/users/:id`

**Request Headers:**

| Name | Type | Description | Optional |
| ---- | ---- | ----------- | -------- |
| `accessToken` | `JWT` | The token of the user | **No** |

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

}
```

#### Update user

_Update a document in the database_

Example URI: `PUT` `/api/users/:id`

**Request Headers:**

| Name | Type | Description | Optional |
| ---- | ---- | ----------- | -------- |
| `accessToken` | `JWT` | The token of the user | **No** |

**Request Headers:**

| Name | Type | Description | Optional |
| ---- | ---- | ----------- | -------- |
| `token` | `text` | The token of the user | **No** |

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

}
```

**When `returnDocument` is `false`:**

```Document with ID 66f489160f6e0282477688bf was successfully updated.```

#### Delete user

_Delete a user from the database_

Example URI: `DELETE` `/api/users/:id`

**Request Headers:**

| Name | Type | Description | Optional |
| ---- | ---- | ----------- | -------- |
| `accessToken` | `JWT` | The token of the user | **No** |

**Request Headers:**

| Name | Type | Description | Optional |
| ---- | ---- | ----------- | -------- |
| `token` | `text` | The token of the user | **No** |

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

```User with ID 66f489160f6e0282477688bf was successfully deleted.```

#### Exists

_Get user details by email address._

Example URI: `GET` `/api/users/find`

**Request Body:**

| Name   | Type   | Description                    | Optional |
| ------ | ------ | ------------------------------ | -------- |
| `email`| String | The email address of the user  | **No**   |

**Responses:**

- **200 OK**: The user exists, and the existence status is returned.
- **400 Bad Request**: Missing or invalid `email`.
- **500 Internal Server Error**: An error occurred while retrieving the user.

**Example Response (200 OK):**

```json
{
    "exists": true
}
```

#### Find

_Get a user's details by their email address._

Example URI: `GET` `/api/users/find`

**Request Body:**

| Name    | Type   | Description                       | Optional |
| ------- | ------ | --------------------------------- | -------- |
| `email` | String | The email address of the user     | **No**   |

**Responses:**

- **200 OK**: The user’s details are returned.
- **400 Bad Request**: Missing `email` parameter.
- **404 Not Found**: No user found with the specified email.
- **500 Internal Server Error**: An error occurred while retrieving the user.

**Example Response (200 OK):**

```json
{
    "_id": "66eae0bd0f6e02824705d72a",
    "email": "user@example.com",
    "name": "Jane Doe",
    "documents": [
        "67080abb97c1e14ff70913f0"
    ],
    "stats": {
        "totalDocuments": 1,
        "totalEdits": 5,
        "totalComments": 1
    },
    "createdAt": "2023-01-01T12:00:00.000Z",
    "lastLogin": "2023-01-15T09:00:00.000Z",
    "profilePicture": "url_to_profile_pic"
}
```

### Comment

#### Create new comment

_Create a new comment in the database_

Example URI: `POST` `/api/comments`

**Request Headers:**

| Name | Type | Description | Optional |
| ---- | ---- | ----------- | -------- |
| `accessToken` | `JWT` | The token of the user | **No** |

**Request Headers:**

| Name | Type | Description | Optional |
| ---- | ---- | ----------- | -------- |
| `accessToken` | `JWT` | The token of the user | **No** |

**Request Body:**

| Name | Type | Description | Optional |
| ---- | ---- | ----------- | -------- |
| `title` | `text` | The title of the document | **No** |
| `content` | `text` | The content of the document | **No** |
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

}
```

#### Get all comments

_Get list of all comments in the database._

Example URI: `GET` `/api/comments`

**Request Headers:**

| Name | Type | Description | Optional |
| ---- | ---- | ----------- | -------- |
| `accessToken` | `JWT` | The token of the user | **No** |

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
        
    },
    {

    },
    ...
]
```

#### Get comment by ID

_Get a single comment by ID from the database._

Example URI: `GET` `/api/comments/:id`

**Request Headers:**

| Name | Type | Description | Optional |
| ---- | ---- | ----------- | -------- |
| `accessToken` | `JWT` | The token of the user | **No** |

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

}
```

#### Update comment

_Update a comment in the database_

Example URI: `PUT` `/api/comments/:id`

**Request Headers:**

| Name | Type | Description | Optional |
| ---- | ---- | ----------- | -------- |
| `accessToken` | `JWT` | The token of the user | **No** |

**Request Headers:**

| Name | Type | Description | Optional |
| ---- | ---- | ----------- | -------- |
| `token` | `text` | The token of the user | **No** |

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

}
```

**When `returnDocument` is `false`:**

```Comment with ID 66f489160f6e0282477688bf was successfully updated.```

#### Delete comment

_Delete a comment from the database_

Example URI: `DELETE` `/api/comments/:id`

**Request Headers:**

| Name | Type | Description | Optional |
| ---- | ---- | ----------- | -------- |
| `accessToken` | `JWT` | The token of the user | **No** |

**Request Headers:**

| Name | Type | Description | Optional |
| ---- | ---- | ----------- | -------- |
| `token` | `text` | The token of the user | **No** |

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

```Comment with ID 66f489160f6e0282477688bf was successfully deleted.```

### Auth

#### Login

_Generate access and refresh tokens for a user_

Example URI: `POST` `/api/auth/login`

**Request Body:**

| Name | Type | Description | Optional |
| ---- | ---- | ----------- | -------- |
| `email` | `text` | The email of the user | **No** |
| `password` | `text` | The password of the user | **No** |
| `method` | `local`, `github` or `google` | The authentication method to use | **Yes** |

**Responses:**

- **201 Created**: The document was successfully created, and the created document is returned in the response.
- **400 Bad Request**: Missing required parameters (title or content) in the request.
- **500 Internal Server Error**: An unexpected error occurred while trying to create the document.

**Example Response (200 OK):**

```json
{
    "token": "XXX",
    "user": {
        "_id": "66eae0bd0f6e02824705d72a",
        "email": "bYxkM@example.com",
        "name": "Robin Johannesson",
        "documents": [
            "67080abb97c1e14ff70913f0"
        ],
        "stats": {
            "totalDocuments": 1,
            "totalEdits": 5,
            "totalComments": 1
        },
        "createdAt": "9/1/2020, 11:36:33 AM",
        "lastLogin": "9/1/2020, 11:36:33 AM",
        "profilePicture": "url_to_profile_pic_1"
    }
}
```

#### Logout

_Remove the refresh token cookie to log the user out._

Example URI: `POST` `/api/auth/logout`

**Request Cookies:**

| Name           | Type   | Description                         | Optional |
| -------------- | ------ | ----------------------------------- | -------- |
| `refreshToken` | `JWT`  | The refresh token of the user       | **No**   |

**Responses:**

- **200 OK**: Logout was successful, and the refresh token cookie was cleared.
- **400 Bad Request**: Missing required `refreshToken` cookie in the request.
- **500 Internal Server Error**: An unexpected error occurred while trying to log the user out.

**Example Response (200 OK):**

```json
{
    "message": "Logout successful"
}
```

#### Refresh

_Generate a new access token for the user using their refresh token._

Example URI: `POST` `/api/auth/refresh`

**Request Cookies:**

| Name           | Type   | Description                         | Optional |
| -------------- | ------ | ----------------------------------- | -------- |
| `refreshToken` | `JWT`  | The refresh token of the user       | **No**   |

**Responses:**

- **200 OK**: A new access token was generated successfully, and the user's details are returned in the response.
- **403 Forbidden**: Refresh token was not provided or is invalid.
- **500 Internal Server Error**: An unexpected error occurred while trying to refresh the access token.

**Example Response (200 OK):**

```json
{
    "accessToken": "newAccessTokenHere",
    "user": {
        "_id": "66eae0bd0f6e02824705d72a",
        "email": "bYxkM@example.com",
        "isAdmin": true
    }
}
```

#### Myself

##### Fetch

_Retrieve the current user's details from the database._

Example URI: `GET` `/api/auth/user`

**Request Cookies:**

| Name           | Type   | Description                         | Optional |
| -------------- | ------ | ----------------------------------- | -------- |
| `refreshToken` | `JWT`  | The refresh token of the user       | **No**   |

**Responses:**

- **200 OK**: User details were successfully retrieved.
- **404 Not Found**: User was not found.
- **500 Internal Server Error**: An error occurred while fetching user details.

**Example Response (200 OK):**

```json
{
    "user": {
        "_id": "66eae0bd0f6e02824705d72a",
        "email": "bYxkM@example.com",
        "name": "Robin Johannesson",
        "stats": {
            "totalDocuments": 10,
            "totalEdits": 50,
            "totalComments": 15
        },
        "profilePicture": "url_to_profile_pic",
        "createdAt": "2023-09-01T11:36:33.000Z",
        "lastLogin": "2023-09-01T11:36:33.000Z"
    },
    "accessToken": "updatedAccessTokenHere"
}
```

---

##### Update

_Update user details in the database._

Example URI: `PUT` `/api/auth/user`

**Request Cookies:**

| Name           | Type   | Description                         | Optional |
| -------------- | ------ | ----------------------------------- | -------- |
| `refreshToken` | `JWT`  | The refresh token of the user       | **No**   |

**Request Body:**

| Name            | Type      | Description                                         | Optional |
| --------------- | --------- | --------------------------------------------------- | -------- |
| `name`          | String    | New name of the user                                | Yes      |
| `email`         | String    | New email of the user                               | Yes      |
| `password`      | String    | New password of the user                            | Yes      |
| `profilePicture`| String    | New profile picture of the user                     | Yes      |
| `stats`         | Object    | Updated stats including totalDocuments, etc.        | Yes      |
| `returnValue`   | Boolean   | If true, returns the updated user in the response   | Yes      |

**Responses:**

- **200 OK**: User updated successfully.
- **400 Bad Request**: Missing or invalid data in the request.
- **404 Not Found**: User to update was not found.
- **500 Internal Server Error**: An error occurred while updating the user.

**Example Response (200 OK):**

```json
{
    "_id": "66eae0bd0f6e02824705d72a",
    "email": "newEmail@example.com",
    "name": "New Name",
    "stats": {
        "totalDocuments": 12,
        "totalEdits": 52,
        "totalComments": 18
    },
    "profilePicture": "url_to_new_profile_pic",
    "updatedAt": "2023-09-15T11:36:33.000Z"
}
```

---

##### Delete

_Remove the current user from the database._

Example URI: `DELETE` `/api/auth/user`

**Request Cookies:**

| Name           | Type   | Description                         | Optional |
| -------------- | ------ | ----------------------------------- | -------- |
| `refreshToken` | `JWT`  | The refresh token of the user       | **No**   |

**Request Body:**

| Name          | Type    | Description                             | Optional |
| ------------- | ------- | --------------------------------------- | -------- |
| `returnValue` | Boolean | If true, returns the deleted user       | Yes      |

**Responses:**

- **200 OK**: User was successfully deleted.
- **403 Forbidden**: Admin users cannot be deleted.
- **404 Not Found**: User to delete was not found.
- **500 Internal Server Error**: An error occurred while deleting the user.

**Example Response (200 OK):**

```User with ID 66eae0bd0f6e02824705d72a was successfully deleted.```

#### Sign Up

_Register a new user and send a verification email._

Example URI: `POST` `/api/auth/signUp`

**Request Body:**

| Name       | Type   | Description                                            | Optional |
| ---------- | ------ | ------------------------------------------------------ | -------- |
| `email`    | String | The email address of the new user                      | **No**   |
| `redirect` | String | The URL to redirect the user for account verification  | **No**   |

**Responses:**

- **200 OK**: A verification email was sent to the user's email address.
- **400 Bad Request**: Missing or invalid `email` or `redirect` parameters, or a user with the given email already exists.
- **500 Internal Server Error**: An error occurred while trying to sign up the user.

**Example Response (200 OK):**

```Account verification email sent```

##### Verify

_Verify a new user's account using a token._

Example URI: `POST` `/api/auth/signUp/verify`

**Request Body:**

| Name   | Type   | Description                          | Optional |
| ------ | ------ | ------------------------------------ | -------- |
| `token`| String | The verification token for the user  | **No**   |

**Responses:**

- **200 OK**: The account was verified successfully, and the email and token expiration time are returned.
- **400 Bad Request**: Missing or invalid `token`, or user with the given email already exists.
- **500 Internal Server Error**: An error occurred during the account verification process.

**Example Response (200 OK):**

```json
{
    "email": "verifiedUser@example.com",
    "expirationTime": 1690402800
}
```

##### Complete

_Create a new user account with the provided details._

Example URI: `POST` `/api/auth/signUp/complete`

**Request Body:**

| Name       | Type   | Description                                           | Optional |
| ---------- | ------ | ----------------------------------------------------- | -------- |
| `name`     | String | The name of the user                                  | **No**   |
| `email`    | String | The email address of the user                         | **No**   |
| `password` | String | The password for the new user account                 | **No**   |
| `token`    | String | The verification token for completing account setup   | **No**   |

**Responses:**

- **200 OK**: User account created successfully.
- **400 Bad Request**: Missing or invalid fields (`name`, `email`, `password`, or `token`), email mismatch, or user already exists.
- **500 Internal Server Error**: An error occurred while creating the user account.

**Example Response (200 OK):**

```json
{
    "message": "Sign up successful"
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