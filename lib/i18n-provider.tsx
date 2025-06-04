"use client";

import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";
import { type PropsWithChildren, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { initReactI18next } from "react-i18next";

import {
  defaultLanguage,
  languageConfig,
  type SupportedLanguage,
} from "./i18n";
import { getClientLanguage, setClientLanguage } from "./language-utils";

// 创建 i18next 实例
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`../locales/${language}/${namespace}.json`),
    ),
  )
  .init({
    ...languageConfig,
    detection: {
      caches: ["localStorage", "cookie"],
      order: ["localStorage", "cookie", "navigator"],
    },
    interpolation: {
      escapeValue: false,
    },
    // 默认使用英文，避免水合错误
    lng: defaultLanguage,
  });

export default function I18nProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    // 客户端加载后，再根据用户偏好切换语言
    const userPreferredLanguage = getClientLanguage();
    if (userPreferredLanguage !== i18next.language) {
      i18next.changeLanguage(userPreferredLanguage);
    }

    // 确保客户端语言偏好在组件挂载时被设置
    const currentLang = i18next.language as SupportedLanguage;
    setClientLanguage(currentLang);

    // 监听语言变化
    const handleLanguageChanged = (lng: string) => {
      setClientLanguage(lng as SupportedLanguage);
    };

    i18next.on("languageChanged", handleLanguageChanged);

    return () => {
      i18next.off("languageChanged", handleLanguageChanged);
    };
  }, []);

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}