import { SQLiteDatabase } from "expo-sqlite";
import { MessagesDateabseProps, MessagesProps } from "@/constants/Types";

export const messageTableExist = (
  user_id: string,
  friend_id: string,
  db: SQLiteDatabase
): boolean => {
  if (!user_id || user_id.length === 0) {
    console.error("at tableExist() in messages.storage.tsx: user_id is empty");
    return false;
  }
  try {
    const result = db.getFirstSync(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='${user_id}_messages_${friend_id}';`
    );
    return result !== null;
  } catch (err) {
    console.error("at tableExist() in messages.storage.tsx: " + err);
    return false;
  }
};

export const createMessageTableIfNotExists = (
  user_id: string,
  friend_id: string,
  db: SQLiteDatabase
) => {
  if (!user_id || user_id.length === 0) {
    console.error(
      "at CreateMessageTableIfNotExists() in messages.storage.tsx: user_id is empty"
    );
    return;
  }
  try {
    db.execSync(
      //`CREATE TABLE IF NOT EXISTS ${user_id}_messages_${friend_id} (id INTEGER PRIMARY KEY AUTOINCREMENT, sender_id TEXT, receiver_id TEXT, content TEXT, content_type TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);`
      `CREATE TABLE IF NOT EXISTS ${user_id}_messages_${friend_id} (id INTEGER PRIMARY KEY AUTOINCREMENT, sender_id TEXT, receiver_id TEXT, content TEXT, content_type TEXT, timestamp INTEGER);`
    );
    console.info(
      `Table [${user_id}_messages_${friend_id}] is created successfully...`
    );
  } catch (err) {
    console.error(
      "at CreateMessageTableIfNotExists() in messages.storage.tsx: " + err
    );
  }
};

export const deleteMessageTableIfExists = (
  user_id: string,
  friend_id: string,
  db: SQLiteDatabase
) => {
  if (!user_id || user_id.length === 0) {
    console.error(
      "at DeleteMessageTableIfExists() in messages.storage.tsx: user_id is empty"
    );
    return;
  }
  try {
    db.execSync(`DROP TABLE IF EXISTS ${user_id}_messages_${friend_id};`);
    console.info(
      `Table [${user_id}_messages_${friend_id}] is deleted successfully...`
    );
  } catch (err) {
    console.error(
      "at DeleteMessageTableIfExists() in messages.storage.tsx: " + err
    );
  }
};

export const fetchLatestMessage = (
  user_id: string,
  friend_id: string,
  db: SQLiteDatabase
) => {
  if (!user_id || user_id.length === 0) {
    console.error(
      "at fetchLatestMessage() in messages.storage.tsx: user_id is empty"
    );
    return;
  }
  try {
    const lastest_message = db.getFirstSync(
      `SELECT * FROM ${user_id}_messages_${friend_id} ORDER BY id DESC LIMIT 1;`
    ) as MessagesProps;
    if (lastest_message) {
      console.info(
        `Fetched latest message in table [${user_id}_messages_${friend_id}] successfully...`
      );
    }
    return lastest_message;
  } catch (err) {
    console.error("at fetchLatestMessage() in messages.storage.tsx: " + err);
  }
};

export const storeMessage = (
  user_id: string,
  message: MessagesDateabseProps
) => {
  // Tables are identified by ID of the person we are talking with, so we always get that person's id
  const friend_id = message.is_recevied
    ? message.sender_id
    : message.receiver_id;

  if (!friend_id || friend_id.length === 0) {
    throw new Error(
      "at storeMessage() in messages.storage.tsx: friend_id is undefined"
    );
  }

  if (!user_id || user_id.length === 0) {
    console.error(
      "at storeMessage() in messages.storage.tsx: user_id is empty"
    );
    return;
  }

  try {
    message.db.runSync(
      //`INSERT INTO ${user_id}_messages_${friend_id} (sender_id, receiver_id, content, content_type) VALUES (?, ?, ?, ?);`,
      `INSERT INTO ${user_id}_messages_${friend_id} (sender_id, receiver_id, content, content_type, timestamp) VALUES (?, ?, ?, ?, CAST(strftime('%s', 'now') AS INTEGER));`,
      message.sender_id,
      message.receiver_id,
      message.content,
      message.content_type
    );
    console.info(
      `Insert new message into table [${user_id}_messages_${friend_id}]: ${message.content}`
    );
  } catch (err) {
    console.error("at storeMessage() in messages.storage.tsx: " + err);
  }

  const lastest_message = fetchLatestMessage(user_id, friend_id, message.db);
  return lastest_message;
};

export const fetchAllMessages = async (
  user_id: string,
  friend_id: string,
  db: SQLiteDatabase
) => {
  if (!friend_id || friend_id.length === 0) {
    throw new Error(
      "at fetchAllMessages() in messages.storage.tsx: friend_id is undefined"
    );
  }

  if (!user_id || user_id.length === 0) {
    console.error(
      "at fetchAllMessages() in messages.storage.tsx: user_id is empty"
    );
    return [];
  }

  try {
    const all_msg = (await db.getAllAsync(
      `SELECT id , sender_id , receiver_id , content , content_type , datetime(timestamp, 'utc', '-7 hours') as timestamp FROM ${user_id}_messages_${friend_id} ORDER BY id DESC;`
    )) as MessagesProps[];
    if (all_msg) {
      console.info(
        `Fetched all message from table [${user_id}_messages_${friend_id}] successfully...`
      );
    }
    return all_msg;
  } catch (err) {
    console.error("at fetchAllMessages() in messages.storage.tsx: " + err);
    return [];
  }
};
