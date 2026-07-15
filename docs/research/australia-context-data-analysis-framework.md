# Australia Context Data Analysis Framework

## Purpose

Use Australian data to decide Beacon's service direction before adding more features.

The goal is to move from:

> "This product has anti-violence features."

to:

> "Australian data shows this specific user group has this specific first-step support gap, so Beacon focuses on this service direction."

## Core Research Question

Where are the biggest gaps between existing Australian domestic/family violence support services and the first-step needs of people who are unsure, digitally monitored, culturally isolated, or not ready to contact formal services?

## Product Decision We Need To Make

Should Beacon focus on:

1. Chinese-speaking / CALD users in Australia
2. International student relationship and dating safety
3. Technology-facilitated abuse / phone monitoring
4. Dating app safety companion
5. Support worker safety-planning tool
6. Community referral toolkit
7. Another narrower service direction

## Data Logic

The analysis should follow this chain:

1. Problem size
2. Affected groups
3. Help-seeking barriers
4. Service and information gaps
5. Product opportunity
6. MVP direction

If a product direction cannot be supported by data at steps 1-4, it should not become the main direction.

## Data Source Matrix

| Source | What It Can Answer | Use For Product Decisions |
|---|---|---|
| ABS Personal Safety Survey | prevalence of partner violence, sexual violence, stalking, help-seeking indicators | prove problem scale and affected groups |
| AIHW Family, Domestic and Sexual Violence | national overview, service pathways, health/welfare impact | establish Australian context |
| eSafety Commissioner | technology-facilitated abuse, image-based abuse, online safety, device monitoring | validate phone safety / digital abuse direction |
| ANROWS | research on domestic/family violence, CALD communities, coercive control, tech abuse | validate user barriers and nuanced groups |
| AIC dating app research | dating app harassment, aggression, sexual violence | validate dating app safety direction |
| 1800RESPECT | official support pathways and safety language | align wording and referral design |
| Ask Izzy | existing service directory model | compare resource navigation |
| State police / legal aid pages | protection orders, emergency response, legal pathways | map official help routes |
| University wellbeing pages | student support pathways | validate international student direction |
| Multicultural service providers | language and cultural service gaps | validate Chinese/CALD direction |

## Analysis Angle 1: Problem Size

### Question

How large is domestic/family/relationship violence in Australia?

### Data To Collect

- intimate partner violence prevalence
- sexual violence prevalence
- stalking prevalence
- family violence service usage
- police or protection order indicators, where available

### Suggested Chart

- bar chart: prevalence by gender
- trend chart: national family/domestic violence indicators
- summary stat cards: key national numbers

### Product Implication

This establishes why the issue matters, but it does not yet determine Beacon's direction.

## Analysis Angle 2: Help-Seeking Gap

### Question

Why do people not immediately use existing services?

### Data To Collect

- whether victims contact police
- whether victims seek advice/support
- reasons for not seeking support, where available
- barriers identified by ANROWS / service reports
- qualitative evidence from support workers

### Barriers To Code

- fear of escalation
- shame or stigma
- not recognizing abuse
- language barrier
- visa or immigration concern
- financial dependence
- child-related concern
- lack of trust in police/services
- device monitoring or surveillance
- not ready to leave
- not ready to call

### Suggested Chart

- ranked barrier chart
- journey gap map: awareness -> search -> decide -> contact -> plan

### Product Implication

If "not ready to call" is a large gap, Beacon should focus on a discreet first-step action tool rather than a generic support directory.

## Analysis Angle 3: CALD / Chinese-Speaking Users

### Question

Do culturally and linguistically diverse users face distinct barriers in Australia?

### Data To Collect

- CALD domestic/family violence research
- language access issues
- migration/visa-related concerns
- use of interpreters
- multicultural service availability
- Chinese-language resource availability

### Indicators

- availability of Chinese-language support
- whether services explain Australian systems clearly
- whether official resources address visa, housing, money, and children
- whether resources are readable for users under stress

### Suggested Chart

- resource availability map by language
- support pathway comparison: English user vs Chinese-speaking user
- table of "questions a Chinese-speaking user may ask first"

### Product Implication

If the gap is strong, Beacon could focus on:

> A bilingual safety navigator for Chinese-speaking people in Australia who are unsure, isolated, or worried about relationship control.

## Analysis Angle 4: International Student Safety

### Question

Do international students have a specific relationship/dating safety support gap?

### Data To Collect

- university wellbeing pathways
- international student support pages
- student safety policies
- dating safety and sexual violence data
- student interviews or surveys

### Indicators

- confusion between university support, police, hospital, counselling, and national hotlines
- visa/study concerns
- fear of parents/community finding out
- dating app risk
- lack of localized support knowledge

### Suggested Chart

- student support pathway map
- first-click test results for student scenarios

### Product Implication

If validated, Beacon could focus on:

> A relationship and dating safety tool for international students in Australia.

## Analysis Angle 5: Technology-Facilitated Abuse

### Question

Is phone/location/account monitoring a high-value product gap?

### Data To Collect

