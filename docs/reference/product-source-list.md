# Product Source List — canonical mapping table

> **Single source of truth for product data.** Every `data/products.json` entry originates from this
> table. Data-phase sessions (P3-P5) read THIS file, not the ChatGPT conversation, to encode products.
>
> - Columns: `Paid SaaS` (the `isPaidSaaS: true` product) -> `Free alternative(s)` (the alternatives).
> - `Model` tags: Self-host / Open-source / Free / Freemium — maps to `pricingType`/`selfHosted`/`deploymentOptions`.
> - GitHub stars / license / release metadata: **leave null** in data; `scripts/sync-github.ts` fills them later.
> - Category + subcategory assignment is decided per the hierarchy in `data/categories.json`.

## Infrastructure & Deployment

| # | Paid SaaS | Free alternative | Model |
|---|---|---|---|
| 1 | Vercel | Coolify | Self-host |
| 2 | Netlify | Coolify | Self-host |
| 3 | Heroku | Dokku | Self-host |
| 4 | Railway | Coolify | Self-host |
| 5 | Render | Coolify / Dokploy | Self-host |
| 6 | Fly.io | Coolify | Self-host |
| 7 | DigitalOcean App Platform | Coolify | Self-host |
| 8 | AWS Amplify | Coolify | Self-host |
| 9 | Firebase Hosting | Coolify | Self-host |
| 10 | Cloudflare Pages | Cloudflare Pages / Coolify | Free/self-host |

## Databases & Backend

| # | Paid SaaS | Free alternative | Model |
|---|---|---|---|
| 11 | Firebase | Supabase | Open-source |
| 12 | Supabase Pro | Supabase self-hosted | Open-source |
| 13 | PlanetScale | PostgreSQL | Open-source |
| 14 | MongoDB Atlas | MongoDB Community | Open-source |
| 15 | Redis Cloud | Valkey / Redis | Open-source |
| 16 | Upstash | Valkey | Open-source |
| 17 | Neon | PostgreSQL | Open-source |
| 18 | DynamoDB | PostgreSQL | Open-source |
| 19 | Airtable | Baserow | Open-source |
| 20 | Airtable | NocoDB | Open-source |

## Auth / Identity

| # | Paid SaaS | Free alternative |
|---|---|---|
| 21 | Auth0 | Keycloak |
| 22 | Auth0 | Authentik |
| 23 | Clerk | Keycloak |
| 24 | Clerk | Supabase Auth |
| 25 | Okta | Keycloak |
| 26 | OneLogin | Authentik |
| 27 | Firebase Auth | Supabase Auth |
| 28 | WorkOS | Keycloak |

## Storage / CDN / Media

| # | Paid SaaS | Free alternative |
|---|---|---|
| 29 | AWS S3 | MinIO |
| 30 | Cloudflare R2 | MinIO |
| 31 | Backblaze B2 | MinIO + cheap VPS/storage |
| 32 | Cloudinary | MinIO |
| 33 | Imgix | ImageMagick + MinIO |
| 34 | Dropbox | Nextcloud |
| 35 | Google Drive | Nextcloud |
| 36 | OneDrive | Nextcloud |

## Analytics

| # | Paid SaaS | Free alternative |
|---|---|---|
| 37 | Google Analytics 360 | Matomo |
| 38 | Mixpanel | PostHog |
| 39 | Amplitude | PostHog |
| 40 | Heap | PostHog |
| 41 | Hotjar | Microsoft Clarity |
| 42 | FullStory | OpenReplay |
| 43 | Segment | RudderStack |
| 44 | PostHog Cloud | PostHog self-hosted |

## Monitoring / Errors / Logs

| # | Paid SaaS | Free alternative |
|---|---|---|
| 45 | Datadog | Grafana + Prometheus |
| 46 | New Relic | Grafana |
| 47 | Sentry | GlitchTip |
| 48 | Logtail | Grafana Loki |
| 49 | Papertrail | Loki |
| 50 | Loggly | Loki |
| 51 | Better Stack | Grafana stack |
| 52 | UptimeRobot | Uptime Kuma |
| 53 | Pingdom | Uptime Kuma |
| 54 | PagerDuty | Grafana OnCall |

## Automation

| # | Paid SaaS | Free alternative |
|---|---|---|
| 55 | Zapier | n8n |
| 56 | Make | n8n |
| 57 | Pipedream | n8n |
| 58 | IFTTT | n8n |
| 59 | Workato | n8n |
| 60 | Tray.io | n8n |

## Communication / Support

| # | Paid SaaS | Free alternative |
|---|---|---|
| 61 | Intercom | Chatwoot |
| 62 | Zendesk | Zammad |
| 63 | Zendesk | FreeScout |
| 64 | Crisp | Chatwoot |
| 65 | Help Scout | FreeScout |
| 66 | Drift | Chatwoot |
| 67 | Front | Zammad |
| 68 | LiveChat | Chatwoot |

## Email

