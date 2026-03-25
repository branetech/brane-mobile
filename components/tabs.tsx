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
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

const GREEN = "#013D25";
const MUTED = "#85808A";
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

export const Tabs = ({ tabs, active, defaultCompnent, onChangeTab }: ITabs) => {
  const [current, setCurrent] = useState(defaultCompnent || tabs[0]?.name);
  const prevIndex = useRef(0);

  // Content animation values
  const opacity = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

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
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: direction * -20,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.96,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      prevIndex.current = nextIndex;
      setCurrent(tabName);
      onChangeTab?.(tabName);

      // Reset position for slide in from opposite side
      translateX.setValue(direction * 20);

      // Fade + slide in
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }),
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
                style={[styles.tabLabel, { color: isActive ? GREEN : MUTED }]}
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
          current === tab.name ? <tab.Component key={tab.name} /> : null,
        )}
      </Animated.View>
    </View>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// TabNavigator — Simple, flexible tab component for conditional content rendering
// ──────────────────────────────────────────────────────────────────────────────

interface TabNavigatorTabConfig {
  label: string;
  key: string;
}

interface TabNavigatorProps {
  tabs: TabNavigatorTabConfig[];
  activeTabKey: string;
  onTabChange: (tabKey: string) => void;
  children: React.ReactNode;
  borderColor?: string;
  activeColor?: string;
  inactiveColor?: string;
  containerStyle?: object;
  tabRowStyle?: object;
}

export const TabNavigator = React.memo(
  ({
    tabs,
    activeTabKey,
    onTabChange,
    children,
    borderColor = MUTED,
    activeColor = GREEN,
    inactiveColor = MUTED,
    containerStyle,
    tabRowStyle,
  }: TabNavigatorProps) => {
    return (
      <View style={[styles.tabNavContainer, containerStyle]}>
        {/* ── Tab headers ── */}
        <View
          style={[
            styles.tabNavRow,
            { borderBottomColor: borderColor },
            tabRowStyle,
          ]}
        >
          {tabs.map((tab) => {
            const isActive = activeTabKey === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tabNavItem,
                  {
                    borderBottomWidth: isActive ? 2 : 0,
                    borderBottomColor: isActive ? activeColor : "transparent",
                  },
                ]}
                onPress={() => onTabChange(tab.key)}
                activeOpacity={0.7}
              >
                <ThemedText
                  style={[
                    styles.tabNavLabel,
                    {
                      color: isActive ? activeColor : inactiveColor,
                      fontWeight: isActive ? "600" : "400",
                    },
                  ]}
                >
                  {tab.label}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Tab content ── */}
        {children}
      </View>
    );
  },
);

TabNavigator.displayName = "TabNavigator";

// ──────────────────────────────────────────────────────────────────────────────
// useTabNavigator — Hook to manage tab state
// ──────────────────────────────────────────────────────────────────────────────

interface UseTabNavigatorOptions {
  defaultTab?: string;
}

export function useTabNavigator(defaultTab?: string) {
  const [activeTab, setActiveTab] = useState(defaultTab || "");

  return {
    activeTab,
    setActiveTab,
    onTabChange: setActiveTab,
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// ThemedTabNavigator — Tab component that respects theme colors
// ──────────────────────────────────────────────────────────────────────────────

interface ThemedTabNavigatorProps {
  tabs: TabNavigatorTabConfig[];
  activeTabKey: string;
  onTabChange: (tabKey: string) => void;
  children: React.ReactNode;
  containerStyle?: object;
  tabRowStyle?: object;
}

export const ThemedTabNavigator = React.memo(
  ({
    tabs,
    activeTabKey,
    onTabChange,
    children,
    containerStyle,
    tabRowStyle,
  }: ThemedTabNavigatorProps) => {
    const rawScheme = useColorScheme();
    const scheme = rawScheme === "dark" ? "dark" : "light";
    const C = Colors[scheme];

    return (
      <TabNavigator
        tabs={tabs}
        activeTabKey={activeTabKey}
        onTabChange={onTabChange}
        borderColor={C.border}
        activeColor={C.primary}
        inactiveColor={C.muted}
        containerStyle={containerStyle}
        tabRowStyle={tabRowStyle}
      >
        {children}
      </TabNavigator>
    );
  },
);

ThemedTabNavigator.displayName = "ThemedTabNavigator";

const styles = StyleSheet.create({
  wrapper: { width: "100%", gap: 0 },

  tabsRow: {
    flexDirection: "row",
    paddingHorizontal: 0,
    gap: 20,
    paddingBottom: 0,
    overflow: "hidden",
    justifyContent: "space-between",
  },

  tabBtn: {
    alignItems: "center",
    paddingHorizontal: 4,
    paddingTop: 4,
    paddingBottom: 0,
  },

  tabLabel: {
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

  content: {
    width: "100%",
    minHeight: 400,
  },

  // TabNavigator styles
  tabNavContainer: {
    width: "100%",
  },

  tabNavRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    gap: 0,
    marginBottom: 16,
  },

  tabNavItem: {
    paddingHorizontal: 4,
    paddingVertical: 10,
    marginRight: 24,
  },

  tabNavLabel: {
    fontSize: 14,
  },
});
