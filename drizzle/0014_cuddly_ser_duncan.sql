DROP INDEX IF EXISTS "search_index";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "documents_search_index" ON "document" USING gin ((
      setweight(to_tsvector('english', "name"), 'A') ||
      setweight(to_tsvector('english', "extension"), 'B')
    ));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "items_search_index" ON "item" USING gin ((
      setweight(to_tsvector('english', "name"), 'A') ||
      setweight(to_tsvector('english', coalesce("type", '')), 'B') ||
      setweight(to_tsvector('english', coalesce("make", '')), 'C')
    ));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "suppliers_search_index" ON "supplier" USING gin ((
        setweight(to_tsvector('english', "name"), 'A') ||
        setweight(to_tsvector('english', "field"), 'B')
    ));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "search_index" ON "project" USING gin ((
        setweight(to_tsvector('english', "name"), 'A') ||
        setweight(to_tsvector('english', coalesce("description", '')), 'B')
      ));