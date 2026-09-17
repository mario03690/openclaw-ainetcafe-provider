# openclaw-ainetcafe-provider

OpenClaw provider plugin for [ainetcafe](https://ainetcafe.com/k3/): Kimi K3 served from ainetcafe's own cluster at the model's native MXFP4 precision, OpenAI-compatible, $2.10 / $10.50 per million tokens, $0.30 cached input.

## Install

```sh
openclaw plugins install npm:openclaw-ainetcafe-provider
export AINETCAFE_API_KEY=sk-...        # https://microquickjs.com → Token Management ($2 sign-up credit)
openclaw models list --provider ainetcafe --refresh
openclaw agent --local --model ainetcafe/Kimi-K3 --thinking low -m "Say OK"
openclaw gateway restart               # if a gateway is already running
```

Or let onboarding store the key:

```sh
openclaw onboard --non-interactive --accept-risk --skip-health --mode local \
  --auth-choice ainetcafe-api-key --ainetcafe-api-key "$AINETCAFE_API_KEY"
```

Set it as the default model:

```json5
{ agents: { defaults: { model: { primary: "ainetcafe/Kimi-K3" } } } }
```

## What it registers

- Provider id `ainetcafe`, base URL `https://microquickjs.com/v1`, API `openai-completions`
- Model `ainetcafe/Kimi-K3`: reasoning on (`low` / `high` / `max` via `/think` or `--thinking`), text + image input, 256K context (1M on request), `reasoning_content` kept on assistant turns so multi-step tool loops replay cleanly

Tested on OpenClaw 2026.9.4 (17 Sep 2026): plain turn and an `exec` tool-call turn both completed with `winnerProvider: ainetcafe`, no fallback.

## Links

- Guide with the no-plugin config alternative and troubleshooting: https://ainetcafe.com/k3/guides/openclaw.html
- Verification of this endpoint with Moonshot's Kimi Vendor Verifier, including what did not pass: https://ainetcafe.com/k3/verifier.html
- Issues: https://github.com/mario03690/openclaw-ainetcafe-provider/issues

Maintained by ainetcafe (operated by Fedimoss). Kimi K3 is a model by Moonshot AI, used under the Kimi K3 License. Not affiliated with OpenClaw or Moonshot.
