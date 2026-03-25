import { FormInput } from "@/components/formInput";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { CloseCircle, SearchNormal1 } from "iconsax-react-native";
import React from "react";
import { StyleProp, TextInputProps, TextStyle, ViewStyle } from "react-native";

type Scheme = "light" | "dark";

type SearchInputProps = Omit<TextInputProps, "value" | "onChangeText"> & {
  value: string;
  onChangeText: (text: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  showClearButton?: boolean;
  onClear?: () => void;
};

export function SearchInput({
  value,
  onChangeText,
  containerStyle,
  inputContainerStyle,
  inputStyle,
  showClearButton = true,
  onClear,
  ...props
}: SearchInputProps) {
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const handleClear = () => {
    if (onClear) {
      onClear();
      return;
    }
    onChangeText("");
  };

  return (
    <FormInput
      {...props}
      value={value}
      onChangeText={onChangeText}
      leftContent={<SearchNormal1 size={16} color={C.muted} />}
      rightContent={
        showClearButton && value.length > 0 ? (
          <CloseCircle size={16} color={C.muted} variant='Bold' />
        ) : null
      }
      rightClick={handleClear}
      containerStyle={containerStyle}
      inputContainerStyle={inputContainerStyle}
      inputStyle={inputStyle}
    />
  );
}
