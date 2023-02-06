import translations from "@/i18n/strings.json";

import { language } from "config.json";

export function i18n(category: string, module: string) {
    return translations[module][category][language];
}
