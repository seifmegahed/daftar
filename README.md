# Daftar

An ERP Web App to manage Engineering Business's contracting projects and resources

This web app is not meant to be deployed to a cloud provider.
It uses the server's filesystem to store and retrieve files, and might use web sockets in the future.
So Vercel, Netlify, or any other VPS hosting provider is not recommended.

## Tech Stack
- Typescript
- Next.js
- React
- Tailwind CSS
- Shadcn ui
- Drizzle ORM
- PostgreSQL
- Zod

## System Architecture

### Data Flow Design
![Data Flow Diagram](/docs/images/system-design-data-validation.png)

As **Immanuel Kant** famously noted in his 1808 Medium article, *"A Critique of Software Development: Observations on the Metaphysics of a Sublime System Design"*: **"You kant trust data coming from the client."**

![YouKant](/docs/images/you-kant.png)

In keeping with this timeless philosophy, I've implemented validation using `Zod` both on the client and server sides. This approach ensures that data is thoroughly validated before it reaches the database, enabling better error handling and data consistency across the system. 

By validating on both ends, we can prevent invalid data from slipping through and safeguard the integrity of the system, which simplifies the debugging process and enhances overall reliability.

#### Error Handling

In this project, I've adopted a GO-like error-handling approach. The main goal is to ensure a clear separation of concerns when returning data or errors, making it explicit that any function either returns valid data or an error message, never both. This design promotes safer, more predictable code that’s easy to reason about and maintain.

```ts
/** 
 * XOR
 * 
 * Either return a value or an error message, never both and never neither 
 * @return [null, errorMessage] | [returnValue, null]
 */
type ReturnTuple<T> = readonly [T, null] | readonly [null, string];
```

By using TypeScript’s type system, the `ReturnTuple` type ensures that our functions can only return valid data or an error message, but never both. This ensures that handling edge cases and errors is enforced by the compiler, reducing the risk of unhandled exceptions or ambiguous states in the application.

This GO-like approach has several advantages over traditional error-handling methods (such as throwing exceptions):

- **Explicit error handling**: By requiring functions to return a tuple, error handling becomes mandatory at every call site, reducing the chances of uncaught exceptions or silent failures.
- **Predictable function signatures**: Since every function that may fail returns the same type (`ReturnTuple<T>`), it’s easy to reason about how errors are handled throughout the codebase.
- **Separation of concerns**: The function’s job is clearly split between returning data or handling an error, preventing confusion and enforcing clean, predictable logic.

Here's an example of a function that retrieves a user by their ID:

```typescript
// Return either user data or an error message
async function getUserById(id: number): Promise<ReturnTuple<UserDataType>> {
  try {
    const user = await getUserByIdQuery(id);
    
    // If no user is found, return an error
    if (!user) return [null, "User not found"];

    return [user, null]; // Success case
  } catch (error) {
    return [null, getErrorMessage(error)]; // Error handling
  }
}

// Example usage of the function:
async function handleGetUser(id: number) {
  const [user, error] = await getUserById(id);

  if (error) {
    console.error("Failed to fetch user:", error);
    // Handle the error, display a message to the user, etc.
  } else {
    console.log("User data:", user);
    // Continue with normal execution
  }
}
```

### Database Design
![Database Diagram](/docs/images/system-design-database-diagram-3.svg)

#### Limitations

This design introduces polymorphic relationships, meaning a table can reference multiple other tables. The `DocumentsRelations` table acts as an intermediate table to store relationships between documents, projects, items, suppliers, and clients.

##### Integrity

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

##### Querying

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

##### Scaling

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