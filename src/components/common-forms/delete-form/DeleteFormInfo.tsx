function DeleteFormInfo({
  type,
}: {
  type: "client" | "project" | "supplier" | "item" | "document";
}) {
  return (
    <>
      <span>
        Please type the name of the {type} to confirm. After typing the name
        press the delete button to delete the {type}.
      </span>
      <br />
      <strong>Warning: </strong>
      <br />
      <span>
        Deleting a {type} is permanent, you will not be able to undo this
        action.
      </span>
      <br />
      <strong>Note: </strong>
      <br />
      <span>
        {`Only an admin ${type === "project" ? "or an owner" : ""} can delete a ${type}.`}
      </span>
    </>
  );
}

export default DeleteFormInfo;
