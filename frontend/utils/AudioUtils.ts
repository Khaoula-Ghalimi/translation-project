

// Utility function to play audio from a Blob
export function playAudioBlob(blob: Blob | null) {
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);

    audio.play();
    audio.onended = () => {
        URL.revokeObjectURL(url);
    };
}