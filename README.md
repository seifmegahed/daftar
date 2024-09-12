# Daftar

An ARP Web App to manage Engineering Business's contracting projects and resources

This web app is not meant to be deployed to a cloud provider.
It uses the server's filesystem to store and retrieve files, and might use web sockets in the future.
So Vercel, Netlify, or any other hosting provider is not recommended.


## TODO

- [x] Add a database
- [x] Define User table
- [x] Implement Auth middleware with JWT
- [x] Implement Login functionality
- [x] Implement Change Password functionality
- [x] Implement Nodejs SuperAdmin add user functionality
- [x] Implement Logout functionality
- [ ] Implement Admin add user functionality


To stop and remove the database container, run the following commands:

```bash
sudo docker stop daftar-postgres
sudo docker container rm daftar-postgres
sudo docker volume rm daftar-postgres-data
```
  
## License

MIT