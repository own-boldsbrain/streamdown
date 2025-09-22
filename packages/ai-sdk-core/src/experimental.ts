import type {
  ImageModelV1,
  SpeechModelV1,
  TranscriptionModelV1,
} from "./types.js";

// Experimental Image Generation
export type ExperimentalGenerateImageOptions = {
  model: ImageModelV1;
  prompt: string;
  n?: number;
  size?: string;
  aspectRatio?: string;
  seed?: number;
  providerOptions?: Record<string, unknown>;
  abortSignal?: AbortSignal;
};

export type ExperimentalGenerateImageResult = {
  images: Array<{
    url: string;
  }>;
};

/**
 * Generate images based on a given prompt using an image model.
 */
export async function experimental_generateImage(
  options: ExperimentalGenerateImageOptions
): Promise<ExperimentalGenerateImageResult> {
  const {
    model,
    prompt,
    n = 1,
    size,
    aspectRatio,
    seed,
    providerOptions,
    abortSignal,
  } = options;

  try {
    const response = await model.doGenerate({
      prompt,
      n,
      size,
      aspectRatio,
      seed,
      providerOptions,
      abortSignal,
    });

    return {
      images: response.images.map((img) => ({
        url: img.uri,
      })),
    };
  } catch (error) {
    throw new Error(`Image generation failed: ${error}`);
  }
}

// Experimental Speech Generation
export type ExperimentalGenerateSpeechOptions = {
  model: SpeechModelV1;
  input: string;
  voice?: string;
  speed?: number;
  providerOptions?: Record<string, unknown>;
  abortSignal?: AbortSignal;
};

export type ExperimentalGenerateSpeechResult = {
  speech: Uint8Array;
  mimeType: string;
};

/**
 * Generate speech audio from text.
 */
export async function experimental_generateSpeech(
  options: ExperimentalGenerateSpeechOptions
): Promise<ExperimentalGenerateSpeechResult> {
  const { model, input, voice, speed, providerOptions, abortSignal } = options;

  try {
    const response = await model.doGenerate({
      input,
      voice,
      speed,
      providerOptions,
      abortSignal,
    });

    return {
      speech: response.speech,
      mimeType: response.mimeType,
    };
  } catch (error) {
    throw new Error(`Speech generation failed: ${error}`);
  }
}

// Experimental Transcription
export type ExperimentalTranscribeOptions = {
  model: TranscriptionModelV1;
  audio: Uint8Array;
  mimeType: string;
  language?: string;
  prompt?: string;
  providerOptions?: Record<string, unknown>;
  abortSignal?: AbortSignal;
};

export type ExperimentalTranscribeResult = {
  text: string;
};

/**
 * Generate a transcript from an audio file.
 */
export async function experimental_transcribe(
  options: ExperimentalTranscribeOptions
): Promise<ExperimentalTranscribeResult> {
  const {
    model,
    audio,
    mimeType,
    language,
    prompt,
    providerOptions,
    abortSignal,
  } = options;

  try {
    const response = await model.doTranscribe({
      audio,
      mimeType,
      language,
      prompt,
      providerOptions,
      abortSignal,
    });

    return {
      text: response.text,
    };
  } catch (error) {
    throw new Error(`Transcription failed: ${error}`);
  }
}
