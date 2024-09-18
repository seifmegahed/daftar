Table Users {
  id int [pk]
  name varchar
  active bool
  role varchar
}

Table Contacts {
  id int [pk]
  supplierId int [ref: > Suppliers.id]
  clientId int [ref: > Clients.id]
  title varchar
  name varchar
  phone varchar
}

Table Addresses {
  id int [pk]
  supplierId int [ref: > Suppliers.id]
  clientId int [ref: > Clients.id]
  addressTitle varchar
  address varchar
  city varchar
  country varchar
}

Table Clients {
  id int [pk]
  name varchar
  registrationNumber varchar [unique]
}

Table Suppliers {
  id int [pk]
  name varchar
  category varchar
  registrationNumber varchar [unique]
}


Table Projects {
  id int [pk]
  name varchar [unique]
  date date
  clientId int [ref: > Clients.id]
  owner int [ref: > Users.id]
  description varchar
}

Table Items {
  id int [pk]
  type varchar
  name varchar
  mpn varchar
  make varchar
  description varchar
}

Table ProjectItems {
  id int [pk]
  supplierId int [ref: > Suppliers.id]
  itemId int [ref: > Items.id]
  projectId int [ref: > Projects.id]
  price numeric
  currency enum
  quantity int
}

Table Documents {
  id int [pk]
  title varchar
  type varchar
  path varchar
  fileType varchar
}

Table DocumentsRelations {
  id int [pk]
  supplierId int [ref: > Suppliers.id]
  itemId int [ref: > Items.id]
  projectId int [ref: > Projects.id]
  documentId int [ref: > Documents.id]
  clientId int [ref: > Clients.id]
}