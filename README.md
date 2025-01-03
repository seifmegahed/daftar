# Daftar

A Web App to manage Engineering Business's data. The user can create, update, and delete clients, suppliers, items, and documents (files). 
The end goal is for the user to link all this data together to create a project. This makes looking up data easier and more efficient.

This is a full stack web app written in Typescript using Next.js 14.

This web app is not meant to be deployed to a serverless hosting provider.
It required read/write permissions to the server's filesystem to store and retrieve files.
So Vercel, Netlify, or any other serverless hosting provider is not recommended.

That being said, I have hosted a demo version of this app on Vercel. 
It is fully functional, but the file upload and download features are faked.

To use the demo version, you can contact me via email.

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

### Database Design
Based on the nature of this project, the obvious choice would be to use a relational database. I opted for PostgreSQL, as it is a mature and well-established database that is widely used in the industry. As for interfacing with the database, I used Drizzle ORM, which is a powerful and flexible ORM that allows for easy querying and manipulation of the database.
Drizzle uses a syntax that closely resemble SQL, making it easy to learn and use. It also provides a lot of features that make it a powerful tool for working with databases such as transactions, migrations, and more.

![Database Diagram](/docs/images/system-design-database-diagram-5.svg)

This diagram is a relation representation diagram. It is meant to show the relations between the tables.

The main data tables in the data base are as follows:
- Projects
- Clients
- Suppliers
- Items
- Documents
  
These tables form the apps main data.

#### Relations

**Project**
- One Owner
- One Client
- Many Documents
- Many Sale Items
- Many Purchase Items
- Many Comments

**Client**
- Many Documents
- Many Projects
- Many Addresses
- Many Contacts

**Supplier**
- Many Documents
- Many Purchase Items
- Many Addresses
- Many Contacts

**Item**
- Many Documents
- Many Suppliers

**Document**
- Many Projects
- Many Items
- Many Suppliers
- Many Clients

In this design there are three many to many relations between the tables. I achieve this relationship by creating a table that stores the relations between the tables.
- DocumentRelations
- SaleItems
- PurchaseItems

Sale Items and Purchase Items are essentially the same, except that a purchase item has a supplier.

Document relations is a bit complicated. First let me define what a document is and provide use cases.
A document is essentially a file. It can be a pdf, a word document, or a spreadsheet etc. An Item for example can have a `User Manual` document linked to it. 
A project might have a `Contract` document linked to it, etc. 

Documents can be shared across all relations. For example two Items might share a `Factory Compliance Certificate` Document.

**Limitations**

The issue with this approach is that in the document relations table, none of the fields are enforced at the database level to be not null except for the documentId. Which opens up the possibility of creating stray document relation records that are not linked to any other record.
In order to prevent this, we have to enforce the relations at the application level. This means that we need to check that there is one and only one defined record for each document relation apart from the documentId. I used `Zod` to achieve this.

```ts
const isExactlyOneDefined = <T extends object>(obj: T): boolean => {
  const definedValues = Object.values(obj).filter(
    (value) => value !== null && value !== undefined,
  );
  return definedValues.length === 1;
};

const documentRelationsSchema = createInsertSchema(
  documentRelationsTable,
)
  .omit({ documentId: true })
  .refine((data) => {
    const { projectId, itemId, supplierId, clientId } = data;
    return isExactlyOneDefined({ projectId, itemId, supplierId, clientId });
  });
```

Using the isExactlyOneDefined utility function, we can ensure that the document relations table accepts one and only one of the relations apart from the documentId.

**Example Usage**

```typescript
// This will throw an error
documentRelationsSchema.parse({
  documentId: 1,
  projectId: 1,
  itemId: 1,
  supplierId: 1,
  clientId: 1,
})

// This will throw an error
documentRelationsSchema.parse({
  documentId: 1,
  projectId: 1,
  clientId: 1,
})

  // This will throw an error
documentRelationsSchema.parse({
  documentId: 1,
})

// This will pass
documentRelationsSchema.parse({
  documentId: 1,
  projectId: 1,
})
```

#### Full Text Search
In this project, we implemented full text search using `ts_vector` and `to_tsvector` functions. And I created search indexes using `GIN` index type. This allows for fast full text search.

**Example**

```ts
const clientsTable = pgTable(
  "client",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 64 }).notNull().unique(),
    // ...
  },
  (table) => ({
    clientsSearchIndex: index("clients_search_index").using(
      "gin",
      sql`to_tsvector('english', ${table.name})`,
    ),
  }),
);
```

I wrote a utility function `prepareSearchText` that takes a search text and prepares it for full text search. It removes any extra spaces, converts it to lowercase, and adds a wildcard at the end of the search text. This function needs some improvements, but it works for now.

```ts
export const prepareSearchText = (searchText: string) => {
  searchText = searchText.trim().replace(/\s+/g, " ").toLowerCase();
  if (!searchText) return "";
  const searchTextArray = searchText.split(" ");
  searchTextArray[searchTextArray.length - 1] += ":*";
  return searchTextArray.join(" | ");
};
```

**Example Usage**

