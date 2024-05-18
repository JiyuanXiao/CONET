import React, { createContext, useState, useEffect } from "react";
import { FriendsContextProps, FriendProps } from "@/constants/Types";
import { useSQLiteContext } from "expo-sqlite";
import {
  fetchLatestMessage,
  CreateMessageTableIfNotExists,
  MessageTableExist,
} from "../messages/messages.storage";
import {
  fetchAllFriends,
  deleteFriend,
  deleteAllFriends,
  addNewFriend,
} from "./firends.storage";

export const FriendsContext = createContext<FriendsContextProps>({
  friends: [],
  setFriends: () => {},
  getFriendById: (id: string) => undefined,
  updateFriendById: (id: string) => {},
  deleteFriendById: (id: string) => {},
  addFriend: (
    id: string,
    name: string,
    avatar_icon: string,
    icon_color: string,
    icon_background_color: string,
    icon_border_color: string
  ) => {},
});

// Friends context provides friend info such as last message and last message timestamp
// Friend info is used for chatbox rendering
export const FriendsContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const db = useSQLiteContext();
  const [friends, setFriends] = useState<FriendProps[]>([]);

  useEffect(() => {
    const init_friends = [];
    // Get all friends' id from local storage
    const friends = fetchAllFriends(db);

    // Collect all friend's last message and its timestamp from local storage
    for (const friend of friends) {
      const current_msg = fetchLatestMessage(friend.friend_id, db);
      const current_friend = {
        id: friend.friend_id,
        name: friend.friend_name,
        avatar_icon: friend.avatar_icon,
        icon_color: friend.icon_color,
        icon_background_color: friend.icon_background_color,
        icon_border_color: friend.icon_border_color,
        last_message_content: current_msg?.content || "",
        last_message_timestamp: current_msg?.timestamp || "",
      };
      init_friends.push(current_friend);
    }
    setFriends(init_friends);
    console.log("Initialize friend context successfully...");
  }, []);

  const getFriendById = (id: string) => {
    return friends.find((friend) => friend.id === id);
  };

  const addFriend = (
    id: string,
    name: string,
    avatar_icon: string,
    icon_color: string,
    icon_background_color: string,
    icon_border_color: string
  ) => {
    // add friend to local storage
    addNewFriend(
      id,
      name,
      avatar_icon,
      icon_color,
      icon_background_color,
      icon_border_color,
      db
    );

    if (!MessageTableExist(id, db)) {
      CreateMessageTableIfNotExists(id, db);
    }

    const new_friend = {
      id: id,
      name: name,
      avatar_icon: avatar_icon,
      icon_color: icon_color,
      icon_background_color: icon_background_color,
      icon_border_color: icon_border_color,
      last_message_content: "",
      last_message_timestamp: "",
    };

    setFriends([...friends, new_friend]);
  };

  const updateFriendById = (id: string) => {
    const targetFriendIndex = friends.findIndex((friend) => friend.id === id);

    if (targetFriendIndex !== -1) {
      const latest_messages = fetchLatestMessage(id, db);
      const updatedFriend = {
        id: id,
        name: friends[targetFriendIndex].name,
        avatar_icon: friends[targetFriendIndex].avatar_icon,
        icon_color: friends[targetFriendIndex].icon_color,
        icon_background_color: friends[targetFriendIndex].icon_background_color,
        icon_border_color: friends[targetFriendIndex].icon_border_color,
        last_message_content: latest_messages?.content || "",
        last_message_timestamp: latest_messages?.timestamp || "",
      };
      const updatedFriends = [...friends];
      updatedFriends[targetFriendIndex] = updatedFriend;
      setFriends(updatedFriends);
    } else {
      console.warn(
        "at updateFriendById() in friends.context.tsx: friend with " +
          id +
          " does not exist"
      );
    }
  };

  const deleteFriendById = (id: string) => {
    // update local storage
    deleteFriend(id, db);

    // update context
    setFriends(friends.filter((friend) => friend.id !== id));
  };

  return (
    <FriendsContext.Provider
      value={{
        friends,
        setFriends,
        getFriendById,
        updateFriendById,
        deleteFriendById,
        addFriend,
      }}
    >
      {props.children}
    </FriendsContext.Provider>
  );
};