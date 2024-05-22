import React, { createContext, useState, useEffect, useContext } from "react";
import { FriendsContextProps, FriendProps, UserProps } from "@/constants/Types";
import { useSQLiteContext } from "expo-sqlite";
import {
  fetchLatestMessage,
  createMessageTableIfNotExists,
  messageTableExist,
} from "../messages/messages.storage";
import {
  fetchAllFriends,
  deleteFriend,
  addNewFriend,
  createFriendTableIfNotExists,
} from "./friends.storage";
import { AuthenticationContext } from "../authentication/authentication.context";

export const FriendsContext = createContext<FriendsContextProps>({
  friends: [],
  setFriends: () => {},
  current_talking_friend_id: "",
  setCurrentTalkingFriendId: () => {},
  getFriendById: (id: string) => undefined,
  updateFriendById: (id: string) => {},
  deleteFriendById: (id: string) => {},
  addFriend: (
    id: string,
    name: string,
    avatar_icon: string,
    icon_background_color: string
  ) => {},
});

// Friends context provides friend info such as last message and last message timestamp
// Friend info is used for chatbox rendering
export const FriendsContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const db = useSQLiteContext();
  const { user } = useContext(AuthenticationContext);
  const [friends, setFriends] = useState<FriendProps[]>([]);
  const [current_talking_friend_id, setCurrentTalkingFriendId] =
    useState<string>("");
  // const [current_user, setCurrentUser] = useState<UserProps | null>(null);

  // useEffect(() => {
  //   setCurrentUser(user);
  // }, [user]);

  useEffect(() => {
    if (user) {
      console.log("Start to initialize friend context...");
      createFriendTableIfNotExists(user.account_id, db);
      const init_friends = [];
      // Get all friends' id from local storage
      const friends = fetchAllFriends(user.account_id, db);

      // Collect all friend's last message and its timestamp from local storage
      for (const friend of friends) {
        const current_msg = fetchLatestMessage(
          user.account_id,
          friend.friend_id,
          db
        );
        const current_friend = {
          id: friend.friend_id,
          name: friend.friend_name,
          avatar_icon: friend.avatar_icon,
          icon_background_color: friend.icon_background_color,
          last_message_content: current_msg?.content || "",
          last_message_timestamp: current_msg?.timestamp || "",
        };
        init_friends.push(current_friend);
      }
      setFriends(init_friends);
      console.log("Initialize friend context successfully...");
    }
  }, [user]);

  const getFriendById = (id: string) => {
    return friends.find((friend) => friend.id === id);
  };

  const addFriend = (
    id: string,
    name: string,
    avatar_icon: string,
    icon_background_color: string
  ) => {
    // add friend to local storage
    addNewFriend(
      user?.account_id || "",
      id,
      name,
      avatar_icon,
      icon_background_color,
      db
    );

    if (!messageTableExist(user?.account_id || "", id, db)) {
      console.info(
        "User " +
          user?.name +
          "'s message storage hasn't been created. Start to create now..."
      );
      createMessageTableIfNotExists(user?.account_id || "", id, db);
    }

    const new_friend = {
      id: id,
      name: name,
      avatar_icon: avatar_icon,
      icon_background_color: icon_background_color,
      last_message_content: "",
      last_message_timestamp: "",
    };
    setFriends([...friends, new_friend]);
    console.info(
      "New friend " + new_friend.name + " has been added to friend context"
    );
  };

  const updateFriendById = (id: string) => {
    const targetFriendIndex = friends.findIndex((friend) => friend.id === id);

    if (targetFriendIndex !== -1) {
      console.info(
        "Start to update friend " +
          friends[targetFriendIndex].name +
          "'s context data..."
      );
      const latest_messages = fetchLatestMessage(
        user?.account_id || "",
        id,
        db
      );
      const updatedFriend = {
        id: id,
        name: friends[targetFriendIndex].name,
        avatar_icon: friends[targetFriendIndex].avatar_icon,
        icon_background_color: friends[targetFriendIndex].icon_background_color,
        last_message_content: latest_messages?.content || "",
        last_message_timestamp: latest_messages?.timestamp || "",
      };
      const updatedFriends = [...friends];
      updatedFriends[targetFriendIndex] = updatedFriend;
      setFriends(updatedFriends);
      console.info(
        "Friend " +
          friends[targetFriendIndex].name +
          "'s context data is updated successfully..."
      );
    } else {
      console.warn(
        "at updateFriendById() in friends.context.tsx: friend with " +
          id +
          " does not exist"
      );
    }
  };

  const deleteFriendById = (id: string) => {
    console.info(
      "Start to delete friend " + id + "'s context and storage data..."
    );
    // update local storage
    deleteFriend(user?.account_id || "", id, db);

    // update context
    setFriends(friends.filter((friend) => friend.id !== id));
    console.info(
      "Friend " +
        id +
        "'s context data and storage data is deleted succrssfully..."
    );
  };

  return (
    <FriendsContext.Provider
      value={{
        friends,
        setFriends,
        current_talking_friend_id,
        setCurrentTalkingFriendId,
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
