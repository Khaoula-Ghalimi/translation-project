"use client";

import { Button } from "@/components/ui/button";
import languages from "@/data/languages.json";
import { useState } from "react";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown, Search, X } from "lucide-react";
import { DropdownMenuContent } from "../ui/dropdown-menu";
import { Input } from "../ui/input";

export default function LanguageTabs({
  defaultLanguage,
  selected,
  setSelected,
}: {
  defaultLanguage: string;
  selected: string;
  setSelected: (lang: string) => void;
}) {

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);


  const visibleLanguages = languages
    .filter(l => l.visible)
    .sort((a, b) =>
      a.name === defaultLanguage ? -1 :
        b.name === defaultLanguage ? 1 :
          0
    );

  const [shownLanguages, setShownLanguages] = useState(visibleLanguages);


  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex gap-2 flex-wrap">
        {shownLanguages.map((lang) => (
          <Button
            key={lang.name}
            variant={selected === lang.name ? "default" : "outline"}
            onClick={() => setSelected(lang.name)}
          >
            {lang.name}
          </Button>
        ))}

        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size={"icon"}>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-0 mt-2">
            <div className="flex flex-col">
              <div className="flex gap-2">
                <Search className="w-4 h-4 my-auto ml-2 text-muted-foreground" />
                <Input
                  placeholder="Search language..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="shadow-none border-0 focus-visible:ring-0 !bg-transparent"
                />
                <X
                  className="w-4 h-4 my-auto mr-2 text-muted-foreground cursor-pointer"
                  onClick={() => {
                    setSearch("");
                    setOpen(false);
                  }
                  }
                />
              </div>
              <div className="grid grid-cols-4 gap-2 p-2 max-h-60 w-screen overflow-y-auto border">
                {chunkBySize(
                  languages.filter((l) => l.name.toLowerCase().includes(search.toLowerCase())),
                  10
                ).map((col, colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-2">
                    {col.map((lang) => (
                      <Button
                        key={lang.name}
                        variant={selected === lang.name ? "secondary" : "ghost"}
                        onClick={() => {
                          setSelected(lang.name);
                          setOpen(false);
                          setSearch("");

                          setShownLanguages((prev) => {
                            const already = prev.find(
                              (l) => l.name === lang.name
                            );
                            if (already) return prev; // already in the row

                            const max = prev.length; // keep same size
                            return [lang, ...prev.slice(0, max - 1)];
                          });
                        }}
                        className="justify-start text-left w-full"
                      >
                        {lang.name}
                      </Button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}



function chunkBySize<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
