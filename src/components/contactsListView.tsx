import {
  Avatar,
  Card,
  Chip,
  Listbox,
  ListboxItem,
  ScrollShadow,
} from "@nextui-org/react";
import React, { type Key } from "react";
import { api } from "~/utils/api";
import ListboxWrapper from "./listBoxWrapper";
import Loading from "./loading";

function Contacts() {
  const [selectedContacts, setSelectedContacts] = React.useState(new Set());
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = api.contacts.getContacts.useQuery();

  const selectedUsers = Array.from(selectedContacts).map((id) =>
    users?.find((user) => user.email === id)
  );
  const topContent = React.useMemo(() => {
    if (!selectedUsers.length) {
      return null;
    }

    return (
      <ScrollShadow
        className="flex w-full gap-1 px-2 py-0.5"
        orientation="horizontal"
      >
        {selectedUsers.map((userId) => {
          const user = users?.find((user) => user.email === userId?.email);

          return user ? <Chip key={user.email}>{user.name}</Chip> : null;
        })}
      </ScrollShadow>
    );
  }, [users, selectedUsers]);
  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div>Error fetching contacts: {error.message}</div>;
  }

  const handleSelectionChange = (keys: Set<Key> | Key) => {
    const newSelection = new Set<string>();

    if (keys instanceof Set) {
      keys.forEach((key) => {
        newSelection.add(String(key));
      });
    } else {
      newSelection.add(String(keys));
    }

    setSelectedContacts(newSelection);
  };

  return (
    <ListboxWrapper className="items-center align-middle max-h-[300px] overflow-scroll">
      <Listbox
        className="align-middle max-h-[300px] overflow-scroll"
        defaultSelectedKeys={["1"]}
        items={users}
        label="Assigned to"
        selectionMode="multiple"
        onSelectionChange={handleSelectionChange}
        variant="flat"
      >
        {(item) => (
          <ListboxItem key={String(item.email)} textValue={item.name}>
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <span className="text-small">{item.name}</span>
                <span className="text-tiny text-default-400">{item.email}</span>
              </div>
            </div>
          </ListboxItem>
        )}
      </Listbox>
    </ListboxWrapper>
  );
}

export default Contacts;
