
import { Product, PlanTier, Chapter } from './types';
import React from 'react';
import { BookOpen, Headphones, Lock, Crown, Zap, Shield, Heart, FileText, PlayCircle } from 'lucide-react';

export const DEFAULT_COVER_IMAGE = "/cover-menopausa.png";

export const PRODUCTS: Product[] = [
  // --- MÓDULO PRINCIPAL ---
  {
    id: 'prog-antiinflamatorio',
    title: 'Programa Antiinflamatorio',
    subtitle: 'Mapa Estratégico',
    category: 'MAIN',
    tier: PlanTier.BASIC,
    description: 'Recupera tu energía y bienestar. Una guía práctica de nutrición antiinflamatoria, ritmo circadiano y hábitos para aliviar el insomnio y la fatiga.',
    imageUrl: '/cover-menopausa.png',
    pdfUrl: 'https://pmscpydblddkwbgkzdmw.supabase.co/storage/v1/object/public/content/programa-antiinflamatorio.pdf',
    audioUrl: '#',
    hotmartId: '6887519'
  },
  // --- BONUS (Agora como MAIN para ficar ao lado) ---
  {
    id: 'bonus-recetas',
    title: 'Banco de Recetas',
    subtitle: 'Rápidas y Nutritivas',
    category: 'MAIN',
    tier: PlanTier.BASIC,
    description: 'Opciones ricas en proteínas y fibras (pudines de chia, tostadas) diseñadas para activar tu metabolismo sin dietas restrictivas.',
    imageUrl: '/cover-recetas.png',
    pdfUrl: 'https://pmscpydblddkwbgkzdmw.supabase.co/storage/v1/object/public/content/recetas-menopausia.pdf',
    audioUrl: '#'
  },
  {
    id: 'bonus-recetas-2',
    title: 'Banco de Recetas (Parte 2)',
    subtitle: 'Nuevas Opciones',
    category: 'MAIN',
    tier: PlanTier.BASIC,
    description: 'Más recetas deliciosas y antiinflamatorias para complementar tu nutrición.',
    imageUrl: '/cover-recetas.png',
    pdfUrl: '/recetas-menopausia-parte2.pdf',
    audioUrl: '#'
  },
  // --- REAL BONUSES ---
  {
    id: 'bonus-enemigos',
    title: 'Los 7 Enemigos',
    subtitle: 'De la Menopausia',
    category: 'BONUS',
    tier: PlanTier.BASIC, // Bônus liberado para todos
    description: 'Descubre qué alimentos e hábitos están saboteando tu equilibrio hormonal.',
    imageUrl: '/cover-enemigos.png',
    pdfUrl: 'https://pmscpydblddkwbgkzdmw.supabase.co/storage/v1/object/public/content/bonus-enemigos.pdf',
    audioUrl: '#'
  },
  {
    id: 'bonus-nutrientes',
    title: 'Nutrientes Clave',
    subtitle: 'Suplementación Natural',
    category: 'BONUS',
    tier: PlanTier.BASIC,
    description: 'Guía esencial de vitaminas e minerales que tu cuerpo necesita en esta etapa.',
    imageUrl: '/cover-nutrientes.png',
    pdfUrl: 'https://pmscpydblddkwbgkzdmw.supabase.co/storage/v1/object/public/content/bonus-nutrientes.pdf',
    audioUrl: '#'
  },
  {
    id: 'bonus-ritmo',
    title: 'Reset Ritmo',
    subtitle: 'Circadiano',
    category: 'BONUS',
    tier: PlanTier.BASIC,
    description: 'Sincroniza tu reloj biológico para dormir mejor y tener más energía.',
    imageUrl: '/cover-ritmo.png',
    pdfUrl: 'https://pmscpydblddkwbgkzdmw.supabase.co/storage/v1/object/public/content/bonus-ritmo.pdf',
    audioUrl: '#'
  },
  {
    id: 'bonus-fuerza',
    title: 'Rutinas de Fuerza',
    subtitle: '15 Minutos en Casa',
    category: 'BONUS',
    tier: PlanTier.BASIC,
    description: 'Ejercicios simples y efectivos para fortalecer huesos y músculos.',
    imageUrl: '/cover-fuerza.png',
    pdfUrl: 'https://pmscpydblddkwbgkzdmw.supabase.co/storage/v1/object/public/content/bonus-fuerza.pdf',
    audioUrl: '#'
  },

  // --- UPSELLS (Paid Add-ons / Order Bumps) ---
  {
    id: 'bump-snacks',
    title: 'Snacks Anti-Ansiedad',
    subtitle: 'Comer sin Culpa',
    category: 'UPSELL',
    tier: PlanTier.PREMIUM,
    description: 'Opciones deliciosas para calmar la ansiedad por comer.',
    imageUrl: '/cover-snacks.png',
    pdfUrl: 'https://pmscpydblddkwbgkzdmw.supabase.co/storage/v1/object/public/content/snacks-ansiedad.pdf',
    audioUrl: '#',
    price: 3.90,
    hotmartId: '6888461',
    checkoutUrl: 'https://pay.hotmart.com/F103599466V'
  },
  {
    id: 'bump-cenas',
    title: 'Cenas para Dormir Mejor',
    subtitle: 'Nutrición Nocturna',
    category: 'UPSELL',
    tier: PlanTier.PREMIUM,
    description: 'Recetas ligeras que favorecen un sueño reparador.',
    imageUrl: '/cover-cenas.png',
    pdfUrl: 'https://pmscpydblddkwbgkzdmw.supabase.co/storage/v1/object/public/content/cenas-dormir.pdf',
    audioUrl: '#',
    price: 3.90,
    hotmartId: '6888109', // Cenas para Dormir mejor
    checkoutUrl: 'https://pay.hotmart.com/W103598657O'
  },
  {
    id: 'bump-plan7',
    title: 'Plan de 7 Días',
    subtitle: 'Detox Antiinflamatorio',
    category: 'UPSELL',
    tier: PlanTier.PREMIUM,
    description: 'Un plan semanal completo para reiniciar tu organismo.',
    imageUrl: '/cover-plan7.png',
    pdfUrl: 'https://pmscpydblddkwbgkzdmw.supabase.co/storage/v1/object/public/content/plan-7-dias.pdf',
    audioUrl: '#',
    price: 3.90,
    hotmartId: '6888217',
    checkoutUrl: 'https://pay.hotmart.com/Y103598873Q'
  },
  {
    id: 'bump-lista',
    title: 'Lista de Compras',
    subtitle: 'Básicos Esenciales',
    category: 'UPSELL',
    tier: PlanTier.PREMIUM,
    description: 'La lista definitiva para tu supermercado antiinflamatorio.',
    imageUrl: '/cover-lista.png',
    pdfUrl: 'https://pmscpydblddkwbgkzdmw.supabase.co/storage/v1/object/public/content/lista-compras.pdf',
    audioUrl: '#',
    price: 3.90,
    hotmartId: '6888446',
    checkoutUrl: 'https://pay.hotmart.com/S103599430A'
  },
  {
    id: 'bump-rapidas',
    title: 'Recetas Rápidas',
    subtitle: 'Cocina en 15 Min',
    category: 'UPSELL',
    tier: PlanTier.PREMIUM,
    description: 'Platos nutritivos para días ocupados.',
    imageUrl: '/cover-rapidas.png',
    pdfUrl: 'https://pmscpydblddkwbgkzdmw.supabase.co/storage/v1/object/public/content/recetas-rapidas.pdf',
    audioUrl: '#',
    price: 3.90,
    hotmartId: '6888416',
    checkoutUrl: 'https://pay.hotmart.com/P103599384B'
  }
];

// Empty chapters for now
export const MOCK_CHAPTERS: Chapter[] = [];

export const ICONS_MAP: Record<string, React.ReactNode> = {
  PDF: <FileText className="w-4 h-4" />,
  AUDIO: <Headphones className="w-4 h-4" />,
  LOCK: <Lock className="w-6 h-6" />,
  PLAY: <PlayCircle className="w-5 h-5" />
};
