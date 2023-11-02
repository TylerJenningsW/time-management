import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

export default function NavDropdown() {
  return (
    <Dropdown className="bg-black">
      <DropdownTrigger>
        <Button className="text-md rounded-md bg-blue-700 px-0 py-2 font-medium text-white hover:bg-blue-900 hover:text-white">
          Account
        </Button>
      </DropdownTrigger>
      <DropdownMenu className="bg-blue-700" aria-label="Static Actions">
        <DropdownItem key="new">Settings</DropdownItem>
        <DropdownItem key="copy">Contacts</DropdownItem>
        <DropdownItem key="edit">Add Credits</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
