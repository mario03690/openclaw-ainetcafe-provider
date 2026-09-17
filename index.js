// ainetcafe provider plugin for OpenClaw: Kimi K3 served at native MXFP4 precision via the
// OpenAI-compatible endpoint https://microquickjs.com/v1. External-plugin shape
// (definePluginEntry + registerProvider), same as other third-party provider plugins on npm.
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth";

export const PROVIDER_ID = "ainetcafe";
export const BASE_URL = "https://microquickjs.com/v1";
export const DEFAULT_MODEL = "Kimi-K3";

// Prices in USD per million tokens (https://ainetcafe.com/k3/#pricing).
export const MODEL_CATALOG = [
  {
    id: "Kimi-K3",
    name: "Kimi K3 (ainetcafe)",
    reasoning: true,
    input: ["text", "image"],
    contextWindow: 262144,
    maxTokens: 65536,
    cost: { input: 2.1, output: 10.5, cacheRead: 0.3, cacheWrite: 0 },
    supportsTools: true,
    compat: {
      supportsReasoningEffort: true,
      supportedReasoningEfforts: ["low", "high", "max"],
      supportsStore: false,
      supportsDeveloperRole: false,
      supportsStrictMode: false,
      maxTokensField: "max_tokens",
      // K3 returns reasoning_content; keep it on assistant turns so multi-step tool loops replay cleanly.
      requiresReasoningContentOnAssistantMessages: true,
      // The endpoint validates tool schemas against JSON Schema 2020-12, which rejects `$id` values
      // with a fragment; the model never needs `$id`, so drop it before sending.
      unsupportedToolSchemaKeywords: ["$id"],
    },
  },
];

export default definePluginEntry({
  id: PROVIDER_ID,
  name: "ainetcafe",
  description: "Kimi K3 on ainetcafe: native MXFP4 weights, OpenAI-compatible, $2.10 / $10.50 per million tokens",
  register(api) {
    api.registerProvider({
      id: PROVIDER_ID,
      label: "ainetcafe",
      docsPath: "https://ainetcafe.com/k3/guides/openclaw.html",
      envVars: ["AINETCAFE_API_KEY"],
      auth: [
        createProviderApiKeyAuthMethod({
          providerId: PROVIDER_ID,
          methodId: "api-key",
          label: "ainetcafe API key",
          hint: "API key from microquickjs.com → Token Management (starts with sk-)",
          optionKey: "ainetcafeApiKey",
          flagName: "--ainetcafe-api-key",
          envVar: "AINETCAFE_API_KEY",
          promptMessage: "Enter your ainetcafe API key (sign up at https://microquickjs.com/register?lng=en, $2 credit)",
          defaultModel: `${PROVIDER_ID}/${DEFAULT_MODEL}`,
        }),
      ],
      // The agent runtime resolves refs through this hook; catalog feeds list/onboarding.
      resolveDynamicModel: (ctx) => {
        const row = MODEL_CATALOG.find((m) => m.id === ctx.modelId) ?? (ctx.modelId?.toLowerCase() === "kimi-k3" ? MODEL_CATALOG[0] : undefined);
        if (!row) return undefined;
        return { ...row, provider: PROVIDER_ID, api: "openai-completions", baseUrl: BASE_URL };
      },
      catalog: {
        order: "simple",
        run: async (ctx) => {
          const apiKey = ctx.resolveProviderApiKey(PROVIDER_ID).apiKey;
          if (!apiKey) return null;
          return {
            provider: {
              baseUrl: BASE_URL,
              apiKey,
              api: "openai-completions",
              models: MODEL_CATALOG,
            },
          };
        },
      },
    });
  },
});
