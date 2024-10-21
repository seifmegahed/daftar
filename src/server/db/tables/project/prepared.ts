import { db } from "@/server/db";
import { eq, sql } from "drizzle-orm";
import { clientsTable, projectsTable } from "@/server/db/schema";

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

export const projectLinkedDocumentsQuery = db.query.projectsTable
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
  .prepare("project_linked_documents");
