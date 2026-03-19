# Models Schema Reference

This document summarizes Mongoose schema details for all models in this folder.

## Common Notes

- Every model has an auto-generated primary key: `_id` (MongoDB `ObjectId`).
- Every schema uses `{ timestamps: true }`, so these fields are also present:
  - `createdAt` (`Date`)
  - `updatedAt` (`Date`)

---

## Blog (`Blog`)

### Primary Key

- `_id` (`ObjectId`)

### Fields

| Field        | Data Type  | NOT NULL | UNIQUE | Relationship                        | Notes                                 |
| ------------ | ---------- | -------- | ------ | ----------------------------------- | ------------------------------------- |
| userId       | ObjectId   | No       | No     | Many-to-One -> User                 | `ref: "User"`                         |
| title        | String     | Yes      | No     | -                                   | `trim: true`                          |
| slug         | String     | Yes      | Yes    | -                                   | `trim: true`                          |
| featureImage | String     | No       | No     | -                                   | `default: ""`                         |
| content      | String     | Yes      | No     | -                                   | -                                     |
| visits       | Number     | No       | No     | -                                   | `default: 0`                          |
| category     | ObjectId   | No       | No     | Many-to-One -> Category             | `ref: "Category"`, `default: null`    |
| tags         | ObjectId[] | No       | No     | Many-to-Many (array of refs) -> Tag | Array of `ObjectId` with `ref: "Tag"` |
| isPublic     | Boolean    | No       | No     | -                                   | `default: true`                       |
| isDraft      | Boolean    | No       | No     | -                                   | `default: false`                      |

### Relationships

- `userId` references `User`.
- `category` references `Category`.
- `tags[]` references `Tag`.

---

## Bookmark (`Bookmark`)

### Primary Key

- `_id` (`ObjectId`)

### Fields

| Field  | Data Type | NOT NULL | UNIQUE | Relationship        | Notes         |
| ------ | --------- | -------- | ------ | ------------------- | ------------- |
| userId | ObjectId  | Yes      | No     | Many-to-One -> User | `ref: "User"` |
| blogId | ObjectId  | Yes      | No     | Many-to-One -> Blog | `ref: "Blog"` |

### Relationships

- `userId` references `User`.
- `blogId` references `Blog`.

### Unique Constraints

- Composite unique index: `(userId, blogId)`.

---

## Category (`Category`)

### Primary Key

- `_id` (`ObjectId`)

### Fields

| Field        | Data Type | NOT NULL | UNIQUE | Relationship        | Notes                           |
| ------------ | --------- | -------- | ------ | ------------------- | ------------------------------- |
| name         | String    | Yes      | Yes    | -                   | `trim: true`                    |
| slug         | String    | Yes      | Yes    | -                   | `trim: true`, `lowercase: true` |
| description  | String    | No       | No     | -                   | `default: ""`, `trim: true`     |
| featureImage | String    | No       | No     | -                   | `default: ""`                   |
| createdBy    | ObjectId  | No       | No     | Many-to-One -> User | `ref: "User"`                   |

### Relationships

- `createdBy` references `User`.

---

## Comment (`Comment`)

### Primary Key

- `_id` (`ObjectId`)

### Fields

| Field         | Data Type | NOT NULL | UNIQUE | Relationship              | Notes                             |
| ------------- | --------- | -------- | ------ | ------------------------- | --------------------------------- |
| userId        | ObjectId  | No       | No     | Many-to-One -> User       | `ref: "User"`                     |
| blogId        | ObjectId  | No       | No     | Many-to-One -> Blog       | `ref: "Blog"`                     |
| content       | String    | Yes      | No     | -                         | -                                 |
| parentComment | ObjectId  | No       | No     | Self-Reference -> Comment | `ref: "Comment"`, `default: null` |

### Relationships

- `userId` references `User`.
- `blogId` references `Blog`.
- `parentComment` references `Comment` (threaded replies).

---

## Follow (`Follow`)

### Primary Key

