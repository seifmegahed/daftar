async function EditUserPage({params}: {params: {id: string}}) {
  const id = Number(params.id);
  if (isNaN(id)) return <p>Invalid ID</p>;
  return <div>Edit User Page</div>;
}

export default EditUserPage;