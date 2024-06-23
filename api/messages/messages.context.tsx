import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import * as MessagesStorage from "./messages.storage";
import * as ChatServer from "@/api/chats/chats.api";
import * as MessageServer from "@/api/messages/messages.api";
import { useSQLiteContext } from "expo-sqlite";
import {
  MessageContextObjectProps,
  MessageContextProps,
  MessagesProps,
} from "@/constants/ContextTypes";
import { AuthenticationContext } from "../authentication/authentication.context";
import { ChatsContext } from "../chats/chats.context";
import { CE_MessageProps } from "@/constants/ChatEngineObjectTypes";
import { getLoadedMessages } from "./messages.context.util";
import * as FileSystem from "expo-file-system";
import { NotificationContext } from "../notification/notification.context";

export const MessagesContext = createContext<MessageContextProps>({
  messages: new Map<number, MessageContextObjectProps>(),
  createMeesageObjectForNewChat: async () => {},
  loadMessagesById: async () => {},
  sendMessage: async () => false,
  receiveMessage: () => false,
  resetLoadedMessagesById: async () => {},
  ClearAllMessagesById: async () => {},
  is_messages_initialized: false,
  is_message_loaded_from_local: false,
  initializeMessageContext: async () => {},
  resetMessageContext: () => {},
});