- eSafety technology-facilitated abuse materials
- ANROWS tech abuse research
- WESNET / frontline practitioner resources
- service worker interviews
- user survey on phone/location concerns

### Risk Types To Code

- location tracking
- checking phone
- shared Apple ID / Google account
- spyware or suspicious apps
- browser history risk
- social account monitoring
- notification previews
- smart home devices
- smart car tracking
- image-based abuse
- dating app stalking

### Suggested Chart

- technology abuse taxonomy
- risk type vs product response matrix
- "what to check first" priority list

### Product Implication

If this direction is strong, Beacon could focus on:

> A discreet phone safety and relationship control check for people who think they may be monitored.

This direction best matches Quick Exit, Disguise Mode, and a mobile-first safety tool.

## Analysis Angle 6: Dating App Safety

### Question

Is dating app safety a strong Australian product opportunity?

### Data To Collect

- AIC dating app sexual harassment/aggression/violence research
- dating app safety codes or platform policies
- reports on dating app-related sexual violence
- user survey among young adults and students

### User Situations

- before meeting someone
- during a date
- after harassment
- after stalking
- after image-based abuse
- after coercive messages

### Suggested Chart

- dating app risk journey: match -> chat -> meet -> after-date
- feature opportunity by moment

### Product Implication

If validated, Beacon could become:

> A dating safety companion for young people and international students in Australia.

## Analysis Angle 7: Existing Resource Gap

### Question

Do existing Australian resources answer the user's first question quickly?

### Method

Audit 10-15 services:

- 1800RESPECT
- eSafety
- Ask Izzy
- Daisy
- Sunny
- Safe Steps
- Full Stop Australia
- state legal aid
- community legal centres
- university wellbeing pages
- multicultural service pages

### Audit Criteria

- first-screen clarity
- emergency visibility
- quick exit
- technology safety coverage
- CALD language support
- Chinese-language availability
- mobile usability
- actionability
- reading complexity
- whether the page gives a next step in under 10 seconds

### Suggested Chart

- service gap heatmap
- first-screen CTA comparison
- coverage matrix by user situation

### Product Implication

This will show whether Beacon should be:

- a navigator
- a digital safety tool
- a student-focused product
- a support-worker tool
- a Chinese-language support layer

## Analysis Angle 8: Product Entry Point

### Question

What should the first screen ask?

### Test Options

Version A: Feature-led

- Chat
- Risk Check
- Resources
- Safety Plan

Version B: Situation-led

- I might be unsafe tonight
- I need to prepare to leave
- My phone may be monitored
- I am not sure if this is abuse
- I am helping someone else

Version C: Narrow direction

- Check phone safety
- Create a safe help message
- Find human support

### Metrics

- first click
- time to first click
- confidence rating
- perceived safety
- trust rating
- comprehension
- willingness to continue

### Product Implication

The homepage should be based on the highest-performing entry point, not on the current feature list.

## Recommended Analysis Outputs

### 1. Problem Overview

One page showing:

- national problem scale
- affected groups
- why this matters

### 2. User Gap Map

Journey:

1. something feels wrong
2. user searches privately
3. user tries to understand risk
4. user decides whether to contact help
5. user plans next action

Mark where current services are weak.

### 3. Segment Opportunity Matrix

| Segment | Pain Strength | Data Support | Access To Users | Product Fit | Risk | Recommendation |
|---|---|---|---|---|---|---|
| Chinese-speaking users | TBD | TBD | TBD | TBD | TBD | TBD |
| International students | TBD | TBD | TBD | TBD | TBD | TBD |
| Tech abuse users | TBD | TBD | TBD | TBD | TBD | TBD |
| Dating app users | TBD | TBD | TBD | TBD | TBD | TBD |
| Support workers | TBD | TBD | TBD | TBD | TBD | TBD |

### 4. Feature Priority Matrix

Use data to decide whether each feature is:

- core
- secondary
- hidden
- removed

### 5. MVP Recommendation

Final output should be one sentence:

> Beacon should focus on [user group] who experience [problem] and need [first-step action] in [Australian context].

Example:

> Beacon should focus on Chinese-speaking international students in Australia who are unsure whether they are experiencing relationship control or phone monitoring and need a discreet first-step safety check.

## Initial Hypotheses To Test

### Hypothesis A

Chinese-speaking and CALD users face extra friction because English-first resources do not fully explain Australian systems, support pathways, and culturally specific concerns.

### Hypothesis B

Technology-facilitated abuse is a strong product entry point because it creates an immediate need for discreet, mobile-first, step-by-step guidance.

### Hypothesis C

Dating app safety is a promising channel for young people and international students, but it may require partnerships to become a strong product.

### Hypothesis D

The current feature-led homepage is weaker than a situation-led homepage.

## Next Research Tasks

1. Fill the data source matrix with specific stats and citations.
2. Complete 8-10 competitor/service audits.
3. Interview 3-5 support workers or community workers.
4. Survey 20-30 general/CALD/international student participants.
5. Run first-click tests on 3 homepage variants.
6. Select one service direction and rewrite the product scope.
