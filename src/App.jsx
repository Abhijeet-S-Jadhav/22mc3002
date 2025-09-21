import React from "react";
import ShortenerForm from "./components/shortit";

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-4">URL Shortener App for Affordmed OA</h1>
        <ShortenerForm />
        <footer className="mt-6 text-xs text-gray-500">
          Backend is in-memory.
        </footer>
    </div>
  </div>
  );
}
