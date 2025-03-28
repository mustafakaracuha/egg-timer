import React, { useState, useEffect } from "react";
import * as Tone from "tone";

const eggSizeInfo = {
    S: { weight: "50g", description: "Küçük Boy" },
    M: { weight: "60g", description: "Orta Boy" },
    L: { weight: "70g", description: "Büyük Boy" },
    XL: { weight: "80g", description: "Çok Büyük Boy" },
};

const eggCookingTimes = {
    S: {
        "Az Pişmiş": 2,
        Kayısı: 3,
        Rafadan: 5,
        "Tam Pişmiş": 10,
    },
    M: {
        "Az Pişmiş": 3,
        Kayısı: 4,
        Rafadan: 6,
        "Tam Pişmiş": 12,
    },
    L: {
        "Az Pişmiş": 4,
        Kayısı: 5,
        Rafadan: 7,
        "Tam Pişmiş": 14,
    },
    XL: {
        "Az Pişmiş": 6,
        Kayısı: 8,
        Rafadan: 9,
        "Tam Pişmiş": 15,
    },
};

const cookingStyleDescriptions = {
    "Az Pişmiş": "Sıvı sarı, çok yumuşak",
    Kayısı: "Hafif akışkan sarı, yumuşak",
    Rafadan: "Yarı katı, orta kıvam",
    "Tam Pişmiş": "Tamamen katı, sert sarı",
};

const EggTimerApp = () => {
    const [eggSize, setEggSize] = useState("S");
    const [cookingStyle, setCookingStyle] = useState("Az Pişmiş");
    const [timeLeft, setTimeLeft] = useState(eggCookingTimes["S"]["Az Pişmiş"] * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [isEggReady, setIsEggReady] = useState(false);

    const synth = new Tone.Synth().toDestination();

    const playReadySound = () => {
        const now = Tone.now();
        synth.triggerAttackRelease("C5", "8n", now);
        synth.triggerAttackRelease("E5", "8n", now + 0.2);
        synth.triggerAttackRelease("G5", "4n", now + 0.4);
    };

    const startTimer = () => {
        const duration = eggCookingTimes[eggSize][cookingStyle] * 60;
        setTimeLeft(duration);
        setIsRunning(true);
        setIsEggReady(false);
    };

    const stopTimer = () => {
        const initialDuration = eggCookingTimes[eggSize][cookingStyle] * 60;
        setTimeLeft(initialDuration);
        setIsRunning(false);
    };

    const changeEggSize = (size) => {
        if (!isRunning) {
            setEggSize(size);
            const newDuration = eggCookingTimes[size][cookingStyle] * 60;
            setTimeLeft(newDuration);
        }
    };

    const changeCookingStyle = (style) => {
        if (!isRunning) {
            setCookingStyle(style);
            const newDuration = eggCookingTimes[eggSize][style] * 60;
            setTimeLeft(newDuration);
        }
    };

    useEffect(() => {
        let interval;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0 && isRunning) {
            setIsRunning(false);
            setIsEggReady(true);
            playReadySound();
        }

        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return {
            display: `${minutes} dk ${remainingSeconds} sn`,
            timer: `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`,
        };
    };

    const closeFullScreenNotification = () => {
        setEggSize("S");
        setCookingStyle("Az Pişmiş");
        setTimeLeft(eggCookingTimes["S"]["Az Pişmiş"] * 60);
        setIsRunning(false);
        setIsEggReady(false);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="bg-black rounded-2xl w-full max-w-md overflow-hidden max-sm:border-none border-3 border-yellow-300">
                <div className="bg-yellow-300 max-sm:bg-black max-sm:text-yellow-300 text-black p-4 max-sm:p-0 text-center">
                    <h1 className="text-xl max-sm:text-lg font-bold">Yumurta Zamanlayıcısı</h1>
                </div>

                <div className="p-6">
                    {/* Seçim Bilgileri */}
                    <div className="mb-6 text-center">
                        <div className="text-yellow-300 text-lg font-semibold mb-2">Boyutu: {eggSize} Boy</div>
                        <div className="text-yellow-400 text-sm">
                            {eggSizeInfo[eggSize].description} - {eggSizeInfo[eggSize].weight}
                        </div>
                    </div>

                    <div className="mb-6 text-center">
                        <div className="text-yellow-300 text-lg font-semibold mb-2">Pişirme Derecesi: {cookingStyle}</div>
                        <div className="text-yellow-400 text-sm">{cookingStyleDescriptions[cookingStyle]}</div>
                    </div>

                    {/* Zamanlayıcı */}
                    <div className="mb-10 mt-6 text-center">
                        <div className="bg-black rounded-full w-52 h-52 mx-auto flex flex-col items-center justify-center mb-4 border-3 border-yellow-300">
                            {!isRunning && timeLeft === 0 ? (
                                <div className="text-center">
                                    <div className="text-lg text-yellow-300 font-semibold">
                                        {eggSize} Boy - {cookingStyle}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center">
                                    <div className="text-5xl mt-4 font-bold text-yellow-300">{formatTime(timeLeft).timer}</div>
                                    {!isRunning ? (
                                        <button onClick={startTimer} className="text-yellow-300 mt-2 hover:text-yellow-500 transition">
                                            Başlat
                                        </button>
                                    ) : (
                                        <button onClick={stopTimer} className="text-yellow-300 mt-2 hover:text-yellow-500 transition">
                                            Durdur
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Yumurta Büyüklüğü Seçimi */}
                    <div className="mb-6">
                        <div className="flex justify-center space-x-2">
                            {["S", "M", "L", "XL"].map((size) => (
                                <button
                                    key={size}
                                    onClick={() => changeEggSize(size)}
                                    className={`w-12 h-12 rounded-full text-sm font-semibold transition-all duration-300 ${
                                        eggSize === size ? "bg-yellow-300 text-black scale-110" : "bg-gray-900 text-yellow-300 hover:bg-gray-800"
                                    } ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
                                    disabled={isRunning}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Pişirme Stili Seçimi */}
                    <div className="mb-6">
                        <div className="grid grid-cols-2 gap-3">
                            {["Az Pişmiş", "Kayısı", "Rafadan", "Tam Pişmiş"].map((style) => (
                                <button
                                    key={style}
                                    onClick={() => changeCookingStyle(style)}
                                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                                        cookingStyle === style ? "bg-yellow-300 text-black scale-105" : "bg-gray-900 text-yellow-300 hover:bg-gray-800"
                                    } ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
                                    disabled={isRunning}
                                >
                                    {style}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Hazır Olduğunda */}
                    {isEggReady && (
                        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center text-center" onClick={closeFullScreenNotification}>
                            <div className="animate-bounce">
                                <div className="text-6xl mb-4">🥚</div>
                            </div>
                            <h2 className="text-4xl font-bold text-yellow-300 mb-6">Yumurtanız Hazır!</h2>
                            <p className="text-xl text-yellow-400 mb-8">
                                {eggSize} Boy - {cookingStyle} Pişirme Stili
                            </p>
                            <p className="text-lg text-white">Kapatmak için dokun</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EggTimerApp;
