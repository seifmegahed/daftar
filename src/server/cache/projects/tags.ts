export const tags = {
  projectBrief: (id: number) => `project-brief-${id}`,
  project: (id: number) => `project-${id}`,
  projectDocuments: (id: number, access?: boolean, path?: boolean) =>
    `project-documents-${id}-${access}-${path}`,
};
