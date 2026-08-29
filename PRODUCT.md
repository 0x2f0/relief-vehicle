# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- Relief applicants (NGOs, medical corps, rescue teams, volunteers, essential supply drivers) applying for crisis movement permits.
- Checkpoint field officers stationed along highway transit posts validating cryptographically signed passes via mobile cameras even during cellular grid outages.
- District coordinators dispatchers overseeing approvals, priority dispatching, route congestion, and active road hazards.

## Product Purpose
Provide an official, tamper-proof, bilingual e-pass and route coordination system for emergency and relief vehicles during flood and natural disaster crises across Nepal.

## Positioning
An authoritative government emergency transit management system that couples self-service public issuance with offline-capable cryptographic QR verification and real-time hazard-aware convoy dispatch.

## Operating Context
- Disaster response during torrential monsoons, landslides, and road blockages across major national highways.
- High-stress field checkpoints with sporadic connectivity requiring deterministic client-side signature validation.
- Central coordination dispatch managing supply bottlenecks and emergency clearance.

## Capabilities and Constraints
- Bilingual support: Full Nepali and English interface with instant locale switching.
- Offline QR Token signing (HMAC-SHA256) and validation without database access.
- Automated mission priority classification (Critical, High, Medium, Normal) based on vehicle and cargo payloads.
- Live highway and arterial road condition advisories.
- Role-based staff access for superadmin, district coordinators, and checkpoint officers.

## Brand Commitments
- Office of the Prime Minister and Council of Ministers (OPMCM / opmcm.gov.np) visual identity:
  - Primary color: Deep Government Blue (#0447AF)
  - Secondary / Alert color: Crimson Red (#CC1424)
  - Background surface: Soft Clean Blue (#F4F8FF) and White
- National Emblem of Nepal header branding.
- Typography: Mukta and Noto Sans Devanagari.

## Evidence on Hand
- Real highway corridor names and segments (Prithvi, Tribhuvan, BP, East-West, Arniko Highways).
- Canonical Nepal Government visual language patterns (two-tier navigation, announcement ticker, official bilingual labels).
- Seeded operational user credentials and road status data.

## Product Principles
1. Speed and Resilience First: Applications must be simple to submit; checkpoint verification must work instantly even with zero connectivity.
2. Authoritative Government Clarity: Clear visual hierarchy, official emblem, and unambiguous status indicators eliminate confusion at roadside checkpoints.
3. Bilingual Equity: Nepali and English are first-class, with natural phrasing rather than machine translations.
4. Actionable Situational Awareness: Road closures and priority levels inform transport operators before departure.

## Accessibility & Inclusion
- High color contrast meeting WCAG AA standards.
- Fully responsive on field mobile devices used by roadside officers.
- Semantic HTML and clear font weights.
