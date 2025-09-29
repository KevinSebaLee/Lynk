import React, { useRef, useState, useEffect, useMemo, memo } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated, Platform } from 'react-native';
import Svg, { Rect, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

// Chart constants - defined outside component to prevent recreation
const BAR_WIDTH = 61;          // Width of each bar
const BAR_SPACING = 10;        // Space between bars
const BAR_RADIUS = 5;          // Rounded corners radius
const CHART_HEIGHT = 180;      // Height of chart area
const ANIMATION_DURATION = 400; // Animation speed in ms
const DAYS_TO_SHOW = 5;        // Number of bars to display

/**
 * GradientBarChart - Animated bar chart with gradient styling
 * @param {number} monthlyUsage - Total usage value for the month
 */
const GradientBarChart = memo(({ monthlyUsage = 0 }) => {
  /**
   * Generate evenly distributed data points across the current month
   * Each point represents usage at that point in time
   */
  const generateChartData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Calculate days in current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Create array of evenly distributed data points
    const data = [];
    
    for (let i = 0; i < DAYS_TO_SHOW; i++) {
      // Calculate day number (distributed evenly across the month)
      const dayNum = Math.round((i / (DAYS_TO_SHOW - 1)) * (daysInMonth - 1)) + 1;
      const date = new Date(currentYear, currentMonth, dayNum);
      const dayOfMonth = date.getDate();
      const monthName = date.toLocaleString('default', { month: 'long' });
      
      // Calculate a portion of monthly usage for each bar
      // More tickets used as the month progresses with slight randomization
      const ratio = dayNum / daysInMonth;
      // Use a deterministic formula based on the day number to ensure consistent renders
      const randomFactor = 0.8 + (((dayNum * 13) % 20) / 50); 
      const value = Math.round(monthlyUsage * ratio * randomFactor);
      
      const entry = {
        date: `${dayOfMonth} ${monthName}`,
        value: value
      };
      
      // Add the total label to the middle bar
      if (i === Math.floor(DAYS_TO_SHOW / 2)) {
        entry.label = `${monthlyUsage}`;
      }
      
      data.push(entry);
    }
    
    return data;
  }, [monthlyUsage]);

  // Chart state
  const [chartData, setChartData] = useState(generateChartData);
  const [selected, setSelected] = useState(Math.floor(DAYS_TO_SHOW / 2)); // Default to middle day
  
  // Update chart data when monthlyUsage changes
  useEffect(() => {
    setChartData(generateChartData());
  }, [monthlyUsage]);
  
  // Calculate chartWidth INSIDE the component - this fixes the error
  const chartWidth = chartData.length * BAR_WIDTH + (chartData.length - 1) * BAR_SPACING;
  
  // Find max value for scaling the bars
  const maxValue = Math.max(...chartData.map(d => d.value)) || 1;
  
  const animatedHeights = useRef(
    chartData.map(d => new Animated.Value((d.value / maxValue) * CHART_HEIGHT))
  ).current;

  // Update animated heights when chartData changes
  useEffect(() => {
    if (chartData.length > 0) {
      const maxVal = Math.max(...chartData.map(d => d.value)) || 1;
      chartData.forEach((d, i) => {
        Animated.timing(animatedHeights[i], {
          toValue: (d.value / maxVal) * CHART_HEIGHT,
          duration: ANIMATION_DURATION,
          useNativeDriver: false,
        }).start();
      });
    }
  }, [chartData]);

  // Handle selection change
  const handleSelect = idx => {
    setSelected(idx);
  };

  return (
    <View style={styles.container}>
      <View style={{ height: CHART_HEIGHT + 52, justifyContent: 'flex-end' }}>
        {/* Bars and shadows */}
        <View style={{ width: chartWidth, height: CHART_HEIGHT, flexDirection: 'row' }}>
          {chartData.map((bar, i) => {
            const isSelected = i === selected;
            return (
              <View
                key={i}
                style={{
                  width: BAR_WIDTH,
                  marginLeft: i !== 0 ? BAR_SPACING : 0,
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  position: 'relative',
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
                          shadowColor: isSelected ? '#70a1ff' : 'transparent',
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
                          overflow: 'hidden',
                          backgroundColor: 'transparent',
                          position: 'absolute',
                          bottom: 0,
                        },
                        Platform.OS === 'android' && { elevation: isSelected ? 4 : 1 },
                      ]}
                    >
                      {isSelected ? (
                        // Gradient bar for selected day
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
      {/* Dates below bars - FIXED alignment by removing marginLeft */}
      <View style={styles.datesRow}>
        {chartData.map((bar, i) => (
          <TouchableWithoutFeedback key={i} onPress={() => handleSelect(i)}>
            <View style={{ width: BAR_WIDTH, marginLeft: i !== 0 ? BAR_SPACING : 0 }}>
              <Text style={[styles.dateText, i === selected && styles.selectedDate]}>
                {bar.date.split(' ')[0]}
              </Text>
              <Text style={[styles.dateText, i === selected && styles.selectedDate]}>
                {bar.date.split(' ')[1]}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </View>
    </View>
  );
});

// Styles - Fixed container to center properly
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 18,
  },
  barShadow: {
    width: BAR_WIDTH,
    position: 'absolute',
    bottom: 0,
    borderRadius: BAR_RADIUS,
    shadowColor: '#70a1ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    backgroundColor: 'transparent',
  },
  tooltip: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -44 }],
    width: 88,
    height: 40,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    top: -44,
    shadowColor: '#2d9fff',
    shadowOpacity: 0.10,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
  },
  tooltipText: {
    color: '#151C2A',
    fontWeight: '600',
    fontSize: 17,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -7,
    width: 14,
    height: 8,
    backgroundColor: 'transparent',
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#fff',
  },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 26,
    width: '100%', // Take full width of container
  },
  dateText: {
    color: '#7988A3',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 17,
  },
  selectedDate: {
    color: '#151C2A',
    fontWeight: 'bold',
  },
});

export default GradientBarChart;