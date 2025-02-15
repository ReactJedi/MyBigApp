"use client"

import { Button } from "@/components/ui/button";
import { useState } from "react";


export default function Home() {

  const [text, setText] = useState("");

  const handleRedirect = () => {
    window.location.href = "https://ft.com"; // Change to your URL
  };

  const handleSubmit = () => {
    setText("cool")
  };

  return (
    <div className="flex flex-col justify-center">
      <Button variant={"destructive"} size="sm"
      onClick={handleSubmit}
      >
        my app
      </Button>
      <div className="justify-center">
        {text}
      </div>
    </div>
  );
}
