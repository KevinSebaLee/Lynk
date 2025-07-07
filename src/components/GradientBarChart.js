import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated, Platform } from "react-native";
import Svg, { Rect, Defs, LinearGradient as SvgLinearGradient, Stop } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";


// Chart constants
const BAR_WIDTH = 61;
const BAR_SPACING = 10;
const BAR_RADIUS = 5;
const CHART_HEIGHT = 180;
const ANIMATION_DURATION = 400;


// Data for each day
const DATA = [
  { date: "27 Julio", value: 80 },
  { date: "28 Julio", value: 100 },
  { date: "29 Julio", value: 170, label: "+325.23" },
  { date: "30 Julio", value: 110 },
  { date: "31 Julio", value: 60 },
];


const maxValue = Math.max(...DATA.map(d => d.value));
const chartWidth = DATA.length * BAR_WIDTH + (DATA.length - 1) * BAR_SPACING;


function GradientBarChart() {
  const [selected, setSelected] = useState(2); // Default to July 29
  const animatedHeights = useRef(
    DATA.map(d => new Animated.Value((d.value / maxValue) * CHART_HEIGHT))
  ).current;


  // Animate all bars when selection changes
  const handleSelect = idx => {
    setSelected(idx);
    animatedHeights.forEach((a, i) => {
      Animated.timing(a, {
        toValue: (DATA[i].value / maxValue) * CHART_HEIGHT,
        duration: ANIMATION_DURATION,
        useNativeDriver: false,
      }).start();
    });
  };


  return (
    <View style={styles.container}>
      <View style={{ height: CHART_HEIGHT + 52, justifyContent: "flex-end" }}>
        {/* Bars and shadows */}
        <View style={{ width: chartWidth, height: CHART_HEIGHT, flexDirection: "row" }}>
          {DATA.map((bar, i) => {
            const isSelected = i === selected;
            return (
              <View
                key={i}
                style={{
                  width: BAR_WIDTH,
                  marginLeft: i !== 0 ? BAR_SPACING : 0,
                  alignItems: "center",
                  justifyContent: "flex-end",
                  position: "relative",
                }}
              >
                <TouchableWithoutFeedback onPress={() => handleSelect(i)}>
                  <View>
                    {/* Shadow */}
                    <Animated.View
                      style={[
                        styles.barShadow,
                        {
                          height: animatedHeights[i],
                          opacity: isSelected ? 0.20 : 0,
                          shadowColor: isSelected ? "#70a1ff" : "transparent",
                        },
                      ]}
                    />
                    {/* Bar */}
                    <Animated.View
                      style={[
                        {
                          width: BAR_WIDTH,
                          height: animatedHeights[i],
                          borderTopLeftRadius: BAR_RADIUS,
                          borderTopRightRadius: BAR_RADIUS,
                          overflow: "hidden",
                          backgroundColor: "transparent",
                          position: "absolute",
                          bottom: 0,
                        },
                        Platform.OS === "android" && { elevation: isSelected ? 4 : 1 },
                      ]}
                    >
                      {isSelected ? (
                        // Gradient bar for July 29
                        <LinearGradient
                          colors={['#735BF2', '#642684']}
                          start={{ x: 0.5, y: 0 }}
                          end={{ x: 0.5, y: 1 }}
                          style={StyleSheet.absoluteFill}
                        />
                      ) : (
                        // Light gray gradient bar
                        <Svg width={BAR_WIDTH} height="100%">
                          <Defs>
                            <SvgLinearGradient id={`grayGradient${i}`} x1="0" y1="0" x2="0" y2="1">
                              <Stop offset="0%" stopColor="#e6e9f0" />
                              <Stop offset="100%" stopColor="#D3D3D3" />
                            </SvgLinearGradient>
                          </Defs>
                          <Rect
                            x={0}
                            y={0}
                            width={BAR_WIDTH}
                            height="100%"
                            rx={BAR_RADIUS}
                            ry={BAR_RADIUS}
                            fill={`url(#grayGradient${i})`}
                          />
                        </Svg>
                      )}
                    </Animated.View>
                  </View>
                </TouchableWithoutFeedback>
                {/* Tooltip label above selected bar */}
                {isSelected && bar.label && (
                  <View style={[styles.tooltip, { bottom: animatedHeights[i].__getValue() + 18 }]}>
                    <Text style={styles.tooltipText}>{bar.label}</Text>
                    <View style={styles.tooltipArrow} />
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>
      {/* Dates below bars */}
      <View style={[styles.datesRow, {marginLeft:32}]}>
        {DATA.map((bar, i) => (
          <TouchableWithoutFeedback key={i} onPress={() => handleSelect(i)}>
            <View style={{ width: 70}}>
              <Text style={[styles.dateText, i === selected && styles.selectedDate]}>
                {bar.date.split(" ")[0]}
              </Text>
              <Text style={[styles.dateText, i === selected && styles.selectedDate]}>
                {bar.date.split(" ")[1]}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </View>
    </View>
  );
}


// Styles
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingBottom: 18,
  },


  tooltip: {
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -44 }],
    width: 88,
    height: 40,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    top: -44,
    shadowColor: "#2d9fff",
    shadowOpacity: 0.10,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
  },
  tooltipText: {
    color: '#151C2A',
    fontWeight: "600",
    fontSize: 17,
    letterSpacing: 0.2,
    textAlign: "center",
  },
  tooltipArrow: {
    position: "absolute",
    bottom: -8,
    left: "50%",
    marginLeft: -7,
    width: 14,
    height: 8,
    backgroundColor: "transparent",
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#fff",
  },
  datesRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginTop: 26,
    width: chartWidth,
  },
  dateText: {
    color: '#7988A3',
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 17,
  },
  selectedDate: {
    color: "#151C2A",
    fontWeight: "bold",
  },
});


export default GradientBarChart;
