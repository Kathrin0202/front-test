import { MouseEvent, useEffect, useRef, useState } from "react";
import { Play } from "../../assets/play";
import { Download } from "../../assets/download";
import { Close } from "../../assets/Close";
import { getRecord } from "../../api";
import './PlayingAudio.css'
import { Pause } from "../../assets/pause";

interface Call {
    record: number;
    partnership_id: string | number;
    id: string | number;
}

interface PlayingAudioProps {
    call: Call;
    time: string;
}

export const PlayingAudio = ({call, time}: PlayingAudioProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handlePlayAudio = async (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (!audioUrl) {
            const url = await getRecord(call.record, call.partnership_id);
            if (url) {
                setAudioUrl(url);
                setIsPlaying(true);
            }
        } else {
            setIsPlaying((prev) => !prev);
        }
    };

    const handleDownland = async (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (audioUrl) {
            const link = document.createElement('a');
            link.href = audioUrl;
            link.download = `${call.id}.mp3`;
            link.click();
        }
    };

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
    };


    return (
        <div className='playDurationItem'>
            <p className="playDurationTime">{time}</p>
            <button className='playDurationItemBtn' onClick={(event)=>handlePlayAudio(event)}>
                {isPlaying ? <Play/> : <Pause/>}
            </button>
            <div className="playProgressBar">
                <div className="playProgress" style={{ width: `${progress}%` }}></div>
            </div>
            <button className="playDownload" onClick={(event)=>handleDownland(event)}>
                <Download/>
            </button>
            <button className="playClose">
                <Close width='14' height='14' color='#ADBFDF'/>
            </button>
            {audioUrl && isPlaying && (
               <audio ref={audioRef}
               onTimeUpdate={handleTimeUpdate}
               src={audioUrl}></audio>
            )}
        </div>
    );
};