import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useUser } from '@clerk/clerk-expo';
import { UserService } from '@/lib/userService';

interface Question {
  id: number;
  question: string;
  subtitle: string;
  options: string[];
  multiSelect?: boolean;
  optional?: boolean;
  isTextInput?: boolean;
}

const questions: Question[] = [
  {
    id: 1,
    question: 'Que ciudades quieres visitar?',
    subtitle: 'Selecciona una o mas sedes del Mundial 2026 en Mexico',
    options: [
      'CDMX (Ciudad de Mexico)',
      'Guadalajara',
      'Monterrey',
      'Las tres ciudades',
    ],
    multiSelect: true,
  },
  {
    id: 2,
    question: 'Que tipo de experiencias te interesan?',
    subtitle: 'Selecciona todo lo que quieras hacer ademas de ver partidos',
    options: [
      'Partidos y fan zones',
      'Gastronomia local',
      'Cultura e historia',
      'Vida nocturna',
      'Compras y mercados',
      'Naturaleza y tours',
    ],
    multiSelect: true,
  },
  {
    id: 3,
    question: 'Cual es tu presupuesto diario?',
    subtitle: 'Esto nos ayuda a recomendar lugares adecuados a tu bolsillo',
    options: [
      'Economico (< $500 MXN/dia)',
      'Moderado ($500-1,500 MXN/dia)',
      'Premium ($1,500-3,000 MXN/dia)',
      'Sin limite (> $3,000 MXN/dia)',
    ],
  },
  {
    id: 4,
    question: 'Que tan importante es la seguridad para ti?',
    subtitle: 'Priorizaremos zonas segun tu preferencia',
    options: [
      'Maxima - Solo zonas muy seguras',
      'Importante - Balance seguridad y experiencia',
      'Basica - Estoy abierto a explorar',
    ],
  },
  {
    id: 5,
    question: 'Tipo de alojamiento preferido?',
    subtitle: 'Para recomendarte hoteles que se ajusten a tu estilo',
    options: [
      'Hostal / Mochilero',
      'Hotel 3-4 estrellas',
      'Boutique / 5 estrellas',
      'Ya tengo donde quedarme',
    ],
  },
  {
    id: 6,
    question: 'Algo especial que quieras hacer?',
    subtitle: 'Opcional - cuentanos tu deseo o experiencia ideal',
    options: [],
    isTextInput: true,
    optional: true,
  },
];

interface RecommendationsQuestionnaireProps {
  onComplete: (answers: {
    cities: string[];
    interests: string[];
    budgetTier: string;
    safetyPriority: string;
    accommodation: string;
    specialWish: string;
  }) => void;
}

