import Back from "@/components/back";
import { LearnCard } from "@/components/home/cards";
import { SearchInput } from "@/components/search-input";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { FORUM_POSTS } from "@/utils";
import { useRouter } from "expo-router";
import { SearchNormal1 } from "iconsax-react-native";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Scheme = "light" | "dark";

export default function PortfolioForumScreen() {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = searchQuery.trim()
    ? FORUM_POSTS.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.desc.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : FORUM_POSTS;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]}>
      <View style={styles.headerRow}>
        <Back onPress={() => router.back()} />
        {!isSearchExpanded && (
          <View style={styles.titleContainer}>
            <ThemedText style={[styles.headerTitle, { color: C.text }]}>
              All Brane Learn
            </ThemedText>
          </View>
        )}
        {isSearchExpanded && (
          <SearchInput
            placeholder='Search forum...'
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            inputContainerStyle={{
              borderColor: C.primary,
              backgroundColor: C.inputBackground,
              borderRadius: 8,
              borderWidth: 1,
              height: 40,
              maxWidth: 300,
            }}
            inputStyle={[styles.input, { color: C.text }]}
          />
        )}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setIsSearchExpanded(!isSearchExpanded);
            if (!isSearchExpanded) {
              setSearchQuery("");
            }
          }}
          style={styles.searchIcon}
        >
          <SearchNormal1 size={18} color={C.text} variant='Outline' />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.heroCard,
            { backgroundColor: C.inputBackground, borderColor: C.border },
          ]}
        >
          <ThemedText style={[styles.heroTitle, { color: C.text }]}>
            Build Better Investing Habits
          </ThemedText>
          <ThemedText style={[styles.heroSubtitle, { color: C.muted }]}>
            Learn from curated topics and practical guides for your portfolio
            growth.
          </ThemedText>
        </View>

        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <LearnCard
              key={post.id}
              post={post}
              onPress={() =>
                router.push(`/(tabs)/(portfolio)/forum/${post.id}` as any)
              }
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <ThemedText style={[styles.emptyText, { color: C.muted }]}>
              {`No results found for "${searchQuery}"`}
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  searchIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
  scroll: { flex: 1 },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  heroCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 12,
    lineHeight: 18,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "500",
  },
  ctaButton: {
    marginTop: 8,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  ctaText: {
    color: "#D2F1E4",
    fontSize: 14,
    fontWeight: "700",
  },
});
