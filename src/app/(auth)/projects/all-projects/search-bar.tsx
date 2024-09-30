"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";

function SearchBar() {
  const [searchText, setSearchText] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <Input
        placeholder="Search projects"
        onChange={(e) => setSearchText(e.target.value)}
        value={searchText}
      />
    </form>
  );
}

export default SearchBar;
