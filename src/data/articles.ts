import type { Article } from '../types';
import { interiors, exteriors } from '../lib/images';

export const articles: Article[] = [
  {
    id: 'j1',
    slug: 'dubai-prime-market-report-q3-2026',
    title: 'The Prime Market, Q3 2026: What’s Actually Moving',
    excerpt:
      'Waterfront villas are outpacing the wider market again, off-plan absorption has cooled from its 2024 peak, and one community quietly overtook Downtown on price per square foot.',
    body:
      'Dubai’s prime segment closed the third quarter with AED 1.2 billion transacted through our desk alone — a figure driven less by volume than by a small number of exceptional, largely off-market deals. Frond villas on the Palm and full-floor residences above the 100th floor of Downtown towers again accounted for a disproportionate share of value, even as unit volume stayed flat.\n\nThe more interesting story is beneath the headline number. Jumeirah Bay Island’s average price per square foot has now overtaken Downtown Dubai for the first time since the island’s launch, a shift driven by a handful of beachfront mansion resales rather than new supply — there simply isn’t much left to sell on the seahorse. Buyers who missed the entry window three years ago are now competing for a shrinking secondary market.\n\nOff-plan absorption, meanwhile, has settled into a steadier rhythm after the exceptional pace of 2023–2024. This isn’t a slowdown so much as a normalisation — developers are pricing more conservatively at launch, and buyers are taking longer to compare payment plans before committing. For end-users this is good news: less pressure to decide within 48 hours of a launch event.\n\nOur read heading into Q4: expect continued strength in true waterfront stock, more selective appetite for inland off-plan, and a widening gap between assets with a story (island, frond, sky-high) and everything else.',
    coverImage: exteriors[1],
    category: 'Market Insight',
    authorId: 'a1',
    publishedAt: '2026-08-18',
    readMinutes: 6,
    featured: true,
  },
  {
    id: 'j2',
    slug: 'golden-visa-through-property-buyers-guide',
    title: 'A Buyer’s Guide to the Golden Visa Through Property',
    excerpt:
      'The residency route is simpler than most buyers expect, but the AED 2 million threshold hides a few details that determine whether a purchase actually qualifies.',
    body:
      'The UAE’s 10-year Golden Visa remains one of the strongest arguments for international buyers to convert a Dubai purchase from an investment into a genuine second base. The property route requires a minimum AED 2 million in real estate, held either outright or with a specific mortgage structure through an approved local bank — the distinction matters, because not every financing arrangement qualifies on its own.\n\nA single property at or above the threshold is the cleanest path, but two properties can be combined to meet it, provided both are fully owned and one alone is worth at least AED 1 million. Off-plan purchases are eligible too, though most banks and the relevant authority want to see a meaningful portion paid rather than the bare minimum booking deposit.\n\nThe visa itself covers the applicant, spouse, and children, and — for an additional requirement around income — can extend to parents and a limited number of domestic staff. Renewal is straightforward as long as the qualifying property is retained; selling it before the ten years are up can affect status, which is worth building into any longer-term exit planning from day one.\n\nWe walk every qualifying client through this before an offer is made, not after, since the visa strategy occasionally changes which unit or which floor makes more sense than the one that first caught their eye.',
    coverImage: interiors[3],
    category: 'Buying Guide',
    authorId: 'a2',
    publishedAt: '2026-08-02',
    readMinutes: 5,
  },
  {
    id: 'j3',
    slug: 'inside-jumeirah-bay-island',
    title: 'Inside Jumeirah Bay Island, Dubai’s Highest-Priced Address',
    excerpt:
      'A private island beside the Bulgari Resort, with fewer than 90 mansion plots ever built — and almost none of them changing hands twice.',
    body:
      'Shaped like a seahorse and connected to the mainland by a single bridge, Jumeirah Bay Island was never designed to be a volume play. Fewer than 90 mansion plots exist on the island in total, and a meaningful share of owners have held their properties since original handover — resale stock is genuinely scarce, which is most of the reason the island now commands the highest average price per square foot in Dubai.\n\nWhat buyers are paying for is less the house than the setting: uninterrupted Gulf views on three sides for many plots, direct beach access, and proximity to the Bulgari Resort and its residents-only marina and spa privileges. Architecture across the island varies plot to plot — there’s no single master developer aesthetic imposed here the way there is on newer islands — which means the diligence on any specific mansion matters more than usual.\n\nFor buyers weighing the Palm against Jumeirah Bay Island, the honest comparison is privacy versus scale. The Palm offers more inventory, more amenity variety, and an established rental market; Jumeirah Bay Island offers fewer neighbours, fewer boats passing the shoreline, and a price that reflects exactly that scarcity.\n\nWe currently represent two off-market mansions on the island for qualified buyers only — neither will appear in any public listing.',
    coverImage: exteriors[6],
    category: 'Neighborhood Guide',
    authorId: 'a3',
    publishedAt: '2026-07-22',
    readMinutes: 5,
  },
  {
    id: 'j4',
    slug: 'reading-an-off-plan-payment-plan',
    title: 'What a 30/40/30 Payment Plan Actually Commits You To',
    excerpt:
      'Off-plan payment structures look simple on a brochure. The construction-linked middle tranche is where most first-time buyers misjudge their own cash flow.',
    body:
      'Every developer markets its payment plan as a headline number — 30/40/30, 20/50/30, 1% a month — but the structure that actually matters is the middle tranche, the one tied to construction milestones rather than fixed dates. A 40% construction-linked payment sounds identical across two projects until you compare their actual build schedules: a project tracking ahead of plan can trigger payment calls faster than a buyer’s personal cash flow anticipated.\n\nThe booking payment (typically 10–20%) reserves the unit and is usually due within days of signing the sale agreement. The construction-linked tranche is released in stages as the developer hits contractual milestones — foundation, structure, MEP, finishing — and this is where buyers should ask for the actual construction schedule, not just the percentage split, before signing anything.\n\nThe handover balance, commonly the final 20–30%, is due on or near completion and is the tranche most often financed with a mortgage once the unit is ready to be valued by a bank. It’s worth pre-clearing eligibility for this stage well before handover, particularly for buyers who plan to finance rather than pay the balance in cash.\n\nOur new developments desk models the actual expected cash-flow timeline against a buyer’s own liquidity before any reservation form is signed — the brochure percentages are the easy part.',
    coverImage: interiors[9],
    category: 'Off-Plan',
    authorId: 'a4',
    publishedAt: '2026-07-05',
    readMinutes: 5,
  },
  {
    id: 'j5',
    slug: 'downtown-vs-dubai-marina',
    title: 'Downtown or Dubai Marina: Choosing Between Two Skylines',
    excerpt:
      'Both are vertical, both are iconic on a postcard, and both attract entirely different kinds of owners. The right answer usually comes down to how you actually plan to use the city.',
    body:
      'Downtown Dubai and Dubai Marina are the two addresses most international buyers arrive already knowing by name, and the two are compared constantly — reasonably so, since both offer full-floor sky residences, five-star-adjacent living, and genuinely global name recognition. The differences that matter are quieter than the skyline photos suggest.\n\nDowntown is a destination first and a neighbourhood second. Burj Khalifa, Dubai Mall, and the Opera District sit within a ten-minute walk of most towers, which makes it the address of choice for owners who want to step outside into the city’s cultural core, and for landlords targeting short-let and corporate tenants who value that same proximity. It is, by design, busier — more tourists, more events, more footfall at street level.\n\nDubai Marina reads as more residential despite its density. The two-kilometre promenade, direct beach access at JBR, and a genuinely long-running social and dining scene give it a settled, lived-in character that Downtown’s newer towers haven’t built up yet. Rental yields here tend to run stronger, partly because the tenant pool — long-term expatriate professionals — is broader than Downtown’s more transient mix.\n\nOur rule of thumb with clients: if the property is a primary or secondary home you’ll use often, Downtown’s density earns its premium. If it’s a yield-focused hold or a home for a family that wants a walkable, beach-adjacent routine, Marina usually wins the comparison.',
    coverImage: exteriors[2],
    category: 'Neighborhood Guide',
    authorId: 'a2',
    publishedAt: '2026-06-20',
    readMinutes: 6,
  },
  {
    id: 'j6',
    slug: 'furnishing-a-sky-residence',
    title: 'Furnishing a Sky Residence: Notes From Dubai’s Design Circuit',
    excerpt:
      'Floor-to-ceiling glazing solves a view problem and creates a lighting one. What Dubai’s better interior studios do differently above the 60th floor.',
    body:
      'A full-floor residence above the 60th floor presents a problem most interior briefs never have to solve: light that changes character completely between morning and sunset, glazing on two or three exposures, and almost no exterior wall space for the kind of layered, lamp-lit warmth that grounds a lower-rise home. The studios doing this well in Dubai right now are leaning into the height rather than fighting it.\n\nMaterial choices shift accordingly. Book-matched marble and large-format stone read better at altitude than busy pattern work, which tends to visually compete with the skyline itself. Furniture silhouettes trend lower and more horizontal, keeping sightlines to the view uninterrupted from most seating positions — a detail that sounds decorative but measurably affects how a AED 20 million-plus apartment actually feels to live in day to day.\n\nLighting is the real craft. Because natural light shifts so dramatically across a single day at height, the better studios are designing layered, zoned lighting — separate circuits for daytime accent, evening ambient, and a genuine “dark sky” setting for nights when the city view itself is the only light source wanted in the room. It’s a level of lighting design most mid-rise apartments never require.\n\nWe work with a small shortlist of studios who specialise specifically in this altitude, and increasingly recommend clients budget for lighting design as its own line item rather than folding it into a general furnishing allowance.',
    coverImage: interiors[14],
    images: [interiors[15], interiors[16], interiors[17], interiors[18]],
    category: 'Lifestyle',
    authorId: 'a5',
    publishedAt: '2026-06-03',
    readMinutes: 4,
  },
  {
    id: 'j7',
    slug: 'why-the-best-villas-never-see-a-for-sale-sign',
    title: 'Why Dubai’s Best Villas Rarely See a For-Sale Sign',
    excerpt:
      'The most sought-after frond and island properties are sold before they’re ever publicly listed. Here’s how that market actually works.',
    body:
      'A meaningful share of the transactions we close each quarter never appear on a public portal, never carry a viewing board outside the gate, and are never seen by anyone outside a short list of pre-qualified buyers. This isn’t exclusivity for its own sake — it’s how sellers at the very top of the market actually prefer to sell.\n\nA public listing tells the entire market, including a seller’s own neighbours and social circle, that a property is for sale — information many owners at this level would rather control. It also invites tyre-kickers, unqualified inquiries, and, in a market as closely watched as Dubai’s prime segment, speculation about why a well-known family might be selling. A quiet, invitation-only process avoids all of it.\n\nFor buyers, access to this market is entirely relationship-driven. It requires a consultant who genuinely knows what’s coming before it’s formally for sale — which means proof of funds and a clear brief matter more here than they do in the public market, since sellers are choosing who even gets to see the property, not just who makes an offer.\n\nThis is the majority of what our private client desk actually does day to day: not writing listings, but matching a short list of known sellers to a shorter list of qualified, briefed buyers, well before either side is ready to go public.',
    coverImage: exteriors[0],
    category: 'Market Insight',
    authorId: 'a1',
    publishedAt: '2026-05-15',
    readMinutes: 5,
  },
];

export function getArticleBySlug(slug: string) {
  return articles.find((a) => a.slug === slug);
}