export const MessagesContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const NUM_OF_MESSAGES_LOAD_AT_ONCE = 15;
  const [messages, setMessages] = useState<
    Map<number, MessageContextObjectProps>
  >(new Map<number, MessageContextObjectProps>());
  const [is_messages_initialized, setIsMessagesInitialized] =
    useState<boolean>(false);
  const [is_message_loaded_from_local, setIsMessagesLoadedFromLocal] =
    useState<boolean>(false);
  const { user } = useContext(AuthenticationContext);
  const {
    chats,
    is_chats_initialized,
    is_chats_loaded_from_local,
    getLastRead,
  } = useContext(ChatsContext);
  const db = useSQLiteContext();
  const { sendNotificationByChatId } = useContext(NotificationContext);
  const sendNotificationByChatIdRef = useRef(sendNotificationByChatId);

  const setMessageMap = (
    chat_id: number,
    messages_object: MessageContextObjectProps
  ) => {
    setMessages(new Map(messages.set(Number(chat_id), messages_object)));
  };

  const createMeesageObjectForNewChat = async (chat_id: number) => {
    const initial_messages_object = {
      chat_id: chat_id,
      loaded_messages: [],
      current_index: 0,
      total_messages_amount: 0,
    };
    setMessageMap(Number(chat_id), initial_messages_object);
    await MessagesStorage.createMessageTableIfNotExists(
      user?.username,
      chat_id,
      db
    );
  };

  // Take the "load" action for a friend's chat
  const loadMessagesById = async (chat_id: number) => {
    const target_messages_object = messages.get(Number(chat_id));

    if (target_messages_object) {
      //Load messages
      try {
        const is_initial_load = false;

        const newly_loaded_messages_object = await getLoadedMessages(
          user?.username || "",
          chat_id,
          target_messages_object,
          NUM_OF_MESSAGES_LOAD_AT_ONCE,
          db,
          is_initial_load
        );
        // Replace the target message object by the loaded one
        setMessageMap(chat_id, newly_loaded_messages_object);
        console.log(`[Message Context] load message for chat ${chat_id}`);
      } catch (err) {
        console.error(
          `[Message Context] getLoadedMessagesObjectById(): chat ${chat_id}: ${err}`
        );
      }
    } else {
      console.warn(
        `[Message Context] getLoadedMessagesObjectById(): chat ${chat_id} does not exit in message context`
      );
    }
  };

  const sendMessage = async (
    chat_id: number,
    message_content: string,
    temp_timestamp: string
  ) => {
    const content_header = process.env.EXPO_PUBLIC_SPECIAL_MESSAGE_INDICATOR;
    // determine the content type
    let current_context_type;
    let file_uri;

    if (message_content.startsWith(`[${content_header}][系统消息]`)) {
      current_context_type = "system";
      file_uri = null;
    } else if (message_content.startsWith(`[${content_header}][图片]`)) {
      current_context_type = "image_uri";
      file_uri = message_content.replace(
        new RegExp(`^\\[${content_header}\\]\\[图片\\]`),
        ""
      );
      message_content = `[${content_header}][图片]`;
    } else if (message_content.startsWith(`[${content_header}][视频]`)) {
      current_context_type = "video_uri";
      file_uri = message_content.replace(
        new RegExp(`^\\[${content_header}\\]\\[视频\\]`),
        ""
      );
      message_content = `[${content_header}][视频]`;
    } else if (message_content.startsWith(`[${content_header}][语音]`)) {
      current_context_type = "voice_uri";
      file_uri = message_content.replace(
        new RegExp(`^\\[${content_header}\\]\\[语音\\]`),
        ""
      );
      message_content = `[${content_header}][语音]`;
    } else {
      current_context_type = "text";
      file_uri = null;
    }

    const new_message = {
      message_id: 0,
      sender_username: user?.username || "",
      text_content: message_content,
      file_url: file_uri ? file_uri : "",
      content_type: current_context_type,
      timestamp: temp_timestamp,
    };

    const target_messages_object = messages.get(Number(chat_id));

    if (target_messages_object) {
      // Construct the message object by appending the new message
      const updated_messages_object: MessageContextObjectProps = {
        chat_id: chat_id,
        loaded_messages: [
          new_message,
          ...target_messages_object.loaded_messages,
        ],
        current_index: target_messages_object.current_index + 1,
        total_messages_amount: target_messages_object.total_messages_amount + 1,
      };

      // Replace the target message object by the loaded one
      setMessageMap(chat_id, updated_messages_object);

      try {
        // sending video will take longer than usual, so send notificaiton after video is sent
        if (current_context_type !== "video_uri") {
          await sendNotificationByChatIdRef.current(chat_id);
          console.log(
            `[Message Context] chat ${chat_id}: sent notifications to server successfully...`
          );
        }
        const success = await MessageServer.SendChatMessage(
          user?.username || "",
          user?.secret || "",
          chat_id,
          message_content,
          file_uri,
          temp_timestamp
        );
        if (current_context_type === "video_uri" && success) {
          await sendNotificationByChatIdRef.current(chat_id);
          console.log(
            `[Message Context] chat ${chat_id}: sent notifications to server successfully...`
          );
        }
        if (success) {
          console.log(
            `[Message Context] chat ${chat_id}: sent message to server successfully...`
          );
        } else {
          const failed_sent_message = {
            message_id: -1,
            sender_username: user?.username || "",
            text_content: message_content,
            file_url: file_uri ? file_uri : "",
            content_type: current_context_type,
            timestamp: temp_timestamp,
          };
          const updated_messages_object_with_failed_message: MessageContextObjectProps =
            {
              chat_id: chat_id,
              loaded_messages: [
                failed_sent_message,
                ...target_messages_object.loaded_messages,
              ],
              current_index: target_messages_object.current_index + 1,
              total_messages_amount:
                target_messages_object.total_messages_amount + 1,
            };

          // Replace the target message object by the loaded one
          setMessageMap(chat_id, updated_messages_object_with_failed_message);
          console.warn(
            `[Message Context] chat ${chat_id}: sent message to server failed`
          );
        }
        return success;
      } catch (err) {
        console.error(
          `[Message Context] chat ${chat_id}: sent message to server failed: ${err}`
        );
        return false;
      }
    } else {
      console.warn(
        `[Message Context] addMessageById(): chat_id ${chat_id} DOES NOT EXIST`
      );
      return false;
    }
  };

  const receiveMessage = (
    chat_id: number,
    message: MessagesProps,
    temp_timestamp: string
  ): boolean => {
    const target_messages_object = messages.get(Number(chat_id));

    if (!target_messages_object) {
      console.log(
        `[Message Context] receiveMessage(): messgae send to unknown chat: ${chat_id}`
      );
      return false;
    }

    const received_message = {
      message_id: message.message_id,
      sender_username: message.sender_username,
      text_content: message.text_content,
      file_url: message.file_url,
      content_type: message.content_type,
      timestamp: message.timestamp,
    } as MessagesProps;

    const target_message_index =
      target_messages_object.loaded_messages.findIndex((msg) => {
        return msg.timestamp === temp_timestamp;
      });

    // This new message is sent by myself
    if (target_message_index !== -1) {
      console.log(
        `[Message Context] Confirmed a message ${message.message_id} is sent by myself`
      );

      const updated_loaded_messages = target_messages_object.loaded_messages;

      updated_loaded_messages[target_message_index] = received_message;

      const updated_messages_object = {
        chat_id: target_messages_object.chat_id,
        loaded_messages: updated_loaded_messages,
        current_index: target_messages_object.current_index,
        total_messages_amount: target_messages_object.total_messages_amount,
      } as MessageContextObjectProps;

      setMessageMap(chat_id, updated_messages_object);
    }
    // This message is sent by other
    else {
      console.log(
        `[Message Context] A new message ${message.message_id} is sent from ${message.sender_username}`
      );
      const updated_messages_object = {
        chat_id: target_messages_object.chat_id,
        loaded_messages: [
          received_message,
          ...target_messages_object.loaded_messages,
        ],
        current_index: target_messages_object.current_index + 1,
        total_messages_amount: target_messages_object.total_messages_amount + 1,
      } as MessageContextObjectProps;
      setMessageMap(chat_id, updated_messages_object);
    }
    //await MessagesStorage.storeMessage(username, chat_id, ce_message, db);
    console.log(
      `[Message Context] New message ${message.message_id} is received`
    );
    return true;
  };

  // Use for switching back from chat screen to chat list screen
  const resetLoadedMessagesById = async (chat_id: number) => {
    // find the index original message object
    const target_messages_object = messages.get(Number(chat_id));

    if (target_messages_object) {
      // const target_messages_object = messages_object_list[target_object_index];

      const end_index = Math.min(
        target_messages_object.total_messages_amount,
        NUM_OF_MESSAGES_LOAD_AT_ONCE
      );

      // Construct the messages object in which the number of loaded messages is the default value
      const updated_messages_object: MessageContextObjectProps = {
        chat_id: chat_id,
        loaded_messages: target_messages_object.loaded_messages.slice(
          0,
          end_index
        ),
        current_index: end_index,
        total_messages_amount: target_messages_object.total_messages_amount,
      };

      // Replace the target message object by the loaded one
      setMessageMap(chat_id, updated_messages_object);
    } else {
      try {
        console.log(
          `[Message Context] resetLoadedMessagesById(): Message ojbect with chat_id: ${chat_id} does not exist in message context`
        );
        console.log(
          `[Message Context] resetLoadedMessagesById(): Creating a new message object with chat_id: ${chat_id}...`
        );
        const initial_messages_object = {
          chat_id: chat_id,
          loaded_messages: [],
          current_index: 0,
          total_messages_amount: 0,
        };

        // First load
        const is_initial_load = true;

        const newly_loaded_messages_object = await getLoadedMessages(
          user?.username || "",
          chat_id,
          initial_messages_object,
          NUM_OF_MESSAGES_LOAD_AT_ONCE,
          db,
          is_initial_load
        );

        // Append new messages object to object list
        setMessageMap(chat_id, newly_loaded_messages_object);
        console.log(
          `[Message Context] New message object with chat_id: ${chat_id} is created successfully...`
        );
      } catch (err) {
        console.error("[Message Context] resetLoadedMessagesById(): " + err);
      }
    }
  };

  const ClearAllMessagesById = (chat_id: number) => {
    console.log(
      "[Message Context] Start to clear all messages data for " + chat_id
    );
    MessagesStorage.deleteMessageTableIfExists(
      user?.username || "",
      chat_id,
      db
    );
    MessagesStorage.createMessageTableIfNotExists(
      user?.username || "",
      chat_id,
      db
    );
    console.log(
      "[Message Context] cleared messages from local storage for " + chat_id
    );
    // find the index of original message object
    const target_messages_object = messages.get(Number(chat_id));

    if (target_messages_object) {
      // construct a mock messages oject with a empty message list
      let cleared_messages_object: MessageContextObjectProps = {
        chat_id: chat_id,
        loaded_messages: [],
        current_index: 0,
        total_messages_amount: 0,
      };

      // Replace the target message object by the loaded one
      setMessageMap(chat_id, cleared_messages_object);
      console.log(
        "[Message Context] cleared messages from context for " + chat_id
      );
    } else {
      console.warn(
        `[Message Context] ClearAllMessagesById(): chat_id ${chat_id} DOES NOT EXIST`
      );
    }
  };

  const fetchMessageDataFromStorage = async () => {
    if (user) {
      setIsMessagesLoadedFromLocal(false);
      const init_messages = new Map<number, MessageContextObjectProps>();
      // Fetach all messages from loacl storage for each friend
      for (const chat of chats.values()) {
        let initial_messages_object = {
          chat_id: chat.id,
          loaded_messages: [],
          current_index: 0,
          total_messages_amount: 0,
        } as MessageContextObjectProps;

        // If message data existed already, load the data
        if (MessagesStorage.messageTableExist(user.username, chat.id, db)) {
          try {
            const is_initial_load = true;

            initial_messages_object = await getLoadedMessages(
              user.username,
              chat.id,
              initial_messages_object,
              NUM_OF_MESSAGES_LOAD_AT_ONCE,
              db,
              is_initial_load
            );
            console.log(
              `[Message Context] initially loaded message for chat ${chat.id} successfully`
            );
          } catch (err) {
            console.error(
              `[Message Context] initially loaded message for chat ${chat.id} failed: ${err}`
            );
          }
        }
        // If message data doesn't exist, create one in local storage
        else {
          console.log(
            `[Message Context] message table for chat ${chat.id} do not exist, start creating...`
          );
          MessagesStorage.createMessageTableIfNotExists(
            user.username,
            chat.id,
            db
          );
        }

        // Append new messages object to object list
        init_messages.set(chat.id, initial_messages_object);
        //setMessageMap(chat.id, initial_messages_object);
      }
      setMessages(init_messages);
      setIsMessagesLoadedFromLocal(true);
    }
  };

  const initializeMessageContext = async () => {
    if (user) {
      setIsMessagesInitialized(false);
      console.log("[Message Context] Start to initialize message context...");

      console.log(
        "[Message Context] Start to get messages data from server and update to storage for " +
          user.username
      );
      for (const chat of chats.values()) {
        if (!MessagesStorage.messageTableExist(user.username, chat.id, db)) {
          MessagesStorage.createMessageTableIfNotExists(
            user.username,
            chat.id,
            db
          );
        }
        const latest = MessagesStorage.fetchLatestMessage(
          user.username,
          chat.id,
          db
        );

        try {
          let last_read = await getLastRead(chat.id);
          if (latest) {
            last_read = Math.min(last_read, latest.message_id);
          }
          const ce_message_object_list =
            await MessageServer.GetUnreadChatMessages(
              user.username,
              user.secret,
              chat.id,
              last_read
            );

          for (const ce_message_object of ce_message_object_list) {
            if (ce_message_object.id > last_read) {
              MessagesStorage.storeMessage(
                user.username,
                chat.id,
                ce_message_object,
                db
              );
            }
          }
          console.log(
            `[Message Context] update chat ${chat.id} new messages to storage`
          );
        } catch (err) {
          console.error(
            `[Message Context] update chat ${chat.id} new messages to storage failed`
          );
        }
      }
      console.log(
        "[Message Context] Finish updating messages storage data from server..."
      );

      const init_messages = new Map<number, MessageContextObjectProps>();
      // Fetach all messages from loacl storage for each friend
      for (const chat of chats.values()) {
        let initial_messages_object = {
          chat_id: chat.id,
          loaded_messages: [],
          current_index: 0,
          total_messages_amount: 0,
        } as MessageContextObjectProps;

        // If message data existed already, load the data
        if (MessagesStorage.messageTableExist(user.username, chat.id, db)) {
          try {
            const is_initial_load = true;

            initial_messages_object = await getLoadedMessages(
              user.username,
              chat.id,
              initial_messages_object,
              NUM_OF_MESSAGES_LOAD_AT_ONCE,
              db,
              is_initial_load
            );
            console.log(
              `[Message Context] initially loaded message for chat ${chat.id} successfully`
            );
          } catch (err) {
            console.error(
              `[Message Context] initially loaded message for chat ${chat.id} failed: ${err}`
            );
          }
        }
        // If message data doesn't exist, create one in local storage
        else {
          console.log(
            `[Message Context] message table for chat ${chat.id} do not exist, start creating...`
          );
          MessagesStorage.createMessageTableIfNotExists(
            user.username,
            chat.id,
            db
          );
        }

        // Append new messages object to object list
        init_messages.set(chat.id, initial_messages_object);
        //setMessageMap(chat.id, initial_messages_object);
      }
      setMessages(init_messages);
      console.log(
        "[Message Context] Finish fetching messages data from local storage to context..."
      );

      console.log(
        "[Message Context] Initialize message context successfully..."
      );
      setIsMessagesInitialized(true);
    }
  };

  const resetMessageContext = () => {
    setMessages(new Map<number, MessageContextObjectProps>());
    setIsMessagesInitialized(false);
    console.log(`[Message Context] all messages context data has been cleaned`);
  };

  useEffect(() => {
    if (is_chats_loaded_from_local) {
      fetchMessageDataFromStorage();
    }
  }, [is_chats_loaded_from_local]);

  useEffect(() => {
    if (is_chats_initialized && is_message_loaded_from_local) {
      initializeMessageContext();
    }
  }, [is_chats_initialized, is_message_loaded_from_local]);

  useEffect(() => {
    sendNotificationByChatIdRef.current = sendNotificationByChatId;
  }, [chats]);

  return (
    <MessagesContext.Provider
      value={{
        messages,
        createMeesageObjectForNewChat,
        loadMessagesById,
        sendMessage,
        receiveMessage,
        resetLoadedMessagesById,
        ClearAllMessagesById,
        is_messages_initialized,
        is_message_loaded_from_local,
        initializeMessageContext,
        resetMessageContext,
      }}
    >
      {props.children}
    </MessagesContext.Provider>
  );
};
