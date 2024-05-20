import { SQLiteDatabase } from "expo-sqlite";

// Friends table store each friend's ID
// This storage is presisted across restarts of app, hence app can get table id to do initial rendering

const tableExist = (db: SQLiteDatabase): boolean => {
  try {
    const result = db.getFirstSync(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='friends';`
    );
    return result !== null;
  } catch (err) {
    console.error("at tableExist() in friends.storage.tsx: " + err);
    return false;
  }
};

export const createFriendTableIfNotExists = (db: SQLiteDatabase) => {
  try {
    if (!tableExist(db)) {
      db.execSync(
        `CREATE TABLE IF NOT EXISTS friends (id INTEGER PRIMARY KEY AUTOINCREMENT, friend_id TEXT UNIQUE, friend_name TEXT, avatar_icon TEXT, icon_color TEXT, icon_background_color TEXT, icon_border_color TEXT);`
      );
      console.info(`Table [friends] is created successfully...`);
    }
  } catch (err) {
    console.error(
      "at CreateFriendTableIfNotExists() in friends.storage.tsx: " + err
    );
  }
};

export const deleteAllFriends = (db: SQLiteDatabase) => {
  try {
    db.execSync(`DROP TABLE IF EXISTS friends;`);
    console.info(`Table [friends] is deleted successfully...`);
    createFriendTableIfNotExists(db);
  } catch (err) {
    console.error(
      "at CreateFriendTableIfNotExists() in friends.storage.tsx: " + err
    );
  }
};

export const addNewFriend = (
  friend_id: string,
  friend_name: string,
  avatar_icon: string,
  icon_color: string,
  icon_background_color: string,
  icon_border_color: string,
  db: SQLiteDatabase
) => {
  createFriendTableIfNotExists(db);
  try {
    const result = db.runSync(
      `INSERT INTO friends (friend_id, friend_name, avatar_icon, icon_color, icon_background_color, icon_border_color ) VALUES (?, ?, ?, ?, ?, ?);`,
      friend_id,
      friend_name,
      avatar_icon,
      icon_color,
      icon_background_color,
      icon_border_color
    );
    console.info(
      `New row is added to table [friends] successfully: ${friend_id}`
    );
  } catch (err: any) {
    if (err.message.includes("SQLITE_CONSTRAINT")) {
      console.error(
        "at addNewFriend() in friends.storage.tsx: Duplicate friend_id: " +
          friend_id
      );
    } else {
      console.error("at addNewFriend() in friends.storage.tsx: " + err);
    }
  }
};

export const fetchAllFriends = (
  db: SQLiteDatabase
): {
  friend_id: string;
  friend_name: string;
  avatar_icon: string;
  icon_color: string;
  icon_background_color: string;
  icon_border_color: string;
}[] => {
  try {
    const rows = db.getAllSync(
      `SELECT friend_id, friend_name, avatar_icon, icon_color, icon_background_color, icon_border_color FROM friends;`
    ) as {
      friend_id: string;
      friend_name: string;
      avatar_icon: string;
      icon_color: string;
      icon_background_color: string;
      icon_border_color: string;
    }[];
    console.info(`Fetched all rows from table [friends] successfully...`);
    return rows;
  } catch (err) {
    console.error("at fetchAllFriends() in friends.storage.tsx: " + err);
    return [];
  }
};

export const deleteFriend = (friend_id: string, db: SQLiteDatabase) => {
  try {
    db.runSync(`DELETE FROM friends WHERE friend_id = ?;`, friend_id);
    console.info(`Successfully deleted row from table [friends]: ${friend_id}`);
  } catch (err) {
    console.error("at deleteFriend() in friends.storage.tsx: " + err);
  }
};
