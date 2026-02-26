import { HomeHeader } from "@/components/home"
import { SafeAreaView } from "react-native-safe-area-context"

export const home = () => {
    return(
        <SafeAreaView style={{ flex: 1 }}>
    <HomeHeader/>
    </SafeAreaView>
    )
}

