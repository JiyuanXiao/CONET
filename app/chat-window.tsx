import React from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { FlatList } from "react-native";
import MessageBubble from "@/components/MessageBubble/MessageBubble.component";
import InputBar from "@/components/InputBar/InputBar.component";
import { useTheme } from "@react-navigation/native";

const MESSAGE_DATA = [
  {
    message: "<ScrollView> vs <FlatList> - which one to use?",
    isReceived: false,
  },
  {
    message:
      "ScrollView renders all its react child components at once, but this has a performance downside.",
    isReceived: true,
  },
  {
    message:
      "Imagine you have a very long list of items you want to display, maybe several screens worth of content. Creating JS components and native views for everything all at once, much of which may not even be shown, will contribute to slow rendering and increased memory usage.",
    isReceived: false,
  },
  {
    message:
      "This is where FlatList comes into play. FlatList renders items lazily, when they are about to appear, and removes items that scroll way off screen to save memory and processing time.",
    isReceived: true,
  },
  {
    message:
      "FlatList is also handy if you want to render separators between your items, multiple columns, infinite scroll loading, or any number of other features it supports out of the box.",
    isReceived: false,
  },
  {
    message: "封装平台ScrollView的组件，同时提供与触摸锁定“响应器”系统的集成。",
    isReceived: true,
  },
  {
    message:
      "请记住，ScrollViews必须具有有界高度才能工作，因为它们在有界容器中包含了无界高度的子对象（通过滚动交互）。",
    isReceived: false,
  },
  {
    message:
      "为了绑定ScrollView的高度，可以直接设置视图的高度（不鼓励），也可以确保所有父视图都具有绑定的高度。忘记将｛flex:1｝向下传输到视图堆栈可能会导致此处的错误，元素检查器可以快速调试这些错误。",
    isReceived: true,
  },
];

export default function ChatWindowScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={MESSAGE_DATA}
        inverted
        renderItem={({ item }) => (
          <MessageBubble
            message_content={item.message}
            isReceived={item.isReceived}
          />
        )}
      />
      <InputBar />
    </View>
  );
}
