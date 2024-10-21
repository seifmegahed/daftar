import { db } from "@/server/db";

export const preparedProjectLinkedDocsQuery = db.query.projectsTable
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
  .prepare("project_linked_documents");
