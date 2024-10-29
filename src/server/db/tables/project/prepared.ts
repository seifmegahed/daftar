import { db } from "@/server/db";
import { eq, sql } from "drizzle-orm";
import {
  addressesTable,
  clientsTable,
  contactsTable,
  projectsTable,
  usersTable,
} from "@/server/db/schema";

export const clientProjectsQuery = db
  .select({
    id: projectsTable.id,
    name: projectsTable.name,
    status: projectsTable.status,
    clientId: projectsTable.clientId,
    clientName: clientsTable.name,
    createdAt: projectsTable.createdAt,
  })
  .from(projectsTable)
  .leftJoin(clientsTable, eq(projectsTable.clientId, clientsTable.id))
  .where(eq(projectsTable.clientId, sql.placeholder("id")))
  .prepare("client_projects");

/**
 * Same as the one below but in sql format
 *
 * Maybe use this one in the future?
 *
 * The difference is that this one does not store
 * client address and contact inside the client object
 *
 * so it needs some type refactoring and front end refactoring
 */
export const projectByIdQuery2 = db
  .select({
    id: projectsTable.id,
    name: projectsTable.name,
    status: projectsTable.status,
    createdAt: projectsTable.createdAt,
    owner: {
      id: projectsTable.id,
      name: usersTable.name,
    },
    client: {
      clientId: projectsTable.clientId,
      name: clientsTable.name,
      registrationNumber: clientsTable.registrationNumber,
      website: clientsTable.website,
    },
    primaryAddress: {
      id: clientsTable.primaryAddressId,
      addressLine: addressesTable.addressLine,
      city: addressesTable.city,
      country: addressesTable.country,
    },
    primaryContact: {
      id: clientsTable.primaryContactId,
      name: contactsTable.name,
      email: contactsTable.email,
      phoneNumber: contactsTable.phoneNumber,
    },
  })
  .from(projectsTable)
  .where(eq(projectsTable.id, sql.placeholder("id")))
  .leftJoin(clientsTable, eq(projectsTable.clientId, clientsTable.id))
  .leftJoin(usersTable, eq(projectsTable.ownerId, usersTable.id))
  .leftJoin(
    addressesTable,
    eq(clientsTable.primaryAddressId, addressesTable.id),
  )
  .leftJoin(contactsTable, eq(clientsTable.primaryContactId, contactsTable.id))
  .prepare("project_by_id2");

export const projectByIdQuery = db.query.projectsTable
  .findFirst({
    where: (project, { eq, sql }) => eq(project.id, sql.placeholder("id")),
    with: {
      client: {
        columns: {
          id: true,
          name: true,
          registrationNumber: true,
          website: true,
        },
        with: {
          primaryAddress: {
            columns: {
              id: true,
              addressLine: true,
              city: true,
              country: true,
            },
          },
          primaryContact: {
            columns: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      },
      owner: {
        columns: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
        },
      },
      creator: {
        columns: {
          id: true,
          name: true,
        },
      },
      updater: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  })
  .prepare("project_by_id");

export const projectLinkedDocumentsQuery = (pathIncluded: boolean) =>
  db.query.projectsTable
    .findFirst({
      where: (project, { eq, sql }) => eq(project.id, sql.placeholder("id")),
      columns: {},
      with: {
        client: {
          columns: {},
          with: {
            documents: {
              columns: {},
              with: {
                document: {
                  columns: {
                    id: true,
                    name: true,
                    extension: true,
                    path: pathIncluded,
                    private: true,
                  },
                },
              },
            },
          },
        },
        purchaseItems: {
          columns: {},
          with: {
            supplier: {
              columns: { id: true },
              with: {
                documents: {
                  columns: {},
                  with: {
                    document: {
                      columns: {
                        id: true,
                        name: true,
                        extension: true,
                        path: pathIncluded,
                        private: true,
                      },
                    },
                  },
                },
              },
            },
            item: {
              columns: { id: true },
              with: {
                documents: {
                  columns: {},
                  with: {
                    document: {
                      columns: {
                        id: true,
                        name: true,
                        extension: true,
                        path: pathIncluded,
                        private: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        documents: {
          columns: {},
          with: {
            document: {
              columns: {
                id: true,
                name: true,
                extension: true,
                path: pathIncluded,
                private: true,
              },
            },
          },
        },
        saleItems: {
          columns: {},
          with: {
            item: {
              columns: { id: true },
              with: {
                documents: {
                  columns: {},
                  with: {
                    document: {
                      columns: {
                        id: true,
                        name: true,
                        extension: true,
                        path: pathIncluded,
                        private: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })
    .prepare(
      pathIncluded
        ? "project_linked_documents_with_path"
        : "project_linked_documents",
    );
