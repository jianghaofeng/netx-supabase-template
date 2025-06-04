// 支持的语言列表
export const supportedLanguages = ["en", "zh"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

// 默认语言
export const defaultLanguage: SupportedLanguage = "en";

// 语言配置
export const languageConfig = {
  defaultNS: "common",
  fallbackLng: defaultLanguage,
  ns: ["common", "auth", "navigation", "products", "dashboard"],
  supportedLngs: supportedLanguages,
} as const;