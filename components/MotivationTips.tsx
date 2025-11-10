import React, { useState, useEffect } from 'react';
import { BibleIcon } from './icons/BibleIcon';
import { RefreshCwIcon } from './icons/RefreshCwIcon';
import { BIBLE_VERSES } from '../constants';

const MotivationTips: React.FC = () => {
    const [currentVerse, setCurrentVerse] = useState<{ quote: string; reference: string } | null>(null);

    const getRandomVerse = () => {
        const randomIndex = Math.floor(Math.random() * BIBLE_VERSES.length);
        setCurrentVerse(BIBLE_VERSES[randomIndex]);
    };

    useEffect(() => {
        getRandomVerse();
    }, []);

    if (!currentVerse) return null;

    return (
        <div className="mt-8 p-4 md:p-6 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100 dark:from-slate-800 dark:to-amber-900/50 backdrop-blur-sm rounded-lg shadow-md border-l-4 border-amber-400">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <BibleIcon className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Dicas de Motivação e Fé</h3>
                </div>
                <button onClick={getRandomVerse} className="p-2 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition" aria-label="Nova dica">
                    <RefreshCwIcon className="w-5 h-5" />
                </button>
            </div>
            <div className="mt-4 pl-9">
                <blockquote className="text-slate-700 dark:text-slate-300 italic text-base">
                    "{currentVerse.quote}"
                </blockquote>
                <p className="text-right mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                    - {currentVerse.reference}
                </p>
            </div>
        </div>
    );
};

export default MotivationTips;
