import { Colors } from "@/constants/colors";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BraneButton } from "../brane-button";

interface ThankYouStageProps {
  onClose: () => void;
}

export default function ThankYouStage({ onClose }: ThankYouStageProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Thank you for your response, Brane to serve you better
      </Text>
      <Text style={styles.sub}>
        Your feedback is valuable and will help us create a better experience
        for you.
      </Text>
      <BraneButton
        text='Close'
        onPress={onClose}
        style={styles.btn}
        width={200}
        backgroundColor={Colors.light.googleBg}
        textColor={Colors.light.primary}
        />
      {/* <TouchableOpacity style={styles.btn} onPress={onClose} activeOpacity={0.85}>
        <Text style={styles.btnText}>Close</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 8,
    paddingTop: 20,
    gap: 12,
  },
  title: {
    fontSize: 21,
    fontWeight: "700",
    color: '#85808A',
    textAlign: "center",
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  sub: {
    fontSize: 12,
    color: '#CECCD0',
    textAlign: "center",
    lineHeight: 13,
    marginVertical: 10,
  },
  btn: {
    borderWidth: 1.5,
    borderColor: Colors.light.googleBg,
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 48,
    alignItems: "center",
  },
  btnText: {
    color: Colors.light.googleBg,
    fontWeight: "700",
    fontSize: 14,
  },
});