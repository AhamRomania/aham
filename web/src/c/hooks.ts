"use client";

import { useEffect, useState } from "react";


export function useLocalStorageState<T>(key: string, defaultValue: T) {
    const isStorageAvailable = typeof window !== "undefined" && "localStorage" in window;

    const [state, setState] = useState<T>(() => {
        if (!isStorageAvailable) return defaultValue;
        try {
            const storedValue = localStorage.getItem(key);
            return storedValue ? JSON.parse(storedValue) : defaultValue;
        } catch (error) {
            console.error("Error accessing localStorage:", error);
            return defaultValue;
        }
    });

    useEffect(() => {
        if (!isStorageAvailable) return;
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error("Error writing to localStorage:", error);
        }
    }, [key, state, isStorageAvailable]);

    return [state, setState] as const;
}