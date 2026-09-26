"use client";

import React, { useState } from "react";
import { X, Delete } from "lucide-react";

interface CalculatorProps {
  onClose: () => void;
}

export const VirtualCalculator: React.FC<CalculatorProps> = ({ onClose }) => {
  const [display, setDisplay] = useState("0");

  const handleBtn = (val: string) => {
    if (display === "0" && val !== ".") {
      setDisplay(val);
    } else {
      setDisplay((prev) => prev + val);
    }
  };

  const handleClear = () => {
    setDisplay("0");
  };

  const handleBackspace = () => {
    if (display.length <= 1) {
      setDisplay("0");
    } else {
      setDisplay((prev) => prev.slice(0, -1));
    }
  };

  const handleCalculate = () => {
    try {
      // Evaluate basic arithmetic safely
      // Replace symbols
      const sanitized = display.replace(/×/g, "*").replace(/÷/g, "/");
      // eslint-disable-next-line no-eval
      const result = Function(`'use strict'; return (${sanitized})`)();
      setDisplay(String(result));
    } catch {
      setDisplay("Error");
    }
  };

  const handleMathFunc = (func: string) => {
    try {
      const num = parseFloat(display);
      let res = 0;
      if (func === "sqrt") res = Math.sqrt(num);
      else if (func === "log2") res = Math.log2(num);
      else if (func === "ln") res = Math.log(num);
      else if (func === "log10") res = Math.log10(num);
      else if (func === "sq") res = num * num;
      setDisplay(String(res));
    } catch {
      setDisplay("Error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xs p-4 shadow-2xl space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-bold text-slate-200">GATE Virtual Calculator</span>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Display */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-right text-xl font-mono font-bold text-white overflow-x-auto">
          {display}
        </div>

        {/* Scientific row */}
        <div className="grid grid-cols-4 gap-1.5 text-xs font-mono font-semibold">
          <button onClick={() => handleMathFunc("log2")} className="p-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700">log2</button>
          <button onClick={() => handleMathFunc("ln")} className="p-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700">ln</button>
          <button onClick={() => handleMathFunc("sqrt")} className="p-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700">√x</button>
          <button onClick={() => handleMathFunc("sq")} className="p-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700">x²</button>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-1.5 text-sm font-semibold">
          <button onClick={handleClear} className="p-2.5 rounded bg-rose-950 text-rose-300 hover:bg-rose-900">C</button>
          <button onClick={handleBackspace} className="p-2.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center">⌫</button>
          <button onClick={() => handleBtn("÷")} className="p-2.5 rounded bg-indigo-950 text-indigo-300 hover:bg-indigo-900">÷</button>
          <button onClick={() => handleBtn("×")} className="p-2.5 rounded bg-indigo-950 text-indigo-300 hover:bg-indigo-900">×</button>

          <button onClick={() => handleBtn("7")} className="p-2.5 rounded bg-slate-800 text-white hover:bg-slate-700">7</button>
          <button onClick={() => handleBtn("8")} className="p-2.5 rounded bg-slate-800 text-white hover:bg-slate-700">8</button>
          <button onClick={() => handleBtn("9")} className="p-2.5 rounded bg-slate-800 text-white hover:bg-slate-700">9</button>
          <button onClick={() => handleBtn("-")} className="p-2.5 rounded bg-indigo-950 text-indigo-300 hover:bg-indigo-900">-</button>

          <button onClick={() => handleBtn("4")} className="p-2.5 rounded bg-slate-800 text-white hover:bg-slate-700">4</button>
          <button onClick={() => handleBtn("5")} className="p-2.5 rounded bg-slate-800 text-white hover:bg-slate-700">5</button>
          <button onClick={() => handleBtn("6")} className="p-2.5 rounded bg-slate-800 text-white hover:bg-slate-700">6</button>
          <button onClick={() => handleBtn("+")} className="p-2.5 rounded bg-indigo-950 text-indigo-300 hover:bg-indigo-900">+</button>

          <button onClick={() => handleBtn("1")} className="p-2.5 rounded bg-slate-800 text-white hover:bg-slate-700">1</button>
          <button onClick={() => handleBtn("2")} className="p-2.5 rounded bg-slate-800 text-white hover:bg-slate-700">2</button>
          <button onClick={() => handleBtn("3")} className="p-2.5 rounded bg-slate-800 text-white hover:bg-slate-700">3</button>
          <button onClick={handleCalculate} className="row-span-2 p-2.5 rounded bg-indigo-600 text-white hover:bg-indigo-500 font-bold flex items-center justify-center">=</button>

          <button onClick={() => handleBtn("0")} className="col-span-2 p-2.5 rounded bg-slate-800 text-white hover:bg-slate-700">0</button>
          <button onClick={() => handleBtn(".")} className="p-2.5 rounded bg-slate-800 text-white hover:bg-slate-700">.</button>
        </div>
      </div>
    </div>
  );
};
