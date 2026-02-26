import { logOut } from "@/redux/slice/auth-slice";
import { useRouter } from "expo-router";
import React from "react";
import { Modal, View, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { ThemedText } from "@/components/themed-text";

interface LogOutModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const LogOutModal: React.FC<LogOutModalProps> = ({ isOpen, closeModal }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={closeModal}
    >
      {/* Backdrop */}
      <View style={styles.backdrop}>
        {/* Bottom Sheet Card */}
        <View style={styles.card}>
          {/* Icon */}
          <View style={styles.iconWrapper}>
            <View style={styles.iconCircle}>
              <ThemedText style={styles.iconText}>!</ThemedText>
            </View>
          </View>

          <ThemedText style={styles.title}>Log out</ThemedText>
          <ThemedText style={styles.subtitle}>
            Are you sure you want to log out?
          </ThemedText>

          {/* Cancel */}
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={closeModal}
          >
            <ThemedText style={styles.cancelText}>No, cancel</ThemedText>
          </TouchableOpacity>

          {/* Confirm */}
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => {
              dispatch(logOut());
              router.replace("/");
            }}
          >
            <ThemedText style={styles.logoutText}>Yes, log out</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default LogOutModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(1, 61, 37, 0.6)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "91.666%",
    marginBottom: 16,
    alignItems: "center",
  },
  iconWrapper: {
    marginTop: 24,
    marginBottom: 8,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#CB010B",
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    color: "#fff",
    fontSize: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 20,
  },
  cancelBtn: {
    backgroundColor: "#013D25",
    height: 50,
    width: "100%",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cancelText: {
    color: "#D2F1E4",
    fontWeight: "600",
    fontSize: 15,
  },
  logoutBtn: {
    backgroundColor: "#FFE0E1",
    height: 50,
    width: "100%",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  logoutText: {
    color: "#CB010B",
    fontWeight: "600",
    fontSize: 15,
  },
});