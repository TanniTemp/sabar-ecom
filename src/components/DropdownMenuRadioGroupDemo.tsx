"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  selectedFilter: string;
  setSelectedFilter: (value: string) => void;
}

export function DropdownMenuRadioGroupDemo({ selectedFilter, setSelectedFilter }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"sm"} variant="outline">Filter: {" "} {selectedFilter}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select Filter </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={selectedFilter}
          onValueChange={setSelectedFilter}
        >
          <DropdownMenuRadioItem value="Popularity">Popularity</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Price: Low to High">Price: Low to High</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Price: High to Low">Price: High to Low</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Newest">Newest</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
