# Nova - Specification-Driven Development (SDD)

**Version:** 1.0  
**Last Updated:** 2026-01-22  
**Project Type:** AI-Powered Travel Planning Application  
**Target Market:** Mexico (Mundial 2026 Focus)  
**Status:** Specification Phase

---

## Table of Contents

1. [Vision & Goals](#vision--goals)
2. [Executive Summary](#executive-summary)
3. [Core Specifications](#core-specifications)
4. [Technical Architecture Plan](#technical-architecture-plan)
5. [AI/ML Strategy](#aiml-strategy)
6. [Implementation Guidelines](#implementation-guidelines)
7. [Constitution](#constitution)
8. [Acceptance Criteria](#acceptance-criteria)
9. [Competitive Analysis](#competitive-analysis)
10. [Monetization Strategy](#monetization-strategy)
11. [Roadmap & Milestones](#roadmap--milestones)

---

## Vision & Goals

### Mission Statement

Nova is the definitive AI-powered travel companion for visitors to Mexico, specifically optimized for the FIFA World Cup 2026. Unlike generic global travel planners, Nova provides hyperlocalized, real-time intelligence about Mexican destinations with a focus on safety, cultural authenticity, and seamless mobility across World Cup host cities.

### Primary Objectives

1. **Become the #1 travel planning tool for Mexico** during the Mundial 2026 period
2. **Deliver superior user experience vs MindTrip AI** through Mexican market specialization
3. **Provide real-time, actionable intelligence** that generic competitors cannot match
4. **Optimize operational costs** through strategic use of AI agents vs traditional ML models
5. **Create a sustainable, monetizable platform** beyond the World Cup timeline

### Success Metrics

- **User Acquisition:** 1,000+ active users by June 2026 (World Cup start)
- **Engagement:** Average 7+ days of active usage per trip
- **Conversion Rate:** 25%+ freemium to premium conversion
- **User Satisfaction:** 4.5+ star rating across app stores
- **Cost Efficiency:** 70% reduction in LLM costs through hybrid AI/ML architecture
- **Market Position:** Top 3 travel apps in Mexico by download volume

### Target Audience

**Primary Personas:**

1. **International Football Fan (35-45 years old)**
   - First-time visitor to Mexico
   - Traveling with friends/family
   - Budget: $3,000-$8,000 USD total
   - Tech-savvy, uses multiple apps for travel
   - Concerns: Safety, language barrier, navigating between cities

2. **Regional Tourist (25-35 years old)**
   - Latin American visitor
   - Interested in football + cultural tourism
   - Budget: $1,500-$4,000 USD
   - Wants authentic experiences beyond tourist traps
   - Values: Local recommendations, cost optimization

3. **Domestic Mexican Traveler (28-40 years old)**
   - Following their team across host cities
   - Knows Mexico but not necessarily all regions
   - Budget: $800-$2,500 USD
   - Needs: Inter-city logistics, accommodation near stadiums
   - Values: Efficiency, local insights

**Secondary Personas:**

4. **Digital Nomad/Expat**
   - Extended stay during World Cup
   - Combining work with cultural immersion
   - Budget: Flexible
   - Values: Co-working spaces, long-term rentals, community

---

## Executive Summary

### The Problem

Current travel planning tools suffer from three critical gaps when applied to Mexico:

1. **Generic Global Approach:** Tools like MindTrip AI optimize for worldwide travel but lack deep Mexican market knowledge (local transport options, safety nuances, cultural events, regional mobility challenges)

2. **Static Information:** Existing platforms provide outdated recommendations that don't reflect real-time conditions (traffic, safety alerts, event congestion, availability)

3. **Mundial 2026 Complexity:** The World Cup creates unprecedented logistical challenges across host cities (CDMX, Guadalajara, Monterrey) that generic tools cannot anticipate or optimize for

### The Solution

Nova addresses these gaps through:

**1. Hyperlocalized Intelligence**
- Deep integration with Mexican transportation systems (ADO, Metro CDMX, Metrobús, Primera Plus)
- Real-time safety alerts by neighborhood using governmental and crowd-sourced data
- Cultural calendar integration (fiestas patronales, local events, regional holidays)
- Mexican Spanish language processing with slang/modism understanding

**2. Real-Time Adaptive Planning**
- Live availability checks for accommodations and restaurants
- Dynamic route optimization based on current traffic and event congestion
- Mundial 2026-specific features (stadium proximity, fan zone locations, multi-city game attendance optimization)
- Weather-aware recommendations with seasonal considerations

**3. Cost-Optimized AI Architecture**
- Hybrid system using LLM agents only where conversational intelligence adds value
- Traditional ML models and algorithms for computational tasks (route optimization, filtering, ranking)
- Reduces operational costs by ~70% vs pure LLM approach
- Enables sustainable freemium model with healthy unit economics

### Competitive Advantage

**vs MindTrip AI:**

| Feature | MindTrip AI | Nova |
|---------|-------------|------|
| Market Focus | Global (200+ countries) | Mexico-specialized |
| Real-time Data | Limited | Extensive (transport, safety, events) |
| Local Transport | Generic recommendations | Deep integration (ADO, Metro, etc.) |
| Safety Intelligence | Basic | Neighborhood-level alerts |
| Mundial 2026 Features | None | Purpose-built |
| Offline Capability | Limited | Full itinerary + maps offline |
| Language | English-primary | Spanish + English with Mexican context |
| Cost Efficiency | High LLM usage | Hybrid AI/ML (70% cost reduction) |

**Unique Value Propositions:**

1. **"Mundial Mode"** - Specialized planning for attending multiple World Cup matches across cities
2. **Safety Intelligence Layer** - Real-time alerts + historical safety data by neighborhood
3. **Cultural Route Themes** - Pre-curated experiences (Ruta del Tequila, Pueblos Mágicos, Archaeological Sites)
4. **True Multi-Modal Transport** - Seamless planning across flights, buses, metro, rideshare
5. **Collaborative Itineraries** - Real-time co-planning for groups (unique for travel apps)
6. **Budget Tracking** - Live expense tracking vs planned budget during trip

---

## Core Specifications

### Feature 1: Conversational Travel Planner Agent

**Purpose:** Enable users to describe their travel preferences in natural language and receive personalized itinerary recommendations.

**User Story:**
```
As a first-time visitor to Mexico planning to attend World Cup matches,
I want to describe my interests, budget, and constraints in a conversation,
So that Nova can generate a customized itinerary without me filling out complex forms.
```

**Functional Requirements:**

1. **Conversational Interface**
   - Accept natural language input in Spanish and English
   - Support voice input for hands-free planning
   - Maintain conversation context across multiple interactions
   - Handle clarifying questions when preferences are ambiguous
   - Support iterative refinement ("make it more budget-friendly", "add more cultural activities")

2. **Preference Extraction**
   - Automatically extract: travel dates, budget range, interests (culture/food/sports/nightlife/nature), accommodation preferences, group size, mobility constraints
   - Infer implicit preferences from conversation tone and context
   - Store user profile for future trip planning (with consent)

3. **Response Generation**
   - Provide conversational, friendly responses (not robotic)
   - Explain reasoning behind recommendations
   - Offer alternatives when primary option unavailable
   - Include cultural context and local tips

4. **Integration Points**
   - Query vector database for relevant locations/experiences
   - Trigger itinerary generation agent when sufficient information gathered
   - Access user's past trip data (if available)
   - Interface with budget tracking system

**Technical Specifications:**

IMPORTANT: the agents are in the folder Turismo_agents_copy/, the main agent is the Turismo_agents_copy\chatbot_agent.py file. The agents are created using langgraph and langchain. The other agents in the folder are for generating the itinerary, but they require modifications to be included correctly.

- **Agent Type:** LLM-based conversational agent
- **Model:** gpt-4o-mini, with fallback to gpt-4o-mini for cost optimization on simple queries
- **Context Window:** Maintain last 10 conversation turns
- **Response Time:** < 3 seconds for conversational responses
- **Language Support:** Spanish (primary), English (secondary)
- **State Management:** Store conversation state in Redis with 24-hour TTL

**Non-Functional Requirements:**

- **Availability:** 99.5% uptime
- **Scalability:** Support 10,000 concurrent conversations
- **Cost Control:** Average < $0.05 per conversation session
- **Privacy:** Zero retention of conversation content after session ends (unless user saves)
- **Accessibility:** WCAG 2.1 AA compliant

**Edge Cases:**

- User requests impossible itinerary (3 cities in 1 day) → Agent explains constraints and offers realistic alternatives
- User provides conflicting preferences → Agent asks clarifying questions
- User switches languages mid-conversation → Agent adapts seamlessly
- Conversation timeout (15 min inactivity) → Save state, allow resume
- User asks unrelated questions (weather, exchange rates) → Agent provides helpful answers but guides back to planning

**Acceptance Criteria:**

- [ ] User can start planning in natural language without forms
- [ ] Agent successfully extracts 90%+ of key preferences within 5 conversation turns
- [ ] Agent maintains context across entire planning session
- [ ] Agent provides culturally relevant recommendations specific to Mexico
- [ ] Average user satisfaction rating > 4.2/5 for conversational experience
- [ ] Cost per conversation session < $0.05

---

### Feature 2: Intelligent Itinerary Generator Agent

**Purpose:** Create optimized day-by-day itineraries based on user preferences, real-time availability, and logistical constraints.

**User Story:**
```
As a traveler with extracted preferences and constraints,
I want Nova to generate a detailed day-by-day itinerary,
So that I have a structured plan optimizing time, cost, and experience quality.
```

**Functional Requirements:**

1. **Itinerary Structure**
   - Generate day-by-day breakdown with time blocks
   - Include: activities, restaurants, accommodations, transportation
   - Provide morning/afternoon/evening structure
   - Include estimated costs per day
   - Show travel time between locations
   - Include buffer time for rest/flexibility

2. **Optimization Criteria**
   - Minimize total travel time between locations
   - Balance activity intensity (avoid exhausting schedules)
   - Respect budget constraints
   - Consider opening hours and reservations needed
   - Account for meal times and cultural dining schedules in Mexico
   - Optimize for Mundial match schedules (if applicable)

3. **Personalization**
   - Weight recommendations by user preferences
   - Adapt to user's pace (relaxed vs intensive)
   - Consider accessibility requirements
   - Account for dietary restrictions
   - Respect cultural/religious considerations

4. **Content Generation**
   - Provide descriptions for each activity/location
   - Include practical tips (what to bring, best time to visit)
   - Highlight safety considerations
   - Suggest local etiquette and customs
   - Include Spanish phrases for key interactions

**Technical Specifications:**

- **Agent Type:** LLM-based generation agent
- **Model:** Claude Sonnet 4 for narrative generation
- **Input:** User preferences JSON + filtered location data
- **Output:** Structured itinerary JSON + narrative description
- **Generation Time:** < 10 seconds for 7-day itinerary
- **Format:** JSON schema for programmatic access + Markdown for display

**Data Dependencies:**

- Filtered locations from vector database
- Real-time availability data (where available)
- Transportation routes and schedules
- Operating hours for attractions
- Current weather forecast
- Event calendar (Mundial, local festivals)

**Non-Functional Requirements:**

- **Quality:** 85%+ of generated itineraries rated "good" or "excellent" by users
- **Consistency:** Same preferences should generate similar quality itineraries
- **Flexibility:** Support 1-30 day itineraries
- **Performance:** Handle 1,000+ itinerary generations per hour
- **Cost:** Average < $0.15 per itinerary generation

**Edge Cases:**

- No availability for preferred dates → Suggest alternative dates or backup options
- Budget too restrictive for preferences → Agent explains tradeoffs and offers compromises
- Itinerary spans multiple cities → Optimize inter-city travel timing
- Major event conflicts (stadium closure, street closures) → Dynamically adapt plan
- Weather disruption → Offer indoor alternatives

**Acceptance Criteria:**

- [ ] Generated itineraries are logistically feasible (verified by algorithm)
- [ ] 90%+ of activities respect operating hours
- [ ] Travel time estimates accurate within ±20%
- [ ] Budget estimates accurate within ±15%
- [ ] User satisfaction with generated itineraries > 4.0/5
- [ ] Itineraries include cultural context and local tips
- [ ] Support export to calendar apps (Google Calendar, Apple Calendar)

---

### Feature 3: Vector-Based Location Discovery System

**Purpose:** Enable fast, semantically intelligent search and filtering of Mexican locations, attractions, restaurants, and experiences without expensive LLM calls.

**User Story:**
```
As the system processing user preferences,
I want to quickly find relevant locations matching user interests,
So that I can present options without incurring high LLM costs for every search.
```

**Functional Requirements:**

1. **Semantic Search**
   - Convert user preferences to embeddings
   - Search vector database for semantically similar locations
   - Support multi-criteria search (cuisine + ambiance + price range)
   - Return ranked results by relevance score

2. **Filtering Capabilities**
   - Filter by: location (city, neighborhood), category (restaurant, museum, park), price range, rating threshold, accessibility features, operating hours
   - Support compound filters (budget Italian restaurants in Roma Norte)
   - Dynamic filtering based on user context (current location, time of day)

3. **Data Coverage**
   - Minimum 10,000 locations across host cities (CDMX, Guadalajara, Monterrey)
   - Include: restaurants, attractions, hotels, bars/nightlife, shopping, cultural sites
   - Expand to secondary cities (Puebla, Guanajuato, Oaxaca) for cultural routes
   - Mundial-specific: stadiums, fan zones, official venues

4. **Enrichment**
   - Each location includes: name, description, category/tags, coordinates, price range ($ to $$$$), user ratings, operating hours, contact info, accessibility features, photos

**Technical Specifications:**

- **Vector Database:** Pinecone or Qdrant (evaluate based on cost/performance)
- **Embedding Model:** text-embedding-3-small (OpenAI) or equivalent open-source
- **Dimension:** 1536 (standard for text-embedding-3-small)
- **Index Size:** 50,000 locations (initial), scalable to 200,000+
- **Query Response Time:** < 100ms for top-20 results
- **Similarity Metric:** Cosine similarity
- **Update Frequency:** Daily batch updates + real-time for new additions

**Data Pipeline:**

1. **Source Data:**
   - Google Places API (initial seed)
   - Foursquare API (enrichment)
   - Manual curation for Mundial-specific venues
   - User-generated content (approved submissions)

2. **Processing:**
   - Clean and normalize location data
   - Generate embeddings for descriptions
   - Store metadata in PostgreSQL
   - Sync vectors to vector DB
   - Implement deduplication logic

3. **Quality Control:**
   - Verify coordinates accuracy
   - Flag outdated information (closed businesses)
   - Human review for top-tier locations
   - User feedback loop for corrections

**Non-Functional Requirements:**

- **Accuracy:** 95%+ precision for top-10 results
- **Latency:** p95 < 150ms for search queries
- **Cost:** < $0.001 per search operation
- **Freshness:** Location data updated within 24 hours
- **Scalability:** Support 100,000 searches per hour

**Edge Cases:**

- No results found → Expand search radius or relax constraints
- Ambiguous query → Return diverse results across categories
- Location closed/moved → Mark as unavailable, suggest alternatives
- Duplicate locations → Merge data, preserve highest quality info
- Seasonal availability → Filter based on travel dates

**Acceptance Criteria:**

- [ ] Search returns relevant results in < 100ms
- [ ] 95%+ of top-10 results match user intent (human evaluation)
- [ ] System handles 100,000+ locations without performance degradation
- [ ] Daily data updates complete without service disruption
- [ ] Cost per search < $0.001
- [ ] Support semantic search in Spanish and English

---

### Feature 4: Route Optimization Engine

**Purpose:** Calculate optimal routes between multiple destinations, minimizing travel time and cost while respecting user constraints.

**User Story:**
```
As a traveler with multiple destinations in a day,
I want Nova to optimize the order and routing of my stops,
So that I minimize travel time and maximize experience time.
```

**Functional Requirements:**

1. **Multi-Stop Optimization**
   - Solve traveling salesman problem (TSP) for daily itineraries
   - Consider time windows (opening/closing hours)
   - Account for mandatory stops (hotel check-in, match attendance)
   - Support mixed-mode transport (walk + metro + rideshare)

2. **Transportation Modes**
   - Walking (for distances < 1.5km in safe areas)
   - Metro/Metrobús (CDMX, Guadalajara, Monterrey systems)
   - Bus (local and inter-city: ADO, Primera Plus)
   - Rideshare (Uber, DiDi estimates)
   - Car rental (for multi-day road trips)
   - Flight (for inter-city during Mundial)

3. **Optimization Objectives**
   - Primary: Minimize total travel time
   - Secondary: Minimize cost
   - Tertiary: Maximize experience quality (avoid backtracking)
   - Constraint: Respect time windows and user preferences

4. **Real-Time Adaptation**
   - Integrate current traffic conditions (Google Maps API)
   - Account for public transport schedules
   - Suggest alternative routes if primary blocked
   - Notify user of delays exceeding 15 minutes

**Technical Specifications:**

- **Algorithm:** Hybrid approach
  - Greedy nearest-neighbor for < 5 stops
  - 2-opt heuristic for 5-10 stops
  - Genetic algorithm for > 10 stops
- **APIs:**
  - Google Maps Directions API (routing + traffic)
  - Local transit APIs (where available)
  - Uber/DiDi APIs for ride estimates
- **Performance:** < 2 seconds for route calculation (up to 15 stops)
- **Accuracy:** Route time estimates within ±20% of actual

**Data Requirements:**

- Real-time traffic data (Google Maps)
- Public transport schedules (GTFS feeds where available)
- Walking safety scores by area
- Rideshare pricing models
- Inter-city bus schedules (ADO, Primera Plus)

**Non-Functional Requirements:**

- **Reliability:** 99% of calculated routes are logistically feasible
- **Performance:** Calculate route for 10 stops in < 2 seconds
- **Cost:** < $0.02 per route calculation (API costs)
- **Accuracy:** Time estimates accurate within ±20%
- **Scalability:** Handle 10,000 route calculations per hour

**Edge Cases:**

- No public transport available → Default to rideshare or walking
- Strike or service disruption → Recalculate with alternative modes
- Traffic congestion exceeds 2x normal → Suggest alternative timing
- Location inaccessible by specified mode → Provide nearest accessible alternative
- Multi-city routing → Split into segments, optimize inter-city travel separately

**Acceptance Criteria:**

- [ ] Routes minimize travel time within 10% of theoretical optimal
- [ ] Support mixed-mode transport (walk + metro + rideshare)
- [ ] Integrate real-time traffic conditions
- [ ] Calculate routes in < 2 seconds for typical itineraries
- [ ] Provide step-by-step directions for each segment
- [ ] Cost estimates accurate within ±20%
- [ ] Support offline route viewing (pre-downloaded)

---

### Feature 5: Real-Time Safety Intelligence Layer

**Purpose:** Provide neighborhood-level safety information and real-time alerts to help travelers make informed decisions about where to go and when.

**User Story:**
```
As a traveler unfamiliar with Mexican cities,
I want to know which neighborhoods are safe and receive alerts about emerging risks,
So that I can explore confidently while avoiding dangerous situations.
```

**Functional Requirements:**

1. **Safety Scoring**
   - Assign safety scores (1-10) to neighborhoods/colonias
   - Consider: crime statistics, police presence, lighting, tourist frequency, time of day (day vs night ratings)
   - Update scores weekly based on new data
   - Provide safety heatmap overlay on maps

2. **Real-Time Alerts**
   - Push notifications for: protests/demonstrations, natural disasters, major incidents, transport disruptions, health advisories
   - Geofenced alerts (only when near affected area)
   - Severity levels (info, caution, warning, danger)
   - Multi-language alerts (Spanish + English)

3. **Data Sources**
   - Government crime statistics (when available)
   - Crowd-sourced incident reports (verified)
   - News monitoring (local media)
   - Embassy/consulate advisories
   - Social media sentiment (filtered)
   - Partner integrations (security firms if applicable)

4. **User Guidance**
   - Suggest safer alternative routes when planning
   - Highlight well-lit, populated walking paths
   - Recommend safe times to visit certain areas
   - Provide emergency contact information
   - Include safety tips for specific neighborhoods

**Technical Specifications:**

- **Data Storage:** PostgreSQL with PostGIS for geographic queries
- **Alert System:** Firebase Cloud Messaging for push notifications
- **Update Frequency:** 
  - Safety scores: Weekly batch update
  - Real-time alerts: As events occur (< 5 min latency)
- **Coverage:** All neighborhoods in host cities initially
- **Geofencing:** 500m radius for location-based alerts

**Data Processing Pipeline:**

1. **Data Collection:**
   - Scrape government crime data APIs
   - Monitor news feeds (RSS + web scraping)
   - Collect crowd-sourced reports (with verification)
   - Pull embassy advisories

2. **Data Validation:**
   - Cross-reference multiple sources
   - Flag contradictory information
   - Human review for critical alerts
   - Spam/false report filtering

3. **Scoring Algorithm:**
   - Weighted combination of: historical crime rates (40%), recent incident frequency (30%), police presence (15%), infrastructure quality (lighting, maintenance) (15%)
   - Separate day/night scores
   - Decay factor for historical data (recent = more weight)

4. **Alert Distribution:**
   - Classify severity (info/caution/warning/danger)
   - Determine affected radius
   - Identify impacted users (geofence)
   - Send notifications with recommended actions

**Non-Functional Requirements:**

- **Accuracy:** Safety scores correlate with actual incident rates (validate quarterly)
- **Timeliness:** Critical alerts delivered within 5 minutes of event detection
- **Coverage:** 100% of host city neighborhoods have safety scores
- **Privacy:** No tracking of user location beyond active trip duration
- **Transparency:** Explain how safety scores are calculated (in FAQ)

**Edge Cases:**

- Conflicting data sources → Weight by source reliability, flag uncertainty
- Rapid situation changes (protest turns violent) → Update alerts in real-time
- User enters dangerous area → Proactive warning + suggest alternative
- False alarm / resolved situation → Send all-clear notification
- Government data unavailable → Rely on secondary sources, note reduced confidence

**Acceptance Criteria:**

- [ ] Safety scores available for all neighborhoods in host cities
- [ ] Real-time alerts delivered within 5 minutes of event detection
- [ ] Users can report incidents (with verification process)
- [ ] Safety heatmap visible on map interface
- [ ] Alert notifications respect user preferences (severity threshold)
- [ ] Safety information updates at least weekly
- [ ] Emergency contact information easily accessible from any screen

---

### Feature 6: Multi-Modal Transportation Integration

**Purpose:** Seamlessly plan and navigate across all transportation modes available in Mexico, from metro to intercity buses to rideshare.

**User Story:**
```
As a traveler navigating Mexican cities and between host cities,
I want Nova to provide integrated multi-modal routing,
So that I can efficiently use metro, buses, rideshare, and walking without juggling multiple apps.
```

**Functional Requirements:**

1. **Supported Transport Modes**
   - **Urban:**
     - Metro (CDMX, Guadalajara, Monterrey)
     - Metrobús/BRT systems
     - Local buses
     - Ecobici/bike share
     - Rideshare (Uber, DiDi, Cabify)
     - Walking
   - **Intercity:**
     - Bus (ADO, Primera Plus, ETN, etc.)
     - Flights (Volaris, VivaAerobus, Aeromexico)
     - Private transfer options

2. **Route Planning**
   - Calculate multi-leg journeys combining modes
   - Provide step-by-step directions with transitions
   - Show real-time arrival times (where available)
   - Estimate total cost for each mode combination
   - Suggest fastest vs cheapest vs most convenient routes

3. **Real-Time Information**
   - Live metro/bus arrival times (where APIs exist)
   - Current rideshare pricing and wait times
   - Traffic conditions affecting routes
   - Service disruptions and alternatives
   - Platform/gate information for intercity travel

4. **Booking Integration**
   - Deep links to rideshare apps (Uber, DiDi)
   - Links to bus ticket platforms (ADO website/app)
   - Flight booking options (via affiliate links)
   - Save boarding passes and confirmations

**Technical Specifications:**

- **APIs Required:**
  - Google Maps Directions (primary routing)
  - GTFS feeds for public transit (where available)
  - Uber/DiDi ride estimation APIs
  - ADO bus schedules (scraping if no API)
  - Flight search APIs (Skyscanner/Kiwi.com)
- **Routing Engine:** Custom multi-modal pathfinding (Dijkstra's with mode transitions)
- **Real-time Updates:** WebSocket connections for live data
- **Offline Support:** Cache route data for offline navigation

**Data Requirements:**

- **Static Data:**
  - Metro/bus route maps and schedules
  - Station/stop locations (coordinates)
  - Intercity bus terminal locations
  - Airport information
- **Dynamic Data:**
  - Real-time vehicle locations (where available)
  - Current traffic conditions
  - Rideshare pricing
  - Service disruptions

**Integration Points:**

- Route optimization engine (Feature 4)
- Itinerary generator (Feature 2)
- Safety intelligence (Feature 5) - avoid unsafe walking segments
- Budget tracking - log transport expenses

**Non-Functional Requirements:**

- **Accuracy:** Route time estimates within ±25% for public transit, ±15% for rideshare
- **Performance:** Multi-modal route calculated in < 3 seconds
- **Reliability:** Fallback routing if primary API fails
- **Coverage:** All host cities + major tourist destinations
- **Offline:** Last calculated route available offline

**Edge Cases:**

- Metro strike or closure → Automatically suggest bus/rideshare alternatives
- Rideshare surge pricing → Alert user, show public transit alternative
- Missed connection → Recalculate route from current location
- No public transit at late hours → Default to rideshare options
- User prefers specific mode → Constrain routing to preferred modes

**Acceptance Criteria:**

- [ ] Support routing with 2+ transport modes in single journey
- [ ] Provide real-time updates for metro/bus arrival times (where available)
- [ ] Deep link to Uber/DiDi for rideshare bookings
- [ ] Show comparative costs for different mode combinations
- [ ] Offline access to saved routes
- [ ] Alert users to service disruptions affecting their route
- [ ] Step-by-step navigation with mode transition instructions

---

### Feature 7: Mundial 2026 Optimization Suite

**Purpose:** Provide specialized features for travelers attending World Cup matches, optimizing multi-city attendance, fan zone access, and match-day logistics.

**User Story:**
```
As a football fan attending multiple World Cup matches across Mexico,
I want Nova to optimize my travel between cities and manage match-day logistics,
So that I can maximize my game attendance while experiencing Mexican culture.
```

**Functional Requirements:**

1. **Multi-Match Planner**
   - Allow user to select matches they want to attend
   - Optimize inter-city travel between matches
   - Suggest optimal "base city" for clusters of matches
   - Calculate minimum days needed between cities
   - Estimate total travel costs for multi-match attendance

2. **Match-Day Logistics**
   - Provide stadium-specific information (gates, parking, public transit)
   - Suggest arrival times (account for security, crowds)
   - Map nearby restaurants/bars (pre-match and post-match)
   - Show fan zone locations and schedules
   - Alert for street closures and traffic restrictions

3. **Accommodation Optimization**
   - Suggest hotels near stadiums with availability
   - Calculate "optimal location" balancing stadium access + city exploration
   - Flag hotels with likely fan concentrations (by team)
   - Provide booking links (via partners/affiliates)

4. **Cultural Integration**
   - Suggest activities between matches in each city
   - Create "Mundial + Culture" combined itineraries
   - Highlight local fan culture and traditions
   - Recommend authentic restaurants near match venues

5. **Group Coordination**
   - Share itineraries with travel companions
   - Coordinate meeting points for match days
   - Group transportation booking suggestions
   - Shared expense tracking

**Technical Specifications:**

- **Data Sources:**
  - Official FIFA match schedules and venues
  - Stadium information (capacity, location, public transit access)
  - Fan zone locations and event schedules
  - Hotel inventory near stadiums (via booking APIs)
  - Historical crowd data (from previous World Cups)
- **Optimization Algorithm:**
  - Input: Selected matches + user preferences
  - Output: Optimal city sequence + travel schedule
  - Constraints: Match dates, minimum rest time, budget
  - Objective: Minimize travel cost + time, maximize culture time

**Integration Points:**

- Multi-modal transportation (Feature 6) for inter-city routing
- Route optimization (Feature 4) for match-day navigation
- Safety intelligence (Feature 5) for crowd management
- Itinerary generator (Feature 2) for non-match activities
- Collaborative planning for group features

**Non-Functional Requirements:**

- **Performance:** Multi-match optimization completes in < 10 seconds
- **Accuracy:** Travel time estimates account for match-day congestion
- **Availability:** 99.9% uptime during World Cup period
- **Scalability:** Handle 50,000+ concurrent users on match days
- **Localization:** Support for 10+ languages (all major World Cup nations)

**Edge Cases:**

- Matches in same city on consecutive days → Suggest single accommodation base
- Impossible routing (insufficient time between matches) → Alert user, suggest alternatives
- Sold-out accommodations near stadium → Expand search radius, suggest transit options
- Match rescheduled → Automatically update itinerary, notify user
- Flight delays between cities → Provide alternative travel options in real-time

**Acceptance Criteria:**

- [ ] Users can select multiple matches and get optimized multi-city itinerary
- [ ] System provides stadium-specific logistics for each match
- [ ] Match-day congestion factored into travel time estimates
- [ ] Integration with official FIFA data (match schedules, venues)
- [ ] Alert users to match-day street closures and transit changes
- [ ] Suggest accommodation balancing stadium access + cultural exploration
- [ ] Support group itinerary sharing and coordination
- [ ] Provide fan zone locations and schedules

---

### Feature 8: Offline Mode & Data Synchronization

**Purpose:** Enable travelers to access their itineraries, maps, and essential information without internet connectivity.

**User Story:**
```
As a traveler in areas with poor cellular coverage,
I want to access my itinerary and maps offline,
So that I can navigate and stay on plan even without internet.
```

**Functional Requirements:**

1. **Offline Data Package**
   - Downloadable itinerary (full details, not just summary)
   - Offline maps (city maps + route overlays)
   - Saved locations (restaurants, attractions with details)
   - Emergency contact information
   - Basic translation phrases

2. **Sync Strategy**
   - Download full itinerary package before trip starts
   - Incremental updates when online
   - Background sync when connected to WiFi
   - Manual sync trigger option
   - Indicate last sync time

3. **Offline Functionality**
   - View itinerary (read-only)
   - Access saved maps and routes
   - View location details (photos, descriptions, hours)
   - Check budget tracking (last synced state)
   - Access emergency information

4. **Online-Required Features** (graceful degradation)
   - Real-time availability checks → Show last known status
   - Live traffic updates → Show typical traffic patterns
   - Safety alerts → Show last downloaded safety information
   - Conversational agent → "Offline mode - limited functionality"

**Technical Specifications:**

- **Storage Format:** SQLite database for structured data
- **Map Storage:** MBTiles format (vector tiles)
- **Compression:** Gzip compression for itinerary data
- **Estimated Package Size:**
  - 7-day itinerary: ~50MB (with maps)
  - Single city maps: ~20MB
  - User can select what to download
- **Sync Protocol:** HTTP/2 with delta synchronization
- **Conflict Resolution:** Server wins for conflicting updates

**Platform-Specific Implementation:**

- **iOS:** Use Core Data + cached network responses
- **Android:** Room database + cached responses
- **Web:** IndexedDB + Service Worker caching

**Non-Functional Requirements:**

- **Storage Efficiency:** Minimize local storage usage (< 200MB for typical trip)
- **Sync Speed:** Full itinerary download in < 30 seconds on 4G
- **Battery Impact:** Offline mode uses < 5% battery per day
- **Reliability:** Offline data accessible even after app restart

**Edge Cases:**

- Storage full → Prompt user to delete old trips or reduce map area
- Partial download interrupted → Resume from last checkpoint
- App updated while offline → Maintain compatibility with cached data
- Sync conflict (user edited online and offline) → Prompt user to resolve
- Expired offline data (> 30 days) → Prompt re-download

**Acceptance Criteria:**

- [ ] Users can download full itinerary + maps before trip
- [ ] Offline mode provides read access to all itinerary details
- [ ] Maps functional offline (view, zoom, rotate)
- [ ] Emergency contacts accessible offline
- [ ] Sync completes in background without user intervention
- [ ] Clear indication of online vs offline status
- [ ] Graceful degradation of features requiring connectivity

---

### Feature 9: Budget Tracking & Expense Management

**Purpose:** Help travelers stay within budget by tracking expenses in real-time and comparing against planned spending.

**User Story:**
```
As a traveler with a budget constraint,
I want to track my actual spending against my planned budget,
So that I can make informed decisions and avoid overspending.
```

**Functional Requirements:**

1. **Budget Setup**
   - Set overall trip budget (in USD, MXN, or user currency)
   - Allocate budget by category (accommodation, food, transport, activities, shopping, misc)
   - Option to import estimated costs from itinerary
   - Set daily spending limit

2. **Expense Logging**
   - Quick-add expense (amount, category, note)
   - Photo receipt capture with OCR
   - Auto-categorize based on location (restaurant → food)
   - Support multiple currencies with auto-conversion
   - Link expenses to specific itinerary items

3. **Real-Time Tracking**
   - Dashboard showing: spent vs budget (overall and by category), daily average spending, projected total if current pace continues, remaining budget
   - Visual indicators (green/yellow/red) for budget health
   - Alerts when approaching category limits

4. **Insights & Recommendations**
   - Suggest cheaper alternatives if overspending
   - Highlight categories with most overspending
   - Provide daily recommended spending to stay on budget
   - End-of-trip spending summary

**Technical Specifications:**

- **Data Storage:** PostgreSQL for expense records
- **Currency Conversion:** Real-time exchange rates API (exchangerate-api.com or similar)
- **OCR:** Google Cloud Vision API or Tesseract for receipt scanning
- **Analytics:** Real-time aggregation queries with caching
- **Export:** CSV, PDF export of expense report

**Integration Points:**

- Itinerary generator (estimated costs)
- Location discovery (price range data)
- Conversational agent (budget-aware recommendations)
- Offline mode (log expenses offline, sync later)

**Non-Functional Requirements:**

- **Accuracy:** Currency conversions accurate to current rates
- **Performance:** Dashboard loads in < 1 second
- **Privacy:** Expense data encrypted at rest
- **Reliability:** No expense data loss (automatic backups)

**Edge Cases:**

- User forgets to log expense → Reminder notifications
- Expense in foreign currency → Auto-convert at day's exchange rate
- Shared expenses (group) → Split calculation and attribution
- Refund or cancellation → Allow negative expenses
- Large one-time expense (flight) → Option to exclude from daily average

**Acceptance Criteria:**

- [ ] Users can set overall and category budgets
- [ ] Quick expense logging in < 10 seconds
- [ ] Real-time budget vs actual comparison
- [ ] OCR successfully extracts amount from 80%+ of receipts
- [ ] Support multi-currency expenses with auto-conversion
- [ ] Alerts when 80% of category budget spent
- [ ] Export expense report as PDF/CSV
- [ ] Offline expense logging with later sync

---

### Feature 10: Collaborative Trip Planning

**Purpose:** Enable multiple travelers to plan and coordinate trips together in real-time.

**User Story:**
```
As a traveler planning a trip with friends/family,
I want to collaboratively build an itinerary,
So that everyone can contribute preferences and see updates in real-time.
```

**Functional Requirements:**

1. **Collaboration Setup**
   - Create shareable trip link or code
   - Invite collaborators via email/messaging
   - Set permissions (viewer, editor, admin)
   - Accept/decline collaboration invitations

2. **Real-Time Editing**
   - Multiple users edit itinerary simultaneously
   - See live cursors/activity of other collaborators
   - Conflict resolution for simultaneous edits
   - Change history and undo functionality

3. **Communication**
   - In-app commenting on itinerary items
   - Voting system for activity choices
   - Notification when collaborator makes changes
   - Group chat for planning discussions

4. **Consensus Building**
   - Poll feature for deciding between options
   - Budget aggregation (combine individual budgets)
   - Shared expense tracking
   - Decision tracking (agreed vs tentative items)

**Technical Specifications:**

- **Real-Time Sync:** WebSocket connections via Socket.io or Pusher
- **Conflict Resolution:** Operational Transformation (OT) or CRDT
- **Data Storage:** PostgreSQL with row-level locking
- **Notifications:** Push notifications + in-app alerts
- **Permissions:** Role-based access control (RBAC)

**Collaboration States:**

- **Draft:** Initial planning, all items tentative
- **Review:** Awaiting consensus from all collaborators
- **Confirmed:** All collaborators approved
- **Locked:** No further edits (trip started)

**Integration Points:**

- Itinerary generator (shared preferences)
- Budget tracking (combined budgets)
- Conversational agent (multi-user context)
- Booking integration (shared confirmations)

**Non-Functional Requirements:**

- **Latency:** Changes visible to all collaborators within 1 second
- **Scalability:** Support 10 collaborators per trip
- **Reliability:** No data loss during network interruptions
- **Conflict Resolution:** Automatic for 95% of conflicts

**Edge Cases:**

- Conflicting edits → Last write wins with notification to other editors
- Collaborator goes offline → Queue changes, sync when back online
- Invitation expired → Allow re-invitation
- Collaborator leaves group → Remove access, keep their contributions
- Budget conflict (individual budgets don't align) → Highlight discrepancy

**Acceptance Criteria:**

- [ ] Users can invite collaborators via link or email
- [ ] Real-time synchronization of itinerary changes
- [ ] Commenting and voting on itinerary items
- [ ] Shared budget tracking across all collaborators
- [ ] Notification when collaborator makes significant changes
- [ ] Conflict resolution without data loss
- [ ] Change history viewable by all collaborators
- [ ] Support at least 10 simultaneous collaborators

---

## Technical Architecture Plan

### System Architecture Overview

Nova employs a **microservices architecture** with a focus on **hybrid AI/ML systems** to balance intelligence with cost efficiency. The system is designed for scalability, resilience, and optimized operational costs.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                     │
│  │ iOS App  │  │Android   │  │  Web     │                     │
│  │ (Swift)  │  │(Kotlin)  │  │(React)   │                     │
│  └─────┬────┘  └────┬─────┘  └────┬─────┘                     │
└────────┼────────────┼─────────────┼─────────────────────────────┘
         │            │             │
         └────────────┴─────────────┘
                      │
         ┌────────────▼────────────┐
         │   API Gateway (Kong)    │
         │  - Auth/JWT validation  │
         │  - Rate limiting        │
         │  - Request routing      │
         └────────────┬────────────┘
                      │
         ┌────────────▼──────────────────────────────────────────┐
         │            Application Layer                          │
         │                                                        │
         │  ┌────────────────┐  ┌──────────────┐  ┌──────────┐ │
         │  │  Conversational│  │  Itinerary   │  │ Location │ │
         │  │  Agent Service │  │  Generator   │  │ Search   │ │
         │  │  (LangGraph)   │  │  Service     │  │ Service  │ │
         │  └────────┬───────┘  └──────┬───────┘  └────┬─────┘ │
         │           │                  │               │        │
         │  ┌────────▼───────┐  ┌──────▼───────┐  ┌────▼─────┐ │
         │  │  Route         │  │  Safety      │  │ Transport│ │
         │  │  Optimizer     │  │  Intelligence│  │ Service  │ │
         │  │  (Algorithm)   │  │  Service     │  │          │ │
         │  └────────┬───────┘  └──────┬───────┘  └────┬─────┘ │
         │           │                  │               │        │
         │  ┌────────▼───────┐  ┌──────▼───────┐  ┌────▼─────┐ │
         │  │  Budget        │  │  Collaboration│  │ Mundial  │ │
         │  │  Tracker       │  │  Service      │  │ Service  │ │
         │  └────────────────┘  └──────────────┘  └──────────┘ │
         └────────────────────────────────────────────────────────┘
                      │
         ┌────────────▼────────────────────────────────────────┐
         │              Data Layer                             │
         │                                                      │
         │  ┌──────────┐ ┌───────────┐ ┌─────────┐ ┌────────┐│
         │  │PostgreSQL│ │  Vector   │ │  Redis  │ │  S3    ││
         │  │(Primary) │ │  DB       │ │ (Cache) │ │(Assets)││
         │  │          │ │(Pinecone) │ │         │ │        ││
         │  └──────────┘ └───────────┘ └─────────┘ └────────┘│
         └──────────────────────────────────────────────────────┘
                      │
         ┌────────────▼────────────────────────────────────────┐
         │           External Services                         │
         │  ┌────────┐ ┌─────────┐ ┌──────────┐ ┌──────────┐ │
         │  │Anthropic│ │Google   │ │ Uber/    │ │ Booking  │ │
         │  │Claude  │ │Maps API │ │ DiDi API │ │ APIs     │ │
         │  └────────┘ └─────────┘ └──────────┘ └──────────┘ │
         └──────────────────────────────────────────────────────┘
```

### Technology Stack

####  Agents only

**Primary Language:** Python 3.12
- **Rationale:** Rich ecosystem for AI/ML, LangGraph/LangChain support, rapid development

**Secondary Language:** TypeScript (Node.js)
- **Use Cases:** Real-time collaboration (Socket.io), lightweight microservices

**Framework Choices:**

1. **Conversational Agent Service:**
   - **Framework:** LangGraph
   - **LLM:** gpt-4o-mini
   - **State Management:** LangGraph state persistence + Redis
   - **Deployment:** Docker containers on Kubernetes

2. **Itinerary Generator Service:**
   - **Framework:** LangGraph (for LLM orchestration)
   - **Language:** Python 

3. **Location Search Service:**
   - **Framework:** FastAPI (Python)
   - **Vector DB:** Pinecone (managed service, evaluate Qdrant for self-hosted option)
   - **Embedding:** OpenAI text-embedding-3-small or open-source alternative
   - **Caching:** Redis for frequently searched queries

4. **Route Optimizer Service:**
   - **Framework:** FastAPI (Python)
   - **Algorithms:** Custom implementation (NetworkX for graph operations)
   - **External APIs:** Google Maps Directions API
   - **Optimization:** Numpy/Scipy for numerical optimization

5. **Safety Intelligence Service:**
   - **Framework:** FastAPI (Python)
   - **Database:** PostgreSQL with PostGIS extension
   - **Alert System:** Firebase Cloud Messaging
   - **Data Pipeline:** Apache Airflow for scheduled updates

6. **Transport Service:**
   - **Framework:** FastAPI (Python)
   - **Integrations:** Google Maps, GTFS feeds, Uber/DiDi APIs
   - **Caching:** Redis for schedules and pricing

7. **Budget Tracker Service:**
   - **Framework:** FastAPI (Python)
   - **Database:** PostgreSQL
   - **OCR:** Google Cloud Vision API
   - **Currency:** exchangerate-api.com

8. **Collaboration Service:**
   - **Framework:** Node.js + Socket.io (for real-time)
   - **Database:** PostgreSQL (shared with main DB)
   - **Sync:** Operational Transformation library

9. **Mundial Service:**
   - **Framework:** FastAPI (Python)
   - **Data Sources:** Official FIFA data, stadium info
   - **Integration:** Combines route optimizer + itinerary generator + transport

#### Frontend

**Web Application:**
- **Framework:** React + TypeScript
- **State Management:** Zustand or Redux Toolkit
- **UI Library:** Tailwind CSS + shadcn/ui
- **Maps:** Mapbox GL JS
- **Real-time:** Socket.io client

**Mobile Applications:**

- **Framework:** Expo (React Native)
- **Language:** TypeScript
- **Navigation:** Expo Router
- **State Management:** Zustand or Redux Toolkit
- **Maps:** React Native Maps + Mapbox SDK
- **Local Storage:** Expo SQLite + SecureStore

#### Data Storage

**Primary Database:** PostgreSQL 15+
- **Use Cases:** User accounts, itineraries, expenses, safety data, collaboration data
- **Extensions:** PostGIS (geospatial), pg_trgm (fuzzy search)
- **Hosting:** AWS RDS or Google Cloud SQL (managed)
- **Backup:** Automated daily backups with 30-day retention

**Vector Database:** Pinecone (managed) or Qdrant (self-hosted)
- **Use Case:** Location embeddings for semantic search
- **Index Size:** 50,000 initial locations, scalable to 500,000+
- **Hosting:** Pinecone cloud (evaluate cost) or self-hosted Qdrant on Kubernetes

**Cache:** Redis 7+
- **Use Cases:** Session data, API response caching, rate limiting, real-time collaboration state
- **Hosting:** AWS ElastiCache or self-hosted on Kubernetes
- **Persistence:** RDB snapshots for critical data

**Object Storage:** AWS S3 or Google Cloud Storage
- **Use Cases:** User-uploaded photos, offline map tiles, receipt images, static assets
- **CDN:** CloudFront or Cloud CDN for global distribution

#### Infrastructure

**Container Orchestration:** Kubernetes (GKE or EKS)
- **Rationale:** Scalability, resilience, multi-service management

**CI/CD:** GitHub Actions
- **Pipeline:** Lint → Test → Build → Deploy to staging → Manual approval → Deploy to production
- **Container Registry:** Docker Hub or Google Container Registry

**API Gateway:** Kong or AWS API Gateway
- **Features:** Authentication, rate limiting, request routing, analytics

**Monitoring & Logging:**
- **APM:** Datadog or New Relic
- **Logging:** ELK stack (Elasticsearch, Logstash, Kibana) or Cloud Logging
- **Error Tracking:** Sentry
- **Uptime Monitoring:** Pingdom or UptimeRobot

**Security:**
- **Authentication:** JWT tokens with refresh mechanism
- **Secrets Management:** AWS Secrets Manager or HashiCorp Vault
- **Encryption:** TLS 1.3 for all traffic, AES-256 for data at rest
- **DDoS Protection:** Cloudflare or AWS Shield

### Deployment Architecture

**Multi-Region Strategy:**
- **Primary Region:** US-Central (close to Mexico)
- **Secondary Region:** US-East (failover)
- **CDN:** Global edge caching for static assets

**Environment Strategy:**
- **Development:** Local Docker Compose for developers
- **Staging:** Full Kubernetes cluster (scaled down)
- **Production:** Multi-zone Kubernetes cluster with auto-scaling

**Database Strategy:**
- **Primary:** Master in US-Central
- **Read Replicas:** In same region for load distribution
- **Backup:** Cross-region backups for disaster recovery

**Scaling Strategy:**
- **Horizontal Scaling:** Auto-scale pods based on CPU/memory (50-500 pods per service)
- **Database:** Read replicas for read-heavy workloads
- **Cache:** Redis cluster for high availability
- **Cost Optimization:** Scale down non-critical services during off-peak hours

---

## AI/ML Strategy

### Hybrid Architecture Philosophy

Nova employs a **hybrid approach** combining LLM-based agents with traditional ML models and algorithms to optimize for both intelligence and cost efficiency.

**Decision Framework:**

| Task Type | Approach | Rationale |
|-----------|----------|-----------|
| Natural language understanding | LLM (Claude) | Conversational fluency, context retention |
| Natural language generation | LLM (Claude) | High-quality, personalized output |
| Semantic search | ML (embeddings) | Fast, cost-effective, scalable |
| Route optimization | Algorithm | Deterministic, fast, zero cost |
| Recommendation ranking | ML (scoring model) | Customizable, explainable, low cost |
| Safety scoring | ML (weighted model) | Data-driven, transparent |
| Price prediction | ML (regression) | Historical data-based, accurate |
| Real-time alerts | Rule-based + ML | Fast, reliable, low cost |

### LLM Usage Strategy

**When to Use LLMs (Claude):**

1. **Conversational Agent (Feature 1)**
   - **Model:** Claude Sonnet 4 (primary)
   - **Cost Optimization:** 
     - Use Haiku for simple queries (weather, factual Q&A)
     - Cache system prompts (reduce input tokens by 80%)
     - Limit context window to last 10 turns
   - **Expected Cost:** $0.03-0.05 per conversation

2. **Itinerary Generator (Feature 2)**
   - **Model:** Claude Sonnet 4
   - **Usage:** Generate narrative descriptions and structure
   - **Cost Optimization:**
     - Pre-filter locations with vector search (reduce choices)
     - Use structured output format (reduce tokens)
     - Cache common itinerary templates
   - **Expected Cost:** $0.10-0.15 per itinerary

3. **Content Enrichment**
   - **Model:** Claude Haiku (batch processing)
   - **Usage:** Generate location descriptions, tips, cultural context
   - **Frequency:** Offline batch processing, not real-time
   - **Expected Cost:** $0.001 per location description

**Total Expected LLM Cost per User:**
- Onboarding conversation: $0.05
- Itinerary generation: $0.15
- Adjustments/refinements: $0.10
- **Total:** ~$0.30 per user acquisition

**At scale (100,000 users):** $30,000 in LLM costs

### Traditional ML Models

**1. Location Recommendation System**

- **Type:** Hybrid collaborative + content-based filtering
- **Training Data:** 
  - User preferences (extracted from conversations)
  - Location features (category, price, ratings, ambiance tags)
  - Interaction data (views, saves, bookings)
- **Model:** Two-tower neural network or matrix factorization
- **Inference:** Real-time scoring of candidate locations
- **Retraining:** Weekly with new interaction data
- **Cost:** Training $50/month, inference negligible

**2. Safety Scoring Model**

- **Type:** Weighted scoring algorithm (not deep learning)
- **Inputs:**
  - Crime statistics (40%)
  - Recent incidents (30%)
  - Infrastructure quality (15%)
  - Police presence (15%)
- **Output:** Safety score 1-10 per neighborhood
- **Update Frequency:** Weekly batch update
- **Cost:** Negligible (algorithmic)

**3. Price Prediction Model**

- **Type:** Gradient boosting (XGBoost or LightGBM)
- **Inputs:** Location type, date, season, demand indicators, historical pricing
- **Output:** Predicted price range
- **Use Case:** Budget estimation for itineraries
- **Retraining:** Monthly
- **Cost:** Training $20/month, inference negligible

**4. User Clustering**

- **Type:** K-means clustering
- **Purpose:** Group users by travel style for better recommendations
- **Features:** Preference vectors, past itinerary choices, spending patterns
- **Clusters:** ~10-20 personas (budget backpacker, luxury traveler, foodie, culture enthusiast, etc.)
- **Retraining:** Monthly
- **Cost:** Negligible

### Embedding Strategy

**Location Embeddings:**
- **Model:** text-embedding-3-small (OpenAI) or open-source alternative (e.g., sentence-transformers)
- **Dimension:** 1536 (or 384 for open-source)
- **Generation:** Batch process all locations offline
- **Storage:** Pinecone or Qdrant vector database
- **Cost:** ~$0.0001 per embedding (one-time per location)
- **Total for 50,000 locations:** ~$5

**User Preference Embeddings:**
- **Generation:** Real-time during conversation
- **Usage:** Query vector DB for relevant locations
- **Cost:** ~$0.0001 per query

### Algorithm-Based Systems

**1. Route Optimization**
- **Algorithm:** 
  - Greedy nearest-neighbor for < 5 stops
  - 2-opt improvement heuristic for 5-10 stops
  - Genetic algorithm for > 10 stops
- **Libraries:** NetworkX (Python) for graph operations
- **Performance:** < 2 seconds for 15-stop optimization
- **Cost:** Zero (computational only)

**2. Multi-Modal Transport Routing**
- **Algorithm:** Modified Dijkstra's shortest path with mode transitions
- **Graph:** Nodes = locations/stations, Edges = transport segments with mode, cost, time
- **Optimization:** Minimize (time + cost_weight * cost)
- **Cost:** Zero (computational only)

**3. Itinerary Scheduling**
- **Algorithm:** Constraint satisfaction problem (CSP)
- **Constraints:** Opening hours, travel time, user preferences, energy level
- **Solver:** OR-Tools (Google) or custom backtracking
- **Cost:** Zero (computational only)

### Cost Optimization Strategies

**1. Caching**
- Cache LLM responses for common queries
- Cache embeddings for frequently searched terms
- Cache route calculations for popular routes
- **Expected Savings:** 60-70% reduction in API calls

**2. Batching**
- Batch embedding generation for new locations
- Batch safety score updates (weekly)
- Batch content generation (offline)
- **Expected Savings:** 40% reduction in real-time API costs

**3. Model Tiering**
- Use Haiku for simple queries, Sonnet for complex
- Use smaller embedding models where precision not critical
- Use algorithmic solutions where deterministic logic suffices
- **Expected Savings:** 50% reduction in LLM costs

**4. Request Optimization**
- Compress prompts (remove redundancy)
- Use structured outputs (reduce generation tokens)
- Implement prompt caching (reduce input costs by 80%)
- **Expected Savings:** 30-40% per LLM request

**Total Cost Optimization:** ~70% reduction vs naive LLM-for-everything approach

---

## Implementation Guidelines

### Development Workflow (Spec-Driven)

Nova follows **Specification-Driven Development (SDD)** principles:

1. **Specification First**
   - All features documented in this SDD before implementation
   - Specifications are the source of truth
   - Code implements the spec, not the other way around

2. **Iterative Refinement**
   - Spec reviewed by team before coding starts
   - Acceptance criteria defined upfront
   - Tests written based on acceptance criteria

3. **AI-Assisted Implementation**
   - Use Claude Code or similar for boilerplate generation
   - Provide this SDD as context to AI coding tools
   - Human review of all AI-generated code

4. **Living Document**
   - Update SDD when requirements change
   - Version control for spec changes
   - Maintain spec-to-code traceability

### Code Organization

**Monorepo Structure:**

```
nova/
├── backend/
│   ├── services/
│   │   ├── conversational-agent/    # LangGraph service
│   │   ├── itinerary-generator/     # Itinerary service
│   │   ├── location-search/         # Vector DB service
│   │   ├── route-optimizer/         # Algorithm service
│   │   ├── safety-intelligence/     # Safety data service
│   │   ├── transport/               # Multi-modal transport
│   │   ├── budget-tracker/          # Expense management
│   │   ├── collaboration/           # Real-time collab
│   │   └── mundial/                 # World Cup features
│   ├── shared/
│   │   ├── auth/                    # JWT, permissions
│   │   ├── database/                # DB models, migrations
│   │   ├── utils/                   # Common utilities
│   │   └── clients/                 # External API clients
│   └── api-gateway/                 # Kong configuration
├── frontend/
│   ├── web/                         # React web app
│   ├── ios/                         # Swift iOS app
│   └── android/                     # Kotlin Android app
├── ml/
│   ├── models/                      # Trained ML models
│   ├── training/                    # Training scripts
│   └── inference/                   # Inference services
├── data/
│   ├── migrations/                  # DB migrations
│   ├── seeds/                       # Initial data
│   └── pipelines/                   # ETL pipelines
├── infrastructure/
│   ├── kubernetes/                  # K8s manifests
│   ├── terraform/                   # Infrastructure as code
│   └── docker/                      # Dockerfiles
├── docs/
│   ├── SDD.md                       # This document
│   ├── API.md                       # API documentation
│   ├── CONSTITUTION.md              # Project principles
│   └── DEPLOYMENT.md                # Deployment guide
└── tests/
    ├── unit/                        # Unit tests
    ├── integration/                 # Integration tests
    └── e2e/                         # End-to-end tests
```

### Service Communication

**API Design:**
- RESTful APIs for CRUD operations
- GraphQL for complex queries (optional, evaluate)
- gRPC for inter-service communication (high performance)
- WebSocket for real-time features (collaboration, live updates)

**Authentication:**
- JWT tokens with 1-hour expiry
- Refresh tokens with 30-day expiry
- Token stored in httpOnly cookies (web) or secure storage (mobile)

**Error Handling:**
- Standardized error response format
- HTTP status codes follow REST conventions
- Detailed error messages for debugging (dev only)
- User-friendly error messages (production)

### Testing Strategy

**Unit Tests:**
- Target: 80%+ code coverage
- Focus: Business logic, algorithms, utils
- Framework: pytest (Python), Jest (TypeScript), XCTest (Swift), JUnit (Kotlin)

**Integration Tests:**
- Test service-to-service communication
- Test database interactions
- Test external API integrations (with mocks)
- Framework: pytest + Docker Compose for dependencies

**End-to-End Tests:**
- Simulate full user workflows
- Test critical paths (onboarding → itinerary generation → booking)
- Framework: Playwright (web), XCUITest (iOS), Espresso (Android)

**Load Testing:**
- Target: 10,000 concurrent users
- Test before Mundial 2026 launch
- Framework: k6 or Locust

**AI/LLM Testing:**
- Evaluation dataset for conversational agent (100+ examples)
- Test itinerary quality (human evaluation + automated metrics)
- Monitor LLM output quality (detect degradation)

### Security Guidelines

**Authentication & Authorization:**
- OAuth 2.0 for social login (Google, Facebook)
- Email/password with bcrypt hashing
- Role-based access control (user, admin, support)
- Multi-factor authentication for admin accounts

**Data Protection:**
- Encrypt sensitive data at rest (AES-256)
- TLS 1.3 for all network traffic
- No PII in logs or analytics
- GDPR/CCPA compliance (user data export/deletion)

**API Security:**
- Rate limiting (per user, per IP)
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- XSS protection (content security policy)
- CSRF tokens for state-changing operations

**Third-Party Integrations:**
- Store API keys in secrets manager
- Rotate keys quarterly
- Monitor for unusual usage patterns
- Implement circuit breakers for API failures

### Performance Optimization

**Backend:**
- Database query optimization (indexes, query analysis)
- Connection pooling for database
- Caching strategy (Redis for hot data)
- Async processing for heavy tasks (Celery or similar)
- CDN for static assets

**Frontend:**
- Code splitting (lazy load routes)
- Image optimization (WebP, compression)
- Service worker for offline functionality
- Debounce/throttle user inputs
- Virtual scrolling for long lists

**Mobile:**
- Minimize network requests
- Prefetch data for anticipated user actions
- Cache aggressively (images, itineraries)
- Optimize images for mobile (lower resolution)
- Use native components where performance critical

### Monitoring & Observability

**Metrics to Track:**
- Request latency (p50, p95, p99)
- Error rate (4xx, 5xx responses)
- LLM API costs (per endpoint, per user)
- Database query performance
- User engagement (DAU, MAU, session length)
- Conversion funnel (signup → itinerary → premium)

**Alerts:**
- Error rate > 1% for 5 minutes
- Latency p95 > 2 seconds for 10 minutes
- Database connection pool exhaustion
- LLM API cost spike (> 2x normal)
- Service down (uptime check failure)

**Dashboards:**
- Real-time system health dashboard
- Business metrics dashboard (users, revenue, engagement)
- LLM cost tracking dashboard
- User journey funnel visualization

### Accessibility Requirements

**WCAG 2.1 AA Compliance:**
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios (4.5:1 for text)
- Alt text for all images
- Form labels and ARIA attributes
- Focus indicators for interactive elements

**Mobile Accessibility:**
- Dynamic type support (iOS, Android)
- VoiceOver/TalkBack optimization
- Touch target size ≥ 44x44 points
- Reduced motion support

### Internationalization (i18n)

**Supported Languages (MVP):**
- Spanish (primary)
- English (secondary)

**Future Languages:**
- Portuguese (Brazil)
- French
- German
- Italian
- Japanese
- Korean
- Mandarin

**Implementation:**
- i18n library (react-i18next for web, native frameworks for mobile)
- Translation keys in JSON files
- Fallback to English for missing translations
- Right-to-left (RTL) support (future)
- Locale-aware date/time/currency formatting

---

## Constitution

### Non-Negotiable Principles

These principles guide all development decisions and cannot be compromised:

**1. User Privacy First**
- Users own their data
- No selling user data to third parties
- Transparent data usage policies
- Easy data export and deletion
- Minimal data collection (only what's necessary)

**2. Safety is Paramount**
- Prioritize user safety over engagement metrics
- Provide accurate, timely safety information
- Do not recommend unsafe locations for short-term gain
- Partner only with reputable service providers
- Maintain emergency contact accessibility

**3. Quality Over Speed**
- Do not ship features that compromise user experience
- Thorough testing before production deployment
- Code reviews mandatory for all changes
- Performance regressions are blockers
- AI-generated content must be reviewed before user-facing

**4. Cost Consciousness**
- Optimize for sustainable unit economics
- Use hybrid AI/ML approach to control costs
- Monitor and optimize LLM usage continuously
- Scale infrastructure based on actual demand
- Choose managed services only when cost-justified

**5. Accessibility is Essential**
- WCAG 2.1 AA compliance is mandatory
- Test with assistive technologies
- Design for diverse abilities
- Support multiple languages from launch
- Offline functionality for core features

**6. Cultural Respect**
- Accurate representation of Mexican culture
- Consult local experts for cultural content
- Avoid stereotypes and clichés
- Respect regional differences within Mexico
- Support local businesses over international chains

**7. Transparency**
- Clear pricing (no hidden fees)
- Honest about AI limitations
- Explain recommendation algorithms
- Disclose affiliate relationships
- Open about data sources

**8. Ethical AI**
- No discrimination in recommendations (race, gender, religion, etc.)
- Explainable AI decisions where possible
- Human oversight for critical decisions
- Monitor for bias in ML models
- Respect user agency (AI assists, doesn't decide)

### Development Practices

**Mandatory:**
- All code in version control (Git)
- Peer review for all pull requests
- Automated testing before merge
- No direct commits to main branch
- Documentation updated with code changes

**Prohibited:**
- Committing secrets to repository
- Skipping tests to ship faster
- Deploying without staging validation
- Ignoring security vulnerabilities
- Storing PII in logs

### Technology Constraints

**Allowed:**
- Open-source libraries with permissive licenses (MIT, Apache 2.0)
- Managed cloud services (AWS, GCP, Azure)
- Third-party APIs with clear ToS
- LLMs via official APIs (no scraped models)

**Prohibited:**
- GPL-licensed code (for proprietary features)
- Unlicensed or pirated software
- Services with unclear data retention policies
- Experimental/alpha services in production
- Single point of failure architectures

### Business Principles

**Commitments:**
- Freemium model (core features always free)
- Transparent premium pricing
- 30-day money-back guarantee
- Support local Mexican businesses
- Donate 1% revenue to cultural preservation

**Prohibitions:**
- Bait-and-switch pricing
- Selling user data
- Dark patterns in UI
- Predatory upselling
- Fake scarcity tactics

---

## Acceptance Criteria

### Minimum Viable Product (MVP) Criteria

**MVP Definition:** The minimum feature set required for a successful launch targeting Mundial 2026 travelers.

**MVP Features:**

1. ✅ **Conversational Planning Agent**
   - [ ] User can describe trip preferences in natural language
   - [ ] Agent extracts preferences with 90%+ accuracy (human eval)
   - [ ] Agent responds in < 3 seconds
   - [ ] Supports Spanish and English
   - [ ] Cost per conversation < $0.05

2. ✅ **Itinerary Generation**
   - [ ] Generate day-by-day itinerary from preferences
   - [ ] Include activities, meals, transport, accommodations
   - [ ] Optimize for time and budget
   - [ ] Generate in < 10 seconds
   - [ ] User satisfaction > 4.0/5

3. ✅ **Location Discovery**
   - [ ] 10,000+ locations in host cities (CDMX, GDL, MTY)
   - [ ] Semantic search returns relevant results in < 100ms
   - [ ] Support filtering by category, price, rating
   - [ ] Include photos and descriptions

4. ✅ **Route Optimization**
   - [ ] Calculate optimal routes for multi-stop itineraries
   - [ ] Support walking, metro, rideshare modes
   - [ ] Time estimates accurate within ±20%
   - [ ] Calculate in < 2 seconds

5. ✅ **Safety Intelligence**
   - [ ] Safety scores for all host city neighborhoods
   - [ ] Real-time alerts for critical incidents
   - [ ] Heatmap visualization
   - [ ] Updates at least weekly

6. ✅ **Multi-Modal Transport**
   - [ ] Integrate metro systems (CDMX, GDL, MTY)
   - [ ] Rideshare integration (Uber, DiDi)
   - [ ] Inter-city bus schedules (ADO, Primera Plus)
   - [ ] Step-by-step directions

7. ✅ **Mundial Features**
   - [ ] Multi-match itinerary optimizer
   - [ ] Stadium information for all host venues
   - [ ] Fan zone locations
   - [ ] Match-day logistics

8. ✅ **Offline Mode**
   - [ ] Download itinerary + maps
   - [ ] Offline access to all itinerary details
   - [ ] Sync when back online

9. ✅ **Budget Tracking**
   - [ ] Set budget by category
   - [ ] Log expenses (manual + OCR)
   - [ ] Real-time spending vs budget
   - [ ] Multi-currency support

**MVP Exclusions (Post-Launch):**
- Collaborative trip planning (Phase 2)
- Advanced ML recommendations (Phase 2)
- Booking integration (Phase 3)
- Cultural route themes (Phase 2)
- Voice input (Phase 2)

### Quality Gates

**Before Staging Deployment:**
- [ ] All unit tests passing (80%+ coverage)
- [ ] Integration tests passing
- [ ] No critical security vulnerabilities
- [ ] Performance benchmarks met
- [ ] Accessibility audit passed

**Before Production Deployment:**
- [ ] End-to-end tests passing
- [ ] Load testing completed (10,000 concurrent users)
- [ ] Security penetration testing completed
- [ ] Monitoring and alerts configured
- [ ] Rollback plan documented

**Before Public Launch:**
- [ ] Beta testing with 100+ users (4.0+ rating)
- [ ] All MVP features complete
- [ ] Privacy policy and ToS finalized
- [ ] Customer support channels ready
- [ ] Marketing materials prepared

### Success Metrics (Post-Launch)

**User Acquisition (by June 2026):**
- [ ] 100,000+ registered users
- [ ] 50,000+ generated itineraries
- [ ] 10,000+ premium subscribers

**User Engagement:**
- [ ] 7+ days average active usage per trip
- [ ] 60%+ users complete itinerary generation
- [ ] 40%+ users use offline mode

**User Satisfaction:**
- [ ] 4.5+ star rating (app stores)
- [ ] 70%+ would recommend to friend (NPS > 50)
- [ ] < 5% churn rate (premium)

**Business Metrics:**
- [ ] 25%+ freemium to premium conversion
- [ ] < $15 CAC (customer acquisition cost)
- [ ] > $45 LTV (lifetime value)
- [ ] Positive unit economics by month 6

**Technical Performance:**
- [ ] 99.5%+ uptime
- [ ] < 2 second average response time
- [ ] < $0.50 LLM cost per user
- [ ] Zero critical security incidents

---

## Competitive Analysis

### MindTrip AI - In-Depth Comparison

**MindTrip AI Strengths:**
- Established brand with venture funding
- Global coverage (200+ countries)
- Polished UI/UX
- Strong SEO and content marketing
- Partnerships with booking platforms

**MindTrip AI Weaknesses:**
- Generic approach (not Mexico-specialized)
- Limited real-time data
- No local transport integration
- Weak safety information
- No Mundial-specific features
- High LLM costs (likely unsustainable at scale)

**Nova's Competitive Advantages:**

| Feature | MindTrip AI | Nova |
|---------|-------------|------|
| **Market Focus** | Global | Mexico-specialized |
| **Local Knowledge** | Generic | Deep (safety, transport, culture) |
| **Real-Time Data** | Limited | Extensive (transport, safety, events) |
| **Transport Integration** | Generic recommendations | Native (Metro, ADO, Uber/DiDi) |
| **Safety Info** | Basic warnings | Neighborhood-level scores + alerts |
| **Mundial 2026** | None | Purpose-built features |
| **Offline Mode** | Limited | Full itinerary + maps |
| **Cost Structure** | High (LLM-heavy) | Optimized (hybrid AI/ML) |
| **Collaborative Planning** | Not available | Real-time co-planning |
| **Budget Tracking** | Not available | Integrated expense tracking |

**Positioning Statement:**

"While MindTrip AI helps you plan trips anywhere in the world, Nova is the expert on Mexico. We combine AI intelligence with deep local knowledge, real-time safety alerts, and integrated Mexican transport systems to create the ultimate travel companion for Mundial 2026 and beyond."

### Other Competitors

**Google Maps/Travel:**
- **Strengths:** Massive data, trusted brand, free
- **Weaknesses:** Not personalized, no itinerary planning, limited AI
- **Nova's Edge:** Conversational planning, optimized itineraries, budget tracking

**TripAdvisor:**
- **Strengths:** User reviews, wide coverage, booking integration
- **Weaknesses:** Overwhelming choice, no AI planning, dated UX
- **Nova's Edge:** AI-powered curation, streamlined UX, Mexican specialization

**Airbnb Experiences:**
- **Strengths:** Unique local experiences, trusted platform
- **Weaknesses:** No itinerary planning, limited transport info
- **Nova's Edge:** End-to-end trip planning, transport integration, safety intel

**Local Mexican Apps (e.g., Despegar, Viajala):**
- **Strengths:** Local market knowledge, Spanish-first
- **Weaknesses:** Booking-focused (not planning), dated tech, no AI
- **Nova's Edge:** AI-powered planning, modern UX, Mundial features

---

## Monetization Strategy

### Freemium Model

**Free Tier:**
- Unlimited conversational planning
- Basic itinerary generation (up to 5 days)
- Location search and discovery
- Safety information (basic neighborhood scores)
- Budget tracking (manual entry only)
- Offline maps (1 city at a time)
- Ads (non-intrusive, contextual)

**Premium Tier ($9.99/month or $49.99/year):**
- Extended itineraries (unlimited days)
- Advanced route optimization
- Real-time safety alerts (push notifications)
- Collaborative trip planning (up to 10 collaborators)
- OCR receipt scanning
- Unlimited offline maps
- Priority support
- No ads
- Mundial exclusive features (multi-match optimizer)

**One-Time Trip Pass ($19.99):**
- Premium features for a single trip (30 days)
- Ideal for one-time visitors
- No subscription required

### Additional Revenue Streams

**1. Affiliate Commissions:**
- Hotel bookings (Booking.com, Airbnb): 3-5% commission
- Tour/activity bookings (GetYourGuide, Viator): 10-15% commission
- Transport bookings (bus tickets, flights): 2-5% commission
- Restaurant reservations (OpenTable, TheFork): flat fee per booking

**2. Sponsored Recommendations:**
- Restaurants and hotels can pay for premium placement
- Clearly labeled as "Sponsored"
- Never compromise ranking algorithm quality
- Limit: Max 1 sponsored result per 10 organic results

**3. B2B/White Label:**
- License Nova technology to tourism boards, hotel chains
- Custom-branded versions for partners
- SaaS pricing model ($5,000-$50,000/month based on usage)

**4. Data Insights (Anonymized):**
- Aggregate travel trends reports for tourism boards
- No individual user data sold (ever)
- Strictly anonymized and aggregated

### Pricing Strategy

**Free Trial:**
- 14-day premium trial for new users
- No credit card required
- Convert at end of trial or revert to free

**Mundial 2026 Special:**
- $29.99 for "Mundial Pass" (entire tournament period: June-July 2026)
- Early bird pricing for first 10,000 users: $19.99
- Group discount: 3+ friends sign up together = 20% off

**Annual Subscription Discount:**
- Monthly: $9.99/month ($119.88/year)
- Annual: $49.99/year (58% savings)
- Incentivize annual commitment

### Revenue Projections (Conservative)

**Year 1 (2026 - Mundial Year):**
- Users: 100,000
- Free: 75,000 (75%)
- Premium: 20,000 (20%)
- One-Time Pass: 5,000 (5%)

**Revenue:**
- Premium subscriptions: 20,000 × $49.99 = $999,800
- One-time passes: 5,000 × $19.99 = $99,950
- Affiliate commissions: ~$200,000 (estimated)
- **Total Year 1 Revenue:** ~$1.3M

**Year 2 (2027 - Post-Mundial):**
- Retention of 50% Mundial users
- Organic growth to 80,000 total users
- Premium conversion: 15% (12,000 users)

**Revenue:**
- Premium subscriptions: 12,000 × $49.99 = $599,880
- Affiliate commissions: ~$150,000
- **Total Year 2 Revenue:** ~$750K

---

## Roadmap & Milestones

### Phase 1: MVP Development (3 months)

**Month 1: Core Infrastructure**
- [x] Project setup and architecture
- [ ] Backend services scaffolding
- [ ] Database schema design
- [ ] Authentication system
- [ ] CI/CD pipeline
- [ ] Development environment setup

**Month 2: Core Features**
- [ ] Conversational agent (basic)
- [ ] Location database setup (10,000 locations)
- [ ] Vector search implementation
- [ ] Route optimization algorithm
- [ ] Safety scoring system (initial)
- [ ] Basic itinerary generation

**Month 3: MVP Completion**
- [ ] Multi-modal transport integration
- [ ] Offline mode
- [ ] Budget tracking (basic)
- [ ] Mundial features (basic)
- [ ] iOS app (MVP)
- [ ] Android app (MVP)
- [ ] Web app (MVP)
- [ ] Beta testing with 100 users

**Deliverable:** Functional MVP ready for beta testing

---

### Phase 2: Beta Testing & Refinement (2 months)

**Month 4: Beta Testing**
- [ ] Recruit 1,000 beta testers
- [ ] Collect feedback systematically
- [ ] Fix critical bugs
- [ ] Optimize performance bottlenecks
- [ ] Improve LLM prompt engineering
- [ ] Refine UI/UX based on feedback

**Month 5: Polish & Prepare Launch**
- [ ] Implement top user-requested features
- [ ] Finalize premium tier features
- [ ] Payment integration (Stripe)
- [ ] Customer support infrastructure
- [ ] Marketing website
- [ ] App store optimization (ASO)
- [ ] Press kit and media outreach

**Deliverable:** Production-ready app approved for app stores

---

### Phase 3: Public Launch (1 month)

**Month 6 (Target: March 2026 - 3 months before World Cup)**
- [ ] Submit to app stores (iOS, Android)
- [ ] Launch marketing campaign
- [ ] Press releases
- [ ] Social media activation
- [ ] Influencer partnerships
- [ ] Monitor initial user feedback
- [ ] Rapid iteration on critical issues

**Key Metrics:**
- 10,000+ users in first month
- 4.0+ star rating
- < 1% critical bug rate

**Deliverable:** Nova publicly available with growing user base

---

### Phase 4: Mundial 2026 Operations (3 months)

**June-July 2026: World Cup Period**
- [ ] 24/7 monitoring and support
- [ ] Real-time incident response
- [ ] Daily safety data updates
- [ ] Match-day surge capacity handling
- [ ] User feedback collection
- [ ] Performance optimization
- [ ] Feature releases based on usage patterns

**Key Metrics:**
- 99.9% uptime during Mundial
- 100,000+ total users
- 25% premium conversion
- 4.5+ star rating

**Deliverable:** Successfully support 100,000+ travelers during Mundial 2026

---

### Phase 5: Post-Mundial Evolution (Ongoing)

**Q3 2026 (August-September):**
- [ ] Analyze Mundial performance data
- [ ] User retention campaigns
- [ ] Expand to secondary Mexican destinations
- [ ] Collaborative trip planning (full release)
- [ ] Advanced ML recommendations
- [ ] Cultural route themes

**Q4 2026 (October-December):**
- [ ] Booking integration (hotels, activities)
- [ ] Voice input support
- [ ] Enhanced safety data (crowdsourced)
- [ ] B2B partnerships (tourism boards)
- [ ] International expansion planning

**2027 and Beyond:**
- [ ] Expand to other Latin American countries
- [ ] AI-powered travel concierge (proactive suggestions)
- [ ] AR features (point camera, get info)
- [ ] Sustainability scoring (eco-friendly options)
- [ ] Community features (traveler meetups)

---

## Appendices

### A. Technology Evaluation Criteria

When evaluating new technologies, frameworks, or services, use these criteria:

**Must Have:**
- Active maintenance (updated within last 3 months)
- Permissive license (MIT, Apache 2.0)
- Good documentation
- Community support (Stack Overflow, Discord, etc.)
- Production-ready (not beta)

**Nice to Have:**
- TypeScript support (for TS projects)
- Strong type safety
- Built-in testing utilities
- Performance benchmarks
- Migration guides (from alternatives)

**Red Flags:**
- Abandoned (no updates in 6+ months)
- Known security vulnerabilities
- Vendor lock-in without clear migration path
- Unclear pricing (for paid services)
- Poor track record (frequent breaking changes)

---

### B. API Design Standards

**RESTful Conventions:**
- Use nouns for endpoints (`/itineraries`, not `/get-itinerary`)
- HTTP methods follow semantics (GET, POST, PUT/PATCH, DELETE)
- Plural resource names (`/users`, not `/user`)
- Nested resources for relationships (`/itineraries/:id/activities`)
- Use query params for filtering/pagination (`?page=2&limit=20`)

**Response Format:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-01-22T10:30:00Z",
    "request_id": "uuid"
  },
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 100
  }
}
```

**Error Format:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": [
      {
        "field": "start_date",
        "issue": "Date must be in the future"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-01-22T10:30:00Z",
    "request_id": "uuid"
  }
}
```

**Authentication:**
- Bearer token in Authorization header
- JWT with 1-hour expiry
- Refresh token mechanism
- 401 for unauthenticated, 403 for unauthorized

**Versioning:**
- Include version in URL (`/api/v1/itineraries`)
- Support n-1 versions (backwards compatibility)
- Deprecation warnings in headers

---

### C. Database Schema Guidelines

**Naming Conventions:**
- Tables: plural, snake_case (`itineraries`, `user_preferences`)
- Columns: snake_case (`created_at`, `user_id`)
- Primary keys: `id` (UUID preferred for distributed systems)
- Foreign keys: `<table>_id` (`itinerary_id`)
- Indexes: `idx_<table>_<column>`

**Data Types:**
- Timestamps: `timestamptz` (timezone-aware)
- JSON: `jsonb` (binary, indexable)
- Enums: PostgreSQL ENUM types for fixed sets
- Geography: PostGIS geometry types

**Constraints:**
- Always use foreign key constraints
- Add check constraints for data validation
- Use NOT NULL where appropriate
- Unique constraints for business keys

**Migrations:**
- Never edit existing migrations (create new ones)
- Always include rollback (down migration)
- Test migrations on staging first
- Backup database before production migration




---

### D. Monitoring Checklist

**Application Metrics:**
- [ ] Request rate (requests/second)
- [ ] Response time (p50, p95, p99)
- [ ] Error rate (by endpoint)
- [ ] LLM API costs (by service)
- [ ] Database query performance
- [ ] Cache hit rate

**Business Metrics:**
- [ ] New user signups
- [ ] Itineraries generated
- [ ] Premium conversions
- [ ] Churn rate
- [ ] Revenue (daily, monthly)

**Infrastructure Metrics:**
- [ ] CPU utilization
- [ ] Memory usage
- [ ] Disk I/O
- [ ] Network throughput
- [ ] Pod/container count

**User Experience Metrics:**
- [ ] Time to first itinerary
- [ ] Feature adoption rates
- [ ] User satisfaction (in-app surveys)
- [ ] App crashes (crash-free sessions %)

**Alerts:**
- [ ] Critical: Service down, database unavailable, error rate > 5%
- [ ] High: Latency p95 > 3s, LLM cost spike > 2x
- [ ] Medium: Cache miss rate > 50%, disk usage > 80%

---

### E. Glossary

**API (Application Programming Interface):** A set of rules and protocols that allows software applications to communicate with each other.

**Agent:** In the context of LangGraph, an AI-powered system that can autonomously make decisions and take actions based on input and context.

**Embedding:** A vector representation of text or data that captures semantic meaning, enabling similarity search and clustering.

**Freemium:** A business model where basic services are free, but advanced features require payment.

**Hybrid AI/ML:** Combining LLM-based AI agents with traditional machine learning models and algorithms to optimize for both intelligence and cost.

**Itinerary:** A detailed plan for a trip, including destinations, activities, accommodations, and transportation.

**JWT (JSON Web Token):** A compact, URL-safe means of representing claims to be transferred between two parties, commonly used for authentication.

**LLM (Large Language Model):** A type of AI model trained on vast amounts of text data, capable of understanding and generating human-like text.

**MVP (Minimum Viable Product):** The version of a product with just enough features to be usable by early customers who can then provide feedback for future development.

**Vector Database:** A specialized database optimized for storing and querying high-dimensional vectors (embeddings), enabling fast semantic search.

**TSP (Traveling Salesman Problem):** An optimization problem where the goal is to find the shortest route visiting a set of locations exactly once.

**SDD (Specification-Driven Development):** A methodology where software specifications are created before code, serving as the source of truth for development.

---

## Document Control

**Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-22 | Nova Team | Initial SDD creation |

**Approval:**

- [ ] Technical Lead
- [ ] Product Manager
- [ ] Engineering Team
- [ ] Stakeholders

**Next Review Date:** 2026-02-22 (or when significant requirements change)

---

# IMPORTANT
## These are the most important instructions in light of everything described above. The database is built in PostgreSQL and will be used for everything. Everything that can be handled optimally will be managed within the application. Externally, it only has communication with the agents built with Python. These agents are executed using Langggraph Dev, which already includes Uvicorn and FastAPI, so no additional integration is necessary. We will only create, modify, and debug the existing agents for the app's purpose.


**End of Specification-Driven Development Document**

This document serves as the source of truth for Nova's development. All implementation should align with these specifications. Any deviations or new requirements should result in updates to this SDD before code changes.
