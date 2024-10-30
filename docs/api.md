# API for SSR Editor

## Table of Contents

- [Document](#document)
    - [Create new document](#create-new-document)
    - [Get all document](#get-all-documents)
    - [Get document by ID](#get-document-by-id)
    - [Update document](#update-document)
    - [Delete document](#delete-document)
    - [Share Document](#share-document)
    - [Create Comment](#create-comment)
    - [Delete Document (Non-Admin)](#delete-document-non-admin)
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

**Admin only**

Example URI: `POST` `/api/documents`

**Request Headers:**

| Name            | Type   | Description                                         | Optional |
| --------------  | ------ | --------------------------------------------------- | -------- |
| `Authorization` | `JWT`  | Bearer token for authenticating the user request    | **No**   |

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
- **400 Bad Request**: Missing required parameters in the request.
- **500 Internal Server Error**: An unexpected error occurred while trying to create the document.

**Example Response (201 OK):**

```json
{
    "_id": "67224d13c8466915823c2668",
    "title": "Hello World",
    "content": "Lorem Ipsum",
    "ownerId": "66eae0bd0f6e02824705d72a",
    "collaborators": [],
    "comments": [],
    "stats": {
        "totalEdits": 0,
        "totalViews": 0,
        "activeComments": 0,
        "activeUsers": 0
    },
    "createdAt": "2024-10-30T15:13:23.412Z",
    "updatedAt": "2024-10-30T15:13:23.412Z"
}
```

#### Get all documents

_Get list of all documents in the database._

**Admin only**

Example URI: `GET` `/api/documents`

**Request Headers:**

| Name            | Type   | Description                                         | Optional |
| --------------  | ------ | --------------------------------------------------- | -------- |
| `Authorization` | `JWT`  | Bearer token for authenticating the user request    | **No**   |

**Responses:**

- **200 OK**: The request was successful, and the list of documents is returned in the response.
- **500 Internal Server Error**: An unexpected error occurred while trying to retrieve the documents.

**Example Response (200 OK):**

```json
[
    {
        "_id": "67080abb97c1e14ff70913f1",
        "title": "React.js",
        "content": {
            "ops": [
                {
                    "attributes": {
                        "bold": true
                    },
                    "insert": "React.js is a powerful JavaScript library for building user interfaces."
                },
                {
                    "attributes": {
                        "header": 1
                    },
                    "insert": "\n"
                },
                {
                    "insert": "\nIt allows developers to create large web applications that can change data, without reloading the page. Its key feature is the ability to manage components efficiently.\n\nLearn more about React's core concepts in this "
                },
                {
                    "attributes": {
                        "link": "https://react.dev/learn"
                    },
                    "insert": "official documentation."
                }
            ]
        },
        "collaborators": [],
        "stats": {
            "totalEdits": 0,
            "totalViews": 5,
            "activeComments": 0,
            "activeUsers": 1
        },
        "createdAt": "2020-09-01T11:36:33+02:00",
        "updatedAt": "2020-09-01T11:36:33+02:00",
        "ownerId": "66eae0bd0f6e02824705d72a"
    },
    {
        "_id": "67080abb97c1e14ff70913f0",
        "title": "DV1677 - JavaScript-baserade webbramverk",
        "content": {
            "ops": [
                {
                    "attributes": {
                        "bold": true
                    },
                    "insert": "Detta är kursen DV1677 JavaScript-baserade webbramverk."
                },
                {
                    "attributes": {
                        "header": 1
                    },
                    "insert": "\n"
                },
                {
                    "insert": "\nVi ska i denna kurs använda oss av JavaScript ramverk både på frontend och backend för att vidareutveckla en befintlig applikation.\nKursen ges till "
                },
                {
                    "attributes": {
                        "color": "#2915a3",
                        "link": "https://dbwebb.se/"
                    },
                    "insert": "webbprogrammeringsstudenter"
                },
                {
                    "insert": " vid "
                },
                {
                    "attributes": {
                        "color": "#2915a3",
                        "link": "https://bth.se/"
                    },
                    "insert": "Blekinge Tekniska Högskola"
                },
                {
                    "insert": ". Och är en av Sveriges enda högskolekurser i JavaScript ramverk. Källkoden till denna webbplats finns på "
                },
                {
                    "attributes": {
                        "color": "#2915a3",
                        "link": "https://github.com/emilfolino/jsramverk.se"
                    },
                    "insert": "GitHub emilfolino/jsramverk.se"
                },
                {
                    "insert": "\n\nI kursen bygger vi vidare på en "
                },
                {
                    "attributes": {
                        "italic": true
                    },
                    "insert": "\"real-time collaborative text-editor\""
                },
                {
                    "insert": "-applikation tillsammans två och två. Vi tar en titt på hur detta samarbetet kan bli optimalt och vilka tekniker och verktyg som finns för att samarbeta om vidareutveckling av kod.\n\n"
                }
            ]
        },
        "collaborators": [
            {
                "userId": "66eae0bd0f6e02824705d72a",
                "canWrite": true
            },
            {
                "userId": "67080b1bc1f55178f0902d77",
                "canWrite": true
            },
            {
                "userId": "66eae0bd0f6e02824705d72b",
                "canWrite": false
            }
        ],
        "stats": {
            "totalEdits": 0,
            "totalViews": 10,
            "activeComments": 1,
            "activeUsers": 2
        },
        "createdAt": "2019-08-22T20:00:00+02:00",
        "updatedAt": "2019-08-22T20:00:00+02:00",
        "ownerId": "66eae0bd0f6e02824705d72c"
    },
    ...
]
```

#### Get Document by ID

_Get a single document by ID from the database._

**Admin only**

Example URI: `GET` `/api/documents/:id`

**Request Headers:**

| Name            | Type   | Description                                         | Optional |
| --------------  | ------ | --------------------------------------------------- | -------- |
| `Authorization` | `JWT`  | Bearer token for authenticating the user request    | **No**   |

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
    "_id": "67080abb97c1e14ff70913f1",
    "title": "React.js",
    "content": {
        "ops": [
            {
                "attributes": {
                    "bold": true
                },
                "insert": "React.js is a powerful JavaScript library for building user interfaces."
            },
            {
                "attributes": {
                    "header": 1
                },
                "insert": "\n"
            },
            {
                "insert": "\nIt allows developers to create large web applications that can change data, without reloading the page. Its key feature is the ability to manage components efficiently.\n\nLearn more about React's core concepts in this "
            },
            {
                "attributes": {
                    "link": "https://react.dev/learn"
                },
                "insert": "official documentation."
            }
        ]
    },
    "collaborators": [],
    "stats": {
        "totalEdits": 0,
        "totalViews": 5,
        "activeComments": 0,
        "activeUsers": 1
    },
    "createdAt": "2020-09-01T11:36:33+02:00",
    "updatedAt": "2020-09-01T11:36:33+02:00",
    "ownerId": "66eae0bd0f6e02824705d72a"
}
```

#### Update document

_Update a document in the database_

**Admin only**

Example URI: `PUT` `/api/documents/:id`

**Request Headers:**

| Name            | Type   | Description                                         | Optional |
| --------------  | ------ | --------------------------------------------------- | -------- |
| `Authorization` | `JWT`  | Bearer token for authenticating the user request    | **No**   |

**Request Parameters:**

| Name             | Type       | Description                            | Optional |
| ---------------- | ---------- | -------------------------------------- | -------- |
| `id`             | `ObjectId` | The ID of the document                 | **No**   |

**Query Parameters:**

| Name             | Type       | Description                            | Optional |
| ---------------- | ---------- | -------------------------------------- | -------- |
| `returnValue` | `boolean`  | Whether to return the updated document | **Yes**  |

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

- **When `returnValue` is `true`:**

```json
{
    "_id": "67080abb97c1e14ff70913f1",
    "title": "Updated Title",
    "content": {
        "ops": [
            {
                "attributes": {
                    "bold": true
                },
                "insert": "React.js is a powerful JavaScript library for building user interfaces."
            },
            {
                "attributes": {
                    "header": 1
                },
                "insert": "\n"
            },
            {
                "insert": "\nIt allows developers to create large web applications that can change data, without reloading the page. Its key feature is the ability to manage components efficiently.\n\nLearn more about React's core concepts in this "
            },
            {
                "attributes": {
                    "link": "https://react.dev/learn"
                },
                "insert": "official documentation."
            }
        ]
    },
    "collaborators": [],
    "stats": {
        "totalEdits": 0,
        "totalViews": 5,
        "activeComments": 0,
        "activeUsers": 1
    },
    "createdAt": "2020-09-01T11:36:33+02:00",
    "updatedAt": "2020-09-01T11:36:33+02:00",
    "ownerId": "66eae0bd0f6e02824705d72a"
}
```

**When `returnValue` is `false`:**

```Document with ID 66f489160f6e0282477688bf was successfully updated.```

#### Delete document

_Delete a document from the database_

**Admin only**

Example URI: `DELETE` `/api/documents/:id`

**Request Headers:**

| Name            | Type   | Description                                         | Optional |
| --------------  | ------ | --------------------------------------------------- | -------- |
| `Authorization` | `JWT`  | Bearer token for authenticating the user request    | **No**   |

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

#### Share Document

_Sharing a document with other users_

Example URI: `POST` `/api/documents/:id/share`

**Request Headers:**

| Name            | Type   | Description                                         | Optional |
| --------------  | ------ | --------------------------------------------------- | -------- |
| `Authorization` | `JWT`  | Bearer token for authenticating the user request    | **No**   |

**Request Body:**

| Name        | Type   | Description                                               |
| ----------- | ------ | --------------------------------------------------------- |
| `users`     | Array  | An array of users to share the document with (required). |
| `redirectURL` | String | The URL to redirect the user after sharing the document (optional). |

**Responses:**

- **200 OK**: The document was successfully shared with the specified users.
- **400 Bad Request**:
  - Missing users array in the request.
  - Each user must contain valid email and canWrite fields.
- **404 Not Found**:
  - No document found with the provided ID.
  - User with the provided email does not exist.
- **500 Internal Server Error**: An unexpected error occurred while trying to share the document.

**Example Response (200 OK):**

```Document shared successfully.```

#### Create Comment

_Creating a new comment on a document_

Example URI: `POST` `/api/documents/:id/comment`

**Request Headers:**

| Name            | Type   | Description                                         | Optional |
| --------------  | ------ | --------------------------------------------------- | -------- |
| `Authorization` | `JWT`  | Bearer token for authenticating the user request    | **No**   |

**Request Parameters:**

| Name | Type      | Description                      |
| ---- | --------- | -------------------------------- |
| `id` | `ObjectId` | The ID of the document to comment on (required). |

**Request Body:**

| Name     | Type   | Description                        |
| -------- | ------ | ---------------------------------- |
| `position` | Number | The position of the comment in the document (required). |
| `content`  | String | The content of the comment (required). |

**Responses:**

- **201 Created**: The comment was successfully created.
- **400 Bad Request**:
  - Invalid document ID format.
  - Missing parameters for position or content.
- **404 Not Found**: No document found with the provided ID.
- **500 Internal Server Error**: An unexpected error occurred while trying to create the comment.

**Example Response (201 Created):**

```Comment created.```

#### Delete Document (Non-Admin)

_Deleting a document from the database_

Example URI: `DELETE` `/api/documents/:id`

**Request Headers:**

| Name            | Type   | Description                                         | Optional |
| --------------  | ------ | --------------------------------------------------- | -------- |
| `Authorization` | `JWT`  | Bearer token for authenticating the user request    | **No**   |

**Request Parameters:**

| Name | Type      | Description                      |
| ---- | --------- | -------------------------------- |
| `id` | `ObjectId` | The ID of the document (required). |

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

**Admin only**

Example URI: `POST` `/api/users`

**Request Headers:**

| Name            | Type   | Description                                         | Optional |
| --------------  | ------ | --------------------------------------------------- | -------- |
| `Authorization` | `JWT`  | Bearer token for authenticating the user request    | **No**   |

**Request Body:**

| Name | Type | Description | Optional |
| ---- | ---- | ----------- | -------- |
| `name` | `text` | The name of the user | **No** |
| `email` | `text` | The email address of the user | **No** |
| `password` | `text` | The password of the user | **No** |
| `isAdmin` | `boolean` | Whether the user is an admin | **Yes** |
| `profilePicture` | `URL` | The URL of the user's profile picture | **Yes** |
| `stats` | `Object` | User statistics (totalEdits, totalComments, totalDocuments) | **No** |

**Responses:**

- **201 Created**: The user was successfully created, and the created user is returned in the response.
- **400 Bad Request**: Missing required parameters in the request.
- **500 Internal Server Error**: An unexpected error occurred while trying to create the user.

**Example Response (200 OK):**

```json
{
    "_id": "66eae0bd0f6e02824705d72a",
    "isAdmin": true,
    "email": "bYxkM@example.com",
    "name": "Robin Johannesson",
    "stats": {
        "totalDocuments": 1,
        "totalEdits": 5,
        "totalComments": 1
    },
    "createdAt": "2017-10-31T02:15:00+02:00",
    "updatedAt": "2017-10-31T02:15:00+02:00",
    "lastLogin": "2024-10-30T14:43:45.868Z",
    "profilePicture": "url_to_profile_pic_1"
}
```

#### Get all users

_Get list of all users in the database._

**Admin only**

Example URI: `GET` `/api/users`

**Request Headers:**

| Name            | Type   | Description                                         | Optional |
| --------------  | ------ | --------------------------------------------------- | -------- |
| `Authorization` | `JWT`  | Bearer token for authenticating the user request    | **No**   |

**Responses:**

- **200 OK**: The request was successful, and the list of documents is returned in the response.
- **500 Internal Server Error**: An unexpected error occurred while trying to retrieve the documents.

**Example Response (200 OK):**

```json
[
    {
        "_id": "66eae0bd0f6e02824705d72b",
        "isAdmin": false,
        "email": "alice@example.com",
        "name": "Alice Andersson",
        "stats": {
            "totalDocuments": 1,
            "totalEdits": 3,
            "totalComments": 2
        },
        "createdAt": "2014-11-24T08:22:43+01:00",
        "updatedAt": "2014-11-24T08:22:43+01:00",
        "lastLogin": "2014-11-24T08:22:43+01:00",
        "profilePicture": "url_to_profile_pic_3"
    },
    {
        "_id": "66eae0bd0f6e02824705d72c",
        "isAdmin": false,
        "email": "bob@example.com",
        "name": "Bob Bergström",
        "stats": {
            "totalDocuments": 0,
            "totalEdits": 0,
            "totalComments": 0
        },
        "createdAt": "2020-11-03T13:02:01",
        "updatedAt": "2020-11-03T13:02:01",
        "lastLogin": "2020-11-03T13:02:01",
        "profilePicture": "url_to_profile_pic_4"
    },
    ...
]
```

#### Get user by ID

_Get a single user by ID from the database._

**Admin only**

Example URI: `GET` `/api/users/:id`

**Request Headers:**

| Name            | Type   | Description                                         | Optional |
| --------------  | ------ | --------------------------------------------------- | -------- |
| `Authorization` | `JWT`  | Bearer token for authenticating the user request    | **No**   |

**Request Parameters:**

| Name | Type      | Description             |
| ---- | --------- | ----------------------- |
| `id` | `ObjectId` | The unique ID of the user. |

**Responses:**

- **200 OK**: The user was successfully retrieved. The response body contains the user details.
- **400 Bad Request**: The request is missing required parameters, such as the user ID, or the ID format is invalid.
- **500 Internal Server Error**: The server encountered an error while processing the request. This could be due to a database issue or an unexpected exception.

**Example Response (200 OK):**

```json
{
    "_id": "66eae0bd0f6e02824705d72a",
    "isAdmin": true,
    "email": "bYxkM@example.com",
    "name": "Robin Johannesson",
    "stats": {
        "totalDocuments": 1,
        "totalEdits": 5,
        "totalComments": 1
    },
    "createdAt": "2017-10-31T02:15:00+02:00",
    "updatedAt": "2017-10-31T02:15:00+02:00",
    "lastLogin": "2024-10-30T14:43:45.868Z",
    "profilePicture": "url_to_profile_pic_1"
}
```

#### Update user

_Update a single user in the database_

**Admin only**

Example URI: `PUT` `/api/users/:id`

**Request Headers:**

| Name            | Type   | Description                                         | Optional |
| --------------  | ------ | --------------------------------------------------- | -------- |
| `Authorization` | `JWT`  | Bearer token for authenticating the user request    | **No**   |

**Request Parameters:**

| Name             | Type       | Description                            | Optional |
| ---------------- | ---------- | -------------------------------------- | -------- |
| `id`             | `ObjectId` | The ID of the user                 | **No**   |

**Query Parameters:**

| Name             | Type       | Description                            | Optional |
| ---------------- | ---------- | -------------------------------------- | -------- |
| `returnValue` | `boolean`  | Whether to return the updated user | **Yes**  |

**Request Body:**

| Name             | Type     | Description                                                         | Optional |
| ---------------- | -------- | ------------------------------------------------------------------- | -------- |
| `name`           | `text`   | The new name of the user                                            | **Yes**  |
| `email`          | `text`   | The new email of the user                                           | **Yes**  |
| `password`       | `text`   | The new password of the user                                        | **Yes**  |
| `stats`          | `Object` | Updated user statistics (totalEdits, totalComments, totalDocuments) | **Yes**  |
| `profilePicture` | `URL`    | The new profile picture of the user                                 | **Yes**  |

**Responses:**

- **200 OK**: The user was successfully updated.
- **400 Bad Request**: 
  - Missing ID parameter in the request.
  - No properties provided for update (name, email, password).
- **500 Internal Server Error**: An unexpected error occurred while trying to update the user.

**Example Response (200 OK):**

- **When `returnValue` is `true`:**

```json
{
    "_id": "66eae0bd0f6e02824705d72a",
    "isAdmin": true,
    "email": "bYxkM@example.com",
    "name": "Robin Johannesson",
    "stats": {
        "totalDocuments": 1,
        "totalEdits": 5,
        "totalComments": 1
    },
    "createdAt": "2017-10-31T02:15:00+02:00",
    "updatedAt": "2017-10-31T02:15:00+02:00",
    "lastLogin": "2024-10-30T14:43:45.868Z",
    "profilePicture": "url_to_profile_pic_1"
}
```

**When `returnValue` is `false`:**

```User with ID 66f489160f6e0282477688bf was successfully updated.```

#### Delete user

_Delete a user from the database_

**Admin only**

Example URI: `DELETE` `/api/users/:id`

**Request Headers:**

| Name            | Type   | Description                                         | Optional |
| --------------  | ------ | --------------------------------------------------- | -------- |
| `Authorization` | `JWT`  | Bearer token for authenticating the user request    | **No**   |

**Request Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `id` | `ObjectId` | The ID of the User |

**Responses:**

- **200 OK**: The user was successfully deleted.
- **400 Bad Request**: Missing ID parameter in the request.
- **404 Not Found**:
  - No user found with the provided ID.
  - The delete operation acknowledged, but the user to delete does not exist.
- **500 Internal Server Error**: An unexpected error occurred while trying to delete the user.

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
    "_id": "66eae0bd0f6e02824705d72a",
    "isAdmin": true,
    "email": "bYxkM@example.com",
    "name": "Robin Johannesson",
    "stats": {
        "totalDocuments": 1,
        "totalEdits": 5,
        "totalComments": 1
    },
    "createdAt": "2017-10-31T02:15:00+02:00",
    "updatedAt": "2017-10-31T02:15:00+02:00",
    "lastLogin": "2024-10-30T15:06:30.569Z",
    "profilePicture": "url_to_profile_pic_1"
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

**Admin only**

Example URI: `POST` `/api/comments`

**Request Headers:**

| Name            | Type   | Description                                         | Optional |
| --------------  | ------ | --------------------------------------------------- | -------- |
| `Authorization` | `JWT`  | Bearer token for authenticating the user request    | **No**   |

**Request Body:**

| Name | Type | Description | Optional |
| ---- | ---- | ----------- | -------- |
| `position` | `text` | The position of the comment | **No** |
| `content` | `text` | The content of the comment | **No** |
| `documentId` | `ObjectId` | The ID of the document | **No** |
| `userId` | `ObjectId` | The ID of the user | **No** |

**Responses:**

- **201 Created**: The comment was successfully created, and the created comment is returned in the response.
- **400 Bad Request**: Missing required parameters in the request.
- **500 Internal Server Error**: An unexpected error occurred while trying to create the comment.

**Example Response (200 OK):**

```json
{
    "_id": "66eae1c30f6e0282470624c7",
    "position": "14:28",
    "content": "OK!",
    "resolved": false,
    "createdAt": "2021-10-05T00:00:00+02:00",
    "updatedAt": "2021-10-05T00:00:00+02:00",
    "documentId": "67080abb97c1e14ff70913f0",
    "userId": "66eae0bd0f6e02824705d72a"
}
```

#### Get all comments

_Get list of all comments in the database._

**Admin only**

Example URI: `GET` `/api/comments`

**Request Headers:**

| Name            | Type   | Description                                         | Optional |
| --------------  | ------ | --------------------------------------------------- | -------- |
| `Authorization` | `JWT`  | Bearer token for authenticating the user request    | **No**   |

**Responses:**

- **200 OK**: The request was successful, and the list of documents is returned in the response.
- **500 Internal Server Error**: An unexpected error occurred while trying to retrieve the documents.

**Example Response (200 OK):**

```json
[
    {
        "_id": "66eae1c30f6e0282470624c7",
        "position": "14:28",
        "content": "OK!",
        "resolved": false,
        "createdAt": "2021-10-05T00:00:00+02:00",
        "updatedAt": "2021-10-05T00:00:00+02:00",
        "documentId": "67080abb97c1e14ff70913f0",
        "userId": "66eae0bd0f6e02824705d72a"
    },
    {
        "_id": "66eae1c30f6e0282470624c8",
        "position": "2:15",
        "content": "Great article!",
        "resolved": false,
        "createdAt": "2021-10-30T13:00:00+02:00",
        "updatedAt": "2021-10-30T13:00:00+02:00",
        "documentId": "67080abb97c1e14ff70913f0",
        "userId": "66eae0bd0f6e02824705d72b"
    },
    ...
]
```

#### Get comment by ID

_Get a single comment by ID from the database._

**Admin only**

Example URI: `GET` `/api/comments/:id`

**Request Headers:**

| Name            | Type   | Description                                         | Optional |
| --------------  | ------ | --------------------------------------------------- | -------- |
| `Authorization` | `JWT`  | Bearer token for authenticating the user request    | **No**   |

**Request Parameters:**

| Name | Type      | Description             |
| ---- | --------- | ----------------------- |
| `id` | `ObjectId` | The unique ID of the comment. |

**Responses:**

- **200 OK**: The comment was successfully retrieved. The response body contains the comment details.
- **400 Bad Request**: The request is missing required parameters, such as the comment ID, or the ID format is invalid.
- **500 Internal Server Error**: The server encountered an error while processing the request. This could be due to a database issue or an unexpected exception.

**Example Response (200 OK):**

```json
{
    "_id": "66eae1c30f6e0282470624c7",
    "position": "14:28",
    "content": "OK!",
    "resolved": false,
    "createdAt": "2021-10-05T00:00:00+02:00",
    "updatedAt": "2021-10-05T00:00:00+02:00",
    "documentId": "67080abb97c1e14ff70913f0",
    "userId": "66eae0bd0f6e02824705d72a"
}
```

#### Update comment

_Update a comment in the database_

**Admin only**

Example URI: `PUT` `/api/comments/:id`

**Request Headers:**

| Name            | Type   | Description                                         | Optional |
| --------------  | ------ | --------------------------------------------------- | -------- |
| `Authorization` | `JWT`  | Bearer token for authenticating the user request    | **No**   |

**Request Parameters:**

| Name             | Type       | Description                            | Optional |
| ---------------- | ---------- | -------------------------------------- | -------- |
| `id`             | `ObjectId` | The ID of the comment                 | **No**   |

**Query Parameters:**

| Name             | Type       | Description                            | Optional |
| ---------------- | ---------- | -------------------------------------- | -------- |
| `returnValue` | `boolean`  | Whether to return the updated comment | **Yes**  |

**Request Body:**

| Name           | Type                                    | Description                              | Optional |
| -------------- |  ---------------------------------------| ---------------------------------------- | -------- |
| `position`     | `text` with format of (`line`:`column`) | The new position of the comment          | **Yes**   |
| `content`      | `text`                                  | The new content of the comment           | **Yes**   |
| `resolved`     | `boolean`                               | If the comment is resolved               | **Yes**  |
| `userId`       | `ObjectId`                              | The new user ID of the comment           | **Yes**   |
| `documentId`   | `ObjectId`                              | The new document ID of the comment       | **Yes**   |

**Responses:**

- **200 OK**: The comment was successfully updated.
- **400 Bad Request**: 
  - Missing ID parameter in the request.
  - No properties provided for update (position, content, userId).
- **500 Internal Server Error**: An unexpected error occurred while trying to update the comment.

**Example Response (200 OK):**

- **When `returnValue` is `true`:**

```json
{
    "_id": "66eae1c30f6e0282470624c7",
    "position": "14:28",
    "content": "Not OK!",
    "resolved": false,
    "createdAt": "2021-10-05T00:00:00+02:00",
    "updatedAt": "2021-10-05T00:00:00+02:00",
    "documentId": "67080abb97c1e14ff70913f0",
    "userId": "66eae0bd0f6e02824705d72a"
}
```

**When `returnValue` is `false`:**

```Comment with ID 66f489160f6e0282477688bf was successfully updated.```

#### Delete comment

_Delete a comment from the database_

**Admin only**

Example URI: `DELETE` `/api/comments/:id`

**Request Headers:**

| Name            | Type   | Description                                         | Optional |
| --------------  | ------ | --------------------------------------------------- | -------- |
| `Authorization` | `JWT`  | Bearer token for authenticating the user request    | **No**   |

**Request Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `id` | `ObjectId` | The ID of the comment |

**Responses:**

- **200 OK**: The comment was successfully deleted.
- **400 Bad Request**: Missing ID parameter in the request.
- **404 Not Found**:
  - No comment found with the provided ID.
  - The delete operation acknowledged, but the comment to delete does not exist.
- **500 Internal Server Error**: An unexpected error occurred while trying to delete the comment.

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

**Responses:**

- **201 Created**: The user was successfully created, and the created user is returned in the response.
- **400 Bad Request**: Missing required parameters (title or content) in the request.
- **500 Internal Server Error**: An unexpected error occurred while trying to create the user.

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

```Logout successful```

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
    "accessToken": "XXX",
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

```Sign up successful```

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

**Admin only**

- **Example URI**: `POST` `/api/reset`
- **Description**: This endpoint resets the database by clearing all existing documents in each collection and populating it with initial data.

**HTTP Response Codes**:
- **200 OK**: The database was successfully reset, and a confirmation message is returned.
- **500 Internal Server Error**: An unexpected error occurred while attempting to reset the database.