export default function RecommendationsQuestionnaire({ onComplete }: RecommendationsQuestionnaireProps) {
  const { user } = useUser();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string | string[] }>({});
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [multiSelectAnswers, setMultiSelectAnswers] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const currentQ = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  const isAnswerValid = currentQ.optional
    ? true
    : currentQ.multiSelect
      ? multiSelectAnswers.length > 0
      : currentQ.isTextInput
        ? true
        : currentAnswer.trim() !== '';

  const handleMultiSelectToggle = (option: string) => {
    setMultiSelectAnswers(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleNext = async () => {
    let answerToSave: string | string[];

    if (currentQ.multiSelect) {
      answerToSave = [...multiSelectAnswers];
    } else if (currentQ.isTextInput) {
      answerToSave = currentAnswer;
    } else {
      answerToSave = currentAnswer;
    }

    const newAnswers = { ...answers, [currentQ.id]: answerToSave };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      const nextQ = questions[currentQuestion + 1];
      const existingAnswer = newAnswers[nextQ.id];
      if (nextQ.multiSelect && Array.isArray(existingAnswer)) {
        setMultiSelectAnswers(existingAnswer);
        setCurrentAnswer('');
      } else {
        setCurrentAnswer(typeof existingAnswer === 'string' ? existingAnswer : '');
        setMultiSelectAnswers([]);
      }
    } else {
      await saveAndComplete(newAnswers);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const prevQ = questions[currentQuestion - 1];
      const prevAnswer = answers[prevQ.id];
      if (prevQ.multiSelect && Array.isArray(prevAnswer)) {
        setMultiSelectAnswers(prevAnswer);
        setCurrentAnswer('');
      } else {
        setCurrentAnswer(typeof prevAnswer === 'string' ? prevAnswer : '');
        setMultiSelectAnswers([]);
      }
    }
  };

  const saveAndComplete = async (finalAnswers: { [key: number]: string | string[] }) => {
    setSaving(true);

    try {
      if (user) {
        const supabaseUser = await UserService.getUserByClerkId(user.id);
        if (supabaseUser) {
          const budgetMap: Record<string, string> = {
            'Economico (< $500 MXN/dia)': 'economico',
            'Moderado ($500-1,500 MXN/dia)': 'moderado',
            'Premium ($1,500-3,000 MXN/dia)': 'premium',
            'Sin limite (> $3,000 MXN/dia)': 'sin_limite',
          };

          const safetyMap: Record<string, string> = {
            'Maxima - Solo zonas muy seguras': 'Maxima',
            'Importante - Balance seguridad y experiencia': 'Importante',
            'Basica - Estoy abierto a explorar': 'Basica',
          };

          await UserService.saveMundialPreferences(supabaseUser.id, {
            cities: finalAnswers[1] as string[] || [],
            interests: finalAnswers[2] as string[] || [],
            budgetTier: budgetMap[finalAnswers[3] as string] || 'moderado',
            safetyPriority: safetyMap[finalAnswers[4] as string] || 'Importante',
            accommodation: finalAnswers[5] as string || '',
            specialWish: finalAnswers[6] as string || '',
          });
        }
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setSaving(false);
    }

    const budgetMap: Record<string, string> = {
      'Economico (< $500 MXN/dia)': 'economico',
      'Moderado ($500-1,500 MXN/dia)': 'moderado',
      'Premium ($1,500-3,000 MXN/dia)': 'premium',
      'Sin limite (> $3,000 MXN/dia)': 'sin_limite',
    };

    const safetyMap: Record<string, string> = {
      'Maxima - Solo zonas muy seguras': 'Maxima',
      'Importante - Balance seguridad y experiencia': 'Importante',
      'Basica - Estoy abierto a explorar': 'Basica',
    };

    onComplete({
      cities: finalAnswers[1] as string[] || [],
      interests: finalAnswers[2] as string[] || [],
      budgetTier: budgetMap[finalAnswers[3] as string] || 'moderado',
      safetyPriority: safetyMap[finalAnswers[4] as string] || 'Importante',
      accommodation: finalAnswers[5] as string || '',
      specialWish: finalAnswers[6] as string || '',
    });
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} disabled={currentQuestion === 0}>
          <IconSymbol
            name="chevron.left"
            size={24}
            color={currentQuestion === 0 ? '#E5E7EB' : '#374151'}
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.questionContainer} key={currentQuestion}>
          <Text style={styles.questionText}>{currentQ.question}</Text>
          <Text style={styles.subtitleText}>{currentQ.subtitle}</Text>
        </View>

        {currentQ.isTextInput ? (
          <TextInput
            style={styles.textInput}
            value={currentAnswer}
            onChangeText={setCurrentAnswer}
            placeholder="Ej: Quiero ver a mi seleccion en el Azteca..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
          />
        ) : (
          <View style={styles.optionsContainer}>
            {currentQ.options.map((option, index) => {
              const isSelected = currentQ.multiSelect
                ? multiSelectAnswers.includes(option)
                : currentAnswer === option;

              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
                  onPress={() => {
                    if (currentQ.multiSelect) {
                      handleMultiSelectToggle(option);
                    } else {
                      setCurrentAnswer(option);
                    }
                  }}
                >
                  {currentQ.multiSelect ? (
                    <View style={[styles.optionCheckbox, isSelected && styles.optionCheckboxSelected]}>
                      {isSelected && <IconSymbol name="checkmark" size={14} color="#FFFFFF" />}
                    </View>
                  ) : (
                    <View style={[styles.optionCircle, isSelected && styles.optionCircleSelected]}>
                      {isSelected && <View style={styles.optionCircleInner} />}
                    </View>
                  )}
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            isAnswerValid ? styles.continueButtonEnabled : styles.continueButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!isAnswerValid || saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={[styles.continueButtonText, isAnswerValid && styles.continueButtonTextEnabled]}>
                {isLastQuestion ? 'Ver Recomendaciones' : 'Continuar'}
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
    backgroundColor: '#000000',
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
  optionsContainer: {
    gap: 12,
    paddingBottom: 32,
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
    borderColor: '#000000',
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
    borderColor: '#000000',
  },
  optionCircleInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000000',
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
    borderColor: '#000000',
    backgroundColor: '#000000',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
    lineHeight: 22,
  },
  optionTextSelected: {
    fontWeight: '500',
    color: '#111827',
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
    minHeight: 100,
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
});
