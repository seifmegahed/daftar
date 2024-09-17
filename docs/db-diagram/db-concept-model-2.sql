Table Users {
  id int [pk]
  name varchar
  active bool
  role varchar
}

Table Contacts {
  id int [pk]
  refTable varchar
  refId int [ref: > Suppliers.id, ref: > Clients.id]
  title varchar
  name varchar
  phone varchar
}

Table Addresses {
  id int [pk]
  refTable varchar
  refId int [ref: > Suppliers.id, ref: > Clients.id]
  addressTitle varchar
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
  itemId int [ref: > Items.id]
  projectId int [ref: > Projects.id]
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

Table DocumentsRelations {
  id int [pk]
  refTable varchar
  refId int [
    ref: > Items.id,
    ref: > Projects.id,
    ref: > Suppliers.id,
    ref: > Clients.id
  ]
  documentId int [ref: > Documents.id]
}
