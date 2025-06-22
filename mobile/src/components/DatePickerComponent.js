"use client"

import { useState } from "react"
import { Platform } from "react-native"
import { TextInput } from "react-native-paper"
import DateTimePicker from "@react-native-community/datetimepicker"
import { formatDate } from "../utils/formatters"

const DatePickerComponent = ({ label, value, onChange, error, minimumDate, maximumDate }) => {
  const [showPicker, setShowPicker] = useState(false)

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === "ios")
    if (selectedDate) {
      onChange(selectedDate)
    }
  }

  const showDatePicker = () => {
    setShowPicker(true)
  }

  return (
    <>
      <TextInput
        label={label}
        value={formatDate(value)}
        onFocus={showDatePicker}
        error={error}
        mode="outlined"
        right={<TextInput.Icon icon="calendar-today" onPress={showDatePicker} />}
        editable={false}
        style={{ marginBottom: 8 }}
      />
      {showPicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </>
  )
}

export default DatePickerComponent
