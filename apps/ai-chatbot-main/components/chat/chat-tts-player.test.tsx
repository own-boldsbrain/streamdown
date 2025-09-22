/**
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import ChatTTSPlayer from "./chat-tts-player";

test("renders ChatTTSPlayer", () => {
  render(
    <ChatTTSPlayer
      url="https://example.com/test.mp3"
      text="Este é um texto de teste para o player TTS."
      voiceName="Voz de Teste"
    />
  );
  
  // Verificar se os elementos principais estão presentes
  expect(screen.getByText("Voz de Teste")).toBeDefined();
  expect(screen.getByText("Este é um texto de teste para o player TTS.")).toBeDefined();
  expect(screen.getByText("00:00")).toBeDefined(); // Tempo inicial
});