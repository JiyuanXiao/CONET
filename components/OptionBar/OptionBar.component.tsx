import React from "react";
import { useTheme } from "@react-navigation/native";
import { OptionBarProps } from "@/constants/Types";
import { OptionBarCard } from "./OptionBar.styles";

const OptionBar = (props: OptionBarProps) => {
  const { colors } = useTheme();

  return (
    <OptionBarCard
      content={props.content}
      align_self={props.align_self}
      theme_colors={colors}
    />
  );
};

export default OptionBar;
