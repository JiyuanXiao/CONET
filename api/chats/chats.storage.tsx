import { SQLiteDatabase } from "expo-sqlite";

// Chats table store each chat's ID
// This storage is presisted across restarts of app, hence app can get table id to do initial rendering

const tableExist = (db: SQLiteDatabase): boolean => {
  try {
    const result = db.getFirstSync(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='chats';`
    );
    return result !== null;
  } catch (err) {
    console.error("at tableExist() in chats.storage.tsx: " + err);
    return false;
  }
};

export const CreateChatTableIfNotExists = (db: SQLiteDatabase) => {
  try {
    if (!tableExist(db)) {
      db.execSync(
        // `CREATE TABLE IF NOT EXISTS chats (id INTEGER PRIMARY KEY AUTOINCREMENT, chat_id TEXT UNIQUE, friend_name TEXT, avatar_icon TEXT, icon_color TEXT, icon_background_color TEXT, icon_border_color TEXT);`
        `CREATE TABLE IF NOT EXISTS chats (id INTEGER PRIMARY KEY AUTOINCREMENT, chat_id TEXT UNIQUE, friend_name TEXT);`
      );
      console.info(`Table [chats] is Created Successfully...`);
    }
  } catch (err) {
    console.error(
      "at CreateChatTableIfNotExists() in chats.storage.tsx: " + err
    );
  }
};

export const deleteAllChats = (db: SQLiteDatabase) => {
  try {
    db.execSync(`DROP TABLE IF EXISTS chats;`);
    console.info(`Table [chats] is Deleted Successfully...`);
    CreateChatTableIfNotExists(db);
  } catch (err) {
    console.error(
      "at CreateChatTableIfNotExists() in chats.storage.tsx: " + err
    );
  }
};

export const addNewChat = (
  chat_id: string,
  friend_name: string,
  db: SQLiteDatabase
) => {
  CreateChatTableIfNotExists(db);
  try {
    const result = db.runSync(
      `INSERT INTO chats (chat_id, friend_name) VALUES (?, ?);`,
      chat_id,
      friend_name
    );
    console.info(`New Row is Added to Table [chats] Successfully: ${chat_id}`);
  } catch (err: any) {
    if (err.message.includes("SQLITE_CONSTRAINT")) {
      console.error(
        "at addNewChat() in chats.storage.tsx: Duplicate chat_id: " + chat_id
      );
    } else {
      console.error("at addNewChat() in chats.storage.tsx: " + err);
    }
  }
};

export const fetchAllChats = (
  db: SQLiteDatabase
): { chat_id: string; friend_name: string }[] => {
  try {
    const rows = db.getAllSync(`SELECT chat_id, friend_name FROM chats;`) as {
      chat_id: string;
      friend_name: string;
    }[];
    //const chatIds = rows.map((row) => row.chat_id);
    console.info(`Fetched All Rows From Table [chats] Successfully...`);
    return rows;
  } catch (err) {
    console.error("at fetchAllChats() in chats.storage.tsx: " + err);
    return [];
  }
};

export const deleteChat = (chat_id: string, db: SQLiteDatabase) => {
  try {
    db.runSync(`DELETE FROM chats WHERE chat_id = ?;`, chat_id);
    console.info(`Successfully Deleted Row From Table [chats]: ${chat_id}`);
  } catch (err) {
    console.error("at deleteChat() in chats.storage.tsx: " + err);
  }
};
