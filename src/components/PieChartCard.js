import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';

// Define a set of predefined colors for categories
const CATEGORY_COLORS = {
    'Transferencia': '#FF6384',
    'Eventos': '#36A2EB',
    'Entretenimiento': '#FFCE56',
    'Restaurantes': '#4BC0C0',
    'Otros': '#9966FF'
};

// Helper function to get a color for a category
const getCategoryColor = (categoryName) => {
    return CATEGORY_COLORS[categoryName] || '#642684'; // Default purple color
};

const PieChartCard = ({ categories = [], title = 'Distribución de Tickets', subtitle = '' }) => {
    if (!categories || categories.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{title}</Text>
                {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No hay datos disponibles</Text>
                </View>
            </View>
        );
    }

    // We'll handle single category specially when rendering
    let chartCategories = [...categories];
    // Process and normalize the chart data
    const chartData = chartCategories.map(category => ({
        name: category.name || 'Sin nombre',
        amount: typeof category.amount === 'number' ? category.amount : 0,
        color: category.color || getCategoryColor(category.name) || '#642684'
    }));

    // Filter out zero amount entries
    const filteredChartData = chartData.filter(item => item.amount > 0);

    // If after filtering, there's no data to display
    if (filteredChartData.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{title}</Text>
                {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No hay datos para mostrar</Text>
                </View>
            </View>
        );
    }

    const screenWidth = Dimensions.get('window').width;

    // Render the donut chart
    const renderDonutChart = () => {
        const width = screenWidth - 72; // Account for padding
        const height = 200;
        const chartSize = Math.min(width, height) - 32;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = chartSize / 2;
        const strokeWidth = 40; // Thickness of the donut
        const innerRadius = radius - strokeWidth;

        // Calculate total for percentages
        let total = 0;
        filteredChartData.forEach(category => {
            total += category.amount;
        });

        // Make sure we have a valid total
        if (total <= 0) {
            total = 1; // Prevent division by zero
        }

        // Create arcs for the donut chart
        let startAngle = 0;
        const arcs = filteredChartData.map(category => {
            const percentage = category.amount / total;
            const endAngle = startAngle + percentage * 2 * Math.PI;

            // Create SVG arc path
            const x1 = centerX + radius * Math.cos(startAngle);
            const y1 = centerY + radius * Math.sin(startAngle);

            // For single category that represents 100%, make it a nearly full circle with a small gap
            let actualEndAngle = endAngle;
            if (Math.abs(endAngle - startAngle) > 1.99 * Math.PI) {
                actualEndAngle = startAngle + 1.999 * Math.PI;
            }

            const largeArcFlag = actualEndAngle - startAngle > Math.PI ? 1 : 0;

            const x2Adjusted = centerX + radius * Math.cos(actualEndAngle);
            const y2Adjusted = centerY + radius * Math.sin(actualEndAngle);

            // Outer arc path
            const outerPath = `
        M ${centerX + innerRadius * Math.cos(startAngle)} ${centerY + innerRadius * Math.sin(startAngle)}
        L ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2Adjusted} ${y2Adjusted}
        L ${centerX + innerRadius * Math.cos(actualEndAngle)} ${centerY + innerRadius * Math.sin(actualEndAngle)}
        A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${centerX + innerRadius * Math.cos(startAngle)} ${centerY + innerRadius * Math.sin(startAngle)}
      `;

            const arc = {
                path: outerPath,
                color: category.color,
                category: category.name,
                value: category.amount,
                startAngle,
                endAngle
            };

            startAngle = endAngle;
            return arc;
        });

        // Create legend items
        const legendItems = filteredChartData.map((category, index) => {
            // Skip small "Otros" categories in legend
            if (category.name === 'Otros' && category.amount < total * 0.1) {
                return null;
            }

            const formattedValue = Math.round(Number(category.amount)).toLocaleString('es-ES', {
                maximumFractionDigits: 0
            });

            const percentage = filteredChartData.length === 1 ||
                (filteredChartData.length === 2 && filteredChartData[1].name === 'Otros')
                ? 100
                : Math.round(category.amount / total * 100);

            let displayText;

            // If we have a count (for transactions), display that
            if (category.count !== undefined) {
                const txCount = category.name === 'Transferencia' ?
                    `${category.count} transfer${category.count === 1 ? '' : 's'}` :
                    `${category.count} transac${category.count === 1 ? 'ción' : 'ciones'}`;

                displayText = `${category.name}: ${txCount} (${percentage}%)`;
            } else {
                // Otherwise just display the amount
                displayText = `${category.name}: ${formattedValue} (${percentage}%)`;
            }

            return (
                <View key={index} style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: category.color }]} />
                    <Text style={styles.legendText}>
                        {displayText}
                    </Text>
                </View>
            );
        }).filter(item => item !== null);

        return (
            <View style={styles.chartContainer}>
                <Svg width={width} height={height}>
                    <G x="0" y="0">
                        {/* Background circles */}
                        <Circle
                            cx={centerX}
                            cy={centerY}
                            r={radius}
                            fill="transparent"
                            stroke="#E0E0E0"
                            strokeWidth={1}
                        />

                        {/* For a single category that's 100%, show a special full circle */}
                        {filteredChartData.length === 1 && filteredChartData[0].amount === total ? (
                            <Circle
                                cx={centerX}
                                cy={centerY}
                                r={(radius + innerRadius) / 2}
                                strokeWidth={strokeWidth}
                                stroke={filteredChartData[0].color}
                                fill="transparent"
                            />
                        ) : (
                            /* Draw arcs normally for multiple categories */
                            arcs.map((arc, index) => (
                                <Path
                                    key={index}
                                    d={arc.path}
                                    fill={arc.color}
                                    stroke="#FFFFFF"
                                    strokeWidth={2}
                                />
                            ))
                        )}

                        {/* Center hole */}
                        <Circle
                            cx={centerX}
                            cy={centerY}
                            r={innerRadius}
                            fill="white"
                            stroke="#F0F0F0"
                            strokeWidth={1}
                        />

                        {/* If we have just one category, add a text label */}
                        {chartData.length === 1 && (
                            <Circle
                                cx={centerX}
                                cy={centerY}
                                r={innerRadius - 10}
                                fill="#F8F8FF"
                            />
                        )}
                    </G>
                </Svg>

                <View style={styles.legendContainer}>
                    {legendItems}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            {renderDonutChart()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        shadowColor: '#642684',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 1,
        borderColor: 'rgba(100, 38, 132, 0.05)',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#151C2A',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#642684',
        marginBottom: 16,
        fontWeight: '500',
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 20,
    },
    legendContainer: {
        marginTop: 25,
        width: '100%',
        flexDirection: 'column',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
    },
    legendColor: {
        width: 18,
        height: 18,
        borderRadius: 9,
        marginRight: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
    },
    legendText: {
        fontSize: 14,
        color: '#151C2A',
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        marginVertical: 8,
    },
    emptyText: {
        color: '#757575',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default PieChartCard;
