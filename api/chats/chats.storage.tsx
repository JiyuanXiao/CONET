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
        `CREATE TABLE IF NOT EXISTS chats (id INTEGER PRIMARY KEY AUTOINCREMENT, chat_id TEXT UNIQUE, friend_name TEXT, avatar_icon TEXT, icon_color TEXT, icon_background_color TEXT, icon_border_color TEXT);`
      );
      console.info(`Table [chats] is created successfully...`);
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
    console.info(`Table [chats] is deleted successfully...`);
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
  avatar_icon: string,
  icon_color: string,
  icon_background_color: string,
  icon_border_color: string,
  db: SQLiteDatabase
) => {
  CreateChatTableIfNotExists(db);
  try {
    const result = db.runSync(
      `INSERT INTO chats (chat_id, friend_name, avatar_icon, icon_color, icon_background_color, icon_border_color ) VALUES (?, ?, ?, ?, ?, ?);`,
      chat_id,
      friend_name,
      avatar_icon,
      icon_color,
      icon_background_color,
      icon_border_color
    );
    console.info(`New row is added to table [chats] successfully: ${chat_id}`);
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
): {
  chat_id: string;
  friend_name: string;
  avatar_icon: string;
  icon_color: string;
  icon_background_color: string;
  icon_border_color: string;
}[] => {
  try {
    const rows = db.getAllSync(
      `SELECT chat_id, friend_name, avatar_icon, icon_color, icon_background_color, icon_border_color FROM chats;`
    ) as {
      chat_id: string;
      friend_name: string;
      avatar_icon: string;
      icon_color: string;
      icon_background_color: string;
      icon_border_color: string;
    }[];
    //const chatIds = rows.map((row) => row.chat_id);
    console.info(`Fetched all rows from table [chats] successfully...`);
    return rows;
  } catch (err) {
    console.error("at fetchAllChats() in chats.storage.tsx: " + err);
    return [];
  }
};

export const deleteChat = (chat_id: string, db: SQLiteDatabase) => {
  try {
    db.runSync(`DELETE FROM chats WHERE chat_id = ?;`, chat_id);
    console.info(`Successfully deleted row from table [chats]: ${chat_id}`);
  } catch (err) {
    console.error("at deleteChat() in chats.storage.tsx: " + err);
  }
};
