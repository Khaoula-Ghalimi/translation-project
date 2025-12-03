'use client';

import api from "@/lib/axios-client";

export default function TestPage() {

    async function test() {
        try {
            const response = await api.post("/translate", {
                sourceLang: "english",
                targetLang: "moroccan",
                text: "I love you"
            });

            console.log("SUCCESS:", response.data);
        } catch (error) {
            console.log("ERROR:", error);
        }
    }

    return (
        <div className="p-6">
            <button
                onClick={test}
                className="bg-emerald-500 text-white px-4 py-2 rounded"
            >
                Test Translation
            </button>
        </div>
    );
}


