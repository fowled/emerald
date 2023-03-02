const config = await import("config.json");

export type Config = typeof config.default & {
    default: typeof config;
    [key: string]: any;
};
