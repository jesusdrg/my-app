import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, TextInput, ActivityIndicator, Alert, Keyboard } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useUser, useClerk } from '@clerk/clerk-expo';
import { UserService } from '@/lib/userService';

interface Question {
  id: number;
  question: string;
  subtitle: string;
  type: 'text' | 'multiple-choice';
  placeholder?: string;
  required?: boolean;
  options?: string[];
  multiSelect?: boolean;
}

const questions: Question[] = [
  {
    id: 1,
    question: '¿Cuál es tu nombre o apodo?',
    subtitle: 'Esto le dará un toque personal a tu experiencia',
    type: 'text',
    placeholder: 'Ej: María, Alex, Luna...',
    required: true
  },
  {
    id: 2,
    question: '¿De qué país nos visitas?',
    subtitle: 'Esto es crucial para idioma, recomendaciones culturales y conectar con compatriotas',
    type: 'text',
    placeholder: 'Ej: España, Argentina, Brasil...',
    required: true
  },
  {
    id: 3,
    question: '¿Cuántos días estarás en México?',
    subtitle: 'Define profundidad de recomendaciones y tipo de itinerarios',
    type: 'multiple-choice',
    required: true,
    options: [
      '3-5 días',
      '1 semana',
      '2 semanas',
      '3+ semanas',
      'Aún no lo sé'
    ]
  },
  {
    id: 4,
    question: '¿Con quién viajas?',
    subtitle: 'Personaliza tipo de actividades y alojamientos',
    type: 'multiple-choice',
    required: true,
    options: [
      'Solo',
      'Pareja',
      'Amigos',
      'Familia con niños',
      'Grupo grande'
    ]
  },
  {
    id: 5,
    question: '¿Qué te interesa además del fútbol?',
    subtitle: 'Opcional - puedes seleccionar una o más opciones',
    type: 'multiple-choice',
    required: false,
    multiSelect: true,
    options: [
      'Gastronomía',
      'Cultura e historia',
      'Vida nocturna',
      'Playas y naturaleza',
      'Compras',
      'Solo fútbol'
    ]
  },
  {
    id: 6,
    question: '¿Qué tipo de experiencias buscas?',
    subtitle: 'Tu estilo de viaje nos ayudará a personalizar tus recomendaciones',
    type: 'multiple-choice',
    required: true,
    options: [
      'Viajero económico / mochilero',
      'Comodidad a buen precio',
      'Experiencias premium',
      'Lo mejor sin límites'
    ]
  }
];

