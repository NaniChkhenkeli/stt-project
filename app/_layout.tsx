import React, { createContext, useContext, useRef, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';

// context 
interface RecordingCtx {
  isRecording:    boolean;
  recordingUri:   string | null;
  transcript:     string;
  elapsed:        number;
  startRecording: () => Promise<void>;
  stopRecording:  () => Promise<void>;
}

export const RecordingContext = createContext<RecordingCtx>({} as RecordingCtx);
export const useRecording = () => useContext(RecordingContext);

const MOCK_WORDS = `ტექნოლოგიები ყოველდღიურად იცვლება და ჩვენ მათთან ერთად ვვითარდებით. ზოგჯერ რთულია ახალი იდეების მიღება, განსაკუთრებით მაშინ, თუ მას სწრაფი ცვლილებები ახლავს თან. მიუხედავად ამისა, ვინც არ ცდილობს სწავლას, ის ვერ აღწევს წარმატებას. დღეს ძალიან მნიშვნელოვანია ახალი უნარების სწავლა, განსაკუთრებით ისეთ სფეროებში, როგორიცაა ტექნოლოგიები, რომლებიც სწრაფად ვითარდება. მათთან ერთად იზრდება პრაქტიკული ცოდნა და გამოცდილება — ეს არის წარმატების მთავარი ფორმულა. თანამედროვე სამყაროში განათლება მნიშვნელოვან როლს ასრულებს, რადგან ის გვაძლევს შესაძლებლობას განვვითარდეთ და მივაღწიოთ მიზნებს. მომხმარებელს შეუძლია გამოიყენოს სხვადასხვა რესურსი ცოდნის გასაღრმავებლად. მნიშვნელოვანია, შეძლოს საკუთარ თავსა და გარემოში ნაპოვნი პრობლემების გადაჭრა. სწორედ ამიტომ, აუცილებელია მუდმივი სწავლა და განვითარება.`.split(' ');

// provider
function RecordingProvider({ children }: { children: React.ReactNode }) {
  const [isRecording,  setIsRecording]  = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [transcript,   setTranscript]   = useState('');
  const [elapsed,      setElapsed]      = useState(0);

  const recRef     = useRef<Audio.Recording | null>(null);
  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const mockRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const wordIdx    = useRef(0);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recRef.current = recording;
      wordIdx.current = 0;

      setTranscript('');
      setRecordingUri(null);
      setElapsed(0);
      setIsRecording(true);

      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
      mockRef.current  = setInterval(() => {
        if (wordIdx.current >= MOCK_WORDS.length) wordIdx.current = 0;
        const w = MOCK_WORDS[wordIdx.current++];
        setTranscript(prev => prev ? prev + ' ' + w : w);
      }, 400);
    } catch (e) { console.error(e); }
  };

  const stopRecording = async () => {
    try {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      if (mockRef.current)  { clearInterval(mockRef.current);  mockRef.current  = null; }
      if (recRef.current) {
        await recRef.current.stopAndUnloadAsync();
        setRecordingUri(recRef.current.getURI() ?? null);
        recRef.current = null;
        await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      }
      setIsRecording(false);
    } catch (e) { console.error(e); }
  };

  return (
    <RecordingContext.Provider value={{
      isRecording, recordingUri, transcript, elapsed,
      startRecording, stopRecording,
    }}>
      {children}
    </RecordingContext.Provider>
  );
}

// root layout 
export default function RootLayout() {
  return (
    <RecordingProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="history" />
      </Stack>
    </RecordingProvider>
  );
}