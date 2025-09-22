// Este arquivo aplica os estilos Yello Solar Hub a componentes específicos

'use client';

import { useEffect } from 'react';

export default function YelloSolarStyleApplier() {
  useEffect(() => {
    // Aplica estilos às bordas de cards
    const cards = document.querySelectorAll('.card, [class*="card-"]');
    for (const card of cards) {
      card.classList.add('yello-card');
    }

    // Aplica estilos aos botões primários
    const primaryButtons = document.querySelectorAll('.btn-primary, button[class*="primary"]');
    for (const button of primaryButtons) {
      button.classList.add('yello-button');
    }

    // Aplica bordas a elementos de entrada
    const inputs = document.querySelectorAll('input, textarea, select');
    for (const input of inputs) {
      input.classList.add('yello-border');
    }

    return () => {
      // Cleanup se necessário
    };
  }, []);

  return null; // Componente não renderiza nada visualmente
}