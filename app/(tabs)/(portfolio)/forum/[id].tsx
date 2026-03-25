import Back from "@/components/back";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { FORUM_POSTS } from "@/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowRight2 } from "iconsax-react-native";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Scheme = "light" | "dark";

export default function ForumDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const currentPost = useMemo(() => {
    return FORUM_POSTS.find((post) => post.id === id);
  }, [id]);

  const currentIndex = useMemo(() => {
    return FORUM_POSTS.findIndex((post) => post.id === id);
  }, [id]);

  const nextPost = useMemo(() => {
    if (currentIndex === -1) return null;
    const nextIdx = currentIndex + 1;
    return nextIdx < FORUM_POSTS.length ? FORUM_POSTS[nextIdx] : null;
  }, [currentIndex]);

  if (!currentPost) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: C.background }]}
      >
        <View style={styles.headerRow}>
          <Back onPress={() => router.back()} />
        </View>
        <View style={styles.notFound}>
          <ThemedText style={{ color: C.muted }}>Post not found</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]}>
      <View style={styles.headerRow}>
        <Back onPress={() => router.back()} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <ThemedText style={[styles.title, { color: C.text }]}>
          {currentPost.title}
        </ThemedText>

        {/* Author Info */}
        <View style={styles.authorContainer}>
          <View style={[styles.avatar, { backgroundColor: C.border }]} />
          <View style={styles.authorInfo}>
            <ThemedText
              type='defaultSemiBold'
              style={[styles.authorName, { color: C.text }]}
            >
              {currentPost.author}
            </ThemedText>
            <ThemedText style={[styles.authorExperience, { color: C.muted }]}>
              {currentPost.experience}
            </ThemedText>
          </View>
        </View>

        {/* Body Text */}
        <ThemedText style={[styles.bodyText, { color: C.text }]}>
          {currentPost.body}
        </ThemedText>

        {/* Image Placeholder */}
        <View
          style={[
            styles.imagePlaceholder,
            { backgroundColor: C.inputBackground, borderColor: C.border },
          ]}
        />

        {/* Next Post */}
        {nextPost && (
          <>
            <ThemedText style={[styles.nextLabel, { color: C.muted }]}>
              Next
            </ThemedText>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                router.push(`/(tabs)/(portfolio)/forum/${nextPost.id}` as any)
              }
              style={styles.nextPostContainer}
            >
              <View>
                <ThemedText
                  type='defaultSemiBold'
                  style={[styles.nextPostTitle, { color: C.text }]}
                >
                  {nextPost.title}
                </ThemedText>
                <ThemedText
                  numberOfLines={1}
                  style={[styles.nextPostDesc, { color: C.muted }]}
                >
                  {nextPost.desc}
                </ThemedText>
              </View>
              <ArrowRight2 size={20} color={C.muted} />
            </TouchableOpacity>
          </>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    lineHeight: 32,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 13,
    marginBottom: 2,
  },
  authorExperience: {
    fontSize: 12,
    lineHeight: 16,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: "100%",
    height: 280,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  nextLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 20,
    marginBottom: 12,
  },
  nextPostContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  nextPostTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  nextPostDesc: {
    fontSize: 12,
  },
});