| # | Paid SaaS | Free alternative |
|---|---|---|
| 69 | Mailchimp | Listmonk |
| 70 | ConvertKit | Listmonk |
| 71 | Brevo | Listmonk |
| 72 | SendGrid | Postal |
| 73 | Mailgun | Postal |
| 74 | Postmark | Postal |
| 75 | Amazon SES | Postal / Mailcow |
| 76 | Microsoft 365 email | Mailcow |

> Note: email self-hosting has deliverability caveats — see README notes if needed.

## Git / CI/CD / DevOps

| # | Paid SaaS | Free alternative |
|---|---|---|
| 77 | GitHub Enterprise | Forgejo |
| 78 | GitLab Premium | Gitea / Forgejo |
| 79 | Bitbucket | Forgejo |
| 80 | GitHub Actions | Woodpecker CI |
| 81 | CircleCI | Woodpecker CI |
| 82 | Travis CI | Woodpecker CI |
| 83 | Docker Hub | Harbor |
| 84 | GitHub Container Registry | Harbor |

## Design

| # | Paid SaaS | Free alternative |
|---|---|---|
| 85 | Figma | Penpot |
| 86 | Miro | Excalidraw |
| 87 | Miro | AFFiNE |
| 88 | Canva Pro | Penpot / GIMP / Inkscape |
| 89 | Photoshop | GIMP |
| 90 | Illustrator | Inkscape |

## Productivity / Docs

| # | Paid SaaS | Free alternative |
|---|---|---|
| 91 | Notion | AppFlowy |
| 92 | Notion | AFFiNE |
| 93 | Confluence | Outline |
| 94 | Google Docs | OnlyOffice |
| 95 | Dropbox Paper | Outline |
| 96 | Evernote | Joplin |
| 97 | Google Keep | Joplin |

## Scheduling / Project Management

| # | Paid SaaS | Free alternative |
|---|---|---|
| 98 | Calendly | Cal.com |
| 99 | Linear | Plane |
| 100 | Jira | Plane |
| 101 | Jira | OpenProject |
| 102 | Trello | Wekan |
| 103 | Asana | OpenProject |
| 104 | Monday.com | OpenProject |
| 105 | ClickUp | OpenProject |

## Internal Tools / Forms

| # | Paid SaaS | Free alternative |
|---|---|---|
| 106 | Retool | Appsmith |
| 107 | Retool | ToolJet |
| 108 | Typeform | Formbricks |
| 109 | Typeform | LimeSurvey |
| 110 | Google Forms | Formbricks |
| 111 | Airtable | Baserow |
| 112 | Airtable | NocoDB |

## Search / AI Infrastructure

| # | Paid SaaS | Free alternative |
|---|---|---|
| 113 | Algolia | Meilisearch |
| 114 | Algolia | Typesense |
| 115 | Pinecone | Qdrant |
| 116 | Pinecone | Weaviate |
| 117 | OpenAI API | Ollama |
| 118 | OpenAI local inference | Ollama + open models |
| 119 | Replicate | Ollama / vLLM |
| 120 | OpenAI embeddings | sentence-transformers |

## Passwords / Security

| # | Paid SaaS | Free alternative |
|---|---|---|
| 121 | 1Password | Vaultwarden |
| 122 | LastPass | Vaultwarden |
| 123 | Bitwarden Premium | Vaultwarden |
| 124 | Auth0 | Keycloak |
| 125 | Cloudflare Access | Authentik |

## Billing / CRM

| # | Paid SaaS | Free alternative |
|---|---|---|
| 126 | Stripe Billing | Lago |
| 127 | Chargebee | Lago |
| 128 | HubSpot CRM | SuiteCRM |
| 129 | Salesforce | SuiteCRM / EspoCRM |
| 130 | Pipedrive | EspoCRM |
| 131 | Zoho CRM | SuiteCRM |

## Unique alternative inventory (deduplicated)

Infrastructure: Coolify, Dokploy, Dokku
Databases/backend: Supabase, PostgreSQL, MongoDB Community, Valkey, Redis, Baserow, NocoDB
Auth: Keycloak, Authentik, Supabase Auth
Storage/media: MinIO, ImageMagick, Nextcloud
Analytics: Matomo, PostHog, Microsoft Clarity, OpenReplay, RudderStack
Monitoring: Grafana, Prometheus, Loki, GlitchTip, Uptime Kuma, Grafana OnCall
Automation: n8n
Communication: Chatwoot, Zammad, FreeScout
Email: Listmonk, Postal, Mailcow
Git/CI: Forgejo, Gitea, Woodpecker CI, Harbor
Design: Penpot, Excalidraw, AFFiNE, GIMP, Inkscape
Productivity: AppFlowy, Outline, OnlyOffice, Joplin
PM: Cal.com, Plane, OpenProject, Wekan
Internal tools: Appsmith, ToolJet, Formbricks, LimeSurvey
Search/AI: Meilisearch, Typesense, Qdrant, Weaviate, Ollama, vLLM, sentence-transformers
Security: Vaultwarden
Billing/CRM: Lago, SuiteCRM, EspoCRM

> Count: ~131 paid rows + ~60 unique alternatives -> ~170 unique product entries once combined with
> deduplication of shared alternatives (Supabase, PostgreSQL, Keycloak, n8n, etc. appear once).