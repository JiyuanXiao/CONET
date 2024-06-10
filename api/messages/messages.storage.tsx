import { SQLiteDatabase } from "expo-sqlite";
import { MessagesProps } from "@/constants/ContextTypes";
import { CE_MessageProps } from "@/constants/ChatEngineObjectTypes";

export const messageTableExist = (
  username: string | undefined,
  chat_id: number,
  db: SQLiteDatabase
): boolean => {
  if (!username || username.length === 0) {
    console.error("at tableExist() in messages.storage.tsx: username is empty");
    return false;
  }
  try {
    const result = db.getFirstSync(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='${username}_messages_${chat_id}';`
    );
    return result !== null;
  } catch (err) {
    console.error("at tableExist() in messages.storage.tsx: " + err);
    return false;
  }
};

export const createMessageTableIfNotExists = (
  username: string | undefined,
  chat_id: number,
  db: SQLiteDatabase
) => {
  if (!username || username.length === 0) {
    console.error(
      "at CreateMessageTableIfNotExists() in messages.storage.tsx: username is empty"
    );
    return;
  }
  try {
    db.execSync(
      //`CREATE TABLE IF NOT EXISTS ${username}_messages_${chat_id} (id INTEGER PRIMARY KEY AUTOINCREMENT, sender_id TEXT, receiver_id TEXT, content TEXT, content_type TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);`
      `CREATE TABLE IF NOT EXISTS ${username}_messages_${chat_id} (message_id INTEGER PRIMARY KEY, sender_username TEXT, text_content TEXT, file_url TEXT, content_type TEXT, timestamp TEXT);`
    );
    console.log(
      `[Message Storage] Table [${username}_messages_${chat_id}] is created successfully...`
    );
  } catch (err) {
    console.error("[Message Storage] CreateMessageTableIfNotExists(): " + err);
  }
};

export const deleteMessageTableIfExists = (
  username: string | undefined,
  chat_id: number,
  db: SQLiteDatabase
) => {
  if (!username || username.length === 0) {
    console.error(
      "at DeleteMessageTableIfExists() in messages.storage.tsx: username is empty"
    );
    return;
  }
  try {
    db.execSync(`DROP TABLE IF EXISTS ${username}_messages_${chat_id};`);
    console.log(
      `Table [${username}_messages_${chat_id}] is deleted successfully...`
    );
  } catch (err) {
    console.error(
      "at DeleteMessageTableIfExists() in messages.storage.tsx: " + err
    );
  }
};

export const fetchLatestMessage = (
  username: string | undefined,
  chat_id: number,
  db: SQLiteDatabase
) => {
  if (!username || username.length === 0) {
    console.error("[Message Storage] fetchLatestMessage(): username is empty");
    return;
  }
  try {
    const lastest_message = db.getFirstSync(
      `SELECT message_id, sender_username, text_content, file_url, content_type, timestamp FROM ${username}_messages_${chat_id} ORDER BY message_id DESC LIMIT 1;`
    ) as MessagesProps;
    if (lastest_message) {
      console.log(
        `[Message Storage] Fetched latest message in table [${username}_messages_${chat_id}] successfully...`
      );
    }
    return lastest_message;
  } catch (err) {
    console.error("[Message Storage] fetchLatestMessage(): " + err);
  }
};

export const storeMessage = (
  username: string | undefined,
  chat_id: number,
  message_object: CE_MessageProps,
  db: SQLiteDatabase
) => {
  if (!username || username.length === 0) {
    console.error("[Message Storage] storeMessage(): username is empty");
    return;
  }
  const message_header = process.env.EXPO_PUBLIC_SPECIAL_MESSAGE_INDICATOR;
  let current_context_type;

  if (!message_object.text) {
    current_context_type = "file";
  } else if (message_object.text.startsWith(`[${message_header}][系统消息]`)) {
    current_context_type = "system";
  } else if (message_object.text.startsWith(`[${message_header}][图片]`)) {
    current_context_type = "image";
  } else {
    current_context_type = "text";
  }

  try {
    db.runSync(
      //`INSERT INTO ${username}_messages_${chat_id} (sender_id, receiver_id, content, content_type) VALUES (?, ?, ?, ?);`,
      `INSERT INTO ${username}_messages_${chat_id} (message_id, sender_username, text_content, file_url, content_type, timestamp ) VALUES (?, ?, ?, ?, ?, ?);`,
      message_object.id,
      message_object.sender.username,
      message_object.text ? message_object.text : "",
      "",
      current_context_type,
      message_object.created
    );
    console.log(
      `[Message Storage] Insert new message into table [${username}_messages_${chat_id}]: ${message_object.id}`
    );
  } catch (err: any) {
    if (err.message.includes("UNIQUE constraint failed")) {
      console.log(
        `[Message Storage] message ${message_object.id} in chat: ${chat_id} exists in storage: storing rejected`
      );
    } else {
      console.error(
        `[Message Storage] storeMessage(): error in chat ${chat_id}: ` + err
      );
    }
  }

  const lastest_message = fetchLatestMessage(username, chat_id, db);
  return lastest_message;
};

export const fetchAllMessages = async (
  username: string | undefined,
  chat_id: number,
  db: SQLiteDatabase
) => {
  if (!username || username.length === 0) {
    console.error("[Message Storage]fetchAllMessages(): username is empty");
    return [];
  }

  try {
    const all_msg = (await db.getAllAsync(
      `SELECT message_id, sender_username, text_content, file_url, content_type, timestamp FROM ${username}_messages_${chat_id} ORDER BY message_id DESC;`
    )) as MessagesProps[];
    if (all_msg) {
      console.log(
        `[Message Storage] Fetched all message from table [${username}_messages_${chat_id}] successfully...`
      );
    }
    return all_msg;
  } catch (err) {
    console.error("[Message Storage] fetchAllMessages(): " + err);
    return [];
  }
};
