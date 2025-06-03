"use client";

import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@heroui/react";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const ICON_SIZE = 16;

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="ghost" size="sm">
          {theme === "light" ? (
            <Sun
              key="light"
              size={ICON_SIZE}
              className="text-muted-foreground"
            />
          ) : theme === "dark" ? (
            <Moon
              key="dark"
              size={ICON_SIZE}
              className="text-muted-foreground"
            />
          ) : (
            <Laptop
              key="system"
              size={ICON_SIZE}
              className="text-muted-foreground"
            />
          )}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="主题选择">
        <DropdownItem
          key="light"
          startContent={<Sun size={ICON_SIZE} className="text-muted-foreground" />}
          onClick={() => setTheme("light")}
        >
          浅色模式
        </DropdownItem>
        <DropdownItem
          key="dark"
          startContent={<Moon size={ICON_SIZE} className="text-muted-foreground" />}
          onClick={() => setTheme("dark")}
        >
          深色模式
        </DropdownItem>
        <DropdownItem
          key="system"
          startContent={<Laptop size={ICON_SIZE} className="text-muted-foreground" />}
          onClick={() => setTheme("system")}
        >
          系统模式
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export { ThemeSwitcher };
