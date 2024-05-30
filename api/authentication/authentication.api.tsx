import React from "react";
import { CE_UserProps } from "@/constants/ChatEngineObjectTypes";

const MOCK_USERS_AUTH = require("../../mock_data/users.mock.json");

export const GetMyAccount = (
  username: string,
  pw: string
): CE_UserProps | null => {
  const result = MOCK_USERS_AUTH.find(
    (user: CE_UserProps) => user.username === username
  );
  if (result?.secret === pw) {
    return result;
  }
  return null;
};
