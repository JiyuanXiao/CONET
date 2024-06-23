import { SQLiteDatabase } from "expo-sqlite";
import { MessagesProps } from "@/constants/ContextTypes";
import { CE_MessageProps } from "@/constants/ChatEngineObjectTypes";
import * as FileSystem from "expo-file-system";

export const messageTableExist = (
  username: string | undefined,
  chat_id: number,
  db: SQLiteDatabase
): boolean => {
  if (!username || username.length === 0) {
    console.error("at tableExist() in messages.storage.tsx: username is empty");
    return false;
  }
  try {
    const result = db.getFirstSync(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='${username}_messages_${chat_id}';`
    );
    return result !== null;
  } catch (err) {
    console.error("at tableExist() in messages.storage.tsx: " + err);
    return false;
  }
};

export const createMessageTableIfNotExists = (
  username: string | undefined,
  chat_id: number,
  db: SQLiteDatabase
) => {
  if (!username || username.length === 0) {
    console.error(
      "at CreateMessageTableIfNotExists() in messages.storage.tsx: username is empty"
    );
    return;
  }
  try {
    db.execSync(
      //`CREATE TABLE IF NOT EXISTS ${username}_messages_${chat_id} (id INTEGER PRIMARY KEY AUTOINCREMENT, sender_id TEXT, receiver_id TEXT, content TEXT, content_type TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);`
      `CREATE TABLE IF NOT EXISTS ${username}_messages_${chat_id} (message_id INTEGER PRIMARY KEY, sender_username TEXT, text_content TEXT, file_url TEXT, content_type TEXT, timestamp TEXT);`
    );
    console.log(
      `[Message Storage] Table [${username}_messages_${chat_id}] is created successfully...`
    );
  } catch (err) {
    console.error("[Message Storage] CreateMessageTableIfNotExists(): " + err);
  }
};

export const deleteMessageTableIfExists = (
  username: string | undefined,
  chat_id: number,
  db: SQLiteDatabase
) => {
  if (!username || username.length === 0) {
    console.error(
      "at DeleteMessageTableIfExists() in messages.storage.tsx: username is empty"
    );
    return;
  }
  try {
    db.execSync(`DROP TABLE IF EXISTS ${username}_messages_${chat_id};`);
    console.log(
      `Table [${username}_messages_${chat_id}] is deleted successfully...`
    );
  } catch (err) {
    console.error(
      "at DeleteMessageTableIfExists() in messages.storage.tsx: " + err
    );
  }
};

export const fetchLatestMessage = (
  username: string | undefined,
  chat_id: number,
  db: SQLiteDatabase
) => {
  if (!username || username.length === 0) {
    console.error("[Message Storage] fetchLatestMessage(): username is empty");
    return;
  }
  try {
    const lastest_message = db.getFirstSync(
      `SELECT message_id, sender_username, text_content, file_url, content_type, timestamp FROM ${username}_messages_${chat_id} ORDER BY message_id DESC LIMIT 1;`
    ) as MessagesProps;
    if (lastest_message) {
      console.log(
        `[Message Storage] Fetched latest message in table [${username}_messages_${chat_id}] successfully...`
      );
    }
    return lastest_message;
  } catch (err) {
    console.error("[Message Storage] fetchLatestMessage(): " + err);
  }
};

export const storeMessage = async (
  username: string | undefined,
  chat_id: number,
  message_object: CE_MessageProps,
  db: SQLiteDatabase
) => {
  if (!username || username.length === 0) {
    console.error("[Message Storage] storeMessage(): username is empty");
    return;
  }
  const message_header = process.env.EXPO_PUBLIC_SPECIAL_MESSAGE_INDICATOR;
  let current_context_type;

  if (!message_object.text) {
    current_context_type = "invalid";
  } else if (message_object.text.startsWith(`[${message_header}][系统消息]`)) {
    current_context_type = "system";
  } else if (message_object.text.startsWith(`[${message_header}][图片]`)) {
    const file_url = message_object.attachments[0].file;
    const directory_path = `${FileSystem.documentDirectory}${username}/${chat_id}/`;
    const file_extension = file_url.match(/\/attachments\/[^?]+\.(\w+)\?/);
    let file_path;
    if (file_extension && file_extension.length > 1) {
      file_path = `${directory_path}${message_object.id}.${file_extension[1]}`;
    } else {
      file_path = `${directory_path}${message_object.id}.png`;
    }
    try {
      const dir_info = await FileSystem.getInfoAsync(directory_path);
      if (!dir_info.exists) {
        await FileSystem.makeDirectoryAsync(directory_path, {
          intermediates: true,
        });
      }
      await FileSystem.downloadAsync(file_url, file_path);
      message_object.attachments[0].file = file_path;
      console.log(`[Message Storage] saved image to ${file_path}`);
    } catch (err) {
      console.error(
        `[Message Storage] saving image to file system failed: ${err}`
      );
      return;
    }
    message_object.text = "[图片]";
    current_context_type = "image_uri";
  } else if (message_object.text.startsWith(`[${message_header}][视频]`)) {
    const file_url = message_object.attachments[0].file;
    const directory_path = `${FileSystem.documentDirectory}${username}/${chat_id}/`;
    const file_extension = file_url.match(/\/attachments\/[^?]+\.(\w+)\?/);
    let file_path;
    if (file_extension && file_extension.length > 1) {
      file_path = `${directory_path}${message_object.id}.${file_extension[1]}`;
    } else {
      file_path = `${directory_path}${message_object.id}.mp4`;
    }
    try {
      const dir_info = await FileSystem.getInfoAsync(directory_path);
      if (!dir_info.exists) {
        await FileSystem.makeDirectoryAsync(directory_path, {
          intermediates: true,
        });
      }
      await FileSystem.downloadAsync(file_url, file_path);
      message_object.attachments[0].file = file_path;
      console.log(`[Message Storage] saved video to ${file_path}}`);
    } catch (err) {
      console.error(
        `[Message Storage] saving video to file system failed: ${err}`
      );
      return;
    }
    message_object.text = "[视频]";
    current_context_type = "video_uri";
  } else if (message_object.text.startsWith(`[${message_header}][语音]`)) {
    const file_url = message_object.attachments[0].file;
    console.log(file_url);
    const directory_path = `${FileSystem.documentDirectory}${username}/${chat_id}/`;
    const file_extension = file_url.match(/\/attachments\/[^?]+\.(\w+)\?/);
    let file_path;
    if (file_extension && file_extension.length > 1) {
      file_path = `${directory_path}${message_object.id}.${file_extension[1]}`;
    } else {
      file_path = `${directory_path}${message_object.id}.m4a`;
    }
    try {
      const dir_info = await FileSystem.getInfoAsync(directory_path);
      if (!dir_info.exists) {
        await FileSystem.makeDirectoryAsync(directory_path, {
          intermediates: true,
        });
      }
      await FileSystem.downloadAsync(file_url, file_path);
      message_object.attachments[0].file = file_path;
      console.log(`[Message Storage] saved voice to ${file_path}}`);
    } catch (err) {
      console.error(
        `[Message Storage] saving voice to file system failed: ${err}`
      );
      return;
    }
    message_object.text = "[语音]";
    current_context_type = "voice_uri";
  } else {
    current_context_type = "text";
  }

  try {
    db.runSync(
      //`INSERT INTO ${username}_messages_${chat_id} (sender_id, receiver_id, content, content_type) VALUES (?, ?, ?, ?);`,
      `INSERT INTO ${username}_messages_${chat_id} (message_id, sender_username, text_content, file_url, content_type, timestamp ) VALUES (?, ?, ?, ?, ?, ?);`,
      message_object.id,
      message_object.sender.username,
      message_object.text ? message_object.text : "",
      message_object.attachments.length > 0
        ? message_object.attachments[0].file
        : "",
      current_context_type,
      message_object.created
    );
    console.log(
      `[Message Storage] Insert new message into table [${username}_messages_${chat_id}]: ${message_object.id}`
    );
    const lastest_message = fetchLatestMessage(username, chat_id, db);
    return lastest_message;
  } catch (err: any) {
    if (err.message.includes("UNIQUE constraint failed")) {
      console.log(
        `[Message Storage] message ${message_object.id} in chat: ${chat_id} exists in storage: storing rejected`
      );
    } else {
      console.error(
        `[Message Storage] storeMessage(): error in chat ${chat_id}: ` + err
      );
    }
  }
};

export const fetchChunkOfMessages = async (
  username: string | undefined,
  chat_id: number,
  chunk_size: number,
  offset: number,
  db: SQLiteDatabase
) => {
  if (!username || username.length === 0) {
    console.error("[Message Storage]fetchAllMessages(): username is empty");
    return [];
  }

  try {
    // const messages = (await db.getAllAsync(
    //   `SELECT message_id, sender_username, text_content, file_url, content_type, timestamp FROM ${username}_messages_${chat_id} ORDER BY message_id DESC `
    // )) as MessagesProps[];
    const messages = (await db.getAllAsync(
      `SELECT message_id, sender_username, text_content, file_url, content_type, timestamp FROM ${username}_messages_${chat_id} ORDER BY message_id DESC LIMIT ${chunk_size} OFFSET ${offset};`
    )) as MessagesProps[];
    if (messages) {
      console.log(
        `[Message Storage] Fetched ${chunk_size} messages with offset ${offset} from table [${username}_messages_${chat_id}] successfully...`
      );
    }
    return messages;
  } catch (err) {
    console.error("[Message Storage] fetchChunkOfMessages(): " + err);
    return [];
  }
};

export const getTotalRowCount = async (
  username: string | undefined,
  chat_id: number,
  db: SQLiteDatabase
) => {
  try {
    const result: { total_rows: number } | null = await db.getFirstAsync(
      `SELECT COUNT(*) as total_rows FROM ${username}_messages_${chat_id};`
    );

    if (!result) {
      return 0;
    }
    return result.total_rows;
  } catch (error) {
    console.error("[Message Storage] Error fetching total row count:", error);
    return 0;
  }
};
