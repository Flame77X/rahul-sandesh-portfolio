import { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import { Volume2, VolumeX } from 'lucide-react';

const AudioController = () => {
    const [isMuted, setIsMuted] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const droneRef = useRef<Tone.Player | null>(null);
    const synthRef = useRef<Tone.PolySynth | null>(null);

    const initAudio = async () => {
        if (isInitialized) return;

        await Tone.start();
        console.log("Audio Context Started");

        // Ambient Drone (using simple oscillator for lightweight drone)
        const drone = new Tone.Oscillator(55, "sine").toDestination();
        drone.volume.value = -20; // Subtle

        // Tremolo for texture
        // Tremolo for texture
        // const tremolo = new Tone.Tremolo(0.5, 0.5).toDestination().start();
        // drone.connect(tremolo); // Disabling drone to prevent annoyance

        // Interaction Synth (for hover/clicks)
        const synth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "triangle" },
            envelope: { attack: 0.05, decay: 0.1, sustain: 0.1, release: 0.5 }
        }).toDestination();
        synth.volume.value = -12;

        droneRef.current = drone as any;
        synthRef.current = synth;

        setIsInitialized(true);
        setIsMuted(false);
        // drone.start(); // Disabled drone
    };

    const toggleMute = () => {
        if (!isInitialized) {
            initAudio();
            return;
        }

        if (isMuted) {
            Tone.Destination.mute = false;
            setIsMuted(false);
        } else {
            Tone.Destination.mute = true;
            setIsMuted(true);
        }
    };

    useEffect(() => {
        const handleHover = (e: MouseEvent) => {
            if (isMuted || !isInitialized) return;
            const target = e.target as HTMLElement;
            if (target.tagName === 'A' || target.tagName === 'BUTTON') {
                // Play random pentatonic note
                const notes = ["C5", "D5", "E5", "G5", "A5"];
                const note = notes[Math.floor(Math.random() * notes.length)];
                synthRef.current?.triggerAttackRelease(note, "32n");
            }
        };

        const handleClick = () => {
            if (isMuted || !isInitialized) return;
            synthRef.current?.triggerAttackRelease("C3", "16n");
        }

        window.addEventListener('mouseover', handleHover);
        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('mouseover', handleHover);
            window.removeEventListener('click', handleClick);
            droneRef.current?.stop();
        };
    }, [isMuted, isInitialized]);

    return (
        <button
            onClick={toggleMute}
            className="fixed bottom-8 left-8 z-[100] p-3 rounded-full bg-ink-1/80 border border-ink-4 text-ink-7 hover:text-ink-9 hover:border-accent-border transition-colors backdrop-blur-md"
        >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
    );
};

export default AudioController;
