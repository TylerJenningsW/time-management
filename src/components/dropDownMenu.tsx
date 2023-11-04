import React, { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  useDisclosure,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

export default function NavDropdown() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);

  const toggleSettingsModal = () => {
    setIsSettingsModalVisible(!isSettingsModalVisible);
  };
  return (
    <>
    <Dropdown className="bg-black">
      <DropdownTrigger>
        <Button className="text-md rounded-md bg-blue-700 px-0 py-2 font-medium text-white hover:bg-blue-900 hover:text-white">
          Account
        </Button>
      </DropdownTrigger>
      <DropdownMenu className="bg-blue-700" aria-label="Static Actions">
        <DropdownItem onClick={onOpen} key="settings">
          Settings
        </DropdownItem>
        <DropdownItem key="contacts">Contacts</DropdownItem>
        <DropdownItem key="addcredits">Add Credits</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Settings</ModalHeader>
              <ModalBody>
                <div className="flex py-2 px-1 justify-between">
                  <Checkbox
                    classNames={{
                      label: "text-small",
                    }}
                  >
                    Dark Mode
                  </Checkbox>
                </div>
              </ModalBody>
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
