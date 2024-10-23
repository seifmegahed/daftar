# Daftar

A Web App to manage Engineering Business's data. The user can create, update, and delete clients, suppliers, items, and documents (files). 
The end goal is for the user to link all this data together to create a project. This makes looking up data easier and more efficient.

This is a full stack web app written in Typescript using Next.js 14.

This web app is not meant to be deployed to a serverless hosting provider.
It required read/write permissions to the server's filesystem to store and retrieve files.
So Vercel, Netlify, or any other serverless hosting provider is not recommended.

That being said, I have hosted a demo version of this app on Vercel. 
It is fully functional, but the file uploading and downloading features are faked.

To use the demo version, you can contact me at seifmegahed at me dot com.

## Tech Stack
- Typescript
- Next.js
- React
- Tailwind CSS
- Shadcn ui
- Drizzle ORM
- PostgreSQL
- Zod
- Redis
- Nginx
- PM2

## System Design
I have the designed the system to be as modular as possible with an emphasis on separation of concerns. This approach allows for easier maintenance, scalability, and flexibility in the future. However, I would like to refactor the code in the future to make it comply with uncle bob's clean architecture principles.

In my design I separated the system into three main layers:
- The frontend
- The interface
- The business logic

The frontend is responsible for the user interface, including the layout, styling, and interactivity. It does have some business logic in the form of user input validation. This validation happens on both the frontend and the business logic layer.

The interface layer is responsible for the communication between the business logic and the database or other external systems. It handles the data retrieval and mutation operations.

The business logic layer is responsible for the business logic of the application. It handles the data validation, communication between the interface and the frontend.

![Design Diagram](/docs/images/system-design-diagram.png)

### Data Validation
![Data Flow Diagram](/docs/images/system-design-data-validation.png)

As **Immanuel Kant** famously noted in his 1808 Medium article, *"A Critique of Software Development: Observations on the Metaphysics of a Sublime System Design"*: **"You kant trust data coming from the client."**

![YouKant](/docs/images/you-kant.png)

In keeping with this timeless philosophy, I've implemented validation using `Zod` both on the client and server sides. This approach ensures that data is thoroughly validated before it reaches the database, enabling better error handling and data consistency across the system. 

By validating on both ends, we can prevent invalid data from slipping through and safeguard the integrity of the system, which simplifies the debugging process and enhances overall reliability.

### Error Handling

In this project, I've adopted a GO-like error-handling approach. I have implemented this approach using type that takes in a generic and creates a tuple of either the generic and a null or a null and an error message.

```ts
/**
 * This type ensures the the return is either the generic value or the error message.
 * 
 * Acts as an XOR gate (Either Or) (Never Neither) (Never Both)
 * 
 * This forces the caller to handle the error case.
 *
 * @param T The generic type to return
 * @returns A tuple of the generic type and a null or a null and a string error message
 */
export type ReturnTuple<T> = readonly [T, null] | readonly [null, string];
```

**Example Usage**

```typescript
function fetchUserData(): Promise<ReturnTuple<User>> {
  return [user, null];
}

/**
 * we assign the result of the fetchUserData function to a tuple
 */
const [user, error] = await fetchUserData();

/**
 * if the error is not null, it means that an error occurred
 * and we can handle it accordingly
 */
if (error !== null) {
  displayErrorMessage(error); // Show a friendly message to the user
} else {
  /**
   * here we can assume that the user is not null
   * and we can safely access its properties
   */
  updateUIWithData(user); // Proceed with normal flow
}
```

In my opinion this approach has several advantages:

**1. Forced Error handling**

In the example above, when we call `fetchUserData()` typescript expects the `user` const to be of type `User | null`. however, if we handle the null case in `error` or `user`, typescript will infer that `user` is of type `User`. This forces us to handle the error exception.

**2. Better performance**

Throwing an error in a try-catch block is considered by some to be expensive. By using this approach, we can create error messages for petty error cases without throwing an error.

**Example**
```ts
function fetchUserData(id: number): Promise<ReturnTuple<User>> {
  try {
    /**
     * fetch user data from the database
     */
    const [user] = await db.select().from(userTable).where(eq(userTable.id, id));

    /**
     * if the user is not found, return an error message
     * Otherwise return user
     */
    if (!user) return [null, "User not found"];
    return [user, null];
  } catch (error) {
    /**
     * if an error occurs, return an error message
     * and log error
     */
    console.error("User Fetch Error:", error)
    return [null, "An error occurred while fetching user data"];
  }
}
```

In this example, we can safely assume that the user might not exist in the database. If the user is not found, instead of throwing an error, we can just return an error message.
As for any other errors that might occur, we're still able to catch them in the try-catch block and handle them gracefully.

**3. Better Error Communication**

By using this approach, we can communicate errors in a more structured way. Instead of returning a generic error object and parsing it, we can return a specific error message that describes the error in a user-friendly way. and we can still catch any other errors that might occur on the client-side.

**Example**
```tsx
"use client"

function incrementServerSideCount() {

  const handleIncrementCount = async () => {
    try {
      const [count, error] = await incrementCountAction();
      if (error !== null) {
        toast.error(error);
        return;
      }
      toast.success(`Count incremented to ${count}`);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while incrementing the count");
    }
  }

  return (
    <button onClick={handleIncrementCount}>
      Increment Count
    </button>
  )
}
```

In this client-side example, we bind a server action to button click that mutates a server side value. Here we handle returned error messages and show them to the user using a toast, yet we still use a try-catch block to catch any other errors that might occur and toast a generic error message to the user.

**Edge Cases**
In some cases, a server action might call a redirect. In this case, the return type would be undefined. This would cause an error in the client-side if we use any of the above approaches.
To overcome this, we need to handle the undefined case first before assigning the result to a tuple.

**Server-Side Example** 
```ts
const logoutAction = async (id: number): Promise<ReturnTuple<number> | undefined> => {
  const [userId, error] = await logoutUser(id);
  if (error !== null) {
    return [undefined, error];
  }
  redirect("/login");
}
```
here we call the `logoutUser` function which handles the logout logic and returns a tuple of either the userId or an error message.

**Client-Side Example**
```tsx
"use client"

function LogoutButton({ id }: { id: number }) {
  const handleLogout = async () => {
    try {
      /**
       * we call the logoutAction function
       * and assign the result to a const
       */
      const response = await logoutAction(id);

      /**
       * Here we handle the undefined case which is expected
       * when the server redirects to the login page
       * and we can safely ignore it and wait for the redirect
       */
      if(!response) return;

      /**
       * If the logout action returns a value, it means that an error occurred
       * and we can handle it accordingly
       */
      const [, error] = response;
      if (error !== null) {
        toast.error(error);
        return;
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while logging out");
    }
  }
```

In this example, the logout server action will return undefined if successful because of the redirect call.
So on the client side we first store the response in a const and then handle the undefined case. then we handle the error case.

### Database Design
![Database Diagram](/docs/images/system-design-database-diagram-4.svg)

This is a conceptual diagram of the database design. It is not a complete or accurate representation of the actual database schema. The actual schema has more data fields and constraints. This diagram is meant to provide a high-level overview of the database structure.

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