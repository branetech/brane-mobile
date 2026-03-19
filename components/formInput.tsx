import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { FormikHandlers, FormikState } from "formik";
import React, { forwardRef } from "react";
import {
    StyleProp,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

/* ===================== TYPES ===================== */

interface FormInputProp extends Omit<
  TextInputProps,
  "value" | "onChangeText" | "onBlur"
> {
  labelText?: string;
  placeholder?: string;
  value?: string | number;
  onChangeText?: (text: string) => void;
  onBlur?: (e: any) => void;
  error?: string;

  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  leftClick?: () => void;
  rightClick?: () => void;
  disabled?: boolean;

  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>; // ✅ width belongs here
  inputStyle?: StyleProp<TextStyle>; // ✅ arrays allowed
  leftContentStyle?: StyleProp<ViewStyle>;
  rightContentStyle?: StyleProp<ViewStyle>;
  errorTextStyle?: TextStyle;
}

const FormikError = ({
  message,
  style,
  errorColor,
}: {
  message?: string;
  style?: TextStyle;
  errorColor?: string;
}) => {
  if (!message) return null;
  return <Text style={[styles.errorText, { color: errorColor }, style]}>{message}</Text>;
};

export const FormInput = forwardRef<TextInput, FormInputProp>(
  (
    {
      labelText,
      placeholder,
      error,
      value,
      onChangeText,
      onBlur,
      leftContent,
      rightContent,
      leftClick,
      rightClick,
      disabled,

      containerStyle,
      labelStyle,
      inputContainerStyle,
      inputStyle,
      leftContentStyle,
      rightContentStyle,
      errorTextStyle,

      ...textInputProps
    },
    ref,
  ) => {
    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

    const inputBg = theme.inputBackground;
    const borderColor = theme.border;
    const muted = theme.muted;

    return (
      <View style={[styles.inputWrapper, containerStyle]}>
        {/* Label */}
        {labelText && (
          <ThemedText
            style={[
              styles.label,
              // { color: theme.text },
              labelStyle,
            ]}
          >
            {labelText}
          </ThemedText>
        )}

        {/* Input container */}
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: inputBg,
              borderColor: error ? theme.error : inputBg,
            },
            inputContainerStyle,
          ]}
        >
          {/* Left content */}
          {leftContent && (
            <TouchableOpacity
              onPress={leftClick}
              style={[styles.leftContent, leftContentStyle]}
              activeOpacity={0.7}
            >
              {leftContent}
            </TouchableOpacity>
          )}

          {/* TextInput */}
          <TextInput
            ref={ref}
            style={[
              styles.textInput,
              { color: theme.text },
              leftContent ? styles.textInputWithLeftContent : undefined,
              rightContent ? styles.textInputWithRightContent : undefined,
              disabled ? { color: muted } : undefined,
              inputStyle,
            ]}
            placeholder={placeholder}
            placeholderTextColor={muted}
            value={value as string}
            onChangeText={onChangeText}
            onBlur={onBlur}
            editable={!disabled}
            {...textInputProps}
          />

          {/* Right content */}
          {rightContent && (
            <TouchableOpacity
              onPress={rightClick}
              style={[styles.rightContent, rightContentStyle]}
              activeOpacity={0.7}
            >
              {rightContent}
            </TouchableOpacity>
          )}
        </View>

        {/* Error */}
        <FormikError message={error} style={errorTextStyle} errorColor={theme.error} />
      </View>
    );
  },
);

FormInput.displayName = "FormInput";

/* ===================== FORMIK HELPER ===================== */

export const mapFormikProps = (
  name: string,
  form: FormikHandlers & FormikState<any>,
) => ({
  value: form.values[name],
  error:
    form.touched[name] && form.errors[name]
      ? String(form.errors[name])
      : undefined,
  onChangeText: form.handleChange(name),
  onBlur: form.handleBlur(name),
});

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  inputWrapper: {},

  label: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: "400",
  },

  inputContainer: {
    position: "relative",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 8,
    height: 48,
  },

  textInput: {
    height: 48,
    paddingHorizontal: 12,
    fontSize: 14,
  },

  textInputWithLeftContent: {
    paddingLeft: 40,
  },

  textInputWithRightContent: {
    paddingRight: 40,
  },

  leftContent: {
    position: "absolute",
    left: 10,
    top: 12,
    zIndex: 1,
  },

  rightContent: {
    position: "absolute",
    right: 10,
    top: 12,
    zIndex: 1,
  },

  errorText: {
    fontSize: 12,
    marginTop: 5,
  },
});
