# Task-Manager

Task Manager for managing notes, not Task Manager (the kind that manages processes on desktops).

## API


| No. | Method | Route                    | Description                         |
| --- | ------ | ------------------------ | ----------------------------------- |
| 1   | POST   | /api/v1/auth/register    | Register a new user                 |
| 2   | POST   | /api/v1/auth/login       | Log in, get a token                 |
| 3   | DELETE | /api/v1/auth/me          | Delete your own account             |
| 4   | GET    | /api/v1/sync/            | Sync data                           |
| 5   | POST   | /api/v1/notes            | Create a new note                   |
| 6   | GET    | /api/v1/notes            | Get notes (filter: tag, words, etc) |
| 7   | GET    | /api/v1/notes/id         | Get a note                          |
| 8   | PUT    | /api/v1/notes/id         | Update a note                       |
| 9   | DELETE | /api/v1/notes/id         | Delete a note                       |
| 10  | GET    | /api/v1/notes/trash      | Get all deleted notes               |
| 11  | PUT    | /api/v1/notes/id/restore | Restore a deleted note              |
| 12  | DELETE | /api/v1/notes/trash/id   | Permanently delete the note         |
| 13  | POST   | /api/v1/tags             | Create a new tag                    |
| 14  | GET    | /api/v1/tags             | Get all of the user's tags          |
| 15  | PUT    | /api/v1/tags/{tagId}     | Update a tag's name                 |
| 16  | DELETE | /api/v1/tags/{tagId}     | Delete a tag                        |

## User

### POST /api/v1/auth/register

**Body**
```json
{
    "username" : "test1",
    "password": "123456"
}
```

**Response**
```json
{
    "message": "User registered successfully.",
    "data": "Something super long.",
    "error": null
}
```

### DELETE /api/v1/auth/me

**Body**
```json
{
    "password": "123456"
}
```

**Response**
```json
{
    "message": "User deleted successfully.",
    "data": null,
    "error": null
}
```

## Note

### GET /api/v1/notes

**Response**
```json
{
    "message": "Notes retrieved successfully.",
    "data": {
        "notes": [],
        "total": 0,
        "page": 1,
        "pages": 0
    },
    "error": null
}
```

### POST /api/v1/notes

**Body**: same as data in response, minus some fields.

**Response**
```json
{
    "message": "Note created successfully.",
    "data": {
        "uuid": "note1",
        "title": "Project",
        "body": [
            {
                "type": "text",
                "data": {
                    "text": "Initial brainstorming session for the new project.",
                    "checked": false
                }
            },
            {
                "type": "checklist",
                "data": {
                    "text": "Define Q1 milestones",
                    "checked": true
                }
            },
            {
                "type": "checklist",
                "data": {
                    "text": "Setup the repository and CI/CD pipeline",
                    "checked": false
                }
            }
        ],
        "isPinned": true,
        "user": "68c36ab6c63fa1eb2d4a4bf6",
        "tagUUIDs": [
            "tag1",
            "tag2"
        ],
        "isDeleted": false,
        "_id": "68c3ef3f47af0b418114c5a0",
        "createdAt": "2025-09-12T10:00:31.837Z",
        "updatedAt": "2025-09-12T10:00:31.837Z",
        "__v": 0,
        "id": "68c3ef3f47af0b418114c5a0"
    },
    "error": null
}
```

### PUT /api/v1/notes/id

**Body**
```json
{
    "title": "Project 2 test"
}
```

**Response**
```json
{
    "message": "Note updated successfully.",
    "data": {
        "_id": "68c3efc647af0b418114c5a4",
        "uuid": "note2",
        "title": "Project 2 test",
        "body": [
            // bla bla bla
        ],
        "isPinned": false,
        "user": "68c36ab6c63fa1eb2d4a4bf6",
        "tagUUIDs": [
            "tag1"
        ],
        "isDeleted": false,
        "createdAt": "2025-09-12T10:02:46.975Z",
        "updatedAt": "2025-09-12T10:07:29.104Z",
        "__v": 0,
        "id": "68c3efc647af0b418114c5a4"
    },
    "error": null
}
```

### DELETE /api/v1/notes/id

