import { IconSymbol } from '@/components/ui/IconSymbol';
import { AstralProfile, AstralQuestionnaireResponse, UserService } from '@/lib/userService';
import { useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function AstralProfileScreen() {
    const { user } = useUser();
    const [loading, setLoading] = useState(true);
    const [questionnaire, setQuestionnaire] = useState<AstralQuestionnaireResponse | null>(null);
    const [astralProfile, setAstralProfile] = useState<AstralProfile | null>(null);

    useEffect(() => {
        loadData();
    }, [user]);

    const loadData = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const dbUser = await UserService.getUserByClerkId(user.id);

            if (dbUser) {
                const [questData, profileData] = await Promise.all([
                    UserService.getAstralQuestionnaire(dbUser.id),
                    UserService.getAstralProfile(dbUser.id)
                ]);

                setQuestionnaire(questData);
                setAstralProfile(profileData);
            }
        } catch (error) {
            console.error('Error loading astral data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'No especificada';
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString?: string) => {
        if (!timeString) return 'No especificada';
        // Asumiendo formato HH:MM:SS o similar
        return timeString.substring(0, 5);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000000" />
                <Text style={styles.loadingText}>Cargando tu perfil astral...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <IconSymbol name="chevron.left" size={28} color="#000000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Perfil Astrológico</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Sección 1: Datos del Cuestionario */}
                <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <IconSymbol name="person.text.rectangle.fill" size={20} color="#4F46E5" />
                        <Text style={styles.sectionTitle}>Mis Datos</Text>
                    </View>

                    <View style={styles.card}>
                        <View style={styles.dataRow}>
                            <Text style={styles.label}>Nombre / Apodo</Text>
                            <Text style={styles.value}>{questionnaire?.name || 'No especificado'}</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.dataRow}>
                            <Text style={styles.label}>Fecha de Nacimiento</Text>
                            <Text style={styles.value}>{formatDate(questionnaire?.birth_date)}</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.dataRow}>
                            <Text style={styles.label}>Hora de Nacimiento</Text>
                            <Text style={styles.value}>{formatTime(questionnaire?.birth_time)}</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.dataRow}>
                            <Text style={styles.label}>Lugar de Nacimiento</Text>
                            <Text style={styles.value}>{questionnaire?.birth_location || 'No especificado'}</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Sección 2: Preferencias de Viaje */}
                <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <IconSymbol name="airplane" size={20} color="#0EA5E9" />
                        <Text style={styles.sectionTitle}>Preferencias de Viaje</Text>
                    </View>

                    <View style={styles.card}>
                        <View style={styles.preferenceItem}>
                            <Text style={styles.preferenceLabel}>Busco experiencias de:</Text>
                            <Text style={styles.preferenceValue}>{questionnaire?.travel_experiences || 'No especificado'}</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.preferenceItem}>
                            <Text style={styles.preferenceLabel}>Quiero transformar:</Text>
                            <Text style={styles.preferenceValue}>{questionnaire?.travel_motivation || 'No especificado'}</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Sección 3: Carta Astral (Si existe) */}
                {astralProfile && (
                    <Animated.View entering={FadeInDown.duration(500).delay(300)} style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <IconSymbol name="sparkles" size={20} color="#8B5CF6" />
                            <Text style={styles.sectionTitle}>Mi Carta Astral</Text>
                        </View>

                        <View style={styles.signsContainer}>
                            <View style={styles.signCard}>
                                <Text style={styles.signLabel}>Sol</Text>
                                <Text style={styles.signValue}>{astralProfile.sun_sign || '?'}</Text>
                            </View>
                            <View style={styles.signCard}>
                                <Text style={styles.signLabel}>Luna</Text>
                                <Text style={styles.signValue}>{astralProfile.moon_sign || '?'}</Text>
                            </View>
                            <View style={styles.signCard}>
                                <Text style={styles.signLabel}>Ascendente</Text>
                                <Text style={styles.signValue}>{astralProfile.rising_sign || '?'}</Text>
                            </View>
                        </View>

                        {astralProfile.profile_summary && (
                            <View style={styles.card}>
                                <Text style={styles.cardTitle}>Resumen</Text>
                                <Text style={styles.summaryText}>{astralProfile.profile_summary}</Text>
                            </View>
                        )}

                        {astralProfile.full_profile && (
                            <View style={[styles.card, styles.markdownCard]}>
                                <Text style={styles.cardTitle}>Análisis Completo</Text>
                                <Markdown style={markdownStyles}>
                                    {astralProfile.full_profile}
                                </Markdown>
                            </View>
                        )}
                    </Animated.View>
                )}

                {!astralProfile && !loading && (
                    <Animated.View entering={FadeInDown.duration(500).delay(300)} style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>
                            Aún no se ha generado tu perfil astral completo. Asegúrate de haber completado todos los datos de nacimiento.
                        </Text>
                    </Animated.View>
                )}

                <View style={styles.footer} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#6B7280',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    dataRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    label: {
        fontSize: 15,
        color: '#6B7280',
    },
    value: {
        fontSize: 15,
        fontWeight: '500',
        color: '#111827',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 12,
    },
    preferenceItem: {
        gap: 4,
    },
    preferenceLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    preferenceValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#111827',
    },
    signsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    signCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    signLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    signValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4F46E5',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 12,
    },
    summaryText: {
        fontSize: 15,
        color: '#4B5563',
        lineHeight: 24,
    },
    markdownCard: {
        marginTop: 16,
    },
    emptyState: {
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyStateText: {
        textAlign: 'center',
        color: '#6B7280',
        fontSize: 15,
    },
    footer: {
        height: 40,
    },
});

const markdownStyles = {
    body: {
        fontSize: 15,
        color: '#374151',
        lineHeight: 24,
    },
    heading1: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginTop: 16,
        marginBottom: 8,
    },
    heading2: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginTop: 12,
        marginBottom: 8,
    },
    paragraph: {
        marginBottom: 12,
    },
    list_item: {
        marginBottom: 6,
    },
};