- `_id` (`ObjectId`)

### Fields

| Field     | Data Type | NOT NULL | UNIQUE | Relationship        | Notes         |
| --------- | --------- | -------- | ------ | ------------------- | ------------- |
| follower  | ObjectId  | No       | No     | Many-to-One -> User | `ref: "User"` |
| following | ObjectId  | No       | No     | Many-to-One -> User | `ref: "User"` |

### Relationships

- `follower` references `User`.
- `following` references `User`.

---

## Like (`Like`)

### Primary Key

- `_id` (`ObjectId`)

### Fields

| Field  | Data Type | NOT NULL | UNIQUE | Relationship        | Notes         |
| ------ | --------- | -------- | ------ | ------------------- | ------------- |
| userId | ObjectId  | No       | No     | Many-to-One -> User | `ref: "User"` |
| blogId | ObjectId  | No       | No     | Many-to-One -> Blog | `ref: "Blog"` |

### Relationships

- `userId` references `User`.
- `blogId` references `Blog`.

---

## Report (`Report`)

### Primary Key

- `_id` (`ObjectId`)

### Fields

| Field       | Data Type     | NOT NULL | UNIQUE | Relationship        | Notes                                                                                                                                    |
| ----------- | ------------- | -------- | ------ | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| reportedBy  | ObjectId      | Yes      | No     | Many-to-One -> User | `ref: "User"`                                                                                                                            |
| blogId      | ObjectId      | Yes      | No     | Many-to-One -> Blog | `ref: "Blog"`                                                                                                                            |
| reason      | String (enum) | Yes      | No     | -                   | Allowed: `SPAM`, `HARASSMENT`, `HATE_SPEECH`, `MISINFORMATION`, `INAPPROPRIATE_CONTENT`, `COPYRIGHT_VIOLATION`, `OTHER`; default `OTHER` |
| description | String        | No       | No     | -                   | `default: ""`, `trim: true`                                                                                                              |
| status      | String (enum) | No       | No     | -                   | Allowed: `PENDING`, `REVIEWED`, `RESOLVED`, `DISMISSED`; default `PENDING`                                                               |
| reviewedBy  | ObjectId      | No       | No     | Many-to-One -> User | `ref: "User"`, `default: null`                                                                                                           |

### Relationships

- `reportedBy` references `User`.
- `blogId` references `Blog`.
- `reviewedBy` references `User`.

### Unique Constraints

- Composite unique index: `(reportedBy, blogId)`.

---

## Tag (`Tag`)

### Primary Key

- `_id` (`ObjectId`)

### Fields

| Field | Data Type | NOT NULL | UNIQUE | Relationship | Notes                           |
| ----- | --------- | -------- | ------ | ------------ | ------------------------------- |
| name  | String    | Yes      | Yes    | -            | `trim: true`, `lowercase: true` |
| slug  | String    | Yes      | Yes    | -            | `trim: true`, `lowercase: true` |

---

## User (`User`)

### Primary Key

- `_id` (`ObjectId`)

### Fields

| Field    | Data Type     | NOT NULL | UNIQUE | Relationship | Notes                                                    |
| -------- | ------------- | -------- | ------ | ------------ | -------------------------------------------------------- |
| name     | String        | Yes      | No     | -            | `trim: true`                                             |
| username | String        | Yes      | Yes    | -            | `trim: true`, `lowercase: true`                          |
| email    | String        | Yes      | Yes    | -            | `trim: true`, `lowercase: true`                          |
| password | String        | Yes      | No     | -            | Hashed in `pre("save")` middleware                       |
| gender   | String (enum) | No       | No     | -            | Allowed: `""`, `MALE`, `FEMALE`, `OTHER`; default `null` |
| avatar   | String        | No       | No     | -            | `default: ""`                                            |
| role     | String (enum) | No       | No     | -            | Allowed: `USER`, `ADMIN`; default `USER`                 |
| bio      | String        | No       | No     | -            | `default: ""`, `trim: true`                              |
