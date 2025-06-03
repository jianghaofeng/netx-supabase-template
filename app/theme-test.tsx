"use client";

import { useTheme } from "next-themes";
import { Button } from "@heroui/react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-xl font-bold">当前主题: {theme}</h2>
      <div className="flex gap-2">
        <Button 
          onClick={() => setTheme("light")}
          variant={theme === "light" ? "solid" : "ghost"}
        >
          浅色模式
        </Button>
        <Button 
          onClick={() => setTheme("dark")}
          variant={theme === "dark" ? "solid" : "ghost"}
        >
          深色模式
        </Button>
        <Button 
          onClick={() => setTheme("system")}
          variant={theme === "system" ? "solid" : "ghost"}
        >
          系统模式
        </Button>
      </div>
    </div>
  );
} 