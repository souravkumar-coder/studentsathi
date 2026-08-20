# StudentSathi Mobile Experience Plan

## Product intent

StudentSathi is a calm, trustworthy scholarship companion for Indian students. The application reduces the friction of discovering genuine opportunities, understanding eligibility, assembling documents, and keeping applications on track. The first release prioritizes a **private, locally persistent MVP**; all models and screens are organized so authenticated, cloud-synced student, college, provider, and admin workflows can be connected later without redesign.

## Interface principles

The interface is designed for a 9:16 portrait screen and one-handed use. It follows iOS conventions with a restrained navigation hierarchy, clear grouping, large tap targets, tab-bar navigation, bottom sheets for lightweight actions, system-style toggles, and status feedback after every meaningful action. The main action on a screen stays in the thumb zone. Dense information is revealed progressively rather than putting long forms or exhaustive criteria on the first screen.

## Color choices

| Token | Light value | Dark value | Rationale |
|---|---:|---:|---|
| Ink navy | `#102A43` | `#F7FAFC` | Establishes institutional trust and legible hierarchy. |
| Sathi blue | `#206BC4` | `#69A9FF` | Primary navigation and student actions. |
| Opportunity teal | `#0F766E` | `#4FD1C5` | Highlights eligibility and verified scholarship signals. |
| Warm saffron | `#D97706` | `#FBBF24` | Draws attention to time-sensitive deadlines without alarm. |
| Success green | `#15803D` | `#4ADE80` | Confirms completed applications and documents. |
| Soft canvas | `#F7FAFC` | `#0B1522` | Provides spacious, low-noise reading surfaces. |

## Screen list

| Screen | Primary content and functionality |
|---|---|
| Welcome and profile setup | A compact, step-based student profile capturing education level, course, state, category, income band, and relevant optional criteria. The resulting profile powers local eligibility matching. |
| Home | Personalized greeting, profile-completion indicator, urgent deadlines, a prominent search entry point, recommendation feed, and quick actions for documents, eligibility, and reminders. |
| Discover | Search, filter chips, saved filters, closing-soon and newly added sections, bookmark actions, and an accessibility-friendly scholarship list. |
| Scholarship detail | Provider, award amount, deadline, eligibility summary, “Why this matches” insight, documents, official-link placeholder, similar opportunities, save/apply actions, and application notes. |
| Eligibility checker | Simple question flow with a transparent score, matched criteria, missing criteria, and a recommended next step. |
| My applications | Timeline cards for saved, in progress, submitted, and completed applications; each includes deadline, checklist state, reminder control, and notes. |
| Document vault | A secure-feeling document inventory with verification state, expiry awareness, missing-document cues, checklist progress, and upload-ready slots. |
| Updates | Scholarship, exam, admission, internship, and government-scheme updates, with a compact “important” announcement treatment. |
| Community | Question and answer cards, helpful vote counts, reporting affordance, success story entry point, and a clear moderation-state pattern. |
| Sathi assistant | A Hindi/English chat-style support interface for natural-language scholarship search, application guidance, document checklists, and career questions. The initial interface is designed for a backend LLM connection. |
| Profile and settings | Student summary, profile editor entry point, theme and language preferences, notification preferences, privacy controls, help, and terms links. |
| Future role workspaces | Reserved route patterns and models for college, provider, and admin activities, including announcement management, scholarship review, metrics, verification, and moderation. |

## Key user flows

| Goal | Flow |
|---|---|
| Find a relevant scholarship | Home search or Discover tab → filter by course/state/category → open scholarship detail → review eligibility explanation → save or begin application. |
| Prepare an application | Scholarship detail → add to My Applications → see required-document checklist → open Document Vault → mark/upload available documents → return to application → set deadline reminder. |
| Understand eligibility | Home quick action → Eligibility Checker → answer short profile questions → review score, qualifying criteria, missing criteria, and recommended scholarships → save a result. |
| Get quick guidance | Tab or Home assistant entry → ask in Hindi or English → receive guided search/checklist response → open related scholarship or document action. |
| Stay on schedule | Home urgent deadline card or My Applications → open application → enable reminder → follow checklist and update status. |
| Participate safely | Community tab → open question → read answers → mark helpful or report → create a new question through a moderated composer. |

## Domain vocabulary

The core model uses `StudentProfile`, `Scholarship`, `EligibilityResult`, `DocumentRecord`, `ApplicationRecord`, `Reminder`, `NewsItem`, `CommunityPost`, `NotificationPreference`, and `UserRole`. Student records remain on-device in the MVP. Service boundaries are represented through typed repository interfaces so future authentication, OCR, real application links, sync, notifications, college, provider, and admin capabilities can be introduced without changing the screens.

## MVP scope and future expansion

The initial app turns the feature master list into usable student journeys, seeded with representative content rather than claiming live government data, live application submission, legal document verification, or autonomous advice. The advanced provider, college, admin analytics, OCR, voice, SMS/WhatsApp, and security features are mapped into the domain design and backlog as the next build increments.
