function DocumentLinksPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <p>Document Links:</p>
      <pre>{JSON.stringify(params, null, 2)}</pre>
    </div>
  );
}

export default DocumentLinksPage; 