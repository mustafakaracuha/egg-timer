import React, { useState, useEffect } from "react";
import * as Tone from "tone";
import { Egg, Star, Heart, ThermometerSun, ChefHat } from "lucide-react";

const eggFacts = [
    {
        fact: "Dünyada günde yaklaşık 3 milyar yumurta tüketiliyor!",
        icon: <Star className="inline-block mr-2 text-yellow-300" />,
    },
    {
        fact: "Bir tavuk günde 1-2 yumurta üretebilir.",
        icon: <Egg className="inline-block mr-2 text-yellow-300" />,
    },
    {
        fact: "Ortalama bir yumurta 6-7 gram protein içerir.",
        icon: <Heart className="inline-block mr-2 text-yellow-300" />,
    },
    {
        fact: "A, D, E ve B6 vitaminleri açısından oldukça zengin bir besin!",
        icon: <ChefHat className="inline-block mr-2 text-yellow-300" />,
    },
    {
        fact: "Bazı tavuklar mavi veya yeşil yumurta üretebilir!",
        icon: <ThermometerSun className="inline-block mr-2 text-yellow-300" />,
    },
];

const eggTips = [
    "💡 İpucu: Yumurtayı oda sıcaklığında pişirmek daha eşit pişmesini sağlar!",
    "💡 Püf Nokta: Taze yumurtalar daha lezzetli ve besleyicidir!",
    "💡 Öneri: Yumurtayı fazla pişirmeyin, protein değerini koruyun!",
    "💡 Mutfak Sırrı: Tuzlu su içinde yumurta daha kolay soyulur!",
    "💡 Sağlık İçin: Günde 1-2 yumurta tüketmek sağlıklıdır!",
];

const nutritionInfo = {
    "Az Pişmiş": {
        calories: 63,
        protein: 6,
        description: "En fazla besin değerini korur",
    },
    Kayısı: {
        calories: 70,
        protein: 6.5,
        description: "Yumuşak ve besleyici",
    },
    Rafadan: {
        calories: 75,
        protein: 7,
        description: "Dengeli besin değeri",
    },
    "Tam Pişmiş": {
        calories: 80,
        protein: 7.5,
        description: "En sert protein yapısı",
    },
};

const eggSizeInfo = {
    S: { weight: "50g", description: "Küçük Boy", emoji: "🥚", protein: 5, calories: 55 },
    M: { weight: "60g", description: "Orta Boy", emoji: "🍳", protein: 6, calories: 65 },
    L: { weight: "70g", description: "Büyük Boy", emoji: "🧇", protein: 7, calories: 75 },
    XL: { weight: "80g", description: "Çok Büyük Boy", emoji: "🥣", protein: 8, calories: 85 },
};

const eggCookingTimes = {
    S: {
        "Az Pişmiş": 0.05,
        Kayısı: 4,
        Rafadan: 5,
        "Tam Pişmiş": 10,
    },
    M: {
        "Az Pişmiş": 4,
        Kayısı: 5,
        Rafadan: 6,
        "Tam Pişmiş": 11,
    },
    L: {
        "Az Pişmiş": 5,
        Kayısı: 6,
        Rafadan: 7,
        "Tam Pişmiş": 12,
    },
    XL: {
        "Az Pişmiş": 6,
        Kayısı: 8,
        Rafadan: 9,
        "Tam Pişmiş": 14,
    },
};


const cookingStyleDescriptions = {
    "Az Pişmiş": "Beyazı hafif pişmiş, sarısı tamamen sıvı",
    Kayısı: "Beyazı tamamen pişmiş, sarısı hafif akışkan",
    Rafadan: "Beyazı sertleşmiş, sarısı kremsi ve yarı katı",
    "Tam Pişmiş": "Beyazı ve sarısı tamamen katı ve sert",
};

const EggTimerApp = () => {
    const [eggSize, setEggSize] = useState("S");
    const [cookingStyle, setCookingStyle] = useState("Az Pişmiş");
    const [timeLeft, setTimeLeft] = useState(eggCookingTimes["S"]["Az Pişmiş"] * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [isEggReady, setIsEggReady] = useState(false);
    const [soundPlayer, setSoundPlayer] = useState(null);
    const [currentFact, setCurrentFact] = useState(null);
    const [currentTip, setCurrentTip] = useState(null);

    const playReadySound = () => {
        const player = new Tone.Player("https://tonejs.github.io/audio/berklee/Pling2.mp3").toDestination();

        Tone.loaded().then(() => {
            player.start();
            setSoundPlayer(player);
        });
    };

    const startTimer = () => {
        const duration = eggCookingTimes[eggSize][cookingStyle] * 60;
        setTimeLeft(duration);
        setIsRunning(true);
        setIsEggReady(false);

        // Randomly select a fact and a tip
        const randomFact = eggFacts[Math.floor(Math.random() * eggFacts.length)];
        const randomTip = eggTips[Math.floor(Math.random() * eggTips.length)];

        setCurrentFact(randomFact);
        setCurrentTip(randomTip);
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

    const closeFullScreenNotification = () => {
        // Stop the sound if it's playing
        if (soundPlayer) {
            soundPlayer.stop();
            setSoundPlayer(null);
        }

        setEggSize("S");
        setCookingStyle("Az Pişmiş");
        setTimeLeft(eggCookingTimes["S"]["Az Pişmiş"] * 60);
        setIsRunning(false);
        setIsEggReady(false);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return {
            display: `${minutes} dk ${remainingSeconds} sn`,
            timer: `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`,
        };
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

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="bg-black rounded-2xl w-full max-w-md overflow-hidden max-sm:border-none border-3 border-yellow-300">
                <div className="bg-yellow-300 max-sm:bg-black max-sm:text-yellow-300 text-black p-4 max-sm:p-0 text-center">
                    <h1 className="text-xl max-sm:text-lg font-bold">Yumurta Zamanlayıcısı</h1>
                </div>

                <div className="p-6">
                    {/* Seçim Bilgileri */}
                    <div className="mb-6 text-center">
                        <div className="text-yellow-300 text-lg font-semibold mb-2">
                            Boyutu: {eggSize} Boy {eggSizeInfo[eggSize].emoji}
                        </div>
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

                    {/* Yeni Bilgi Kartları */}
                    {isRunning && (currentFact || currentTip) && (
                        <div className="absolute bottom-4 left-4 right-4 bg-gray-900 p-4 rounded-lg shadow-lg text-sm text-center text-white">
                            {currentFact && (
                                <div className="mb-2 flex items-center justify-center">
                                    {currentFact.icon}
                                    {currentFact.fact}
                                </div>
                            )}
                            {currentTip && <div className="italic text-yellow-300">{currentTip}</div>}
                        </div>
                    )}

                    {/* Hazır Olduğunda */}
                    {isEggReady && (
                        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center text-center" onClick={closeFullScreenNotification}>
                            <div className="animate-bounce">
                                <div className="text-6xl mb-4">🥚</div>
                            </div>
                            <h2 className="text-4xl font-bold text-yellow-300 mb-6">Yumurtanız Hazır!</h2>
                            <p className="text-lg text-white">Kapatmak için dokun</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EggTimerApp;
