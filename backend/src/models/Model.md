# Entities and Relationships

## 1. User

**_Attributes:_**

- userId (PK)
- username
- email
- password
- profilePicture
- bio
- createdAt
- updatedAt

**_Relationships:_**

- A User can create multiple Posts (1-to-many).
- A User can write multiple Comments (1-to-many).
- A User can like multiple Posts (many-to-many through Likes).

## 2. Post

**_Attributes:_**

- postId (PK)
- title
- content
- authorId (FK, references User)
- category
- createdAt
- updatedAt

**_Relationships:_**

- A Post can have multiple Comments (1-to-many).
- A Post can have multiple Likes (many-to-many through Likes).
- A Post can belong to multiple Tags (many-to-many through PostTags).

---

## 3. Comment

**_Attributes:_**

- commentId (PK)
- content
- authorId (FK, references User)
- postId (FK, references Post)
- createdAt
- updatedAt

**_Relationships:_**

- A Comment belongs to one User (many-to-1).
- A Comment belongs to one Post (many-to-1).`

---

## 4. Like

**_Attributes:_**

- likeId (PK)
- userId (FK, references User)
- postId (FK, references Post)
- createdAt

**_Relationships:_**

- A Like involves one User (many-to-1).
- A Like involves one Post (many-to-1).
