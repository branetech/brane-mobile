import { Image, View } from "react-native";
import { BraneButton } from "@/components/brane-button";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";

interface ContinueWithGoogleProps {
  action?: string;
}

const ContinueWithGoogle = ({ action }: ContinueWithGoogleProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const onLoad = async () => {
    setIsLoading(true);

    try {
      const {
        data: { uri },
      } = await BaseRequest.get("auth-service/google/uri");

      // Open Google OAuth in browser
      await WebBrowser.openBrowserAsync(uri);
    } catch (error) {
      catchError(error);
    }

    setIsLoading(false);
  };

  return (
    <View>
      <BraneButton
        text={action || "Continue with Google"}
        textColor={C.primary}
        backgroundColor={scheme === "dark" ? "#F6FCFA" : "#D2F1E4"}
        onPress={onLoad}
        height={52}
        radius={12}
        disabled={isLoading}
        loading={isLoading}
        leftIcon={
          <Image
            source={require("@/assets/images/Google.png")}
            style={{ width: 18, height: 18 }}
          />
        }
        fontSize={14}
      />
    </View>
  );
};

export default ContinueWithGoogle;
