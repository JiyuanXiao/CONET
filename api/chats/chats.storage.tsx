import { SQLiteDatabase } from "expo-sqlite";

// Chats table store each chat's ID
// This storage is presisted across restarts of app, hence app can get table id to do initial rendering

export const CreateChatTableIfNotExists = (db: SQLiteDatabase) => {
  try {
    db.execSync(
      `CREATE TABLE IF NOT EXISTS chats (id INTEGER PRIMARY KEY AUTOINCREMENT, chat_id TEXT UNIQUE);`
    );
    console.info(`CREATE TABLE: Table chats created successfully`);
  } catch (err) {
    console.error("CREATE TABLE: " + err);
  }
};

export const addNewChat = (chat_id: string, db: SQLiteDatabase) => {
  CreateChatTableIfNotExists(db);
  try {
    const result = db.runSync(
      `INSERT INTO chats (chat_id) VALUES (?);`,
      chat_id
    );
    console.info(
      `ADD CHAT: new chat is added with ID: ${result.lastInsertRowId}`
    );
  } catch (err: any) {
    if (err.message.includes("SQLITE_CONSTRAINT")) {
      console.error("ADD CHAT: Duplicate chat_id " + chat_id);
    } else {
      console.error("ADD CHAT: " + err);
    }
  }
};

export const getAllChats = (db: SQLiteDatabase): string[] => {
  try {
    const rows = db.getAllSync(`SELECT chat_id FROM chats;`) as {
      id: number;
      chat_id: string;
    }[];
    const chatIds = rows.map((row) => row.chat_id);
    console.info(`GET ALL CHATS: Successfully fetched all chat_ids`);
    return chatIds;
  } catch (err) {
    console.error("GET ALL CHATS: " + err);
    return [];
  }
};
