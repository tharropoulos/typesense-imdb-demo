import type { ConfigurationOptions } from "typesense/lib/Typesense/Configuration";
import { Client } from "typesense";

const config = {
  TYPESENSE_HOST: "localhost",
  TYPESENSE_PORT: 8108,
  TYPESENSE_PROTOCOL: "http",
  TYPESENSE_API_KEY: "xyz",
};

export const typesenseConfig: ConfigurationOptions = {
  nodes: [
    {
      host: config.TYPESENSE_HOST,
      port: Number(config.TYPESENSE_PORT),
      protocol: config.TYPESENSE_PROTOCOL,
    },
  ],
  apiKey: config.TYPESENSE_API_KEY,
  retryIntervalSeconds: 2,
};

export const client = new Client(typesenseConfig);
