import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Image,
} from "react-native";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { BraneButton } from "../brane-button";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

interface WelcomeStageProps {
  onStart: () => void;
  onClose: () => void;
}

export default function WelcomeStage({ onStart, onClose }: WelcomeStageProps) {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>

      {/* ── Background decoration images (absolutely positioned) ── */}
      <Image
        source={require("../../assets/images/survey2.png")}
        style={styles.blobTopLeft}
        resizeMode="contain"
      />
      <Image
        source={require("../../assets/images/survey1.png")}
        style={styles.blobBottomRight}
        resizeMode="contain"
      />

      {/* ── Close button ── */}
      <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
        <Text style={styles.closeBtnIcon}>✕</Text>
      </TouchableOpacity>

      {/* ── Main scrollable content ── */}
      <View style={styles.content}>
        <Image
          source={require("../../assets/images/icnn.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Quick Survey</Text>

        <Text style={styles.desc}>
          Your honest feedback would help us improve the app experience to meet
          your needs. It only takes a few minutes.
        </Text>

        <Image
          source={require("../../assets/images/survey3.png")}
          style={styles.mockup}
          resizeMode="cover"
        />
      </View>

      {/* ── Footer ── */}
      <LinearGradient
  colors={["transparent", "rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 1)"]}
  style={styles.footer}
>
  <BraneButton text="Get Started" onPress={onStart} width={240} />
</LinearGradient>

    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: "hidden",
    paddingBottom: Platform.OS === "ios" ? 34 : 20, // ← ensures content isn't cut off by home indicator
  },

  content: {
    flex: 1,           // ← takes all remaining space above footer
    alignItems: "center",
    paddingTop: 52,
    paddingHorizontal: 24,
    overflow: "hidden",
  },

   mockup: {
    width: 300,
    height: 300,
    top: -30,
    overflow: "hidden",
    maxHeight: 300, // ← prevents it growing into footer zone
  },

  // Footer — natural flow, no longer absolute
  footer: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,        // ← gives the gradient room to fade in
    height: 100,           // ← fixed height for the gradient zone
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
  },

  // Background blobs
  blobTopLeft: {
    position: "absolute",
    top: -10,
    left: -20,
    width: width * 0.45,
    height: width * 0.45,
    opacity: 0.9,
  },
  blobBottomRight: {
    position: "absolute",
    bottom: -30,
    right: -30,
    width: width * 0.45,
    height: width * 0.85,
    opacity: 0.9,
  },

  // Close
  closeBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8E8E8",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnIcon: {
    color: "#888",
    fontSize: 15,
    fontWeight: "600",
  },


  // Logo
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },

  // Text
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111111",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  desc: {
    fontSize: 15,
    color: "#999999",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 12,
  },
});