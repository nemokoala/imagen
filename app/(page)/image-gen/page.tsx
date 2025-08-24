"use client";

import { useState } from "react";

export default function ImageGenPage() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    const res = await fetch("/api/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setImageUrl(data.dataUrl);
  };

  return (
    <main className="p-4">
      <input
        type="text"
        placeholder="프롬프트 입력..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="border p-2 w-80"
      />
      <button
        onClick={handleGenerate}
        className="ml-2 p-2 bg-blue-500 text-white"
      >
        이미지 생성
      </button>

      {imageUrl && (
        <div className="mt-4">
          <img src={imageUrl} alt="생성된 이미지" />
        </div>
      )}
    </main>
  );
}
