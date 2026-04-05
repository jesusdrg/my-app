import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { IconSymbol } from './ui/IconSymbol';

export interface Activity {
    id?: number;
    hora: string;
    actividad: string;
    zona?: string;
    detalles?: string;
}

export interface ItineraryDayProps {
    day: number;
    activities: Activity[];
    onActivityPress?: (activity: Activity) => void;
}

export function ItineraryDay({ day, activities, onActivityPress }: ItineraryDayProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <View style={[styles.dayBadge, { backgroundColor: colors.tint }]}>
                    <ThemedText style={styles.dayText}>Día {day}</ThemedText>
                </View>
            </View>

            <View style={styles.timeline}>
                {activities.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.activityItem}
                        onPress={() => onActivityPress?.(item)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.timeColumn}>
                            <ThemedText style={styles.timeText}>{item.hora}</ThemedText>
                            {index < activities.length - 1 && <View style={[styles.verticalLine, { backgroundColor: colors.icon }]} />}
                        </View>

                        <View style={styles.contentColumn}>
                            <ThemedText type="defaultSemiBold" style={styles.activityTitle}>
                                {item.actividad}
                            </ThemedText>
                            {item.zona && (
                                <View style={styles.zonaRow}>
                                    <IconSymbol name="location.fill" size={12} color={colors.icon} />
                                    <ThemedText style={styles.zonaText}>{item.zona}</ThemedText>
                                </View>
                            )}
                            {item.detalles && (
                                <ThemedText style={styles.detallesText}>{item.detalles}</ThemedText>
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
        paddingHorizontal: 4,
    },
    header: {
        marginBottom: 16,
    },
    dayBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    dayText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    timeline: {
        paddingLeft: 4,
    },
    activityItem: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    timeColumn: {
        width: 60,
        alignItems: 'center',
    },
    timeText: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 4,
    },
    verticalLine: {
        width: 1,
        flex: 1,
        marginTop: 4,
        opacity: 0.3,
    },
    contentColumn: {
        flex: 1,
        paddingLeft: 12,
    },
    activityTitle: {
        fontSize: 16,
        marginBottom: 4,
    },
    zonaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 4,
    },
    zonaText: {
        fontSize: 12,
        opacity: 0.7,
    },
    detallesText: {
        fontSize: 14,
        opacity: 0.8,
        lineHeight: 20,
    },
});
