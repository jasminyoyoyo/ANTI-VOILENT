# Next Analysis Questions

Last updated: 2026-07-14

This file translates the cleaned ABS dataset into concrete analysis tasks.

中文说明：这不是“随便做一些图”，而是把每个分析任务和产品问题对应起来。

## 1. Analysis Question A: Why State-Aware?

Product question:

> Why should Beacon ask the user which state/territory they are in?

Data to use:

- `data/processed/pss_key_metrics.csv`
- filter `source_sheet = Table 9.3`
- filter `sex = Women`

Analysis:

1. Compare each jurisdiction against Australia for:
   - total violence since age 15
   - sexual violence since age 15
   - intimate partner/family member violence since age 15
   - sexual harassment since age 15
2. Rank jurisdictions by each indicator.
3. Add legal/system differences from `australia-state-violence-system-map.md`.

Expected output:

- state comparison chart
- short explanation:
  - data shows state differences
  - law/service map shows system differences
  - therefore product should be state-aware

## 2. Analysis Question B: What Type Of Violence Should The First Screen Recognise?

Product question:

> Should the first screen only say domestic violence, or should it include other entry points?

Data to use:

- `Table 1.3`
- `Table 2.3`
- `Table 9.3`

Analysis:

Compare:

- sexual violence
- physical violence
- intimate partner/family violence
- emotional abuse
- economic abuse
- stalking
- sexual harassment

Expected product implication:

The first screen should not only say "domestic violence." It should use user-language entry points such as:

- "I am not sure if this counts"
- "Someone controls or scares me"
- "My phone/location may be monitored"
- "Something happened after dating or meeting someone"
- "I need to plan leaving safely"
- "I am helping someone else"

## 3. Analysis Question C: Can ABS Prove A Chinese/CALD Direction?

Product question:

> Can we justify focusing on Chinese-speaking or CALD users using ABS alone?

Data to use:

- ABS PSS for general scale only
- additional sources required:
  - ANROWS
  - eSafety CALD research
  - multicultural service directories
  - Chinese-language service availability
  - interviews

Analysis:

1. Use ABS to prove general violence scale.
2. Use service audit to see whether Chinese-language pathways are easy to find.
3. Use interviews or surveys to learn actual landing motivation.

Expected conclusion:

ABS supports the general problem, but not the Chinese/CALD product direction by itself.

## 4. Analysis Question D: Is Technology-Facilitated Abuse A Strong Direction?

Product question:

> Should Beacon include a phone/account/location safety pathway?

Data to use:

- ABS stalking / harassment / emotional abuse as adjacent scale signals
- eSafety tech abuse research
- ANROWS / WESNET materials
- user/support-worker interviews

Analysis:

1. Treat ABS as context, not proof.
2. Build a tech-abuse taxonomy:
   - phone checking
   - location sharing
   - shared Apple ID / Google account
   - spyware or unknown apps
   - browser history
   - social media monitoring
   - image-based abuse
   - dating app stalking
3. Map each risk to product response:
   - safe explanation
   - checklist
   - what not to do
   - when to contact specialist support

Expected conclusion:

This direction needs external evidence, but it may be highly product-relevant because it changes privacy and UX design.

## 5. Analysis Question E: What Should We Not Build?

Product question:

> Which features are risky even if users say they want them?

Methods:

- risk analysis
- safety-by-design review
- expert review

Likely avoid first:

- public forum
- user profiles
- private messaging
- location/community matching
- AI legal advice
- storing sensitive stories by default

Expected output:

- risk matrix
- safer alternatives:
  - reviewed anonymous story library
  - professional Q&A
  - state-specific next-step navigator
  - no-login safety checklist

## 6. The Next Concrete Deliverable

The next useful deliverable should be:

> Evidence scorecard for Beacon directions

Rows:

- state-aware navigator
- Chinese/CALD navigator
- tech abuse first-aid
- dating safety
- international student safety
- bystander/helper pathway
- anonymous story library
- public forum

Columns:

- problem severity
- evidence strength
- service gap
- product fit
- safety risk
- data still needed
- recommended action

This scorecard will turn research into a product decision.