**Response**
```json
{
    "message": "Note deleted successfully.",
    "data": {
        "_id": "68c3f15973b6a199a22d8686",
        "uuid": "note99",
        "title": "note to delete",
        "body": [
            // bla bla bla
        ],
        "isPinned": false,
        "user": "68c36ab6c63fa1eb2d4a4bf6",
        "tagUUIDs": [],
        "isDeleted": true,
        "createdAt": "2025-09-12T10:09:29.065Z",
        "updatedAt": "2025-09-12T10:09:40.100Z",
        "__v": 0,
        "id": "68c3f15973b6a199a22d8686"
    },
    "error": null
}
```

### PUT /api/v1/notes/id/restore

**Response**
```json
{
    "message": "Note restored successfully.",
    "data": {
        "_id": "68c3f15973b6a199a22d8686",
        "uuid": "note99",
        "title": "note to delete",
        "body": [
            // bla bla bla
        ],
        "isPinned": false,
        "user": "68c36ab6c63fa1eb2d4a4bf6",
        "tagUUIDs": [],
        "isDeleted": false,
        "createdAt": "2025-09-12T10:09:29.065Z",
        "updatedAt": "2025-09-12T10:24:55.329Z",
        "__v": 0,
        "id": "68c3f15973b6a199a22d8686"
    },
    "error": null
}
```

### GET /api/v1/notes/trash

**Response**
```json
{
    "message": "Deleted notes retrieved successfully.",
    "data": [
        {
            "_id": "68c3f15973b6a199a22d8686",
            "uuid": "note99",
            "title": "note to delete",
            "body": [
                // bla bla bla
            ],
            "isPinned": false,
            "user": "68c36ab6c63fa1eb2d4a4bf6",
            "tagUUIDs": [],
            "isDeleted": true,
            "createdAt": "2025-09-12T10:09:29.065Z",
            "updatedAt": "2025-09-12T10:09:40.100Z",
            "__v": 0,
            "id": "68c3f15973b6a199a22d8686"
        }
    ],
    "error": null
}
```

### DELETE /api/v1/trash/id

**Response**
```json
{
    "message": "Note permanently deleted successfully.",
    "data": {
        "_id": "68c3f15973b6a199a22d8686",
        "uuid": "note99",
        "title": "note to delete",
        "body": [
            // bla bla bla
        ],
        "isPinned": false,
        "user": "68c36ab6c63fa1eb2d4a4bf6",
        "tagUUIDs": [],
        "isDeleted": true,
        "createdAt": "2025-09-12T10:09:29.065Z",
        "updatedAt": "2025-09-12T10:27:41.234Z",
        "__v": 0,
        "id": "68c3f15973b6a199a22d8686"
    },
    "error": null
}
```

## Tag

### GET /api/v1/tags

**Response**
```json
{
    "message": "Tags retrieved successfully.",
    "data": [
        {
            "_id": "68c3edaac5eb2281f2d1738e",
            "uuid": "tag2",
            "name": "personal",
            "user": "68c36ab6c63fa1eb2d4a4bf6",
            "isDeleted": false,
            "createdAt": "2025-09-12T09:53:46.334Z",
            "updatedAt": "2025-09-12T09:53:46.334Z",
            "__v": 0
        },
        {
            "_id": "68c3ee44c5eb2281f2d17398",
            "uuid": "tag1",
            "name": "work",
            "user": "68c36ab6c63fa1eb2d4a4bf6",
            "isDeleted": false,
            "createdAt": "2025-09-12T09:56:20.521Z",
            "updatedAt": "2025-09-12T09:56:20.521Z",
            "__v": 0
        }
    ],
    "error": null
}
```

### POST /api/v1/tags

**Body**
```json
{
    "uuid": "tag2",
    "name": "personal"
}
```

**Response**
```json
{
    "message": "Tag created successfully.",
    "data": {
        "uuid": "tag2",
        "name": "personal",
        "user": "68c36ab6c63fa1eb2d4a4bf6",
        "isDeleted": false,
        "_id": "68c3edaac5eb2281f2d1738e",
        "createdAt": "2025-09-12T09:53:46.334Z",
        "updatedAt": "2025-09-12T09:53:46.334Z",
        "__v": 0
    },
    "error": null
}
```


