import { SQLiteDatabase } from "expo-sqlite";
import { MessagesDateabseProps, MessagesProps } from "@/constants/Types";

export const MessageTableExist = (
  table_id: string,
  db: SQLiteDatabase
): boolean => {
  try {
    const result = db.getFirstSync(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='messages_${table_id}';`
    );
    return result !== null;
  } catch (err) {
    console.error("at tableExist() in messages.storage.tsx: " + err);
    return false;
  }
};

export const CreateMessageTableIfNotExists = (
  table_id: string,
  db: SQLiteDatabase
) => {
  try {
    db.execSync(
      `CREATE TABLE IF NOT EXISTS messages_${table_id} (id INTEGER PRIMARY KEY AUTOINCREMENT, sender_id TEXT, receiver_id TEXT, content TEXT, content_type TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);`
    );
    console.info(`Table [messages_${table_id}] is created successfully...`);
  } catch (err) {
    console.error(
      "at CreateMessageTableIfNotExists() in messages.storage.tsx: " + err
    );
  }
};

export const DeleteMessageTableIfExists = (
  table_id: string,
  db: SQLiteDatabase
) => {
  try {
    db.execSync(`DROP TABLE IF EXISTS messages_${table_id};`);
    console.info(`Table [messages_${table_id}] is deleted successfully...`);
  } catch (err) {
    console.error(
      "at DeleteMessageTableIfExists() in messages.storage.tsx: " + err
    );
  }
};

export const fetchLatestMessage = (table_id: string, db: SQLiteDatabase) => {
  try {
    const lastest_message = db.getFirstSync(
      `SELECT * FROM messages_${table_id} ORDER BY id DESC LIMIT 1;`
    ) as MessagesProps;
    if (lastest_message) {
      console.info(
        `Fetched latest message in table [messages_${table_id}] successfully...`
      );
    }
    return lastest_message;
  } catch (err) {
    console.error("at fetchLatestMessage() in messages.storage.tsx: " + err);
  }
};

export const storeMessage = (props: MessagesDateabseProps) => {
  // Tables are identified by ID of the person we are talking with, so we always get that person's id
  const table_id = props.is_recevied ? props.sender_id : props.receiver_id;

  if (!table_id || table_id.length === 0) {
    throw new Error(
      "at storeMessage() in messages.storage.tsx: table_id is undefined"
    );
  }

  try {
    const result = props.db.runSync(
      `INSERT INTO messages_${table_id} (sender_id, receiver_id, content, content_type) VALUES (?, ?, ?, ?);`,
      props.sender_id,
      props.receiver_id,
      props.content,
      props.content_type
    );
    console.info(
      `Insert new message into table [messages_${table_id}]: ${props.content}`
    );
  } catch (err) {
    console.error("at storeMessage() in messages.storage.tsx: " + err);
  }

  const lastest_message = fetchLatestMessage(table_id, props.db);
  return lastest_message;
};

export const fetchAllMessages = async (
  table_id: string,
  db: SQLiteDatabase
) => {
  if (!table_id || table_id.length === 0) {
    throw new Error(
      "at fetchAllMessages() in messages.storage.tsx: table_id is undefined"
    );
  }

  try {
    const all_msg = (await db.getAllAsync(
      `SELECT * FROM messages_${table_id} ORDER BY id DESC;`
    )) as MessagesProps[];
    if (all_msg) {
      console.info(
        `Fetched all message from table [messages_${table_id}] successfully...`
      );
    }
    return all_msg;
  } catch (err) {
    console.error("at fetchAllMessages() in messages.storage.tsx: " + err);
    return [];
  }
};
