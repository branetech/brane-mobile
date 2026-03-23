import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useMemo } from "react";
import { View } from "react-native";
import { Calendar } from "react-native-calendars";

type MyCalendarProps = {
  selectedDate?: string;
  minDate?: string;
  maxDate?: string;
  onSelectDate: (dateString: string) => void;
};

export const MyCalendar = ({
  selectedDate,
  minDate,
  maxDate,
  onSelectDate,
}: MyCalendarProps) => {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const markedDates = useMemo(() => {
    if (!selectedDate) return {};

    return {
      [selectedDate]: {
        selected: true,
        selectedColor: C.primary,
        selectedTextColor: scheme === "dark" ? "#0B0014" : "#FFFFFF",
      },
    };
  }, [C.primary, scheme, selectedDate]);

  return (
    <View>
      <Calendar
        current={selectedDate || undefined}
        minDate={minDate}
        maxDate={maxDate}
        enableSwipeMonths
        onDayPress={(day) => onSelectDate(day.dateString)}
        markedDates={markedDates}
        theme={{
          backgroundColor: C.background,
          calendarBackground: C.background,
          textSectionTitleColor: C.muted,
          selectedDayBackgroundColor: C.primary,
          selectedDayTextColor: scheme === "dark" ? "#0B0014" : "#FFFFFF",
          todayTextColor: C.primary,
          dayTextColor: C.text,
          textDisabledColor: scheme === "dark" ? "#5A5E63" : "#CCD2D8",
          dotColor: C.primary,
          selectedDotColor: scheme === "dark" ? "#0B0014" : "#FFFFFF",
          arrowColor: C.primary,
          monthTextColor: C.text,
          indicatorColor: C.primary,
          textDayFontSize: 14,
          textMonthFontSize: 15,
          textDayHeaderFontSize: 12,
        }}
      />
    </View>
  );
};
