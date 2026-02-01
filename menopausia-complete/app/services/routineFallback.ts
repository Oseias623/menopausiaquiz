import {
  GeneratedRoutine,
  ProfileType,
  RoutineDuration,
  DailyRoutine
} from '../types/routine.types';

// Fallback routine templates if AI generation fails
export function getFallbackRoutine(
  profile: ProfileType,
  duration: RoutineDuration
): GeneratedRoutine {
  const baseRoutine: GeneratedRoutine = {
    id: `fallback_${Date.now()}`,
    profile,
    duration,
    generatedAt: new Date().toISOString(),
    routines: generateFallbackDays(profile, duration),
    metadata: {
      geminiModel: 'fallback',
      promptVersion: '1.0'
    }
  };

  return baseRoutine;
}

function generateFallbackDays(profile: ProfileType, duration: RoutineDuration): DailyRoutine[] {
  const days: DailyRoutine[] = [];

  for (let day = 1; day <= duration; day++) {
    const phase = day <= 7
      ? 'Fase 1: Reset Circadiano'
      : day <= 15
        ? 'Fase 2: Ativação Metabólica'
        : 'Fase 3: Vitalidade Total';

    const focusArea = getFocusAreaForDay(day, profile);
    const slots = getSlotsForPhase(day, profile);

    days.push({
      day,
      phase,
      date: '',
      focusArea,
      slots
    });
  }

  return days;
}

function getFocusAreaForDay(day: number, profile: ProfileType): string {
  const phaseNum = day <= 7 ? 1 : day <= 15 ? 2 : 3;

  const focusAreas = {
    'SINCRONIZACION': {
      1: [
        'Establecer exposición solar matutina',
        'Crear rutina de despertar',
        'Sincronizar ritmo circadiano',
        'Optimizar hidratación matutina',
        'Preparar ambiente de sueño',
        'Reducir luz azul nocturna',
        'Consistencia en horarios'
      ],
      2: [
        'Añadir proteína al desayuno',
        'Integrar movimiento matutino',
        'Fortalecer rutinas alimentarias',
        'Optimizar ventanas de comida',
        'Mejorar digestión nocturna',
        'Balance energético diario',
        'Estabilizar glucosa',
        'Consistencia metabólica'
      ],
      3: [
        'Potenciar energía vital',
        'Fuerza y resistencia',
        'Integrar fermentados',
        'Salud intestinal avanzada',
        'Vitalidad completa',
        'Balance hormonal',
        'Energía sostenible',
        'Renovación celular',
        'Bienestar integral',
        'Optimización total',
        'Transformación profunda',
        'Vitalidad plena',
        'Energía radiante',
        'Balance perfecto',
        'Salud óptima'
      ]
    },
    'DESINFLAMACION': {
      1: [
        'Reducir inflamación con luz',
        'Hidratación antiinflamatoria',
        'Sincronizar ciclo de sueño',
        'Preparar digestión nocturna',
        'Reducir estrés oxidativo',
        'Descanso reparador',
        'Balance del sistema'
      ],
      2: [
        'Proteínas antiinflamatorias',
        'Movimiento suave',
        'Alimentos que sanan',
        'Digestión óptima',
        'Reducir hinchazón',
        'Control de síntomas',
        'Balance inmune',
        'Bienestar digestivo'
      ],
      3: [
        'Microbiota saludable',
        'Intestino equilibrado',
        'Inflamación controlada',
        'Vitalidad sin dolor',
        'Bienestar profundo',
        'Sistema inmune fuerte',
        'Cuerpo regenerado',
        'Balance total',
        'Salud integral',
        'Renovación completa',
        'Bienestar duradero',
        'Cuerpo resiliente',
        'Inflamación vencida',
        'Energía plena',
        'Salud radiante'
      ]
    },
    'VITALIDAD': {
      1: [
        'Energizar con luz solar',
        'Activar metabolismo',
        'Despertar corporal',
        'Hidratación energizante',
        'Preparar cuerpo para acción',
        'Optimizar descanso',
        'Base de vitalidad'
      ],
      2: [
        'Proteína para fuerza',
        'Movimiento activador',
        'Construcción muscular',
        'Energía sostenida',
        'Metabolismo acelerado',
        'Fuerza creciente',
        'Resistencia mejorada',
        'Poder físico'
      ],
      3: [
        'Fuerza máxima',
        'Energía explosiva',
        'Vitalidad completa',
        'Poder intestinal',
        'Resistencia óptima',
        'Músculo tonificado',
        'Metabolismo alto',
        'Energía ilimitada',
        'Cuerpo fuerte',
        'Vitalidad radiante',
        'Poder total',
        'Fuerza interior',
        'Energía vital',
        'Transformación física',
        'Vitalidad suprema'
      ]
    }
  };

  const dayInPhase = phaseNum === 1 ? day - 1 : phaseNum === 2 ? day - 8 : day - 16;
  const availableFocusAreas = focusAreas[profile][phaseNum as 1 | 2 | 3];
  return availableFocusAreas[dayInPhase % availableFocusAreas.length];
}

