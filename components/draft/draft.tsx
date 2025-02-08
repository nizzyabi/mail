"use client";

import { counter } from "@/store/draftStates";
import { useAtom } from "jotai";
import React from "react";

function Draft() {
  const [count, setCounter] = useAtom(counter);
  const onClick = () => setCounter((prev) => prev + 1);
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={onClick}>Click</button>
    </div>
  );
}

export default Draft;
