CREATE INDEX IF NOT EXISTS "search_index" ON "project" USING gin ((
        setweight(to_tsvector('english', coalesce("name", '')), 'A') ||
        setweight(to_tsvector('english', coalesce("description", '')), 'B')
      ));