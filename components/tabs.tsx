import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "@/components/themed-text";

const GREEN  = "#013D25";
const MUTED  = "#85808A";
const { width: SW } = Dimensions.get("window");

interface ITab {
  name: string;
  Component: React.FC;
}

interface ITabs {
  tabs: ITab[];
  active?: string;
  defaultCompnent?: string;
  onChangeTab?: (tab: string) => void;
}

export const Tabs = ({
  tabs,
  active,
  defaultCompnent,
  onChangeTab,
}: ITabs) => {
  const [current, setCurrent] = useState(defaultCompnent || tabs[0]?.name);
  const prevIndex = useRef(0);

  // Content animation values
  const opacity    = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const scale      = useRef(new Animated.Value(1)).current;

  // Underline animated positions — one per tab
  const underlineWidths = useRef(tabs.map(() => new Animated.Value(0))).current;

  // Sync external `active` prop
  useEffect(() => {
    if (active && active !== current) {
      animateToTab(active);
    }
  }, [active]);

  const animateToTab = (tabName: string) => {
    const nextIndex = tabs.findIndex((t) => t.name === tabName);
    const direction = nextIndex > prevIndex.current ? 1 : -1;

    // Fade + slide out
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: direction * -20, duration: 150, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 0.96, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      prevIndex.current = nextIndex;
      setCurrent(tabName);
      onChangeTab?.(tabName);

      // Reset position for slide in from opposite side
      translateX.setValue(direction * 20);

      // Fade + slide in
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(translateX, { toValue: 0, useNativeDriver: true, tension: 80, friction: 10 }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
      ]).start();
    });
  };

  return (
    <View style={styles.wrapper}>
      {/* ── Tab headers ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsRow}
        bounces={false}
      >
        {tabs.map((tab, index) => {
          const isActive = current === tab.name;
          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => !isActive && animateToTab(tab.name)}
              activeOpacity={0.75}
              style={styles.tabBtn}
            >
              <ThemedText
                style={[
                  styles.tabLabel,
                  { color: isActive ? GREEN : MUTED },
                ]}
              >
                {tab.name}
              </ThemedText>

              {/* Active underline */}
              <View
                style={[
                  styles.underline,
                  {
                    backgroundColor: isActive ? GREEN : "transparent",
                    height: isActive ? 3 : 2,
                  },
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Separator */}
      <View style={styles.separator} />

      {/* ── Tab content ── */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity,
            transform: [{ translateX }, { scale }],
          },
        ]}
      >
        {tabs.map((tab) =>
          current === tab.name ? <tab.Component key={tab.name} /> : null
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper:   { width: "100%", gap: 0 },

  tabsRow:   {
    flexDirection: "row",
    paddingHorizontal: 0,
    gap: 20,
    paddingBottom: 0,
  },

  tabBtn:    {
    alignItems: "center",
    paddingHorizontal: 4,
    paddingTop: 4,
    paddingBottom: 0,
  },

  tabLabel:  {
    fontSize: 14,
    fontWeight: "700",
    paddingBottom: 8,
  },

  underline: {
    width: "100%",
    borderRadius: 2,
  },

  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#e8e8e8",
    width: "100%",
    marginBottom: 12,
  },

  content:   {
    width: "100%",
    minHeight: 400,
  },
});