import {
  defaultLanguage,
  type SupportedLanguage,
  supportedLanguages,
} from "./i18n";

/**
 * 获取客户端语言偏好
 */
export function getClientLanguage(): SupportedLanguage {
  if (typeof window === "undefined") {
    return defaultLanguage;
  }

  try {
    // 首先尝试从 localStorage 获取
    const stored = window.localStorage.getItem("preferred-language");
    if (stored && supportedLanguages.includes(stored as SupportedLanguage)) {
      return stored as SupportedLanguage;
    }

    // 然后尝试从浏览器语言设置获取
    const browserLang = window.navigator.language.split("-")[0];
    if (browserLang && supportedLanguages.includes(browserLang as SupportedLanguage)) {
      return browserLang as SupportedLanguage;
    }
  } catch (error) {
    console.error("Error getting client language:", error);
  }

  // 默认返回英文
  return defaultLanguage;
}

/**
 * 设置客户端语言偏好
 */
export function setClientLanguage(lang: SupportedLanguage): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem("preferred-language", lang);
  } catch (error) {
    console.error("Error setting client language:", error);
  }
}

/**
 * 获取语言显示名称
 */
export function getLanguageDisplayName(lang: SupportedLanguage): string {
  return languageNames[lang] || lang;
}

/**
 * 语言名称映射
 */
export const languageNames: Record<SupportedLanguage, string> = {
  en: "English",
  zh: "中文",
};

/**
 * 从cookie中获取语言偏好（服务器端）
 * 注意：此函数只能在服务器组件中使用
 */
export async function getLanguage(): Promise<SupportedLanguage> {
  // 在客户端环境中，使用客户端语言偏好
  if (typeof window !== 'undefined') {
    return getClientLanguage();
  }
  
  // 在服务器端，我们无法直接访问cookies，返回默认语言
  return defaultLanguage;
}