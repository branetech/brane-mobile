import { BraneButton } from "@/components/brane-button";
import { ThemedText } from "@/components/themed-text";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

type UploadMethodItemProps = {
  selected: boolean;
  title: string;
  onSelect: () => void;
  onFileChange: (uri?: string) => void;
  status?: string;
};

export default function UploadMethodItem({
  selected,
  title,
  onSelect,
  onFileChange,
  status,
}: UploadMethodItemProps) {
  const [uri, setUri] = useState<string | undefined>();

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.9,
      allowsEditing: true,
    });

    if (result.canceled) return;
    const fileUri = result.assets[0]?.uri;
    setUri(fileUri);
    onFileChange(fileUri);
  };

  const done = String(status || "").toLowerCase() === "completed";

  return (
    <View style={styles.wrap}>
      <Pressable style={styles.row} onPress={onSelect}>
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
        {done ? <ThemedText style={styles.done}>Verified</ThemedText> : null}
      </Pressable>

      {selected && !done && (
        <View style={styles.body}>
          {uri ? <Image source={{ uri }} style={styles.preview} /> : null}
          <BraneButton
            text={uri ? "Change file" : "Choose file"}
            onPress={pickImage}
            height={40}
          />
          {uri ? (
            <ThemedText style={styles.filename}>
              {uri.split("/").pop()}
            </ThemedText>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderBottomWidth: 1,
    borderBottomColor: "#F7F7F8",
    paddingVertical: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  done: {
    color: "#008753",
    fontSize: 12,
    fontWeight: "600",
  },
  body: {
    marginTop: 10,
    gap: 8,
  },
  preview: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    backgroundColor: "#F7F7F8",
  },
  filename: {
    color: "#85808A",
    fontSize: 12,
  },
});
