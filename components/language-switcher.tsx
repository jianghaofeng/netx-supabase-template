"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { languageNames, setClientLanguage } from "@/lib/language-utils";

export function LanguageSwitcher() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState<string>(i18n.language);

  // 同步当前语言状态
  useEffect(() => {
    setCurrentLang(i18n.language);
  }, [i18n.language]);

  // 处理语言切换
  const handleLanguageChange = useCallback(
    (newLang: string) => {
      if (newLang === currentLang) return;
      
      i18n.changeLanguage(newLang);
      setClientLanguage(newLang);
      setCurrentLang(newLang);
      router.refresh();
    },
    [currentLang, i18n, router]
  );

  return (
    <div className="flex items-center space-x-2">
      <select
        value={currentLang}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="bg-background border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Select language"
      >
        {Object.entries(languageNames).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}