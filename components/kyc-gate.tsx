import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { Card, CloseCircle } from "iconsax-react-native";
import React from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const ORANGE = "#F97316";
const ORANGE_BG = "#FFF5EE";

type KycGateProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  onCompleteKYC?: () => void;
};

export const KycGate = ({
  visible,
  onClose,
  title = "Complete KYC",
  message = "Please complete your KYC to access this feature.",
  onCompleteKYC,
}: KycGateProps) => {
  const router = useRouter();
  const raw = useColorScheme();
  const scheme = raw === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  return (
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: C.background }]}
          onPress={(event) => event.stopPropagation()}
        >
          <View style={[styles.handle, { backgroundColor: C.border }]} />

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <CloseCircle color={C.muted} size={22} />
          </TouchableOpacity>

          <View
            style={[
              styles.card,
              { backgroundColor: scheme === "dark" ? C.inputBg : ORANGE_BG },
            ]}
          >
            <View style={styles.iconWrap}>
              <Card size={56} color={ORANGE} variant='Outline' />
            </View>

            <ThemedText style={[styles.message, { color: C.text }]}>
              {message}
            </ThemedText>

            <ThemedText style={[styles.subtitle, { color: C.muted }]}>
              {title}
            </ThemedText>

            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                onClose();
                if (onCompleteKYC) {
                  onCompleteKYC();
                  return;
                }
                router.push("/kyc" as any);
              }}
              activeOpacity={0.85}
            >
              <ThemedText style={styles.btnLabel}>Complete Your KYC</ThemedText>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 16,
    minHeight: 360,
  },
  handle: {
    width: 78,
    height: 6,
    borderRadius: 999,
    alignSelf: "center",
    marginTop: 6,
    marginBottom: 6,
  },
  closeButton: {
    alignSelf: "flex-end",
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  closeLabel: {
    fontSize: 26,
    lineHeight: 26,
    fontWeight: "400",
  },
  card: {
    width: "100%",
    alignSelf: "center",
    maxWidth: 700,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  iconWrap: {
    marginBottom: 24,
  },
  message: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 26,
  },
  subtitle: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 24,
  },
  btn: {
    width: "100%",
    backgroundColor: ORANGE,
    borderRadius: 12,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  btnLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
