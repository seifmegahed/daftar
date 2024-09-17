--- DB Concept Model 1 ---
--- This is the concept diagram for the database. It shows the tables and their relationships. ---
--- It is not a complete representation of the database, but rather a conceptual model. ---
--- This file can be used to generate a graphical representation of the database using https://dbdiagram.io/ ---

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
  AddressTitle varchar
  address varchar
  city varchar
  country varchar
}

Table Clients {
  id int [pk]
  name varchar
  registrationNumber varchar [unique]
  address varchar
  city varchar
  country varchar
}

Table Suppliers {
  id int [pk]
  name varchar
  field varchar
  registrationNumber varchar [unique]
  address varchar
  city varchar
  country varchar
}

Table Projects {
  id int [pk]
  name varchar [unique]
  date date
  owner int [ref: > Users.id]
  client int [ref: > Clients.id]
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

Table ItemSuppliers {
  id int [pk]
  itemId int [ref: > Items.id]
  supplierId int [ref: > Suppliers.id]
}

Table ProjectItems {
  id int [pk]
  projectId int [ref: > Projects.id]
  itemId int [ref: > Items.id]
  price numeral
  currency enum
}

Table Documents {
  id int [pk]
  title varchar
  type varchar
  path varcahr
  fileType varchar
}

Table ItemDocuments {
  id int [pk]
  itemId int [ref: > Items.id]
  documentId int [ref: > Documents.id]
}

Table ProjectDocuments {
  id int [pk]
  projectId int [ref: > Projects.id]
  documentId int [ref: > Documents.id]
}

Table ClientDocuments {
  id int [pk]
  clientId int [ref: > Clients.id]
  documentId int [ref: > Documents.id]
}

Table SupplierDocuments {
  id int [pk]
  supplierId int [ref: > Suppliers.id]
  documentId int [ref: > Documents.id]
}

Table FinancialOffers {
  id int [pk]
  projectId int [ref: > Projects.id]
  otherData json
}

Table TechnicalOffers {
  id int [pk]
  projectId int [ref: > Projects.id]
  otherData json
}
