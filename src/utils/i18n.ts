import { getConfig } from "@/utils/config";

import type fr from "@/locales/fr.json";
import type en from "@/locales/en.json";

const config = await getConfig();

const lang: Languages = await import(`@/locales/${config.language}.json`);

export function i18n<T extends keyof typeof lang>(category: T) {
    return lang[category];
}

type Languages = typeof en | typeof fr;
