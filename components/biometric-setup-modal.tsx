import React, { useState } from 'react';
import {
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from '@idimma/rn-widget';
import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';
import { setBiometricEnabled, setBiometricType } from '@/redux/slice/auth-slice';
import setBiometricMode from '@/redux/slice/auth-slice';
import { showError, showSuccess } from '@/utils/helpers';
import { BraneButton } from '@/components/brane-button';
import { ThemedText } from '@/components/themed-text';
import { FingerScan, CloseCircle } from 'iconsax-react-native';

type Scheme = 'light' | 'dark';

interface BiometricSetupModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const BiometricSetupModal: React.FC<BiometricSetupModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === 'dark' ? 'dark' : 'light';
  const C = Colors[scheme];

  const dispatch = useDispatch();
  const { isLoading, availability } = useBiometricAuth();
  const [selectedMode, setSelectedMode] = useState<'auto-login' | '2fa' | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEnableBiometric = async (
    mode: 'auto-login' | '2fa'
  ) => {
    if (!visible || isProcessing) return;

    try {
      setIsProcessing(true);

      // Get credentials from parent component (passed via localStorage would be ideal)
      // For now, we'll need to rely on the parent to pass credentials
      // The actual credentials storage will happen after this modal confirms setup

      setSelectedMode(mode);
      
      // Update Redux state
      dispatch(setBiometricEnabled(true));
      dispatch(setBiometricMode(mode));
      dispatch(setBiometricType(availability.type || 'Fingerprint'));

      showSuccess(
        `Biometric ${mode === 'auto-login' ? 'login' : '2FA'} enabled!`
      );

      // Call parent callback
      onSuccess?.();

      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error: any) {
      showError(
        error?.message || 'Failed to enable biometric authentication'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            backgroundColor: C.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingHorizontal: 16,
            paddingTop: 24,
            paddingBottom: 32,
            maxHeight: '80%',
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {/* Close Button */}
            <TouchableOpacity
              onPress={onClose}
              style={{ alignSelf: 'flex-end', marginBottom: 16 }}
            >
              <CloseCircle size={24} color={C.text} />
            </TouchableOpacity>

            {/* Header */}
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <FingerScan size={56} color={C.primary} />
              <ThemedText
                type="title"
                style={{
                  fontSize: 20,
                  fontWeight: '600',
                  marginTop: 16,
                  color: C.text,
                  textAlign: 'center',
                }}
              >
                Secure Your Account
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: 14,
                  color: C.muted,
                  marginTop: 8,
                  textAlign: 'center',
                  lineHeight: 20,
                }}
              >
                Enable {availability.type || 'biometric'} authentication for faster and
                more secure login.
              </ThemedText>
            </View>

            {/* Mode Selection */}
            <View style={{ marginBottom: 24 }}>
              {/* Auto-Login Option */}
              <TouchableOpacity
                onPress={() => handleEnableBiometric('auto-login')}
                disabled={isProcessing || isLoading}
                style={{
                  borderWidth: 2,
                  borderColor:
                    selectedMode === 'auto-login' ? C.primary : C.border,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  backgroundColor:
                    selectedMode === 'auto-login'
                      ? C.primary + '15'
                      : C.inputBg,
                }}
              >
                <ThemedText
                  type="defaultSemiBold"
                  style={{
                    fontSize: 14,
                    color: C.text,
                    marginBottom: 4,
                  }}
                >
                  Fast Login
                </ThemedText>
                <ThemedText
                  style={{
                    fontSize: 12,
                    color: C.muted,
                    lineHeight: 18,
                  }}
                >
                  Use {availability.type || 'your biometric'} to log in instantly without entering your
                  password.
                </ThemedText>
              </TouchableOpacity>

              {/* 2FA Option */}
              <TouchableOpacity
                onPress={() => handleEnableBiometric('2fa')}
                disabled={isProcessing || isLoading}
                style={{
                  borderWidth: 2,
                  borderColor:
                    selectedMode === '2fa' ? C.primary : C.border,
                  borderRadius: 12,
                  padding: 16,
                  backgroundColor:
                    selectedMode === '2fa'
                      ? C.primary + '15'
                      : C.inputBg,
                }}
              >
                <ThemedText
                  type="defaultSemiBold"
                  style={{
                    fontSize: 14,
                    color: C.text,
                    marginBottom: 4,
                  }}
                >
                  Extra Security
                </ThemedText>
                <ThemedText
                  style={{
                    fontSize: 12,
                    color: C.muted,
                    lineHeight: 18,
                  }}
                >
                  Enter your password, then use {availability.type || 'biometric'} to confirm your
                  identity.
                </ThemedText>
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View style={{ gap: 12 }}>
              <BraneButton
                text={isProcessing ? 'Setting up...' : 'Continue'}
                onPress={() => {
                  if (selectedMode) {
                    handleEnableBiometric(selectedMode);
                  }
                }}
                disabled={!selectedMode || isProcessing || isLoading}
                backgroundColor={C.primary}
                textColor="#D2F1E4"
                height={52}
                radius={12}
              />
              <BraneButton
                text="Maybe Later"
                onPress={handleSkip}
                disabled={isProcessing || isLoading}
                backgroundColor={C.inputBg}
                textColor={C.text}
                height={52}
                radius={12}
              />
            </View>

            {/* Info Text */}
            <ThemedText
              style={{
                fontSize: 11,
                color: C.muted,
                marginTop: 16,
                textAlign: 'center',
                lineHeight: 16,
              }}
            >
              You can manage biometric settings anytime in your account settings.
            </ThemedText>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
