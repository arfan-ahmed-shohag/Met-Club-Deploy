import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface AudioContextValue {
  currentSrc: string | null;
  isPlaying: boolean;
  currentTime: number;
  play: (src: string) => void;
  pause: () => void;
  toggle: (src: string) => void;
  stop: () => void;
  isThisSrcPlaying: (src: string) => boolean;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const loadAndPlay = useCallback((src: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.ontimeupdate = null;
      audioRef.current.onended = null;
      audioRef.current.onpause = null;
      audioRef.current.onplay = null;
    }
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
    audio.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    audio.onpause = () => setIsPlaying(false);
    audio.onplay = () => setIsPlaying(true);
    setCurrentSrc(src);
    setCurrentTime(0);
    void audio.play();
  }, []);

  const play = useCallback(
    (src: string) => {
      if (currentSrc === src && audioRef.current) void audioRef.current.play();
      else loadAndPlay(src);
    },
    [currentSrc, loadAndPlay],
  );

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(
    (src: string) => {
      if (currentSrc === src && isPlaying) pause();
      else play(src);
    },
    [currentSrc, isPlaying, play, pause],
  );

  // ✅ stop reads directly from audioRef — never stale
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentSrc(null);
    setIsPlaying(false);
    setCurrentTime(0);
  }, []); // audioRef is a ref so no dep needed

  const isThisSrcPlaying = useCallback(
    (src: string) => {
      return currentSrc === src && isPlaying;
    },
    [currentSrc, isPlaying],
  );

  return (
    <AudioCtx.Provider
      value={{
        currentSrc,
        isPlaying,
        currentTime,
        play,
        pause,
        toggle,
        stop,
        isThisSrcPlaying,
      }}
    >
      {children}
    </AudioCtx.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used inside <AudioProvider>");
  return ctx;
}

/* ═══════════════════════════════════════════════════════
   useAudioSync
   
   Root cause of the bug:
   The old version captured `currentSrc` in the closure.
   When section changed, `currentSrc` was already the
   OLD value — so the condition `if (currentSrc)` was
   checking a stale snapshot and sometimes skipping stop().

   Fix: use a ref that always holds the latest stop().
   Cleanup never becomes stale this way.
═══════════════════════════════════════════════════════ */
// eslint-disable-next-line react-refresh/only-export-components
export function useAudioSync(key: string | number | null | undefined) {
  const { stop } = useAudio();

  // Ref always points to the freshest stop()
  const stopRef = useRef(stop);
  useEffect(() => {
    stopRef.current = stop;
  }, [stop]);

  useEffect(() => {
    return () => {
      // Runs when key changes — always calls the real, up-to-date stop
      stopRef.current();
    };
  }, [key]);
}
