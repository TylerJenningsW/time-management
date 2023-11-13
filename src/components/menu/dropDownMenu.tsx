import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Divider,
  Spacer,
} from "@nextui-org/react";
import { ThemeSwitcher } from "../themeSwitcher";
import Contacts from "../contactsListView";
import UseBuyCredits from "~/hooks/useBuyCredits";

export default function NavDropdown() {
  const { buyCredits } = UseBuyCredits();
  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onOpenChange: onSettingsOpenChange,
  } = useDisclosure();
  const {
    isOpen: isContactsOpen,
    onOpen: onContactsOpen,
    onOpenChange: onContactsOpenChange,
  } = useDisclosure();
  return (
    <>
      <Dropdown className="bg-black">
        <DropdownTrigger>
          <Button className="text-md rounded-md bg-blue-700 px-0 py-2 font-medium text-white hover:bg-blue-900 hover:text-white">
            Account
          </Button>
        </DropdownTrigger>
        <DropdownMenu className="bg-blue-700" aria-label="Static Actions">
          <DropdownItem onClick={onSettingsOpen} key="settings">
            Settings
          </DropdownItem>
          <DropdownItem onClick={onContactsOpen} key="contacts">
            Contacts
          </DropdownItem>
          <DropdownItem onClick={buyCredits} key="addcredits">
            Add Credits
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Modal
        isOpen={isSettingsOpen}
        onOpenChange={onSettingsOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Settings
              </ModalHeader>
              <ModalBody>
                <div className="flex justify-between px-1 py-2">
                  <ThemeSwitcher></ThemeSwitcher>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isContactsOpen}
        onOpenChange={onContactsOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Contacts
              </ModalHeader>
              <Divider />
              <Spacer />
              <ModalBody>
                <div className="ml-auto mr-auto flex items-center px-1 py-2 align-middle">
                  <Contacts></Contacts>
                </div>
              </ModalBody>
              <Spacer className="h-28" />
              <Divider />

              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