function getSlotsForPhase(day: number, profile: ProfileType) {
  const phaseNum = day <= 7 ? 1 : day <= 15 ? 2 : 3;

  // Phase 1: Basic circadian rhythm (3 tasks well-spaced)
  const phase1Slots = [
    {
      time: '07:00',
      title: 'Luz Solar Matutina',
      description: 'Dentro de los primeros 30 minutos después de despertar, exponerte a la luz natural durante 10-15 minutos. Mira hacia la dirección del sol (incluso en días nublados) para activar tu ritmo circadiano.',
      category: 'morning' as const,
      estimatedMinutes: 15
    },
    {
      time: '13:00',
      title: 'Hidratación + Movimiento Suave',
      description: 'Bebe agua y realiza un breve paseo o estiramientos. Esto ayuda a mantener la energía durante la tarde y mejora la digestión.',
      category: 'midday' as const,
      estimatedMinutes: 10
    },
    {
      time: '20:00',
      title: 'Preparación para el Sueño',
      description: 'Reduce la exposición a luces brillantes y pantallas. Usa luz cálida y tenue. Prepara tu ambiente de descanso con temperatura fresca.',
      category: 'evening' as const,
      estimatedMinutes: 15
    }
  ];

  // Phase 2: Add metabolic activation (4 tasks)
  const phase2Slots = [
    {
      time: '07:00',
      title: 'Luz Solar + Hidratación',
      description: 'Exponerte a la luz natural y bebe agua tibia con limón. Combina estos dos hábitos fundamentales para activar tu cuerpo.',
      category: 'morning' as const,
      estimatedMinutes: 15
    },
    {
      time: '08:30',
      title: 'Desayuno con Proteína (25g+)',
      description: 'Incluye al menos 25g de proteína en tu desayuno: huevos, yogur griego, salmón, o un smoothie proteico. Esto ayuda a controlar el azúcar en sangre y mantener energía.',
      category: 'morning' as const,
      estimatedMinutes: 20
    },
    {
      time: '15:00',
      title: 'Movimiento: Fuerza o Caminata',
      description: 'Realiza 15 minutos de entrenamiento de fuerza (pesas ligeras, bandas de resistencia) o una caminata rápida. El movimiento mejora tu metabolismo y estado de ánimo.',
      category: 'afternoon' as const,
      estimatedMinutes: 15
    },
    {
      time: '20:00',
      title: 'Rutina Nocturna Anti-Inflamatoria',
      description: 'Reduce luces y pantallas. Prepara tu cuerpo para el descanso reparador que es fundamental para la regulación hormonal.',
      category: 'evening' as const,
      estimatedMinutes: 15
    }
  ];

  // Phase 3: Add gut health (4 tasks)
  const phase3Slots = [
    {
      time: '07:00',
      title: 'Ritual Matutino Completo',
      description: 'Luz solar natural, agua tibia con limón, y respiración profunda. Establece la base para un día de vitalidad.',
      category: 'morning' as const,
      estimatedMinutes: 20
    },
    {
      time: '08:30',
      title: 'Desayuno Rico en Proteína y Probióticos',
      description: 'Combina proteína (25g+) con alimentos fermentados como yogur natural o kefir. Esto nutre tu cuerpo y microbiota.',
      category: 'morning' as const,
      estimatedMinutes: 20
    },
    {
      time: '15:00',
      title: 'Actividad Física + Alimento Fermentado',
      description: 'Realiza tu sesión de movimiento y luego consume un alimento fermentado (kimchi, chucrut, kombucha) para salud intestinal.',
      category: 'afternoon' as const,
      estimatedMinutes: 20
    },
    {
      time: '20:00',
      title: 'Preparación Óptima para Descanso',
      description: 'Ambiente oscuro, temperatura fresca, sin pantallas. Prepara tu cuerpo para el sueño profundo que regenera y balancea hormonas.',
      category: 'evening' as const,
      estimatedMinutes: 15
    }
  ];

  // Return slots based on phase
  if (phaseNum === 1) return phase1Slots;
  if (phaseNum === 2) return phase2Slots;
  return phase3Slots;
}
