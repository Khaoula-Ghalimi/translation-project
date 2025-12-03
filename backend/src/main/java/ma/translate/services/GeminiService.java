package ma.translate.services;

import java.util.List;

import com.google.genai.Client;
import com.google.genai.types.Blob;
import com.google.genai.types.Candidate;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;
import com.google.genai.types.PrebuiltVoiceConfig;
import com.google.genai.types.Schema;
import com.google.genai.types.SpeechConfig;
import com.google.genai.types.Type;
import com.google.genai.types.VoiceConfig;

import ma.translate.models.TranslationRequest;
import ma.translate.models.TranslationResponse;
import ma.translate.utils.AudioUtils;
import ma.translate.utils.EnvConfig;
import ma.translate.utils.SchemaExtractor;

public class GeminiService {

	private static final String API_KEY = "API_KEY";
	private Client client;

	public GeminiService() {
		String key = EnvConfig.get(API_KEY);
		client = Client.builder().apiKey(key).build();
	}

	public boolean isApiUp() {
		String simplePrompt = "Ping";
		try {
			// Attempt a call to the lightweight model.
			GenerateContentResponse response = client.models.generateContent("gemini-2.5-flash", simplePrompt, null);

			// If we receive a response without an exception, it confirms connectivity
			// and that the API key is accepted by the service.
			return response != null && response.candidates() != null && !response.candidates().isEmpty();

		} catch (Exception e) {
			// Catching a generic Exception to cover AuthenticationError, NetworkError, etc.
			System.err.println("ERROR: Gemini API health check failed. Key may be invalid or service unreachable.");
			System.err.println("Details: " + e.getMessage());
			return false;
		}
	}

	// first time for me to use generic functions
	private static <T> GenerateContentConfig generateSchemaConfig(Class<T> clazz) throws Exception {
		SchemaExtractor<T> schemaExtractor = new SchemaExtractor<>();

		Schema schema = Schema.builder().type(Type.Known.OBJECT).properties(schemaExtractor.extractSchema(clazz))
				.required(SchemaExtractor.extractRequiredFields(clazz)).build();

		GenerateContentConfig config = GenerateContentConfig.builder().responseMimeType("application/json")
				.responseSchema(schema).temperature(1f).build();

		return config;

	}

	public String translate(TranslationRequest request) {

		String prompt = String.format(
				"Detect the language of: '%s'. If it's not %s, use the detected language instead. Then translate it to %s. Return: translatedText, score, alternatives, and suggestedSourceLang.",
				request.getText(), request.getSourceLang(), request.getTargetLang());

		try {
			GenerateContentResponse response = client.models.generateContent("gemini-2.5-flash", prompt,
					GeminiService.generateSchemaConfig(TranslationResponse.class));

			return response.text();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return e.getMessage();
		}

	}
	
	
	//TODO : make this more readable 
	public byte[] textToSpeech(String text, String langCode) throws Exception {
		if (text == null || text.isBlank()) {
			throw new IllegalArgumentException("Text cannot be null or empty for TTS");
		}

		String voiceName = "Kore";
		int sampleRate = 24000;
		int channels = 1;

		GenerateContentConfig ttsConfig = GenerateContentConfig.builder().responseModalities(List.of("AUDIO"))
				.speechConfig(SpeechConfig.builder().voiceConfig(VoiceConfig.builder()
						.prebuiltVoiceConfig(PrebuiltVoiceConfig.builder().voiceName(voiceName).build()).build())
						.build())
				.build();

		GenerateContentResponse response = client.models.generateContent("gemini-2.5-pro-preview-tts", text,
				ttsConfig);

		List<Candidate> candidates = response.candidates().orElse(List.of());
		if (candidates.isEmpty()) {
			throw new IllegalStateException("No candidates in TTS response");
		}

		Content content = candidates.get(0).content()
				.orElseThrow(() -> new IllegalStateException("No content in first candidate"));

		Blob audioBlob = null;
		for (Part part : content.parts().orElse(List.of())) {
			var inlineOpt = part.inlineData();
			if (inlineOpt.isPresent()) {
				audioBlob = inlineOpt.get();
				break;
			}
		}

		if (audioBlob == null) {
			throw new IllegalStateException("No inline audio found in parts");
		}

		byte[] pcmBytes = audioBlob.data().orElseThrow(() -> new IllegalStateException("Audio blob data is empty"));

		// Convert raw LINEAR16 PCM → WAV bytes
		return AudioUtils.pcmToWav(pcmBytes, sampleRate, channels);
	}

}
