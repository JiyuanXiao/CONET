type CE_AttachementProps = {
  id: number;
  file: string;
  created: string;
};

type CE_SimpleMessageProps = {
  id: number;
  text: string | null;
  created: string;
  attachments: CE_AttachementProps[];
};

export type CE_PersonProps = {
  username: string;
  first_name: string;
  last_name: string;
  avatar: string;
  custom_json: string;
  is_online: boolean;
};

export interface CE_ChatMemberProps {
  person: CE_PersonProps;
  chat_updated: string;
  last_read: number;
}

export interface CE_MessageProps {
  id: number;
  sender: CE_PersonProps;
  created: string;
  attachments: CE_AttachementProps[];
  sender_username: string;
  text: string | null;
  custom_json: string;
}

export interface CE_UserProps {
  id: number;
  is_authenticated: boolean;
  last_message: CE_SimpleMessageProps;
  username: string;
  secret: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
  custom_json: string;
  is_online: boolean;
  created: string;
}

export interface CE_ChatProps {
  id: number;
  admin: CE_PersonProps;
  people: CE_ChatMemberProps[];
  attachments: CE_AttachementProps[];
  last_message: CE_MessageProps;
  title: string;
  is_direct_chat: boolean;
  custom_json: string;
  access_key: string;
  is_authenticated: boolean;
  created: string;
}
