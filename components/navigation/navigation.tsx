import React from "react";
import NavigationStyles from "./navigation.styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/constants/color";

export default function Navigation({ activeTab }: { activeTab: string }) {
  const insert = useSafeAreaInsets();

  const navigationTabs = [
    {
      icon: "🏠",
      text: "Home",
      tab: "home",
    }
  ];

  return (
    <NavigationStyles.Container>
      <NavigationStyles.Content style={{ paddingBottom: insert.bottom - 10 }}>
        {navigationTabs.map((tab) => (
          <NavigationStyles.Button  key={tab.tab}>
            <NavigationStyles.ButtonText>{tab.icon}</NavigationStyles.ButtonText>
            <NavigationStyles.ButtonText style={{ color: activeTab === tab.tab ? colors.blue : "#00000090" }}>{tab.text}</NavigationStyles.ButtonText>
          </NavigationStyles.Button>
        ))}
      </NavigationStyles.Content>
    </NavigationStyles.Container>
  );
}
