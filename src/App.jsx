import React, { useState, useEffect } from "react";

const eggCookingTimes = {
    S: {
        "Az Pişmiş": 0.5,
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

const EggTimerApp = () => {
    const [eggSize, setEggSize] = useState("S");
    const [cookingStyle, setCookingStyle] = useState("Az Pişmiş");
    const [timeLeft, setTimeLeft] = useState(eggCookingTimes["S"]["Az Pişmiş"] * 60);
    const [isRunning, setIsRunning] = useState(false);

    const startTimer = () => {
        const duration = eggCookingTimes[eggSize][cookingStyle] * 60;
        setTimeLeft(duration);
        setIsRunning(true);
    };

    const stopTimer = () => {
        // Reset timer to initial duration when stopped
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

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="bg-black rounded-2xl w-full max-w-md overflow-hidden max-sm:border-none xl:border-2 xl:border-yellow-500">
                <div className="bg-yellow-300 max-sm:bg-black max-sm:text-yellow-300 text-black p-4 text-center">
                    <h1 className="text-xl font-bold">Yumurta Zamanlayıcısı</h1>
                </div>

                <div className="p-6">
                    {/* Zamanlayıcı */}
                    <div className="mb-10 text-center">
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
                                        <button onClick={startTimer} className=" text-yellow-300 mt-2">
                                            Başlat
                                        </button>
                                    ) : (
                                        <button onClick={stopTimer} className=" text-yellow-300 mt-2">
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
                                        eggSize === size ? "bg-yellow-300 text-black" : "bg-gray-900 text-yellow-300"
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
                                        cookingStyle === style ? "bg-yellow-300 text-black" : "bg-gray-900 text-yellow-300"
                                    } ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
                                    disabled={isRunning}
                                >
                                    {style}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Kontrol Butonları */}

                    {timeLeft === 0 && (
                        <div className="text-center mt-4">
                            <div className="text-yellow-300 font-semibold text-xl">Yumurtanız Hazır! 🥚</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EggTimerApp;
