import React from "react";
import { StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";
import { FormInput } from "../formInput";

interface TextAnswerProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TextAnswer({ value, onChange }: TextAnswerProps) {
  return (
    <FormInput
    inputContainerStyle={styles.input}
    //   style={styles.input}
      placeholder="Type here"
    //   placeholderTextColor={Colors.textLight}
      multiline
      value={value}
      onChangeText={onChange}
      textAlignVertical="top"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: Colors.light.borderColor,
    borderRadius: 10,
    padding: 14,
    minHeight: 100,
    fontSize: 13,
    color: Colors.light.text,
    backgroundColor: "#FAFAFA",
    marginBottom: 48,
  },
});