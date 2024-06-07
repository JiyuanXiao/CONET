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
  updateContacts: async () => {},
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
    try {
      await ContactStorage.setContact(user?.username, contact_id, contact);
      setContactsMap(contact_id, contact);

      console.log(
        `[Contact Context] add contact ${contact.first_name} to context successfully...`
      );
    } catch (err) {
      console.log(
        `[Contact Context] addContact() failed for ${contact.first_name}: ${err}`
      );
    }
  };

  const removeContact = async (contact_id: number) => {
    try {
      await ContactStorage.removeContact(user?.username, contact_id);
      if (contacts.delete(contact_id)) {
        setContacts(new Map<number, CE_PersonProps>(contacts));
      }

      console.log(
        `[Contact Context] remove contact ${contact_id} from context successfully...`
      );
    } catch (err) {
      console.log(
        `[Contact Context] removeContact() failed for ${contact_id}: ${err}`
      );
    }
  };

  const updateContacts = async () => {};

  const initializeContactContext = async () => {
    if (user) {
      console.log(`[Contact Context] start to initialize contact context`);
      // fetch all exist contacts from local storage
      console.log(
        `[Contact Context] fetch all exist contacts from local storage`
      );
      const all_contacts = await ContactStorage.fetchAllContacts(user.username);

      // fetch contects' data from server
      for (const contact of all_contacts) {
        try {
          const updated_contact = await ContactServer.GetUser(contact.id);
          if (updated_contact) {
            setContactsMap(contact.id, updated_contact.contact);
            console.log(
              `[Contact Context] fetch contect ${contact.contact.first_name} data from server`
            );
          }
        } catch (err) {}
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
        updateContacts,
        resetContacts,
      }}
    >
      {props.children}
    </ContactsContext.Provider>
  );
};
