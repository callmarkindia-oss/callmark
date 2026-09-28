import { useEffect, useState } from "react";

declare global {
    interface Window {
        Razorpay: any;
    }
}

let scriptPromise: Promise<void> | null = null;

function loadRazorpayScript(): Promise<void> {
    if (window.Razorpay) return Promise.resolve();
    if (scriptPromise) return scriptPromise;

    scriptPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Razorpay"));
        document.body.appendChild(script);
    });

    return scriptPromise;
}

export function useRazorpayScript() {
    const [ready, setReady] = useState(!!window.Razorpay);

    useEffect(() => {
        if (ready) return;
        loadRazorpayScript()
            .then(() => setReady(true))
            .catch((err) => console.error(err));
    }, [ready]);

    return ready;
}