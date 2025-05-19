import { useState, useEffect, useRef } from "react";
import Alarm from '../assets/timer.mp3';
import Wrong from '../assets/wrong.mp3';

function CircularProgress({ secondsLeft, totalSeconds, className }) {
    const progress = totalSeconds === 0 ? 0 : Math.round((secondsLeft / totalSeconds) * 100);
    const dashOffset = 100 - progress;
    return <div className={`relative ${className ?? 'w-40 h-40'}`}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200 dark:text-neutral-700" strokeWidth="2" />
        <circle cx="18" cy="18" r="16" fill="none" strokeWidth="2" strokeLinecap="round" strokeDasharray="100" strokeDashoffset={dashOffset} className="stroke-current text-blue-600 dark:text-blue-500 transition-[stroke-dashoffset] duration-[900ms] ease-linear" />
      </svg>
      <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
        <span className="text-center font-bold text-blue-600 dark:text-blue-500 text-2xl md:text-3xl lg:text-4xl">{secondsLeft}</span>
      </div>
    </div>;
  }
  
export function InvalidInputAlert({ onDone }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const audioWrong = new Audio(Wrong);
        audioWrong.play();
        const timer = setTimeout(() => {
            setVisible(false);
            if (onDone) onDone();
        }, 1000);
        return () => clearTimeout(timer);
    }, [onDone]);

    if (!visible) return null;

    return (
        <div
            className="fixed left-1/2 bg-red-600 text-white px-4 py-2 rounded shadow-lg"
            style={{ top: "50vh", transform: "translate(-50%, -50%)", transition: "top 0.5s ease-out" }}
        >
            invalid input
        </div>
    );
}

export default function Timer() {
    const [count, setCount] = useState(0);
    const [showAlert, setShowAlert] = useState(false);
    const [timer, setTimer] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef(null);

    function clearTimerInterval() {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }

    function timerStart(startCount) {
        setTimer(startCount);
        setIsPaused(false);
        const audio = new Audio(Alarm);

        clearTimerInterval();

        intervalRef.current = setInterval(() => {
            setTimer(prev => {
                if (prev === null || prev <= 0) {
                    clearTimerInterval();
                    audio.play();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }

    function pauseTimer() {
        clearTimerInterval();
        setIsPaused(true);
    }

    function continueTimer() {
        if (timer === null || timer <= 0) return;
        setIsPaused(false);
        const audio = new Audio(Alarm);

        clearTimerInterval();

        intervalRef.current = setInterval(() => {
            setTimer(prev => {
                if (prev === null || prev <= 0) {
                    clearTimerInterval();
                    audio.play();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }

    function timerCheck() {
        if (count <= 0) {
            setShowAlert(true);
            return;
        }
        timerStart(count);
    }

    return <div className="relative h-screen w-full flex flex-col items-center justify-center px-4 md:px-10 lg:px-20">
    <div className="flex flex-col items-center space-y-6 md:space-y-8 lg:space-y-12 max-w-lg w-full">
      <CircularProgress secondsLeft={timer ?? 0} totalSeconds={count} className="w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72" />
      <div className="flex gap-4">
        <button onClick={isPaused ? continueTimer : pauseTimer} className={`px-4 py-2 rounded text-white transition-colors duration-300 ${isPaused ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-800 hover:bg-blue-900'}`} disabled={isPaused && (timer === null || timer <= 0)}>{isPaused ? 'Continue' : 'Pause'}</button>
        <button onClick={timerCheck} className="px-4 py-2 bg-blue-600 text-white rounded">Start</button>
      </div>
    </div>
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 flex w-fit max-w-xs justify-center bg-[#cdd6f4] shadow-lg shadow-black rounded-3xl border-2 border-[#313244] box-border">
      <button onClick={() => count > 0 && setCount(count - 1)} className="w-[90px] flex-grow font-xl font-bold">-</button>
      <p className="text-black mx-[50px] text-[45px] md:text-[60px] lg:text-[80px]">{count}</p>
      <button onClick={() => count < 7 && setCount(count + 1)} className="w-[90px] flex-grow font-xl font-bold">+</button>
    </div>
    {showAlert && <InvalidInputAlert onDone={() => setShowAlert(false)} />}
  </div>;
  
  
}
