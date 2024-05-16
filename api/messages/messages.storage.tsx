import { SQLiteDatabase } from "expo-sqlite";
import { MessagesDateabseProps, MessagesProps } from "@/constants/Types";

const tableExist = (
  table_id: string | undefined,
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
  table_id: string | undefined,
  db: SQLiteDatabase
) => {
  try {
    db.execSync(
      `CREATE TABLE IF NOT EXISTS messages_${table_id} (id INTEGER PRIMARY KEY AUTOINCREMENT, sender_id TEXT, receiver_id TEXT, content TEXT, content_type TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);`
    );
    console.info(`Table [messages_${table_id}] is Created Successfully...`);
  } catch (err) {
    console.error(
      "at CreateMessageTableIfNotExists() in messages.storage.tsx: " + err
    );
  }
};

export const DeleteMessageTableIfExists = (
  table_id: string | undefined,
  db: SQLiteDatabase
) => {
  try {
    db.execSync(`DROP TABLE IF EXISTS messages_${table_id};`);
    console.info(`Table [messages_${table_id}] is Deleted Successfully...`);
  } catch (err) {
    console.error(
      "at DeleteMessageTableIfExists() in messages.storage.tsx: " + err
    );
  }
};

export const fetchLatestMessage = (
  table_id: string | undefined,
  db: SQLiteDatabase
) => {
  //DeleteMessageTableIfExists(table_id, db);
  if (!tableExist(table_id, db)) {
    CreateMessageTableIfNotExists(table_id, db);
  }
  try {
    const lastest_message = db.getFirstSync(
      `SELECT * FROM messages_${table_id} ORDER BY id DESC LIMIT 1;`
    ) as MessagesProps;
    if (lastest_message) {
      console.info(
        `Fetched Latest Message in Table [messages_${table_id}] Successfully...`
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

  if (!tableExist(table_id, props.db)) {
    CreateMessageTableIfNotExists(table_id, props.db);
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
      `Insert New Message into Table [messages_${table_id}]: ${props.content}`
    );
  } catch (err) {
    console.error("at storeMessage() in messages.storage.tsx: " + err);
  }

  const lastest_message = fetchLatestMessage(table_id, props.db);
  return lastest_message;
};

export const fetchAllMessages = async (
  table_id: string | undefined,
  db: SQLiteDatabase
) => {
  if (!table_id || table_id.length === 0) {
    throw new Error(
      "at fetchAllMessages() in messages.storage.tsx: table_id is undefined"
    );
  }

  //DeleteMessageTableIfExists(table_id, db);
  if (!tableExist(table_id, db)) {
    CreateMessageTableIfNotExists(table_id, db);
  }

  try {
    const all_msg = (await db.getAllAsync(
      `SELECT * FROM messages_${table_id} ORDER BY id DESC;`
    )) as MessagesProps[];
    if (all_msg) {
      console.info(
        `Fetched All Message From Table [messages_${table_id}] Successfully...`
      );
    }
    return all_msg;
  } catch (err) {
    console.error("at fetchAllMessages() in messages.storage.tsx: " + err);
    return [];
  }
};