```ts

const clientSearchQuery = (searchText: string) =>
  sql`
      to_tsvector('english', ${clientsTable.name}) ,
      to_tsquery(${prepareSearchText(searchText)})
  `;

const getClients = async (searchText: string) => {
  const clients = await db
    .select({
      id: clientsTable.id,
      name: clientsTable.name,
      rank: searchText
        ? sql`ts_rank(${clientSearchQuery(searchText)})`
        : sql`1`,
    })
    .from(clientsTable)
    .orderBy((table) =>
      searchText ? desc(table.rank) : desc(clientsTable.id),
    );

  return clients;
}
```

In this example, we create a virtual column called `rank` that ranks the clients based on the search text using `ts_rank`. We then order the results by the `rank` column if a search text is provided, otherwise we order by the `id` column.

I use this approach in all my search queries so that I don't have to query the count of the results every time a user is searching to adjust the pagination element. This makes the queries faster and more efficient.

### Authentication

Authentication is a crucial aspect of any web application. In this project, I wrote a custom authentication system that uses JWT tokens to authenticate users. The design uses `Jose` for signing and verifying the tokens, and `bcrypt` for hashing the passwords.

The authentication happens at the middleware level, by checking the token in the request headers. If the token is valid, the request is allowed to proceed. If the token is invalid or missing, the user is redirected to the login page.

The application has no sign up or registration functionality by design. Users are created by an admin user. The admin user can create new users, but they are not allowed to sign up themselves.

Creating an initial admin user is done by running the `admin` script. This script creates an admin user with the given username and password, and persists the admin user in the database. This user can then be used to access the admin panel and add other users.

#### Roles

In this project, I have implemented a simple role-based access control system. The roles are:

- Admin - Admins have all privileges, and can access all private data and perform all actions
- Super User - Super users can access all private data and perform basic actions
- User - Regular users can only access public data and perform basic actions

> Note: 
>   - Basic actions include creating and editing. In most cases they do not include deleting.
>   - Private data includes any financial data like sale items or documents that are marked as private.


### Error Handling

In this project, I've adopted a GO-like error-handling approach. I have implemented this approach using type that takes in a generic and creates a tuple of either the generic and a null or a null and an error message.

```ts
/**
 * This type ensures the the return is either the expected value or an error message.
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

In the example above, when we call `fetchUserData()` typescript expects the `user` const to be of type `User | null`. However, if we handle the null case in `error` or `user`, typescript will infer that `user` is of type `User`. This forces us to handle the error exception.

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

In this client-side example, we bind a server action function call to button click. The function increments a server side variable and returns the result. 
Here we handle returned error messages and show them to the user using a toast, but we still use a try-catch block to catch any other errors that might occur and toast a generic error message to the user.

**Edge Cases**

In some cases, a server action might call a `redirect` call back from next/navigate. In this case, the return type would be undefined. This would cause an error in the client-side if we use any of the above approaches.
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

  return <button onClick={handleLogout}>Logout</button>;
};
```

In this example, the logout server action will return undefined if successful because of the redirect call.
So on the client side we first store the response in a const and then handle the undefined case. then we handle the error case.

**Note**

Later on, during the development of the project, I found a video that explains this approach. In the video the author returns a the error object instead of an error message.
You can find the video [here](https://youtu.be/WRuNQWPD5QI?si=_UYf1bn7KL4amFO5). To be honest i had some doubts about this approach and it's usefulness, but this video gave me more confidence in it. (although it was posted after I had already implemented it :P)

The decision to use null over undefined wasn't really an intentional one. I felt like paying tribute to the GOphers. Maybe there is utility in a null value being a valid value, but I haven't explored this further tbh.

### Production

The production build is built using `next build` and then it is served using `PM2` and `Nginx`. 

**Scaling**

I use `PM2` to spin multiple instances of the application, and handle the load balancing. The `PM2` configuration is done in the `pm2.json` file. There you can define how many instances you want.

**Cache**

Since `PM2` serves multiple instances of the app, the production build must use a centralized cache store. This is done using `Redis` and `@neshca/cache-handler` package in the `cache-handler.mjs` file. This cache handler is passed to NextJs in the `next.config.js` file.

**SSL**

At first I wrote a simple `server.ts` script to handle SSL, but opted to use `Nginx` instead. This is because `Nginx` is more flexible and much more powerful at handling SSL than `Node.js`. Also this creates a separation of concerns between the server and the app.
 
![Production Stack](/docs/images/production-stack.png)

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

## Development and Production

```bash
pnpm install
```

To run the application in development mode, use the following command:

```bash
pnpm run dev
```

There are two ways to run the application in production mode. The first is to use `next start` which will start a regular instance of the application.

```bash
pnpm run start
```

The second way is to use pm2 to run the application in production mode. To do this, first install pm2 globally using the following command:

```bash
npm install pm2 -g
```

Then, run the following command to start the application:

```bash
pm2 start pm2.json
```

To configure pm2, you can modify the `pm2.json` file. This file contains the configuration for the application, including the path to the application's entry point, the port to use, and the number of instances to run.

## License

MIT