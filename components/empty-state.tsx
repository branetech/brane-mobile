import { View } from "@idimma/rn-widget";
import { Gift } from "iconsax-react-native";

export const EmptyState = ({ children, style }: { children?: React.ReactNode, style?: any }) => {
  return (
    <View w="100%" h="auto" justify="center" align="center" mx={"auto"} gap={8} style={style}>
      <View
        w={56}
        h={56}
        bg="#F7F7F8"
        justify="center"
        align="center"
        radius={50}
      >
        <Gift variant="TwoTone" size={24} color="#013D25" />
      </View>
      {children}
    </View>
  );
};
