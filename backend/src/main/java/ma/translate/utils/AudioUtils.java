package ma.translate.utils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;


//TODO : find a library that can convert pcm to wav
public class AudioUtils {

    public static byte[] pcmToWav(byte[] pcmData, int sampleRate, int channels) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            int byteRate = sampleRate * channels * 2; // 16-bit PCM
            int subChunk2Size = pcmData.length;
            int chunkSize = 36 + subChunk2Size;

            // RIFF header
            out.write("RIFF".getBytes(StandardCharsets.US_ASCII));
            out.write(intToLittleEndian(chunkSize));
            out.write("WAVE".getBytes(StandardCharsets.US_ASCII));

            // fmt subchunk
            out.write("fmt ".getBytes(StandardCharsets.US_ASCII));
            out.write(intToLittleEndian(16));                 // Subchunk1Size (16 for PCM)
            out.write(shortToLittleEndian((short) 1));        // AudioFormat (1 = PCM)
            out.write(shortToLittleEndian((short) channels)); // NumChannels
            out.write(intToLittleEndian(sampleRate));         // SampleRate
            out.write(intToLittleEndian(byteRate));           // ByteRate
            out.write(shortToLittleEndian((short) (channels * 2))); // BlockAlign
            out.write(shortToLittleEndian((short) 16));       // BitsPerSample

            // data subchunk
            out.write("data".getBytes(StandardCharsets.US_ASCII));
            out.write(intToLittleEndian(subChunk2Size));
            out.write(pcmData);

            return out.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Error building WAV header", e);
        }
    }

    private static byte[] intToLittleEndian(int value) {
        return new byte[] {
                (byte) (value & 0xff),
                (byte) ((value >> 8) & 0xff),
                (byte) ((value >> 16) & 0xff),
                (byte) ((value >> 24) & 0xff)
        };
    }

    private static byte[] shortToLittleEndian(short value) {
        return new byte[] {
                (byte) (value & 0xff),
                (byte) ((value >> 8) & 0xff)
        };
    }
}
