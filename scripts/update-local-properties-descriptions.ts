import fs from 'node:fs';
import path from 'node:path';

const PROPERTIES_PATH = path.resolve('src/data/properties.ts');

const newDescriptions: Record<string, string> = {
  p1: `A fully upgraded beachfront villa situated on one of Palm Jumeirah’s most prestigious fronds, commanding panoramic views across the Arabian Gulf to the Dubai Marina skyline. Completely reimagined by an award-winning architectural and interior studio, this six-bedroom residence merges contemporary coastal aesthetics with book-matched Italian marble, automated shading, and curated designer fittings.

### Key Highlights

• 6 En-suite Bedrooms, 7 Bathrooms
• Built-up area: 11,200 sq. ft. | Plot size: 15,500 sq. ft.
• Private white sand beach frontage with deep-water swim access
• Infinity-edge swimming pool, heated jacuzzi, and sunken fire-pit lounge
• Rooftop majlis and entertainment terrace with 360-degree skyline vistas
• Private cinema room, temperature-controlled wine cellar, and executive home office
• Separate staff quarters, driver room, and private gymnasium

### Architecture & Interior Design

The ground level features double-height ceilings and expansive floor-to-ceiling glass facades that frame the sea. A grand formal reception hall transitions seamlessly to an open-plan show kitchen equipped with Gaggenau appliances, complemented by a discreet secondary service kitchen.

• Book-matched Calacatta marble flooring throughout main reception areas
• Custom Italian millwork and integrated acoustic timber paneling
• Master retreat featuring dual dressing suites, private terrace, and marble spa bath
• Integrated Crestron smart home automation for climate, security, and illumination
• Enclosed multi-car garage with air-conditioned motor court

### Lifestyle & Waterfront Privileges

• Direct private beach access onto the tranquil frond waters
• Private moorings suitable for jet skis and private yachts
• Minutes from Nakheel Mall, Atlantis The Royal, and premier Palm dining
• 24/7 security with gated frond access control`,

  p2: `Perched above the 120th floor of the Burj Khalifa, the world's most iconic supertall tower, this full-floor Sky Residence commands an unrivaled vantage point over Dubai. Floor-to-ceiling panoramic glass captures sweeping vistas spanning the Dubai Fountains, Downtown skyline, and the open waters of the Arabian Gulf.

### Key Highlights

• 4 Bedroom Suites, 5 Bathrooms
• Built-up area: 6,400 sq. ft. occupying an entire private floor plate
• Ultra-high-floor positioning above the 120th level
• Unobstructed 360-degree views of the Dubai Fountain, city, and coastline
• Dedicated private elevator lobby with biometric access control
• Fully furnished with bespoke designer furnishings and Armani-curated finishes
• 4 allocated secure basement parking bays

### Spatial Flow & Penthouse Interiors

Designed for elite privacy and state-of-the-art entertaining, the residence features a grand circular gallery, double reception salon, and a formal dining suite overlooking the dancing fountains far below.

• Expansive double salon with integrated presentation wet bar and wine display
• Chef’s kitchen equipped with professional-grade Miele appliances
• Primary suite with dual walk-in dressing rooms, private salon, and marble bathroom
• Smart home integration controlling bespoke lighting scenes, motorized shades, and climate
• Private study and executive library with skyline vistas

### Resident Privileges & Tower Amenities

• Direct climate-controlled indoor access to The Dubai Mall and Armani Hotel
• Access to the highest resident sky lounge in the world on level 123
• Indoor and outdoor swimming pools, Jacuzzis, and luxury wellness spas
• 24-hour valet parking, dedicated concierge, and round-the-clock security`,

  p3: `Occupying a prime corner position within the acclaimed Marina Gate development by Select Group, this waterfront residence captures striking dual-aspect views over the bustling marina waterway and the Arabian Gulf. Designed with clean modern lines and abundant natural light, the apartment offers effortless access to the Marina Walk.

### Key Highlights

• 2 Bedrooms, 3 Bathrooms
• Built-up area: 1,450 sq. ft.
• Prime corner-unit layout with dual-aspect marina and sea views
• Developed by Select Group in Marina Gate, Dubai Marina
• Large wrap-around viewing balcony
• Walking distance to JBR beach, tram, and Dubai Marina Mall
• 1 allocated covered parking space

### Interior Layout & Finishes

The residence centers around a sunlit open-concept living and dining area with sliding glass doors opening onto the wrap-around balcony. Modern porcelain tiling, minimalist joinery, and an open designer kitchen create an inviting, contemporary atmosphere.

• Expansive living and dining room with floor-to-ceiling double-glazed windows
• Semi-open kitchen with stone countertops and integrated appliances
• Master bedroom with fitted wardrobes and luxury en-suite bathroom
• Second double bedroom with en-suite bath and built-in wardrobes
• Separate guest powder room and dedicated utility laundry room

### Building Amenities & Marina Living

• Expansive infinity swimming pool overlooking the marina yachts
• Two-level state-of-the-art gymnasium with steam room and sauna
• Championship-standard squash and paddle tennis courts
• Direct access to the 7-kilometre pedestrian Marina Walk promenade
• Gated security, 24/7 concierge, and secure visitor parking`,

  p4: `One of only a handful of double-plot trophy estates in Emirates Hills, this palatial residence commands premier frontage along the championship fairways of the Montgomerie Golf Course. Set behind private gates within Sector E, the estate offers an unparalleled sanctuary of privacy, craftsmanship, and grand entertaining.

### Key Highlights

• 8 Bedroom Suites, 10 Bathrooms
• Built-up area: 18,500 sq. ft. | Sprawling plot: 26,000 sq. ft.
• Prime double-plot frontage directly overlooking the Montgomerie golf fairways
• Private temperature-controlled indoor and outdoor swimming pools
• Dedicated 12-car motor court with subterranean executive parking
• State-of-the-art private screening room and acoustic cinema
• Sommelier wine cellar, cigar lounge, and private wellness spa

### Architectural Grandeur & Finishes

A dramatic double-height foyer with a sweeping bifurcated staircase welcomes guests into grand formal salons, formal dining halls, and expansive family living zones framed by manicured garden views.

• Rare imported French limestone, book-matched marble, and handcrafted parquetry
• Commercial-grade catering kitchen alongside an exquisite family show kitchen
• Royal master wing featuring his-and-hers dressing salons, private plunge pool, and terrace
• Private wellness pavilion including Moroccan hammam, steam room, and sauna
• Separate staff wing accommodating up to 8 staff members with private facilities

### Estate Grounds & Community Privileges

• Meticulously landscaped formal gardens with mature palm trees and water features
• Expansive outdoor entertaining pergola with summer kitchen and barbecue bar
• Gated community with 24-hour elite security patrols in Dubai's premier residential enclave
• Direct golf cart access to the Montgomerie Club House and Academy`,

  p5: `A designer-furnished one-bedroom residence positioned in Bay Central, Business Bay, directly fronting the Dubai Water Canal. Combining serene canal reflections with immediate connectivity to Downtown Dubai, this turnkey apartment is tailored for corporate executives and discerning professionals.

### Key Highlights

• 1 Bedroom, 2 Bathrooms
• Built-up area: 890 sq. ft.
• Frontline panoramic views of the Dubai Water Canal
• Located in Bay Central, Business Bay
• Annual rent: AED 165,000 (yearly lease)
• Turnkey designer furniture, ambient lighting, and bespoke homeware
• 1 allocated covered parking space

### Residence Features & Layout

The interior layout emphasizes open flow and natural light, with floor-to-ceiling glass leading onto a private balcony overlooking the canal yachts and promenade.

• Sunlit open-plan living and dining lounge
• Modern open-concept kitchen fitted with high-end appliances and breakfast counter
• Generous master bedroom with built-in wardrobe suite and en-suite bath
• Separate guest powder room
• Private balcony offering serene waterfront panoramas

### Building Facilities & Canal Lifestyle

• Temperature-controlled outdoor swimming pool and sun deck
• Fully equipped gym and wellness health club
• Direct pedestrian access to the 6.4km Dubai Water Canal promenade
• 24-hour concierge, CCTV surveillance, and secure resident parking
• 5 minutes to Business Bay Metro station, Downtown Dubai, and DIFC`,

  p6: `An ultra-prime beachfront trophy mansion situated on the exclusive seahorse-shaped Jumeirah Bay Island, enjoying privileged access to the Bulgari Resort & Residences. Delivering 180-degree unobstructed panoramas across the open Arabian Gulf to the Downtown skyline, this residence represents the absolute pinnacle of private island luxury.

### Key Highlights

• 7 Bedroom Suites, 9 Bathrooms
• Built-up area: 21,000 sq. ft. | Prime island plot: 28,000 sq. ft.
• Private deep-water marina berth accommodating superyachts up to 40 meters
• Private pristine beachfront with direct water access
• Full access to Bulgari Resort amenities, restaurants, and private yacht club
• Fully furnished with Italian bespoke designer furnishings and custom joinery
• Underground climate-controlled gallery garage for 8 vehicles

### Palace Architecture & Spatial Design

Crafted by world-renowned architects, the mansion balances grand proportions with organic coastal warmth. Grand sliding glass walls dissolve the boundary between the internal salons and the seaside terraces.

• Dramatic double-height grand salon with travertine columns and fire features
• Master penthouse suite occupying an entire wing with dual marble spa baths
• Professional chef’s kitchen and bespoke show kitchen with marble island
• Private wellness sanctuary featuring indoor pool, Turkish hammam, and ice room
• Full Crestron smart automation governing security, sound, lighting, and climate

### Island Privileges & Connectivity

• Exclusive gated island accessible via a private 300-meter vehicular bridge
• Minutes from the world’s first Bulgari Yacht Club and marina promenade
• 10 minutes to DIFC, Downtown Dubai, and Jumeirah beach road
• Uncompromising 24-hour elite island security and private concierge`,

  p7: `A contemporary five-bedroom family villa situated within the coveted Park Heights enclave in Dubai Hills Estate. Positioned on an expansive 6,800 sq. ft. plot, this home overlooks the championship golf course and provides a private landscaped sanctuary within walking distance of Dubai Hills Park and Mall.

### Key Highlights

• 5 En-suite Bedrooms, 6 Bathrooms
• Built-up area: 5,200 sq. ft. | Plot size: 6,800 sq. ft.
• Overlooking the lush fairways of the Dubai Hills golf course
• Private swimming pool with sun deck and landscaped perimeter garden
• Located in Park Heights, Dubai Hills Estate
• Purchase price: AED 8,900,000
• Dedicated maid’s room, driver’s room, and 2-car covered garage

### Villa Layout & Living Spaces

The home features clean cubic architecture and open-plan family living zones that open to the garden and pool deck. Wide glass walls bathe the interiors in natural daylight throughout the day.

• Double-height entrance hall and open-plan family living and dining room
• Modern open-concept show kitchen with island counter plus preparatory wet kitchen
• Ground-floor guest bedroom suite ideal for visitors or multi-generational families
• Four en-suite bedrooms on the upper level, each with private balconies
• Primary master suite with walk-in dressing gallery and luxury soaking tub

### Community Amenities & Green Living

• Direct access to Dubai Hills Golf Club’s 18-hole championship course
• Walking distance to Dubai Hills Park, sports courts, and splash zones
• Minutes from Dubai Hills Mall with 650+ premium shopping and dining venues
• Gated neighborhood security, shaded cycling paths, and community pools`,

  p8: `Set directly along the rolling fairways of the prestigious Fire Course within Redwood Avenue at Jumeirah Golf Estates, this six-bedroom villa offers double-height living spaces, timeless Mediterranean architecture, and panoramic views over the 14th green.

### Key Highlights

• 6 En-suite Bedrooms, 7 Bathrooms
• Built-up area: 7,100 sq. ft. | Plot size: 9,000 sq. ft.
• Direct fairway frontage on the Greg Norman-designed Fire Course
• Private infinity swimming pool and landscaped golf-view garden
• Located in Redwood Avenue, Jumeirah Golf Estates
• Purchase price: AED 12,500,000
• Full country club and golf membership privileges eligible

### Spatial Grandeur & Finishes

The villa is characterized by soaring double-height ceilings, arched French doors, and generous family living spaces that blend indoor leisure with outdoor entertaining.

• Grand double-height reception hall with sweeping wrought-iron staircase
• Formal dining salon and expansive family lounge opening to the pool terrace
• Fully integrated designer kitchen with central island and secondary service kitchen
• Luxurious master suite with private viewing balcony overlooking the fairway
• Five additional en-suite bedroom suites, dedicated study, and maid’s quarters

### Championship Golf Lifestyle

• Two world-class 18-hole championship courses: Earth and Fire
• Home to the DP World Tour Championship European Tour season finale
• Country club with tennis academy, resort pools, and fine-dining restaurants
• 24-hour gated community security with private buggy circulation paths`,

  p9: `A sensational duplex penthouse set high within the iconic Address Sky View towers in Downtown Dubai, featuring a private sky bridge connection, private plunge pool, and front-row panoramic views of the Burj Khalifa and the dancing fountains.

### Key Highlights

• 3 Bedroom Suites, 4 Bathrooms
• Built-up area: 3,600 sq. ft. across a dramatic duplex layout
• Direct, front-row views of the Burj Khalifa and Dubai Fountain lake
• Private plunge pool on the expansive sky terrace
• Located in Address Sky View, Downtown Dubai
• Annual rent: AED 950,000 (yearly lease)
• Fully serviced with five-star Address Hotels & Resorts hospitality

### Duplex Architecture & Luxury Appointments

The lower level features double-height living and entertaining spaces wrapped in floor-to-ceiling glass, opening directly onto the private plunge pool terrace. The upper level provides private bedroom suites and executive study areas.

• Dramatic double-height living room with direct skyline panorama
• Fully fitted designer kitchen with integrated high-end appliances
• Master bedroom suite with walk-in dressing room and marble spa bath
• Private viewing plunge pool overlooking the fountain lake
• Full smart home automation and bespoke designer furnishings

### Hotel Privileges & Tower Amenities

• Access to the famous level-54 cantilevered infinity sky pool
• Direct air-conditioned travelator link to Dubai Mall and Metro station
• 24-hour in-residence dining, housekeeping, and concierge services
• World-class spa, fitness centre, and signature dining venues`,

  p10: `A rare duplex residence in Marina Promenade by Emaar, featuring an expansive private terrace directly overlooking the yachts and promenade of Dubai Marina. Offered partly furnished, this three-bedroom home combines townhouse-like space with luxury tower amenities.

### Key Highlights

• 3 Bedrooms, 4 Bathrooms
• Built-up area: 2,400 sq. ft. across an open two-level duplex layout
• Prime waterfront position directly over the marina promenade
• Developed by Emaar Properties in Marina Promenade, Dubai Marina
• Annual rent: AED 210,000 (yearly lease)
• Expansive private terrace ideal for al fresco waterfront entertaining
• 2 dedicated covered parking spaces

### Duplex Layout & Living Spaces

The ground level features an expansive living and dining area with glass doors leading to the deep garden-like terrace. The upper level houses the quiet bedroom suites.

• Large open-plan living and dining room with marina water views
• Fully equipped semi-open kitchen with stone countertops and appliances
• Master bedroom suite with private balcony, walk-in closet, and en-suite bath
• Two further bedrooms with built-in wardrobes and contemporary bathrooms
• Maid's room, utility storage, and guest powder room

### Marina Promenade Facilities

• Resort-style swimming pool and modern fitness gymnasium
• Squash courts, badminton court, and billiards room
• Direct pedestrian gate opening onto the Marina Walk
• 24/7 security, concierge reception, and secure visitor parking`,

  p11: `A recently completed contemporary signature villa positioned at the prime tip of Frond M on Palm Jumeirah. Boasting a private boat pontoon, floor-to-ceiling glass-walled family salons, and direct private beach access, this residence captures uninterrupted views of the open sea.

### Key Highlights

• 5 En-suite Bedrooms, 6 Bathrooms
• Built-up area: 8,900 sq. ft. | Plot size: 11,000 sq. ft.
• Prime frond-tip location with deep-water frontage and private pontoon
• Direct private beach access onto the Arabian Gulf
• Infinity pool, landscaped deck, and expansive rooftop viewing terrace
• Developed on Frond M, Palm Jumeirah
• Purchase price: AED 24,500,000

### Contemporary Coastal Architecture

Designed with a sleek minimalist aesthetic, the villa features transparent architecture that invites the ocean inside. High ceilings and white marble floors amplify the natural light throughout.

• Glass-walled family room and formal salon opening directly to the beach
• Designer show kitchen with marble breakfast bar and preparation scullery
• Five bedroom suites with private en-suite bathrooms and viewing terraces
• Rooftop lounge with 360-degree views across the Palm crescent
• Private elevator servicing all levels, maid's room, and 2-car garage

### Private Island Lifestyle

• Private boat pontoon accommodating speedboats and watersports craft
• Peaceful frond setting protected from public marine traffic
• Gated security with 24-hour guarded entry
• Minutes from Nakheel Mall, The Pointe, and luxury beach clubs`,

  p12: `Positioned within the prestigious Opera District in Downtown Dubai, this elegant two-bedroom apartment in Act One | Act Two by Emaar commands front-row perspectives of the Dubai Opera house, Burj Khalifa, and the fountain lake.

### Key Highlights

• 2 Bedrooms, 3 Bathrooms
• Built-up area: 1,580 sq. ft.
• Frontline vistas of Dubai Opera, Burj Khalifa, and Fountain Lake
• Developed by Emaar Properties in the Opera District, Downtown Dubai
• Purchase price: AED 4,200,000
• Vacant and ready for immediate occupation
• Dedicated covered parking space

### Refined Layout & Interior Specifications

The apartment features an open-plan layout inspired by the theatrical elegance of the Opera District, with neutral color palettes, polished stone, and oversized glass windows.

• Expansive open-plan living and dining lounge leading onto a private balcony
• Modern semi-open kitchen with integrated appliances and stone countertops
• Primary bedroom suite with walk-in wardrobe and luxury en-suite bathroom
• Second double bedroom with en-suite bath and built-in wardrobes
• Separate powder room and dedicated laundry utility closet

### Resident Amenities & Opera District Culture

• Infinity-edge swimming pool overlooking the Burj Khalifa
• State-of-the-art health club, gymnasium, and yoga studio
• Dedicated resident concierge and 24-hour security
• Direct walking access to Dubai Opera, Burj Park, and The Dubai Mall`,

  p13: `A prime one-bedroom suite positioned on Marasi Drive in Business Bay, delivering direct canal-walk access and attractive rental returns. Featuring modern finishes and generous floor plans, this property appeals to both end-users and yield-focused investors.

### Key Highlights

• 1 Bedroom, 2 Bathrooms
• Built-up area: 980 sq. ft.
• Direct canal-walk access on Marasi Drive, Business Bay
• Purchase price: AED 2,650,000
• Projected gross rental yield of 7.2% - 8.0%
• Balcony overlooking the water and city skyline
• Allocated covered parking bay

### Interior Design & Layout

The residence offers a generous one-bedroom footprint with a bright open-concept living area, open kitchen, and a private balcony overlooking the canal.

• Generous living and dining room with floor-to-ceiling windows
• Modern open-concept kitchen fitted with stone surfaces and cabinetry
• Master bedroom suite with built-in wardrobe and en-suite bathroom
• Dedicated guest powder room and storage utility
• Private balcony ideal for morning coffee above the canal promenade

### Tower Amenities & Waterfront Convenience

• Swimming pool and landscaped sundeck
• Fully equipped fitness gym and wellness facilities
• Retail and dining promenade located at the building podium
• Minutes from Business Bay Metro station, Downtown Dubai, and DIFC`,

  p14: `A statement seven-bedroom mansion in Golf Place within Dubai Hills Estate, featuring a double-height grand entrance hall, private acoustic cinema, indoor-outdoor pool deck, and panoramic views across the championship golf course.

### Key Highlights

• 7 Bedroom Suites, 8 Bathrooms
• Built-up area: 13,500 sq. ft. | Sprawling plot: 17,000 sq. ft.
• Direct frontage onto the Dubai Hills 18-hole championship golf course
• Double-height grand entrance gallery with architectural chandelier
• Private indoor-outdoor swimming pool deck with sunken lounge
• Private home cinema, wine cellar, and executive study
• Purchase price: AED 32,000,000

### Palatial Architecture & Finishes

Designed for grand entertaining and family luxury, the mansion balances dramatic spatial volume with intimate family retreats.

• Soaring double-height ceilings in the main reception salon
• Dual kitchen configuration: high-end show kitchen and industrial service kitchen
• Magnificent master retreat with private salon, his-and-hers dressing rooms, and spa bath
• Six additional guest suites with en-suite bathrooms and walk-in wardrobes
• Complete smart home system and multi-car air-conditioned garage

### Dubai Hills Estate Privileges

• Direct golf course access and clubhouse privileges
• Minutes from Dubai Hills Mall, Kings College Hospital, and top international schools
• Secure gated enclave with 24-hour guarded security patrols`,

  p15: `A fully furnished luxury residence within The Palm Tower on Palm Jumeirah, managed to five-star St. Regis standards. Offering direct internal access to Nakheel Mall and proximity to the famous Aura Skypool, this two-bedroom home combines landmark living with hotel convenience.

### Key Highlights

• 2 Bedrooms, 3 Bathrooms
• Built-up area: 1,700 sq. ft. on a high floor
• Five-star St. Regis hotel management and bespoke resident services
• Direct climate-controlled indoor access to Nakheel Mall
• Annual rent: AED 380,000 (yearly lease)
• Fully furnished with St. Regis-curated luxury furnishings
• Dedicated covered parking with resident valet services

### Suite Layout & Hotel-Grade Specifications

The residence features an open-concept living and dining salon wrapped in floor-to-ceiling glass, framing panoramic views across the Palm fronds and the Arabian Gulf.

• Light-filled living and dining area with bespoke designer furniture
• Fully equipped modern kitchen with integrated premium appliances
• Two master suites, each with walk-in dressing areas and marble spa bathrooms
• Powder room and dedicated laundry utility space
• Complete turnkey presentation ready for immediate residency

### Exclusive Building Facilities

• Access to the infinity pool observation deck and St. Regis Beach Club
• 24-hour St. Regis concierge, in-room dining, and housekeeping options
• State-of-the-art fitness centre, spa, and wellness suites
• Direct elevator link to Nakheel Mall's 300+ stores, cinemas, and dining`,

  p16: `An exquisite six-bedroom villa positioned in Sector L of Emirates Hills, facing both the tranquil community lake and the Montgomerie golf course. Set behind mature manicured landscaping, this estate offers supreme privacy and a resort-style pool terrace.

### Key Highlights

• 6 Bedroom Suites, 7 Bathrooms
• Built-up area: 12,800 sq. ft. | Plot size: 18,500 sq. ft.
• Dual frontage facing both the community lake and Montgomerie golf course
• Exceptional privacy behind mature botanical gardens
• Resort-style swimming pool, heated jacuzzi, and private outdoor gazebo
• Purchase price: AED 39,500,000
• Dedicated guest annex, staff quarters, and 4-car private garage

### Timeless Villa Architecture

The villa features classic Mediterranean architectural proportions with expansive open reception halls, marble fireplaces, and high decorative ceilings.

• Formal living and dining salons with French doors leading to the garden
• Spacious family living room and informal breakfast pavilion
• Large chef’s kitchen with integrated appliances and separate service pantry
• Master suite featuring private viewing terrace overlooking the lake and golf course
• Five additional bedroom suites with private en-suite bathrooms

### Elite Gated Community

• 24-hour security and controlled gated access in Dubai's premier residential address
• Minutes to the Montgomerie Clubhouse and Dubai British School
• Effortless road links to Dubai Marina, Downtown Dubai, and DXB Airport`,

  p17: `A modern four-bedroom contemporary townhouse in the exclusive Hills Grove enclave within Dubai Hills Estate. Spanning three storeys with clean architectural lines, private garden, and roof terrace, this home is offered on an attractive post-handover payment structure.

### Key Highlights

• 4 Bedrooms, 5 Bathrooms
• Built-up area: 3,100 sq. ft. | Plot size: 2,400 sq. ft.
• Three-storey architectural design with private roof terrace
• Located in Hills Grove, Dubai Hills Estate
• Purchase price: AED 5,100,000
• Extended post-handover payment plan available
• Brand-new contemporary handover

### Smart Urban Living & Layout

The home is optimized for modern families, featuring open-plan ground floor living that extends into the private rear garden, complemented by an upper-level family retreat and roof deck.

• Bright open-plan living and dining hall with floor-to-ceiling glass
• Contemporary open kitchen with stone countertops and quality joinery
• First-floor bedroom suites with built-in wardrobes and en-suite baths
• Rooftop terrace suite ideal for an entertainment lounge or private study
• En-suite maid’s room, laundry utility, and 2-car covered carport

### Community Amenities & Green Infrastructure

• Resort community swimming pools, splash pads, and sun decks
• Walking trails, sports courts, and landscaped pocket parks
• Minutes to Dubai Hills Park and Dubai Hills Mall
• Secure gated neighborhood with 24/7 security`,

  p18: `Perched on an elevated high floor of Marina Vista by Emaar, this exceptional three-bedroom residence commands unobstructed views across Dubai Marina, JBR, and the open waters of the Arabian Gulf. Delivered to a fully furnished specification with private beach access.

### Key Highlights

• 3 Bedrooms, 4 Bathrooms
• Built-up area: 2,050 sq. ft. on a high floor
• Unobstructed panoramic views over the marina, JBR, and Arabian Gulf
• Fully furnished with contemporary developer-curated designer furnishings
• Located in Marina Vista, Dubai Marina
• Purchase price: AED 6,200,000
• Dedicated covered parking with private beach shuttle access

### Coastal High-Rise Living

The residence is characterized by clean nautical lines and light-filled open spaces. Full-height glass doors lead out to a deep private viewing balcony overlooking the yachts.

• Open-concept living and dining lounge framed by sea and marina views
• Modern kitchen fitted with integrated appliances and stone breakfast counter
• Master bedroom suite with walk-in wardrobe, marble bathroom, and sea vistas
• Two additional double bedrooms with en-suite bathrooms and built-in storage
• Separate guest powder room and dedicated utility laundry room

### Resort Facilities & Waterfront Access

• Infinity-edge swimming pool overlooking the marina skyline
• Fully equipped fitness gymnasium and wellness studios
• Private beach access and dedicated shuttle service
• 24-hour concierge, CCTV surveillance, and covered resident parking`,

  p19: `Part of the final release of bespoke luxury villas within the Redwood Avenue collection at Jumeirah Golf Estates, this five-bedroom residence backs directly onto the world-renowned Earth Course with a projected Q4 2027 handover.

### Key Highlights

• 5 En-suite Bedrooms, 6 Bathrooms
• Built-up area: 5,600 sq. ft. | Plot size: 7,200 sq. ft.
• Backing directly onto the Earth Course (home of the DP World Tour Championship)
• Private swimming pool option with landscaped garden
• Located in Redwood Avenue, Jumeirah Golf Estates
• Purchase price: AED 9,800,000
• Attractive construction-linked milestone payment plan

### Modern Golf-Side Architecture

The villa features contemporary Mediterranean styling with generous open layouts, double-height volumes, and large windows that maximize views across the championship fairways.

• Expansive family living and dining room with panoramic golf course views
• Designer show kitchen with central island and separate preparation kitchen
• Ground-floor guest bedroom suite with private en-suite bathroom
• Four spacious upper-level bedrooms, including a lavish master suite with terrace
• Maid's quarters, laundry room, and multi-car covered garage

### World-Class Country Club Amenities

• Two 18-hole championship courses: Earth and Fire
• Clubhouse with tennis courts, fitness facilities, and resort swimming pools
• 24/7 gated security with private golf-cart circulation
• Easy access to Al Khail Road, Expo City Dubai, and Dubai Marina`,

  p20: `A prime boulevard-facing two-bedroom residence in Boulevard Point by Emaar, situated in the heart of Downtown Dubai with direct air-conditioned link to The Dubai Mall. Overlooking the vibrant Mohammed Bin Rashid Boulevard with balcony views toward the Dubai Fountains.

### Key Highlights

• 2 Bedrooms, 3 Bathrooms
• Built-up area: 1,350 sq. ft.
• Direct boulevard frontage with views toward the Dubai Fountains
• Direct covered bridge connection into The Dubai Mall
• Developed by Emaar Properties in Boulevard Point, Downtown Dubai
• Annual rent: AED 220,000 (yearly lease)
• Fully furnished with modern designer furnishings

### Urban Living & Interior Layout

The residence features a functional open-plan layout with floor-to-ceiling glass leading onto a private balcony overlooking the palm-lined boulevard below.

• Bright living and dining salon with direct balcony access
• Modern semi-open kitchen equipped with quality integrated appliances
• Master bedroom suite with walk-in closet and luxury en-suite bathroom
• Second bedroom with built-in wardrobes and en-suite bath
• Separate guest powder room and utility storage room

### Boulevard Point Amenities

• Elevated swimming pool deck with Burj Khalifa skyline views
• Fully equipped gymnasium, children's play area, and community lawn
• 24-hour concierge, security, and dedicated covered parking
• Direct covered footbridge access into The Dubai Mall and Metro link`,
};

let content = fs.readFileSync(PROPERTIES_PATH, 'utf-8');

for (const [id, desc] of Object.entries(newDescriptions)) {
  // Regex to match property object starting with id: 'pX' and replace its description
  const idRegex = new RegExp(`(id:\\s*'${id}',[\\s\\S]*?description:\\s*)(?:'[^']*'|"[^"]*"|\`[\\s\\S]*?\`)(,)`);
  if (!idRegex.test(content)) {
    console.error(`Could not find property ${id} in properties.ts`);
    continue;
  }
  const escapedDesc = JSON.stringify(desc);
  content = content.replace(idRegex, `$1${escapedDesc}$2`);
  console.log(`Updated description for ${id}`);
}

fs.writeFileSync(PROPERTIES_PATH, content, 'utf-8');
console.log('Successfully updated src/data/properties.ts with structured descriptions!');
