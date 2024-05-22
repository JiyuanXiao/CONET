import { SQLiteDatabase } from "expo-sqlite";

// Friends table store each friend's ID
// This storage is presisted across restarts of app, hence app can get table id to do initial rendering

const tableExist = (user_id: string, db: SQLiteDatabase): boolean => {
  if (!user_id || user_id.length === 0) {
    console.error(`at tableExist() in friends.storage.tsx: user_id is empty`);
    return false;
  }
  try {
    const result = db.getFirstSync(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='${user_id}_friends';`
    );
    return result !== null;
  } catch (err) {
    console.error(`at tableExist() in friends.storage.tsx: ${err}`);
    return false;
  }
};

export const createFriendTableIfNotExists = (
  user_id: string,
  db: SQLiteDatabase
) => {
  if (!user_id || user_id.length === 0) {
    console.error(
      "at CreateFriendTableIfNotExists() in friends.storage.tsx: user_id is empty"
    );
    return;
  }
  try {
    if (!tableExist(user_id, db)) {
      db.execSync(
        `CREATE TABLE IF NOT EXISTS ${user_id}_friends (id INTEGER PRIMARY KEY AUTOINCREMENT, friend_id TEXT UNIQUE, friend_name TEXT, avatar_icon TEXT, icon_background_color TEXT);`
      );
      console.info(`Table [${user_id}_friends] is created successfully...`);
    }
  } catch (err) {
    console.error(
      "at CreateFriendTableIfNotExists() in friends.storage.tsx: " + err
    );
  }
};

export const deleteAllFriends = (user_id: string, db: SQLiteDatabase) => {
  if (!user_id || user_id.length === 0) {
    console.error(
      "at CreateFriendTableIfNotExists() in friends.storage.tsx: user_id is empty"
    );
    return;
  }
  try {
    db.execSync(`DROP TABLE IF EXISTS ${user_id}_friends;`);
    console.info(`Table [${user_id}_friends] is deleted successfully...`);
    createFriendTableIfNotExists(user_id, db);
  } catch (err) {
    console.error(
      "at CreateFriendTableIfNotExists() in friends.storage.tsx: " + err
    );
  }
};

export const addNewFriend = (
  user_id: string,
  friend_id: string,
  friend_name: string,
  avatar_icon: string,
  icon_background_color: string,
  db: SQLiteDatabase
) => {
  if (!user_id || user_id.length === 0) {
    console.error("at addNewFriend() in friends.storage.tsx: user_id is empty");
    return;
  }
  console.info(
    "Start to add new friend " + friend_name + " to storage and context"
  );
  createFriendTableIfNotExists(user_id, db);
  try {
    const result = db.runSync(
      `INSERT INTO ${user_id}_friends (friend_id, friend_name, avatar_icon, icon_background_color ) VALUES (?, ?, ?, ?);`,
      friend_id,
      friend_name,
      avatar_icon,
      icon_background_color
    );
    console.info(
      `New row is added to table [${user_id}_friends] successfully: ${friend_id}`
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
  user_id: string,
  db: SQLiteDatabase
): {
  friend_id: string;
  friend_name: string;
  avatar_icon: string;
  icon_background_color: string;
}[] => {
  if (!user_id || user_id.length === 0) {
    console.error(
      "at fetchAllFriends() in friends.storage.tsx: user_id is empty"
    );
    return [];
  }
  try {
    const rows = db.getAllSync(
      `SELECT friend_id, friend_name, avatar_icon, icon_background_color FROM ${user_id}_friends;`
    ) as {
      friend_id: string;
      friend_name: string;
      avatar_icon: string;
      icon_background_color: string;
    }[];
    console.info(
      `Fetched all rows from table [${user_id}_friends] successfully...`
    );
    return rows;
  } catch (err) {
    console.error("at fetchAllFriends() in friends.storage.tsx: " + err);
    return [];
  }
};

export const deleteFriend = (
  user_id: string,
  friend_id: string,
  db: SQLiteDatabase
) => {
  if (!user_id || user_id.length === 0) {
    console.error("at deleteFriend() in friends.storage.tsx: user_id is empty");
    return;
  }
  try {
    db.runSync(
      `DELETE FROM ${user_id}_friends WHERE friend_id = ?;`,
      friend_id
    );
    console.info(
      `Successfully deleted row from table [${user_id}_friends]: ${friend_id}`
    );
  } catch (err) {
    console.error("at deleteFriend() in friends.storage.tsx: " + err);
  }
};
