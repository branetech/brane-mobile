import { Avatar } from "@/components/avatar";
import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppState } from "@/redux/store";
import { setUser, logOut } from "@/redux/slice/auth-slice";
import BaseRequest, { baseURL, catchError } from "@/services";
import { AUTH_SERVICE } from "@/services/routes";
import { showSuccess, showError } from "@/utils/helpers";
import { View } from "@idimma/rn-widget";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Camera, Trash, TickCircle } from "iconsax-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  View as RNView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

const DetailRow = ({
  label,
  value,
  labelColor,
  valueColor,
  borderColor,
}: {
  label: string;
  value?: string | null;
  labelColor: string;
  valueColor: string;
  borderColor: string;
}) => (
  <View
    style={[styles.row, { borderBottomColor: borderColor }] as any}
    row
    spaced
    aligned
  >
    <ThemedText style={[styles.label, { color: labelColor }]}>
      {label}
    </ThemedText>
    <ThemedText style={[styles.value, { color: valueColor }]}>
      {value || "-"}
    </ThemedText>
  </View>
);

export default function AccountDetailsScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const { user } = useAppState();
  const dispatch = useDispatch();
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Delete Account States
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [reasonFeedback, setReasonFeedback] = useState("");
  const [otp, setOtp] = useState("");
  const [deleteIsLoading, setDeleteIsLoading] = useState(false);
  const maxFeedbackCharacters = 150;

  const deleteReasons = [
    "It is not what I expected",
    "Security concerns",
    "Account inactivity",
    "Issues with payment",
    "It feels difficult to use",
    "Other",
  ];

  console.log('user data', user);
  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    "User";

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.9,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      await uploadPhoto(result.assets[0]?.uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.9,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      await uploadPhoto(result.assets[0]?.uri);
    }
  };

  const uploadPhoto = async (uri?: string) => {
    if (!uri) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", {
        uri,
        name: `profile-${Date.now()}.jpg`,
        type: "image/jpeg",
      } as any);

      await BaseRequest.post(AUTH_SERVICE.PROFILE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Re-fetch user data to get the updated image URL from server
      const updatedUser = (await BaseRequest.get(AUTH_SERVICE.PROFILE)) as any;
      console.log("Updated user after upload:", updatedUser);

      // Handle relative image URLs by converting to absolute
      if (updatedUser?.image && !updatedUser.image.startsWith("http")) {
        const imagePath = updatedUser.image.startsWith("/") ? updatedUser.image : `/${updatedUser.image}`;
        updatedUser.image = `${baseURL}${imagePath}`;
      }

      dispatch(setUser(updatedUser));
      setShowPhotoMenu(false);
    } catch (error) {
      catchError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const removePhoto = async () => {
    setIsLoading(true);
    try {
      await BaseRequest.delete(AUTH_SERVICE.DELETE_PROFILE_IMAGE);

      // Re-fetch user data to get the updated profile without image
      const updatedUser = (await BaseRequest.get(AUTH_SERVICE.PROFILE)) as any;
      console.log("Updated user after removal:", updatedUser);

      dispatch(setUser(updatedUser));
      setShowRemoveConfirm(false);
    } catch (error) {
      catchError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccountClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleContinueDelete = async () => {
    if (!selectedReason) return;
    setShowReasonModal(false);
    setDeleteIsLoading(true);

    try {
      // Send OTP to phone - match web implementation exactly
      const response: any = await BaseRequest.post(AUTH_SERVICE.INIT_DELETE, {
        category: selectedReason,
        reason: reasonFeedback,
      });

      // Extract OTP from response - web uses response.data.opt
      const otpValue = response?.data?.opt || response?.opt;
      if (!otpValue) {
        showError("Failed to send OTP");
        return;
      }

      showSuccess("OTP sent to your phone");
      setShowOtpModal(true);
    } catch (error) {
      catchError(error);
    } finally {
      setDeleteIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) return;
    setDeleteIsLoading(true);
    try {
      // Verify OTP and delete account - match web implementation exactly
      await BaseRequest.post(AUTH_SERVICE.DELETE, {
        otp: otp,
      });

      // Dispatch logout
      dispatch(logOut());

      setShowOtpModal(false);
      setShowDeleteSuccess(true);

      // Navigate to login after success
      setTimeout(() => {
        router.replace("/(auth)/login");
      }, 2000);
    } catch (error) {
      catchError(error);
    } finally {
      setDeleteIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header} row aligned>
        <Back onPress={() => router.back()} />
        <ThemedText type='subtitle' style={{ color: C.text }}>
          Account Details
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable
          style={styles.avatarWrap}
          onPress={() => !isLoading && setShowPhotoMenu(true)}
        >
          <View
            style={[styles.avatarContainer, { backgroundColor: C.inputBg }] as any}
          >
            <Avatar
              name={fullName}
              src={user?.image}
              size={96}
              shape='circle'
            />
            {isLoading && (
              <View style={[styles.loadingOverlay, { backgroundColor: "rgba(0,0,0,0.3)" }] as any}>
                <ActivityIndicator size='large' color={C.primary} />
              </View>
            )}
            {!isLoading && (
              <View style={[styles.cameraIcon, { backgroundColor: C.primary }] as any}>
                <Camera size={18} color='#FFFFFF' />
              </View>
            )}
          </View>
          <ThemedText style={[styles.avatarHint, { color: C.primary }]}>
            Tap to change photo
          </ThemedText>
        </Pressable>

        <DetailRow
          label='First Name'
          value={user?.firstName}
          labelColor={C.muted}
          valueColor={C.text}
          borderColor={C.border}
        />
        <DetailRow
          label='Last Name'
          value={user?.lastName}
          labelColor={C.muted}
          valueColor={C.text}
          borderColor={C.border}
        />
        <DetailRow
          label='Phone Number'
          value={user?.phone}
          labelColor={C.muted}
          valueColor={C.text}
          borderColor={C.border}
        />
        <DetailRow
          label='Email Address'
          value={user?.email}
          labelColor={C.muted}
          valueColor={C.text}
          borderColor={C.border}
        />
        <DetailRow
          label='Username'
          value={user?.username ? `@${user.username}` : undefined}
          labelColor={C.muted}
          valueColor={C.text}
          borderColor={C.border}
        />
        <DetailRow
          label='Address'
          value={user?.houseAddress}
          labelColor={C.muted}
          valueColor={C.text}
          borderColor={C.border}
        />

        <RNView style={[styles.note, { backgroundColor: C.inputBg }]}>
          <ThemedText style={[styles.noteText, { color: C.muted }]}>
            For account information changes, please contact our support team at
            support@getbrane.co
          </ThemedText>
        </RNView>

        <BraneButton
          text="Delete Account"
          onPress={handleDeleteAccountClick}
          backgroundColor={C.error}
          textColor="#FFFFFF"
          height={48}
          radius={12}
          style={{ marginVertical: 32 }}
        />
      </ScrollView>

      {/* Change Photo Modal */}
      <Modal
        visible={showPhotoMenu}
        transparent
        animationType='fade'
        onRequestClose={() => setShowPhotoMenu(false)}
      >
        <Pressable
          style={[styles.modalBackdrop, { backgroundColor: "rgba(0,0,0,0.5)" }]}
          onPress={() => setShowPhotoMenu(false)}
        >
          <Pressable
            style={
              [
                styles.modalCard,
                { backgroundColor: C.background, borderColor: C.border },
              ] as any
            }
            onPress={() => {}}
          >
            <ThemedText
              type='defaultSemiBold'
              style={[styles.modalTitle, { color: C.text }]}
            >
              Change Photo
            </ThemedText>

            <TouchableOpacity
              style={[styles.optionRow, { borderBottomColor: C.border }]}
              onPress={takePhoto}
              disabled={isLoading}
            >
              <Camera size={20} color={C.primary} />
              <ThemedText style={[styles.optionText, { color: C.text }]}>
                Take a photo
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionRow, { borderBottomColor: C.border }]}
              onPress={pickImage}
              disabled={isLoading}
            >
              <Camera size={20} color={C.primary} />
              <ThemedText style={[styles.optionText, { color: C.text }]}>
                Choose from gallery
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => {
                setShowPhotoMenu(false);
                setShowRemoveConfirm(true);
              }}
              disabled={isLoading}
            >
              <Trash size={20} color={C.error} />
              <ThemedText style={[styles.optionText, { color: C.error }]}>
                Remove photo
              </ThemedText>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Remove Photo Confirmation Modal */}
      <Modal
        visible={showRemoveConfirm}
        transparent
        animationType='fade'
        onRequestClose={() => setShowRemoveConfirm(false)}
      >
        <Pressable
          style={[styles.modalBackdrop, { backgroundColor: "rgba(0,0,0,0.5)" }]}
          onPress={() => setShowRemoveConfirm(false)}
        >
          <RNView
            style={
              [
                styles.confirmCard,
                { backgroundColor: C.background, borderColor: C.border },
              ] as any
            }
          >
            <ThemedText
              type='defaultSemiBold'
              style={[styles.confirmTitle, { color: C.text }]}
            >
              Remove Photo
            </ThemedText>
            <ThemedText style={[styles.confirmText, { color: C.muted }]}>
              Are you sure you want to remove your profile photo?
            </ThemedText>

            <RNView style={styles.confirmActions}>
              <BraneButton
                text='Yes, remove photo'
                onPress={removePhoto}
                loading={isLoading}
                disabled={isLoading}
                backgroundColor={C.error}
                style={{ flex: 1 }}
                height={44}
                radius={8}
              />
              <BraneButton
                text="No, don't remove"
                onPress={() => setShowRemoveConfirm(false)}
                disabled={isLoading}
                backgroundColor={C.primary + "20"}
                textColor={C.primary}
                style={{ flex: 1, marginLeft: 12 }}
                height={44}
                radius={8}
              />
            </RNView>
          </RNView>
        </Pressable>
      </Modal>

      {/* Delete Account Confirmation Modal */}
      <Modal
        visible={showDeleteConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteConfirm(false)}
      >
        <Pressable
          style={[styles.modalBackdrop, { backgroundColor: "rgba(0,0,0,0.5)" }]}
          onPress={() => setShowDeleteConfirm(false)}
        >
          <RNView
            style={
              [
                styles.confirmCard,
                { backgroundColor: C.background, borderColor: C.border },
              ] as any
            }
          >
            <ThemedText
              type="defaultSemiBold"
              style={[styles.confirmTitle, { color: C.text }]}
            >
              Delete Your Account?
            </ThemedText>
            <ThemedText style={[styles.confirmText, { color: C.muted }]}>
              We&apos;ll be sad to see you go. This action cannot be undone. All your data will be permanently deleted.
            </ThemedText>

            <RNView style={styles.confirmActions}>
              <BraneButton
                text="Delete Account"
                onPress={() => {
                  setShowDeleteConfirm(false);
                  setShowReasonModal(true);
                }}
                backgroundColor={C.error}
                style={{ flex: 1 }}
                height={44}
                radius={8}
              />
              <BraneButton
                text="Keep Account"
                onPress={() => setShowDeleteConfirm(false)}
                backgroundColor={C.primary + "20"}
                textColor={C.primary}
                style={{ flex: 1, marginLeft: 12 }}
                height={44}
                radius={8}
              />
            </RNView>
          </RNView>
        </Pressable>
      </Modal>

      {/* Delete Reason Modal */}
      <Modal
        visible={showReasonModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReasonModal(false)}
      >
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "flex-end",
          }}
        >
          <Pressable
            style={[styles.modalBackdrop, { backgroundColor: "transparent" }]}
            onPress={() => setShowReasonModal(false)}
          >
            <Pressable
              style={
                [
                  styles.bottomSheetCard,
                  { backgroundColor: C.background },
                ] as any
              }
              onPress={() => {}}
            >
              <ThemedText
                type="defaultSemiBold"
                style={[styles.modalTitle, { color: C.text }]}
              >
                Why do you want to close your account?
              </ThemedText>
              <ThemedText
                style={[styles.modalSubtitle, { color: C.muted }]}
              >
