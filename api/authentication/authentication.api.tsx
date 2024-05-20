import React from "react";
import { MOCK_USERS_AUTH } from "@/mock_data/users.mock";

export const userLogin = (id: string, pw: string) => {
  const result = MOCK_USERS_AUTH.find((user) => user.account_id === id);
  if (result?.passwrod === pw) {
    return result;
  }
  return null;
};
