# Task-Manager
Task Manager for managing notes, not Task Manager (the kind that manages processes on desktops).

## API 

| No. | Method | Route                    | Description                         |
|-----|--------|--------------------------|-------------------------------------|
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








