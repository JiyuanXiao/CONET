import React, { useContext, useEffect, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { OptionBarProps } from "@/constants/Types";
import { OptionBarCard } from "./OptionBar.styles";

const OptionBar = (props: OptionBarProps) => {
  const { colors } = useTheme();

  return <OptionBarCard content={props.content} theme_colors={colors} />;
};

export default OptionBar;