export default function CuestionarioScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string | Date }>({});
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [multiSelectAnswers, setMultiSelectAnswers] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(true);

  // Sincronizar usuario al iniciar (especialmente para OAuth)
  React.useEffect(() => {
    const syncUserOnMount = async () => {
      if (user) {
        setSyncing(true);
        const email = user.emailAddresses[0]?.emailAddress;
        const name = user.firstName || user.username || undefined;

        await UserService.syncClerkUser(user.id, email, name);
        setSyncing(false);
      } else {
        setSyncing(false);
      }
    };

    syncUserOnMount();
  }, [user]);

  const handleTextChange = (text: string) => {
    setCurrentAnswer(text);
  };

  const handleMultiSelectToggle = (option: string) => {
    setMultiSelectAnswers(prev => {
      if (prev.includes(option)) {
        return prev.filter(item => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const handleNext = () => {
    const currentQ = questions[currentQuestion];
    let answerToSave = currentAnswer;

    if (currentQ.multiSelect) {
      answerToSave = multiSelectAnswers.join(', ');
    }

    if (currentQ.required && answerToSave.trim() === '') {
      return; // No continuar si es requerida y está vacía
    }

    // Guardar la respuesta si no está vacía (incluso si es opcional)
    if (answerToSave.trim() !== '') {
      const newAnswers = {
        ...answers,
        [currentQ.id]: answerToSave
      };
      setAnswers(newAnswers);
    }

    // Continuar a la siguiente pregunta o completar
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentAnswer('');
      setMultiSelectAnswers([]);
    } else {
      handleComplete();
    }
  };

  const handleBack = async () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const previousQ = questions[currentQuestion - 1];
      const previousAnswer = answers[previousQ.id];

      if (previousQ.multiSelect && previousAnswer) {
        const answersArray = String(previousAnswer).split(', ').filter(a => a.trim() !== '');
        setMultiSelectAnswers(answersArray);
        setCurrentAnswer('');
      } else {
        setCurrentAnswer(previousAnswer ? String(previousAnswer) : '');
        setMultiSelectAnswers([]);
      }
    } else {
      Alert.alert(
        'Salir del onboarding',
        '¿Estás seguro que deseas salir? Deberás iniciar sesión nuevamente.',
        [
          {
            text: 'Cancelar',
            style: 'cancel'
          },
          {
            text: 'Salir',
            style: 'destructive',
            onPress: async () => {
              try {
                await signOut();
                router.replace('/');
              } catch (error) {
                console.error('Error al cerrar sesión:', error);
                router.replace('/');
              }
            }
          }
        ]
      );
    }
  };

  const handleComplete = async () => {
    if (!user) {
      console.error('No user found');
      router.replace('/(tabs)');
      return;
    }

    // IMPORTANTE: Guardar la ultima respuesta antes de completar
    const currentQ = questions[currentQuestion];
    let finalAnswers = { ...answers };

    if (currentQ.multiSelect) {
      if (multiSelectAnswers.length > 0) {
        finalAnswers[currentQ.id] = multiSelectAnswers.join(', ');
      }
    } else if (currentAnswer.trim() !== '') {
      finalAnswers[currentQ.id] = currentAnswer;
    }

    setSaving(true);

    try {
      // Obtener el usuario de Supabase con múltiples reintentos (el AuthGuard puede estar sincronizando)
      let supabaseUser = null;
      let retries = 0;
      const maxRetries = 6;

      while (!supabaseUser && retries < maxRetries) {
        supabaseUser = await UserService.getUserByClerkId(user.id);

        if (!supabaseUser) {
          retries++;
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }

      if (!supabaseUser) {
        Alert.alert(
          'Error de Sincronización',
          'No se pudo sincronizar tu usuario. Por favor cierra sesión y vuelve a iniciar.',
          [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
        );
        setSaving(false);
        return;
      }

      // Guardar las respuestas del cuestionario Mundial usando finalAnswers
      await UserService.saveOnboardingMundial(supabaseUser.id, finalAnswers);
    } catch (error) {
      console.error('Error in handleComplete:', error);
      Alert.alert(
        'Error',
        'Hubo un problema al guardar tu información. Por favor intenta nuevamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setSaving(false);
      router.replace('/(tabs)');
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  // Validación según el tipo de pregunta
  const isAnswerValid = currentQ.required
    ? (currentQ.multiSelect ? multiSelectAnswers.length > 0 : currentAnswer.trim() !== '')
    : true;

  const renderInputField = () => {
    switch (currentQ.type) {
      case 'multiple-choice':
        if (currentQ.multiSelect) {
          return (
            <View style={styles.optionsContainer}>
              {currentQ.options?.map((option, index) => {
                const isSelected = multiSelectAnswers.includes(option);
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionButton,
                      isSelected && styles.optionButtonSelected
                    ]}
                    onPress={() => handleMultiSelectToggle(option)}
                  >
                    <View style={[
                      styles.optionCheckbox,
                      isSelected && styles.optionCheckboxSelected
                    ]}>
                      {isSelected && (
                        <IconSymbol name="checkmark" size={14} color="#FFFFFF" />
                      )}
                    </View>
                    <Text style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        } else {
          return (
            <View style={styles.optionsContainer}>
              {currentQ.options?.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    currentAnswer === option && styles.optionButtonSelected
                  ]}
                  onPress={() => setCurrentAnswer(option)}
                >
                  <View style={[
                    styles.optionCircle,
                    currentAnswer === option && styles.optionCircleSelected
                  ]}>
                    {currentAnswer === option && (
                      <View style={styles.optionCircleInner} />
                    )}
                  </View>
                  <Text style={[
                    styles.optionText,
                    currentAnswer === option && styles.optionTextSelected
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          );
        }

      case 'text':
        return (
          <TextInput
            style={styles.textInput}
            value={currentAnswer}
            onChangeText={handleTextChange}
            placeholder={currentQ.placeholder}
            placeholderTextColor="#9CA3AF"
            returnKeyType="done"
            blurOnSubmit={true}
            onSubmitEditing={() => Keyboard.dismiss()}
          />
        );

      default:
        return null;
    }
  };

  if (syncing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={styles.loadingText}>Preparando tu experiencia...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <IconSymbol
            name="chevron.left"
            size={24}
            color="#374151"
          />
        </TouchableOpacity>
        <Text style={styles.progressText}>
          {currentQuestion + 1} de {questions.length}
        </Text>
        <View style={styles.spacer} />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQ.question}</Text>
          <Text style={styles.subtitleText}>{currentQ.subtitle}</Text>
        </View>

        <View style={styles.inputContainer}>
          {renderInputField()}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            isAnswerValid ? styles.continueButtonEnabled : styles.continueButtonDisabled
          ]}
          onPress={handleNext}
          disabled={!isAnswerValid || saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={[
                styles.continueButtonText,
                isAnswerValid && styles.continueButtonTextEnabled
              ]}>
                {isLastQuestion ? 'Completar' : 'Continuar'}
              </Text>
              {!isLastQuestion && (
                <IconSymbol
                  name="chevron.right"
                  size={16}
                  color={isAnswerValid ? '#FFFFFF' : '#9CA3AF'}
                />
              )}
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  spacer: {
    width: 24,
  },
  progressContainer: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  progressBackground: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#374151',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  questionContainer: {
    marginBottom: 32,
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    lineHeight: 32,
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  inputContainer: {
    gap: 16,
  },
  textInput: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#374151',
    textAlignVertical: 'top',
  },
  footer: {
    padding: 16,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  continueButtonEnabled: {
    backgroundColor: '#000000',
  },
  continueButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  continueButtonTextEnabled: {
    color: '#FFFFFF',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  optionButtonSelected: {
    borderColor: '#374151',
    backgroundColor: '#F9FAFB',
  },
  optionCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionCircleSelected: {
    borderColor: '#374151',
  },
  optionCircleInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#374151',
  },
  optionCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionCheckboxSelected: {
    borderColor: '#374151',
    backgroundColor: '#374151',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  optionTextSelected: {
    fontWeight: '500',
    color: '#111827',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
  },
});