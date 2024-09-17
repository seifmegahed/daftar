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
![Database Diagram](/docs/images/system-design-database-diagram.svg)

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
- [ ] Implement User settings page
- [ ] Implement User change name form
- [ ] Implement User change password form
- [ ] Implement Password validation for user to change password

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