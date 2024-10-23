Table Users {
  id int [pk]
  name varchar
}

Table Contacts {
  id int [pk]
  supplierId int [ref: > Suppliers.id]
  clientId int [ref: > Clients.id]
  title varchar
}

Table Addresses {
  id int [pk]
  supplierId int [ref: > Suppliers.id]
  clientId int [ref: > Clients.id]
  title varchar
}

Table Clients {
  id int [pk]
  name varchar
}


Table Suppliers {
  id int [pk]
  name varchar
}

Table Projects {
  id int [pk]
  name varchar [unique]
  owner int [ref: > Users.id]
  clientId int [ref: > Clients.id]
}

Table Items {
  id int [pk]
  name varchar
}

Table PurchaseItems {
  id int [pk]
  supplierId int [ref: > Suppliers.id]
  itemId int [ref: > Items.id]
  projectId int [ref: > Projects.id]
}

Table Documents {
  id int [pk]
  name varchar
}

Table DocumentsRelations {
  id int [pk]
  documentId int [ref: > Documents.id]
  supplierId int [ref: > Suppliers.id]
  itemId int [ref: > Items.id]
  projectId int [ref: > Projects.id]
  clientId int [ref: > Clients.id]
}

Table SaleItems {
  id int [pk]
  itemId int [ref: > Items.id, not null]
  projectId int [ref: > Projects.id, not null]
}

Table Comments {
  id int [pk]
  userId int [ref: > Users.id, not null]
  projectId int [ref: > Projects.id, not null]
  text varchar
}
