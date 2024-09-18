# Daftar

An ARP Web App to manage Engineering Business's contracting projects and resources

This web app is not meant to be deployed to a cloud provider.
It uses the server's filesystem to store and retrieve files, and might use web sockets in the future.
So Vercel, Netlify, or any other hosting provider is not recommended.


## Tech Stack
- Typescript
- Next.js
- React
- Tailwind CSS
- Drizzle ORM
- PostgreSQL

## System Architecture

### Data Flow Diagram
![Data Flow Diagram](/docs/images/system-design-data-validation.png)

### Database Diagram
![Database Diagram](/docs/images/system-design-database-diagram-3.svg)

### Limitations

This design introduces polymorphic relationships, meaning a table can reference multiple other tables. The `DocumentsRelations` table acts as an intermediate table to store relationships between documents, projects, items, suppliers, and clients.

#### Integrity

A major concern with this design is the lack of strict database-level constraints to ensure that each row in the `DocumentsRelations` table references exactly one entity besides the `Documents` table. For example, a row should reference either a project, item, supplier, or client, but not multiple entities simultaneously. 

Since the relationship is polymorphic, we can't apply `NOT NULL` constraints to these foreign keys:

```sql
table DocumentsRelations (
  id int [pk]
  documentId int [ref: > Documents.id, not null]

  projectId int [ref: > Projects.id]
  itemId int [ref: > Items.id]
  supplierId int [ref: > Suppliers.id]
  clientId int [ref: > Clients.id]
)
```

**Application-Level Enforcement**  
To address this, we can enforce integrity at the application level by adding validation logic in the server or application code. For example, we can create specific functions to handle inserting relations, ensuring that only one relationship type is assigned per row:

```ts
function createProjectDocumentRelationAction(projectId: number, documentId: number) {
  // Ensure only projectId and documentId are passed, and others are null
  ...
}
```

By doing this, we can tightly control how relations are inserted and avoid situations where multiple foreign keys are populated at once.

#### Querying

Another challenge with this design is querying documents when many columns in the `DocumentsRelations` table are `null`. Using `LEFT JOIN` to join related tables (e.g., projects, suppliers, and clients) can result in complex queries, especially when we need to account for which entity a document is related to.

For instance, querying for documents and their related entities:

```ts
const documentRelations = await db
  .select({
    project: projects,
    supplier: suppliers,
    client: clients,
    document: documents,
  })
  .from(documents)
  .leftJoin(documentsRelations, eq(documents.id, documentsRelations.documentId))
  .leftJoin(projects, eq(documentsRelations.projectId, projects.id))
  .leftJoin(suppliers, eq(documentsRelations.supplierId, suppliers.id))
  .leftJoin(clients, eq(documentsRelations.clientId, clients.id))
  .where(eq(documents.id, documentId));
```

This can become cumbersome, as many of the joined tables will have `null` values when they are not related to a specific document. However, we can simplify the query when retrieving documents by referencing a specific entity:

```ts
const projectWithDocuments = await db
  .select({
    project: projects,
    relatedDocuments: documents,
  })
  .from(projects)
  .leftJoin(documentsRelations, eq(projects.id, documentsRelations.projectId))
  .leftJoin(documents, eq(documentsRelations.documentId, documents.id))
  .where(eq(projects.id, projectId));
```

This query works more efficiently by narrowing the focus to documents related to a specific project.

#### Scaling

A significant consideration is the scalability of this design. Adding new types of relationships, such as "users having many documents," requires altering the `DocumentsRelations` table by adding new foreign key columns (e.g., `userId`). Each time a new entity needs to be related to documents, we will need to perform a database migration, which can become time-consuming and difficult to manage as the system evolves.

For better scalability, I considered moving toward a more generalized polymorphic pattern, where each relation is represented by a `refTable` and `refId` pair, thus avoiding the need to add new columns for each type of relationship:

```sql
table DocumentsRelations (
  id int [pk]
  documentId int [ref: > Documents.id, not null]
  refTable enum('projects', 'items', 'suppliers', 'clients')
  refId int [not null]
)
```

This allows for a more flexible design that can accommodate new relationships without requiring schema changes, but lacks foreign key referential integrity, and it requires complex queries to retrieve related data. 
So I decided to go with the strict referential integrity design.


## TODO

- [x] Add a database
- [x] Define User table
- [x] Implement Auth middleware with JWT
- [x] Implement Login functionality
- [x] Implement Change Password functionality
- [x] Implement Nodejs SuperAdmin add user functionality
- [x] Implement Logout functionality
- [x] Role protected Admin page
- [x] Error Boundary Page
- [x] Setup app layout
- [x] Implement Admin add user functionality
- [x] Implement Go's tuple return concept to properly handle and parse errors
- [x] Add Last Active, Created, Updated, and Deactivated columns to the User table
- [x] Implement Admin change user password functionality
- [x] Implement Admin edit user role functionality
- [x] Implement Admin deactivate user functionality
- [x] Implement Admin edit user name functionality
- [x] Implement User settings page
- [x] Implement User change name form
- [x] Implement User change password form
- [x] Implement Password validation for user to change password

### Error Handling
Error handling is implemented using try-catch blocks in the server actions.
The error is caught and returned as a tuple in the form of `[null, errorMessage]`.
If there is no error, the tuple is `[returnValue, null]`.
This makes it easier to handle errors in the frontend.

```typescript
// Either return a value or an error message, never both and never neither
type ReturnTuple<T> = readonly [T, null] | readonly [null, string];
```

## Environment Variables
You can find an example of the environment variables in the `.env-e` file.
Copy the `.env-e` file to `.env` and fill in the values.

## Database Container Commands

To start the database container, make sure you have Docker installed and your environment variables are set up. Then run the following command:

```bash
sudo docker compose up -d
```

To stop the database container, run the following command:

```bash
sudo docker compose down
```

## Create initial admin user

In order to use the application, you need to create an initial admin user. Since there is no registration process, you will need to create the admin user manually. This admin user can be used to access the admin panel and add other users.

Before running the command, make sure you run `pnpm install` in the `admin` directory, and that you have created the `.env` file in the root directory, and that the database container is running.

```bash
cd admin
pnpm install
cd ..
```

To create the initial admin user, run the following command:

```bash
pnpm run admin <username> <password>
```

This will create an admin user with the specified username and password.

Alternatively, you can set the `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables in the `.env` file and run the command without specifying the username and password arguments.

```bash
pnpm run admin
```
  
## License

MIT