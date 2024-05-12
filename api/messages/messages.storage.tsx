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
    console.error("CHECK TABLE EXISTS: " + err);
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
    console.info(`CREATE TABLE: Table ${table_id} created successfully`);
  } catch (err) {
    console.error("CREATE TABLE: " + err);
  }
};

export const DeleteMessageTableIfExists = (
  table_id: string | undefined,
  db: SQLiteDatabase
) => {
  try {
    db.execSync(`DROP TABLE IF EXISTS messages_${table_id};`);
    console.info(`DELETE TABLE: Tabble ${table_id} deleted successfully`);
  } catch (err) {
    console.error("DELETE TABLE: " + err);
  }
};

export const fetchLatestMessage = (
  table_id: string | undefined,
  db: SQLiteDatabase
) => {
  try {
    const lastest_message = db.getFirstSync(
      `SELECT * FROM messages_${table_id} ORDER BY id DESC LIMIT 1;`
    ) as MessagesProps;
    console.info(
      "FETCH_LATEST: " +
        "ID: " +
        lastest_message.id +
        "| Sender: " +
        lastest_message.sender_id +
        "| Recevier: " +
        lastest_message.receiver_id +
        "| Conetent: " +
        lastest_message.content +
        "| Conetent Type: " +
        lastest_message.content_type +
        "| Timestamp: " +
        lastest_message.timestamp
    );
    return lastest_message;
  } catch (err) {
    console.error("FETCH_LATEST: " + err);
  }
};

export const storeMessage = (props: MessagesDateabseProps) => {
  // Tables are identified by ID of the person we are talking with, so we always get that person's id
  const table_id = props.is_recevied ? props.sender_id : props.receiver_id;

  if (!table_id || table_id.length === 0) {
    throw new Error("table_id is undefined");
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
      `INSERT MESSAGE: Message stored with ID: ${result.lastInsertRowId}`
    );
  } catch (err) {
    console.error("INSERT MESSAGE: " + err);
  }

  const lastest_message = fetchLatestMessage(table_id, props.db);
  return lastest_message;
};

export const fetchAllMessages = async (
  table_id: string | undefined,
  db: SQLiteDatabase
) => {
  if (!table_id || table_id.length === 0) {
    throw new Error("table_id is undefined");
  }

  //DeleteMessageTableIfExists(table_id, db);
  if (!tableExist(table_id, db)) {
    CreateMessageTableIfNotExists(table_id, db);
  }

  try {
    const all_msg = (await db.getAllAsync(
      `SELECT * FROM messages_${table_id};`
    )) as MessagesProps[];
    console.info("GET ALL MESSAGES: ");
    for (const msg of all_msg) {
      console.info(
        "ID: " +
          msg.id +
          "| Sender: " +
          msg.sender_id +
          "| Recevier: " +
          msg.receiver_id +
          "| Conetent: " +
          msg.content +
          "| Conetent Type: " +
          msg.content_type +
          "| Timestamp: " +
          msg.timestamp
      );
    }
    return all_msg;
  } catch (err) {
    console.error("GET ALL MESSAGES: " + err);
    return [];
  }
};
