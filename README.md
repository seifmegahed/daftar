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
- [x] Implement Admin add user functionality
- [ ] Implement Admin edit user role functionality
- [ ] Implement Admin reset user password functionality
- [ ] Implement Admin delete user functionality
- [ ] Implement Password validation for user to change password


## Database Container Commands

To start the database container, make sure you have Docker installed and your environment variables are set up. Then run the following command:

```bash
sudo ./start-database.sh
```

To stop the database container, run the following command:

```bash
sudo docker stop daftar-postgres
```

To remove the database container and its volume, run the following command:

```bash
sudo docker container rm daftar-postgres
sudo docker volume rm daftar-postgres-data
```
  
## License

MIT