import { SQLiteDatabase } from "expo-sqlite";
import { UserProps } from "@/constants/Types";

const tableExist = (db: SQLiteDatabase): boolean => {
  try {
    const result = db.getFirstSync(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='auth';`
    );
    return result !== null;
  } catch (err) {
    console.error("at tableExist() in authentication.storage.tsx: " + err);
    return false;
  }
};

export const createAuthTableIfNotExists = (db: SQLiteDatabase) => {
  try {
    if (!tableExist(db)) {
      db.execSync(
        `CREATE TABLE IF NOT EXISTS auth (id INTEGER PRIMARY KEY AUTOINCREMENT, account_id TEXT UNIQUE, name TEXT, avatar_icon TEXT, icon_background_color TEXT);`
      );
      console.info(`Table [auth] is created successfully...`);
    }
  } catch (err) {
    console.error(
      "at createAuthTableIfNotExists() in authentication.storage.tsx: " + err
    );
  }
};

const deleteAuthTableIfExist = (db: SQLiteDatabase) => {
  try {
    if (tableExist(db)) {
      db.execSync(`DROP TABLE IF EXISTS auth;`);
      console.info(`Table [auth] is deleted successfully...`);
    }
  } catch (err) {
    console.error(
      "at deleteAuthTableIfExists() in authentication.storage.tsx: " + err
    );
  }
};

export const fetchAuthInfo = (db: SQLiteDatabase): UserProps | null => {
  try {
    const user = db.getFirstSync(
      `SELECT account_id, name, avatar_icon, icon_background_color FROM auth LIMIT 1;`
    ) as UserProps;
    console.info(
      `User ${user?.name}'s authentication info is fetcehed successfully...`
    );
    return user;
  } catch (err) {
    console.error("at getFirstRow() in authentication.storage.tsx: " + err);
    return null;
  }
};

export const pushAuthInfo = (user_info: UserProps, db: SQLiteDatabase) => {
  try {
    const num_of_login_user = db.getFirstSync(
      `SELECT COUNT(*) as count FROM auth;`
    );
    if (num_of_login_user !== 0) {
      console.info(
        `Table [auth] should be empty but it is not, clearing the [auth] table now...`
      );
      deleteAuthTableIfExist(db);
      createAuthTableIfNotExists(db);
    }
  } catch (err) {
    console.error(`at isTableEmpty() in authentication.storage.tsx: ${err}`);
    return false;
  }

  try {
    db.runSync(
      `INSERT INTO auth (account_id, name, avatar_icon, icon_background_color) VALUES (?, ?, ?, ?);`,
      user_info.account_id,
      user_info.name,
      user_info.avatar_icon,
      user_info.icon_background_color
    );
    console.info(
      `User ${user_info.name}'s info is saved to storage succrssfully...`
    );
  } catch (err) {
    console.error(`at pushAuthInfo() in authentication.storage.tsx: ${err}`);
  }
};

export const clearAuthInfo = (db: SQLiteDatabase) => {
  console.info(`Table [auth] is clearing...`);
  deleteAuthTableIfExist(db);
  createAuthTableIfNotExists(db);
};