Deleting your account will delete all your associated data such as the datas including content you have shared with others. You cannot undo this action.</ThemedText>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
                <ThemedText style={ { color: C.muted, marginTop: 16 } }>
For more information about how we treat your data, please see our. <TouchableOpacity style={{  marginTop: 16 }} onPress={() => router.push("/(account)/privacy-policy")}>
                  <ThemedText style={{ color: C.primary, fontSize: 12 }}>
                    Privacy Policy
                  </ThemedText>
                </TouchableOpacity></ThemedText>
                  
              </View>
              <ScrollView style={{ marginTop: 16, marginBottom: 20, maxHeight: 300 }}>
                {deleteReasons.map((reason) => (
                  <TouchableOpacity
                    key={reason}
                    style={[
                      styles.reasonOption,
                      {
                        backgroundColor:
                          selectedReason === reason ? C.primary + "15" : "transparent",
                        borderColor:
                          selectedReason === reason ? C.primary : C.border,
                      },
                    ]}
                    onPress={() => setSelectedReason(reason)}
                  >
                    <RNView
                      style={[
                        styles.radioButton,
                        {
                          backgroundColor:
                            selectedReason === reason ? C.primary : "transparent",
                          borderColor: C.border,
                        },
                      ]}
                    >
                      {selectedReason === reason && (
                        <RNView
                          style={[styles.radioInner, { backgroundColor: C.primary }]}
                        />
                      )}
                    </RNView>
                    <ThemedText
                      style={[
                        styles.reasonText,
                        { color: C.text },
                      ]}
                    >
                      {reason}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {selectedReason === "Other" && (
                <RNView style={{ marginBottom: 16 }}>
                  <ThemedText style={[styles.feedbackLabel, { color: C.text }]}>
                    Tell us why
                  </ThemedText>
                  <TextInput
                    style={[
                      styles.feedbackInput,
                      {
                        backgroundColor: C.inputBg,
                        borderColor: C.border,
                        color: C.text,
                      },
                    ]}
                    placeholder="Enter your feedback..."
                    placeholderTextColor={C.muted}
                    value={reasonFeedback}
                    onChangeText={(text) => {
                      if (text.length <= maxFeedbackCharacters) {
                        setReasonFeedback(text);
                      }
                    }}
                    multiline
                    maxLength={maxFeedbackCharacters}
                  />
                  <ThemedText style={[styles.charCounter, { color: C.muted }]}>
                    {reasonFeedback.length}/{maxFeedbackCharacters} characters
                  </ThemedText>
                </RNView>
              )}

              <BraneButton
                text="Delete Account"
                onPress={handleContinueDelete}
                loading={deleteIsLoading}
                disabled={!selectedReason || deleteIsLoading}
                backgroundColor={C.error}
                height={48}
                radius={12}
              />
            </Pressable>
          </Pressable>
        </SafeAreaView>
      </Modal>

      {/* OTP Verification Modal */}
      <Modal
        visible={showOtpModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOtpModal(false)}
      >
        <Pressable
          style={[styles.modalBackdrop, { backgroundColor: "rgba(0,0,0,0.5)" }]}
          onPress={() => setShowOtpModal(false)}
        >
          <RNView
            style={
              [
                styles.confirmCard,
                { backgroundColor: C.background, borderColor: C.border },
              ] as any
            }
          >
            <ThemedText
              type="defaultSemiBold"
              style={[styles.confirmTitle, { color: C.text }]}
            >
              Verify Your Phone
            </ThemedText>
            <ThemedText style={[styles.confirmText, { color: C.muted }]}>
              Enter the 6-digit code we sent to {user?.phone}
            </ThemedText>

            <TextInput
              style={[
                styles.codeInput,
                {
                  backgroundColor: C.inputBg,
                  borderColor: C.border,
                  color: C.text,
                },
              ]}
              placeholder="000000"
              placeholderTextColor={C.muted}
              value={otp}
              onChangeText={setOtp}
              maxLength={6}
              keyboardType="number-pad"
            />

            <RNView style={styles.confirmActions}>
              <BraneButton
                text="Verify OTP"
                onPress={handleVerifyOtp}
                loading={deleteIsLoading}
                disabled={!otp.trim() || deleteIsLoading}
                backgroundColor={C.primary}
                style={{ flex: 1 }}
                height={44}
                radius={8}
              />
            </RNView>
          </RNView>
        </Pressable>
      </Modal>

      {/* Delete Success Modal */}
      <Modal
        visible={showDeleteSuccess}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <Pressable
          style={[styles.modalBackdrop, { backgroundColor: "rgba(0,0,0,0.5)" }]}
        >
          <RNView
            style={
              [
                styles.confirmCard,
                { backgroundColor: C.background, borderColor: C.border },
              ] as any
            }
          >
            <RNView style={{ alignItems: "center", marginBottom: 16 }}>
              <TickCircle size={56} color={C.primary} />
            </RNView>

            <ThemedText
              type="defaultSemiBold"
              style={[styles.confirmTitle, { color: C.text, textAlign: "center" }]}
            >
              Account Deleted
            </ThemedText>
            <ThemedText
              style={[
                styles.confirmText,
                { color: C.muted, textAlign: "center" },
              ]}
            >
              Your account has been permanently deleted. Redirecting to login...
            </ThemedText>
          </RNView>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  avatarWrap: {
    alignItems: "center",
    marginBottom: 24,
    gap: 8,
  },
  avatarContainer: {
    position: "relative",
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingOverlay: {
    position: "absolute",
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarHint: {
    fontSize: 13,
    fontWeight: "500",
  },
  row: {
    borderBottomWidth: 1,
    paddingVertical: 14,
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
  },
  value: {
    fontSize: 13,
    marginLeft: 10,
    flex: 1,
    textAlign: "right",
  },
  note: {
    marginTop: 24,
    borderRadius: 12,
    padding: 14,
  },
  noteText: {
    fontSize: 12,
    lineHeight: 18,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalCard: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 14,
    flex: 1,
  },
  confirmCard: {
    margin: 20,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  } as any,
  confirmTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  confirmText: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  confirmActions: {
    flexDirection: "row",
    gap: 12,
  },
  bottomSheetCard: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  modalSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  reasonOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  reasonText: {
    fontSize: 14,
    flex: 1,
    fontWeight: "500",
  },
  feedbackLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  feedbackInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 8,
  },
  charCounter: {
    fontSize: 12,
    textAlign: "right",
  },
  codeInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    letterSpacing: 2,
    textAlign: "center",
    marginVertical: 20,
    fontWeight: "600",
  },
});
