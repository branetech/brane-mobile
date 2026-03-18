import { BraneButton } from "@/components/brane-button";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

type UploadMethodItemProps = {
  selected: boolean;
  title: string;
  icon?: React.ReactNode;
  onSelect: () => void;
  onFileChange: (uri?: string) => void;
  status?: string;
};

export default function UploadMethodItem({
  selected,
  title,
  icon,
  onSelect,
  onFileChange,
  status,
}: UploadMethodItemProps) {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme === "dark" ? "dark" : "light"];
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

  const canUpload = ["", "failed", "rejected"].includes(
    String(status || "").toLowerCase(),
  );

  return (
    <View style={styles.wrap}>
      <Pressable
        style={[
          styles.selectorRow,
          {
            borderColor: C.border,
            backgroundColor: C.background,
          },
          selected && { backgroundColor: C.inputBg },
        ]}
        onPress={canUpload ? onSelect : undefined}
      >
        <View style={styles.selectorLeft}>
          <View style={styles.iconWrap}>{icon}</View>
          <ThemedText type="defaultSemiBold">{title}</ThemedText>
        </View>

        <View style={styles.selectorRight}>
          {status ? (
            <View style={[styles.pill, { backgroundColor: C.primary + "20" }]}>
              <ThemedText style={[styles.pillText, { color: C.primary }]}>
                {status} Approval
              </ThemedText>
            </View>
          ) : null}

          {canUpload ? (
            <View
              style={[
                styles.selectRing,
                {
                  borderColor: C.border,
                  backgroundColor: C.background,
                },
                selected && { borderColor: C.primary },
              ]}
            >
              <View
                style={[
                  styles.selectDot,
                  selected && { backgroundColor: C.primary },
                ]}
              />
            </View>
          ) : null}
        </View>
      </Pressable>

      {selected && canUpload && (
        <View style={[styles.body, { borderColor: C.border, backgroundColor: C.inputBg }]}>
          {!uri ? (
            <Pressable
              style={[
                styles.uploadCard,
                {
                  borderColor: C.primary,
                  backgroundColor: C.inputBg,
                },
              ]}
              onPress={pickImage}
            >
              <ThemedText type="defaultSemiBold" style={{ color: C.text }}>
                Click here to upload {title}
              </ThemedText>
              <ThemedText style={{ marginTop: 4, fontSize: 11, color: C.muted }}>
                PNG, JPG (max. 10MB)
              </ThemedText>
            </Pressable>
          ) : (
            <View style={[styles.fileCard, { borderColor: C.border, backgroundColor: C.background }]}>
              <View style={styles.fileMeta}>
                <Image source={{ uri }} style={[styles.preview, { backgroundColor: C.inputBg }]} />
                <View style={{ flex: 1 }}>
                  <ThemedText
                    numberOfLines={1}
                    type="defaultSemiBold"
                    style={styles.fileName}
                  >
                    {uri.split("/").pop()}
                  </ThemedText>
                  <ThemedText style={{ marginTop: 4, fontSize: 11, color: C.muted }}>
                    Ready for upload
                  </ThemedText>
                </View>
              </View>

              <BraneButton
                text="Change Document"
                onPress={pickImage}
                height={36}
                backgroundColor={C.primary + "20"}
                textColor={C.primary}
                style={{ marginTop: 10 }}
              />
            </View>
          )}

          {uri ? (
            <Pressable
              onPress={() => {
                setUri(undefined);
                onFileChange(undefined);
              }}
            >
              <ThemedText style={{ color: C.error, fontSize: 12 }}>
                Remove selected file
              </ThemedText>
            </Pressable>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 12,
  },
  selectorRow: {
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 62,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectorLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  iconWrap: {
    width: 24,
    alignItems: "center",
  },
  selectorRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: 10,
  },
  pill: {
    borderRadius: 10,
    paddingHorizontal: 8,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  pillText: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  selectRing: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  selectDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  body: {
    marginTop: 10,
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  uploadCard: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  fileCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  fileMeta: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  preview: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  fileName: {
    fontSize: 13,
  },
});
