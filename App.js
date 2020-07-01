import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { StyleSheet, Text, View, Button, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import TimePicker from "react-native-simple-time-picker";
import moment from "moment";

const initialTime = new Date();
initialTime.setHours(8);
initialTime.setMinutes(0);
initialTime.setSeconds(0);
const initialTD = moment(initialTime);
const initialEndTime = new Date();
initialEndTime.setHours(17);
initialEndTime.setMinutes(0);
initialEndTime.setSeconds(0);
const initialETD = moment(initialEndTime);

export default function App() {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [showLunch, setShowLunchTimePicker] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [time, setTime] = useState(initialTD);
  const [endTime, setEndTime] = useState(initialETD);
  const [lunchHr, setLunchHr] = useState(0);
  const [lunchMin, setLunchMin] = useState(10);

  const onChange = (event, selectedDate) => {
    if (mode === "date") {
      const currentDate = selectedDate || date;
      setShow(Platform.OS === "ios");
      setDate(currentDate);
    } else if (mode === "time") {
      const currentDate = selectedDate || date;
      setShow(Platform.OS === "ios");
      setTime(moment(selectedDate));
    }
  };

  const onChangeEnd = (event, selectedDate) => {
    if (mode === "date") {
      const currentDate = selectedDate || date;
      setShowEnd(Platform.OS === "ios");
      setDate(currentDate);
    } else if (mode === "time") {
      const currentDate = selectedDate || date;
      setShowEnd(Platform.OS === "ios");
      setEndTime(moment(selectedDate));
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showLunchTimePicker = () => {
    setShowLunchTimePicker(!showLunch);
  };

  const showTimepicker = () => {
    showMode("time");
  };

  const showTimepickerEnd = () => {
    setShowEnd(true);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const setLunchTime = (hours, minutes) => {
    setLunchHr(hours);
    setLunchMin(minutes);
  };

  const displayLunch = (hr, min) => {
    return hr === 0 ? min + " mins" : hr + " hrs " + min + " mins";
  };

  const calculateTotal = (start, end, lunchHr, lunchMin) => {
    const lunchTotal = lunchHr * 3600 + lunchMin * 60;
    let duration = end.diff(start, "seconds") - lunchTotal;
    const hours = Math.floor(duration / 3600);
    const minutes = Math.ceil((duration - hours * 3600) / 60);
    return hours + "  hrs  " + minutes + "  mins";
  };

  return (
    <View style={styles.container}>
      <Button onPress={showDatepicker} title="Today's Date" />
      <Text style={styles.textCont}>{date.toDateString()}</Text>
      <Button onPress={showTimepicker} title="Start Time" />
      <Text style={styles.textCont}>{time.format("LT")}</Text>
      <Button onPress={showTimepickerEnd} title="End Time" />
      <Text style={styles.textCont}>{endTime.format("LT")}</Text>
      <Button title="Lunch" onPress={showLunchTimePicker} />

      {showLunch && (
        <TimePicker
          selectedHours={lunchHr}
          selectedMinutes={lunchMin}
          onChange={setLunchTime}
        />
      )}
      <Text style={styles.textCont}>{displayLunch(lunchHr, lunchMin)}</Text>
      <Text style={styles.textResult}>
        {calculateTotal(time, endTime, lunchHr, lunchMin)}
      </Text>

      <StatusBar style="auto" />

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={false}
          display="default"
          onChange={onChange}
        />
      )}
      {showEnd && (
        <DateTimePicker
          value={date}
          mode={"time"}
          is24Hour={false}
          display="default"
          onChange={onChangeEnd}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 50,
    marginRight: 50,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  textTitle: {
    fontSize: RFPercentage(4),
    marginBottom: 20,
    marginTop: 10,
  },
  textCont: {
    fontSize: RFPercentage(3),
    marginBottom: 20,
    marginTop: 10,
  },
  textResult: {
    fontSize: RFPercentage(4),
    fontWeight: "bold",
  },
});
