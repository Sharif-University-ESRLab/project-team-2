import React from "react";
import {
  TopNav,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

/**
 * Navbar provides the top section on each screen
 * and can be customized by `pageName`
 */
export default function ({ navigation, pageName, backOption }) {
  const { isDarkmode, setTheme } = useTheme();
  return (
    <TopNav
      middleContent={pageName}
      leftContent={
        backOption ? (
          <Ionicons
            name="chevron-back"
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.dark}
          />
        ) : (
          <></>
        )
      }
      leftAction={backOption ? () => navigation.goBack() : () => {}}
      rightContent={
        <Ionicons
          name={isDarkmode ? "sunny" : "moon"}
          size={20}
          color={isDarkmode ? themeColor.white100 : themeColor.dark}
        />
      }
      rightAction={() => {
        if (isDarkmode) {
          setTheme("light");
        } else {
          setTheme("dark");
        }
      }}
    />
  );
}
