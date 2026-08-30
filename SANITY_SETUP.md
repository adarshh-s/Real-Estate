# Making the site editable — Sanity CMS setup

Right now the site works exactly as it did before: every page falls back to
the bundled demo data in `src/data/*.ts` and the videos in `public/`. Nothing
breaks if you skip this. Once you complete the steps below, every page
switches over automatically to live content from Sanity — no further code
changes needed.

## What's already built

- `studio/` — a separate Sanity Studio app (the admin dashboard). Content
  types: **Property**, **Off-Plan Project**, **Community**, **Agent**,
  **Testimonial**, and a singleton **Site Settings** (hero video, hero copy,
  the second cinematic video, contact details).
- `src/lib/sanity.ts` + `src/hooks/useSanityContent.ts` — the site fetches
  live content if it's there, and silently keeps using the bundled demo data
  if it isn't. Every page and component was updated to go through these
  hooks instead of importing `src/data/*.ts` directly.
- `scripts/migrate-to-sanity.ts` — a one-time script that pushes all of
  today's demo content (properties, projects, communities, agents,
  testimonials, hero video) into your new Sanity project, so Studio starts
  populated instead of empty. Run it once, then replace the demo content
  with real content inside Studio.

## One-time setup (you do this, not the client)

**1. Create a free Sanity project** — this is the one step that needs a
human in a browser; it can't be scripted.

```bash
cd studio
npx sanity@latest login    # opens a browser, sign in with Google/GitHub/email
npx sanity@latest init --project-id-only
```

Follow the prompts (create a new project, dataset name `production`). It
will print a **Project ID** — copy it.

**2. Add the project ID to your environment.**

At the repo root:
```bash
cp .env.example .env
```
Edit `.env` and fill in:
```
VITE_SANITY_PROJECT_ID=<the project id from step 1>
VITE_SANITY_DATASET=production
```

Also add it to `studio/.env` (copy `studio/.env.example` the same way) so the
Studio app itself knows which project to talk to.

**3. Generate a write token** (only needed to run the one-time migration,
never used by the live site): in [sanity.io/manage](https://sanity.io/manage)
→ your project → API → Tokens → **Add API token** → permission **Editor** →
copy the token into `.env` as `SANITY_WRITE_TOKEN`.

**4. Seed your new project with today's demo content:**

```bash
npm run migrate:sanity
```

This uploads all current properties, projects, communities, agents,
testimonials, and the two site videos. Takes a few minutes (it's uploading
every image). Safe to run only once — it refuses to run again if it detects
existing properties, to avoid duplicates.

**5. Run the Studio and confirm you see the content:**

```bash
cd studio
npm run dev
```
Opens at `http://localhost:3333`. You should see everything from step 4.

**6. Deploy the Studio somewhere the client can reach** (free):

```bash
cd studio
npx sanity deploy
```
Pick a studio hostname (e.g. `providence-estates` → gives you
`providence-estates.sanity.studio`). That URL is what you send the client.

**7. Run the main site and confirm it's now pulling live data:**

```bash
npm run dev
```
Change something in Studio (e.g. a property's price), refresh the site, and
you should see the update.

## Inviting the client

In [sanity.io/manage](https://sanity.io/manage) → your project → Members →
**Invite members** → enter their email → role **Editor**. That's it — they
log into the Studio URL from step 6 with that email and can add/edit
listings, swap the hero video, update agent headshots, everything. No code,
no GitHub account, nothing installed.

## Notes

- Every hook in `src/hooks/useSanityContent.ts` falls back to the bundled
  static data if Sanity isn't configured or a fetch fails — so this can be
  set up gradually or rolled back at any time without breaking the site.
- The hero video and the second cinematic video are both editable from
  **Site Settings** in Studio. Keep them compressed (~10-15MB, under a
  minute) for fast loading — Studio doesn't compress video for you.
- Property → Agent is a reference field, so agents must exist in Sanity
  before you assign them to a property (the migration script handles this
  automatically for the demo data).
