import React, { createContext, useState, useContext, useEffect } from "react";
import { CE_PersonProps } from "@/constants/ChatEngineObjectTypes";
import * as ContactStorage from "@/api/contacts/contacts.storage";
import * as ContactServer from "@/api/contacts/contacts.api";
import { AuthenticationContext } from "../authentication/authentication.context";
import { ContactContextProps } from "@/constants/ContextTypes";

export const ContactsContext = createContext<ContactContextProps>({
  contacts: new Map<number, CE_PersonProps>(),
  addContact: async () => {},
  removeContact: async () => {},
  searchContact: async () => null,
  uploadContacts: async () => {},
  resetContacts: () => {},
});

export const ContactsContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const [contacts, setContacts] = useState<Map<number, CE_PersonProps>>(
    new Map<number, CE_PersonProps>()
  );

  const { user, is_authentication_initialized } = useContext(
    AuthenticationContext
  );

  const setContactsMap = (contact_id: number, contact: CE_PersonProps) => {
    setContacts(
      new Map<number, CE_PersonProps>(contacts.set(contact_id, contact))
    );
  };

  const searchContact = async (contact_id: number) => {
    try {
      const contact = await ContactServer.GetUser(contact_id);
      console.log(
        `[Contact Context] find contact ${contact?.contact.first_name} from server...`
      );
      return contact;
    } catch (err) {
      console.log(`[Contact Context] searchContact() failed: ${err}`);
      return null;
    }
  };

  const addContact = async (contact_id: number, contact: CE_PersonProps) => {
    if (user) {
      try {
        await ContactStorage.setContact(user?.username, contact_id, contact);
        await ContactServer.AddContact(
          user?.username,
          user?.secret,
          contact_id
        );
        setContactsMap(contact_id, contact);

        console.log(
          `[Contact Context] add contact ${contact.first_name} to context successfully...`
        );
      } catch (err) {
        console.log(
          `[Contact Context] addContact() failed for ${contact.first_name}: ${err}`
        );
      }
    }
  };

  const removeContact = async (contact_id: number) => {
    if (user) {
      try {
        const target_contact = contacts.get(contact_id);

        await ContactStorage.removeContact(user?.username, contact_id);
        if (contacts.delete(contact_id)) {
          setContacts(new Map<number, CE_PersonProps>(contacts));
        }
        await ContactServer.DeleteContact(
          user?.username,
          user?.secret,
          contact_id
        );
        console.log(
          `[Contact Context] remove contact ${contact_id} from context successfully...`
        );
      } catch (err) {
        console.log(
          `[Contact Context] removeContact() failed for ${contact_id}: ${err}`
        );
      }
    }
  };

  const uploadContacts = async () => {
    if (user) {
      try {
        const server_contact_records = await ContactServer.GetContacts(
          user.username,
          user.secret
        );

        if (!server_contact_records) {
          const all_contacts = await ContactStorage.fetchAllContacts(
            user.username
          );
          // fetch contects' data from server
          for (const contact of all_contacts) {
            await ContactServer.AddContact(
              user.username,
              user.secret,
              contact.id
            );
            const updated_contact = await ContactServer.GetUser(contact.id);
            if (updated_contact) {
              setContactsMap(contact.id, updated_contact.contact);
              console.log(
                `[Contact Context] fetch contect ${contact.contact.first_name} data from server`
              );
            }
          }
        }
      } catch (err) {
        console.error(
          `[Contact Context] failed to upload contacts to server: ${err}`
        );
      }
    }
  };

  const initializeContactContext = async () => {
    if (user) {
      console.log(`[Contact Context] start to initialize contact context`);
      // fetch all exist contacts from local storage
      console.log(
        `[Contact Context] fetch all exist contacts from local storage`
      );

      const server_contact_records = await ContactServer.GetContacts(
        user.username,
        user.secret
      );

      const local_contact_records = await ContactStorage.fetchAllContacts(
        user.username
      );

      if (
        !server_contact_records ||
        local_contact_records.length >= server_contact_records.contact_id.length
      ) {
        try {
          // fetch contects' data from server
          for (const contact of local_contact_records) {
            const success = await ContactServer.AddContact(
              user.username,
              user.secret,
              contact.id
            );
            if (!success) {
              console.warn(
                `[Contact Context] Failed to add contact ${contact.id} to server`
              );
            }
            const updated_contact = await ContactServer.GetUser(
              Number(contact.id)
            );
            if (updated_contact) {
              setContactsMap(contact.id, updated_contact.contact);
              console.log(
                `[Contact Context] fetch contect ${contact.contact.first_name} data from server`
              );
            }
          }
        } catch (err) {
          console.error(
            `[Contact Context] failed to upload contacts to server: ${err}`
          );
        }
      } else if (
        local_contact_records.length < server_contact_records.contact_id.length
      ) {
        try {
          for (const contact_id of server_contact_records.contact_id) {
            const contact = await ContactServer.GetUser(Number(contact_id));
            if (contact) {
              await ContactStorage.setContact(
                user.username,
                contact_id,
                contact.contact
              );
              setContactsMap(Number(contact_id), contact.contact);
            }
          }
        } catch (err) {
          console.error(
            `[Contact Context] failed to update contacts to local: ${err}`
          );
        }
      }

      console.log(`[Contact Context] finished contact context initialization`);
    }
  };

  const resetContacts = () => {
    setContacts(new Map<number, CE_PersonProps>());
  };

  useEffect(() => {
    if (is_authentication_initialized) {
      initializeContactContext();
    }
  }, [is_authentication_initialized]);

  return (
    <ContactsContext.Provider
      value={{
        contacts,

        addContact,
        removeContact,
        searchContact,
        uploadContacts,
        resetContacts,
      }}
    >
      {props.children}
    </ContactsContext.Provider>
  );
};
