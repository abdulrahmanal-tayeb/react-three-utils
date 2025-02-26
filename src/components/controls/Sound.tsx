import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AudioListener } from "three";
import { Audio, AudioLoader } from "three";


/**
 * Controls a sound in an easy and abstract way.
 * 
 * Just pass in your sound path and control it with functions in the way
 * you wish.
 * 
 * @param src The path to the audio file.
 * @param [initialVolume=1] The initial volume of the audio file (default `1`)
 */
export function useSound(src: string, initialVolume: number = 1) {
    // A single listener to be used for all Audio instances.
    const listenerRef = useRef(new AudioListener());
    // Store the loaded AudioBuffer so we can reuse it.
    const bufferRef = useRef<AudioBuffer | null>(null);
    // Keep track of all active sound instances.
    const activeSoundsRef = useRef<Audio[]>([]);

    const [soundsEnabled, setSoundsEnabled] = useState(true);
    const [isReady, setIsReady] = useState(false);
    const [duration, setDuration] = useState(0);

    // Use a ref to store the default volume so new instances use it.
    const volumeRef = useRef(initialVolume);


    useEffect(() => {
        const loader = new AudioLoader();
        loader.load(
            src,
            (buffer) => {
                bufferRef.current = buffer;
                setDuration(buffer.duration);
                setIsReady(true);
            },
            undefined,
            (error) => {
                console.error("Error loading sound:", error);
            }
        );

        // On unmount, stop all active sounds.
        return () => {
            stop();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src]);



    /**
     * Plays an instance of the specified sound.
     */
    const play = useCallback(() => {
        if (!soundsEnabled || !bufferRef.current) return;

        // Create a new Audio instance for this play call.
        const sound = new Audio(listenerRef.current);
        sound.setBuffer(bufferRef.current);
        sound.setVolume(volumeRef.current);

        // When the sound ends, remove it from our active list.
        sound.onEnded = () => {
            activeSoundsRef.current = activeSoundsRef.current.filter(s => s !== sound);
        };

        activeSoundsRef.current.push(sound);
        sound.play();
    }, []);



    /**
     * Pauses all instances of the specified sound.
     */
    const pause = useCallback(() => {
        // Pause all active sound instances.
        activeSoundsRef.current.forEach((sound) => {
            if (sound.isPlaying) {
                sound.pause();
            }
        });
    }, []);



    /**
     * Stops all instances of the specified sound and dispose them.
     */
    const stop = useCallback(() => {
        // Stop and clear all active sound instances.
        activeSoundsRef.current.forEach((sound) => {
            sound.stop();
        });
        activeSoundsRef.current = [];
    }, []);



    /**
     * Pauses all instances if any is found to be playing, if not, plays a new instance.
     */
    const toggle = useCallback(() => {
        // If any sound is playing, pause all; otherwise, play a new instance.
        const anyPlaying = activeSoundsRef.current.some((sound) => sound.isPlaying);
        if (anyPlaying) {
            pause();
        } else {
            play();
        }
    }, []);



    /**
     * Resets all sounds and plays a new one.
     */
    const reset = useCallback(() => {
        stop();
        play();
    }, []);


    /**
     * Fades a sound in to the target volume.
     */
    const fade = useCallback((targetVolume: number, fadeDuration: number = 1000) => {
        // Fade all active sounds.
        activeSoundsRef.current.forEach((sound) => {
            const startVolume = sound.getVolume();
            const startTime = Date.now();

            const updateVolume = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / fadeDuration, 1);
                const currentVolume = startVolume + (targetVolume - startVolume) * progress;
                sound.setVolume(currentVolume);

                if (progress < 1) {
                    requestAnimationFrame(updateVolume);
                }
            };

            updateVolume();
        });
    }, []);


    /**
     * Whether an audio instance should loop or not. **This is applied to each sound instance individually**.
     * @default false
     */
    const setLoop = useCallback((loop: boolean) => {
        // Apply looping to all active instances.
        activeSoundsRef.current.forEach((sound) => {
            sound.setLoop(loop);
        });
    }, []);


    /**
     * Sets the play back rate of a sound instance.
     */
    const setPlaybackRate = useCallback((rate: number) => {
        // Apply the playback rate to all active instances.
        activeSoundsRef.current.forEach((sound) => {
            sound.playbackRate = rate;
        });
    }, []);


    /**
     * Controls the volume of all sound instances.
     */
    const setVolume = useCallback((newVolume: number) => {
        volumeRef.current = newVolume;
        // Update volume for any active sounds.
        activeSoundsRef.current.forEach((sound) => {
            sound.setVolume(newVolume);
        });
    }, []);


    /**
     * For currentTime, we use the first active sound's context time if available.
     */
    const currentTime = useMemo(() => (activeSoundsRef.current[0]?.context.currentTime || 0), []);


    /**
     * Toggle the sounds externally.
     * 
     * **This function should be called to enable the sounds on a user's action, otherwise the browser
     * will block any attempt to play any sound.**
     */
    const soundEnabled = useCallback((enabled: boolean) => {
        setSoundsEnabled(enabled);
    }, []);


    return {
        /**
         * Plays an instance of the sound.
         */
        play,

        /**
         * Pauses all instances of the sound.
         */
        pause,


        /**
         * Stops all instances of the sound.
         */
        stop,


        /**
         * Pauses all instances of a sound if one is found to be active,
         * plays another instance otherwise.
         */
        toggle,


        /**
         * Resets all instances of a sound.
         */
        reset,


        /**
         * Fades the volume of the sound.
         */
        fade,


        /**
         * Enables the sounds. **This should be called on a user's action, otherwise the
         * broswer will block the sound from playing.**
         */
        soundEnabled,


        /**
         * Controls the volume of all instances.
         */
        setVolume,


        /**
         * Sets whether the instances should loop.
         */
        setLoop,


        /**
         * Sets the playback speed of the instances.
         */
        setPlaybackRate,


        /**
         * Whether the audio is loaded and ready to be played.
         */
        isReady,


        /**
         * The duration of one audio instance.
         */
        duration,


        /**
         * The current time of the audio.
         */
        currentTime,
    };
}