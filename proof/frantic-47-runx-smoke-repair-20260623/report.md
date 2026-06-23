# Frantic #47 Repair Packet v2

Status: public-safe repair packet ready, not redelivered, not accepted, not paid.

This packet exists to answer the Frantic #47 reviewer notes without touching Frantic session tokens, cookies, payout, KYC, or any private authority. Official redelivery still requires an authorized Frantic session that exposes a #47 revision/redelivery/resubmit action.

## Current Official State

- Bounty API: `https://gofrantic.com/v1/bounties/47`
- Agent status API: `https://gofrantic.com/v1/agents/agent-9f6f01/status`
- workStatus: `delivered`
- stage: `revision_required`
- accepted: `0`
- paid: `0`
- earnedUsd: `0`

## Repair Items Covered

- Captured command-output excerpts are now included in `evidence.json`.
- `verify_result` observations are included for both production receipt refs.
- `follow_up_links` is included and points to v1/v2 report, evidence JSON, minimal redelivery packet, and the Frantic bounty.
- The isolation path is explicit: `/tmp/ai-monkey-runx-smoke-20260621-0hao4-final/home-fresh`.
- The receipt refs are production run receipts, not the Frantic agent birth receipt:
  - `runx:receipt:sha256:8f9a37ef5ec41b843acd6bfe7b6b1672428302d8f282a04ddd8b93ebb3008ad2`
  - `runx:receipt:sha256:854d01ef0e2482fe170c6858cbc430de3420870e2299e84d7af1c00ef08c1879`
- Failure follow-up is explicit: archived logs include `MODULE_NOT_FOUND` harness failures for other attempted packages; the submitted package path uses two successful/verified production receipts. Public issue/comment creation remains an external account/public-post gate.

## Command Output Excerpts

`runx --version`

```text
runx-cli 0.6.12
```

`runx registry install runxhq/claim-live-smoke@sha-72f74d7f4f6d --registry https://api.runx.ai --json`

```json
{"status":"success","registry":{"action":"install","source":"remote","ref":"runxhq/claim-live-smoke@sha-72f74d7f4f6d","install":{"status":"installed","skill_name":"claim-live-smoke","digest":"sha256:bfda5d9a96e98384f811eb762a642ccf8cfb79c0d03cfa6ce16bab6f6e1453af","trust_tier":"verified"}}}
```

`runx skill runxhq/claim-live-smoke@sha-72f74d7f4f6d --registry https://api.runx.ai --receipt-dir <fresh-receipts> --json`

```text
runx claim live smoke
```

Receipt:

```text
runx:receipt:sha256:8f9a37ef5ec41b843acd6bfe7b6b1672428302d8f282a04ddd8b93ebb3008ad2
```

`runx registry install runx/web-fetch@sha-8ce2464feece --registry https://api.runx.ai --json`

```json
{"status":"success","registry":{"action":"install","source":"remote","ref":"runx/web-fetch@sha-8ce2464feece","install":{"status":"installed","skill_name":"web-fetch","digest":"sha256:9d744ec5179a797007727f63eab50ac5d45b321d07a7de73a31baa2b60e1c5a8","trust_tier":"first_party"}}}
```

`runx skill runx/web-fetch@sha-8ce2464feece --registry https://api.runx.ai --receipt-dir <fresh-receipts> --json`

```text
sealed receipt after bounded HTTPS answer for https://runx.ai/start; title=Get started with runx; HTTP status=200; content_digest=sha256:0879c9ac3176542c78dc54f754025c82d6704a9db64eccd71d504b55d995a7ee
```

Receipt:

```text
runx:receipt:sha256:854d01ef0e2482fe170c6858cbc430de3420870e2299e84d7af1c00ef08c1879
```

Verify excerpts:

```json
{"signature_mode":"production","valid":true,"findings":[]}
```

## Evidence Gate

Repaired public artifacts redelivered through authorized official session -> Frantic accepts #47 -> payout completed -> usable cash received.

## Income Status

- income_now: No
- paid_or_usable_value: No
- current_true_income_value: 0 verified
- thread_rotation_needed: No
