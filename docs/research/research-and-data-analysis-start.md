# Research and Data Analysis Start

Last updated: 2026-07-13

## 1. Core Position

This research should not start from the current Beacon features.

The correct starting question is:

> In Australia, who has an urgent but underserved first-step safety need, and what makes them open a website before they are ready to call police, a hotline, a lawyer, or a service provider?

Chinese:

> 在澳大利亚，哪些人有真实但未被充分满足的“第一步安全支持”需求？他们为什么会在还没准备好报警、打热线、找律师或联系服务机构之前，先打开一个网站？

This is the question that should decide the product direction, feature set, and UI.

## 2. Why Existing Government Resources Do Not Make Beacon Meaningless

Official resources already do many things well:

- explain what domestic and family violence is
- list abuse types such as emotional, physical, sexual, financial, technological, reproductive, social, and systems abuse
- explain domestic violence orders, family law, child protection, and legal support
- provide state-based service links and emergency pathways
- offer multilingual access on some government-backed pages

So Beacon should not compete as another generic information library.

The product opportunity is different:

> Help users make the first safe decision under stress, uncertainty, privacy risk, language barriers, or fear of consequences.

Chinese:

> Beacon 的意义不应该是“再做一个信息库”，而是帮助用户在压力、犹豫、隐私风险、语言障碍或害怕后果的情况下，完成第一个安全决定。

## 3. What The ABS Data Can Already Tell Us

Source dataset in this repo:

- `data/raw/aihw_downloads/PSS National prevalence and time series (Tables 1 to 8).xlsx`
- `data/raw/aihw_downloads/PSS State and territory prevalence and time series (Tables 9 to 14).xlsx`

Official source:

- ABS Personal Safety, Australia, 2021-22: https://www.abs.gov.au/statistics/people/crime-and-justice/personal-safety-australia/latest-release

Important data period:

- Reference period: 2021-22 financial year
- Released: 2023-03-15
- As of the checked ABS page, this is the latest release and the next release is listed as unknown.

The ABS data is useful for:

- national problem scale
- gender differences
- violence type comparison
- state and territory comparison
- trend comparison across 2005, 2012, 2016, and 2021-22 for selected indicators
- proving that the issue is large enough to justify a product

The ABS data is not enough for:

- Chinese-speaking users specifically
- international students specifically
- dating app users specifically
- technology-facilitated abuse details such as phone monitoring, account access, spyware, shared Apple ID, or location tracking
- exact reasons why a user would land on Beacon
- whether users trust AI, forms, anonymous chat, community posts, or service referrals

That means ABS should be used as the foundation, not the final product answer.

## 4. First Data Findings To Use In Product Reasoning

### National Scale

From ABS Personal Safety Survey 2021-22:

- Around 8 million Australians, or 41%, had experienced physical and/or sexual violence since age 15.
- 31% of women and 42% of men had experienced physical violence since age 15.
- 22% of women and 6.1% of men had experienced sexual violence since age 15.
- 27% of women and 12% of men had experienced violence by an intimate partner or family member since age 15.
- 23% of women and 7.3% of men had experienced violence by an intimate partner since age 15.
- 17% of women and 5.5% of men had experienced cohabiting partner violence since age 15.
- 9.3% of women and 2.3% of men had experienced violence by a boyfriend, girlfriend, or date since age 15.

Product implication:

The product should not frame the issue only as "family violence after marriage." Relationship safety, intimate partner violence, dating-related violence, and non-physical control all matter.

### State and Territory Differences

From the state/territory workbook, selected female prevalence since age 15:

| Indicator | Highest areas in provided table | Australia |
|---|---:|---:|
| Total violence | NT 45.6%, TAS 42.6%, WA 42.0%, ACT 41.9% | 39.2% |
| Sexual violence | NT 26.6%, TAS 26.0%, ACT 25.1%, QLD 24.0% | 22.2% |
| Physical violence | NT 37.1%, QLD 33.6%, WA 33.5%, TAS 32.7% | 30.8% |
| Intimate partner / family violence | NT 32.8%, TAS 30.8%, QLD 31.0% | 27.4% |
| Sexual harassment | ACT 58.9%, NT 58.7%, TAS 56.8%, VIC 55.6% | 52.9% |

Product implication:

Beacon cannot give one single Australia-wide path for every user. The user journey should ask for state/territory early, because police, legal aid, intervention orders, referral systems, and service pathways vary.

### Trend Signals

Selected 12-month prevalence trends:

- Female intimate partner violence: 2.3% in 2016 to 1.5% in 2021-22.
- Female cohabiting partner emotional abuse: 4.8% in 2016 to 3.9% in 2021-22.
- Female sexual harassment: 17.3% in 2016 to 12.6% in 2021-22.
- Female sexual violence stayed relatively stable from 2016 to 2021-22: 1.8% to 1.9%.

Interpretation caution:

- The 2021-22 survey happened during the COVID-19 period.
- ABS warns about relative standard error for some estimates.
- Some indicators are not directly comparable across all years because survey questions changed.

Product implication:

Do not use a simplistic "everything is rising" story. A stronger research story is:

> Even where some indicators decrease or stay stable, the first-step support problem remains: people still need safe, discreet, state-aware, culturally understandable pathways before formal contact.

## 5. Research Directions To Compare

The product direction should be chosen by evidence, not preference. These are the strongest candidates.

### Direction A: Chinese-speaking / CALD Safety Navigator

Hypothesis:

Chinese-speaking and CALD users in Australia may face extra barriers: language, uncertainty about Australian systems, visa concern, family/community pressure, shame, financial dependence, interpreter privacy concerns, and unfamiliarity with police/legal pathways.

What to research:

- Which states have Chinese-language or CALD-specific domestic/family violence services?
- Do official resources explain what happens after contacting police, legal aid, courts, housing, or counselling?
- What questions do Chinese-speaking users search first?
- Do users prefer Chinese-first, bilingual, or English with Chinese explanation?

Potential product:

> A bilingual first-step safety navigator for Chinese-speaking people in Australia.

### Direction B: Technology-Facilitated Abuse / Phone Safety

Hypothesis:

Many users may not first search "domestic violence." They may search "my partner checks my phone," "I think I am being tracked," "shared Apple ID," "location sharing," or "how to leave safely without them knowing."

What to research:

- eSafety, ANROWS, WESNET, and frontline service material on tech-facilitated abuse
- user understanding of device monitoring
- what can be safely checked without increasing danger
- how to design quick exit, privacy, no-login, and low-data-retention flows

Potential product:

> A discreet phone and account safety first-aid tool for people worried they are monitored.

### Direction C: Dating App / Early Relationship Safety

Hypothesis:

Dating app risk may be a distinct entry point, especially for younger users, international students, and people who do not identify their situation as domestic violence.

What to research:

- Australian Institute of Criminology dating app research
- dating platform safety tools and gaps
- campus support pathways
- whether users want pre-date planning, post-incident reporting guidance, or "what just happened?" validation

Potential product:

> A dating safety companion for people in Australia who feel unsafe before, during, or after meeting someone.

### Direction D: International Student Relationship Safety

Hypothesis:

International students may face unique constraints: visa anxiety, housing dependence, limited local knowledge, fear of parents/community finding out, language barriers, and confusion between university, police, hospital, counselling, and legal services.

What to research:

- university support pages across major Australian universities
- international student support policies
- campus sexual assault and harassment pathways
- interviews with student support staff and student associations

Potential product:

> A first-step relationship and safety guide for international students in Australia.

### Direction E: Bystander / Help A Friend

Hypothesis:

Some visitors may not be victim-survivors themselves. They may be friends, classmates, colleagues, housemates, or family members who sense danger but do not know what to say or do.

What to research:

- existing bystander resources
- what support workers recommend friends say first
- how to avoid escalating risk
- whether users need scripts, checklists, or referral pathways

Potential product:

> A safe conversation guide for helping someone in a controlling or unsafe relationship.

## 6. Ranking Criteria

Each direction should be scored from 1 to 5.

| Criterion | Meaning |
|---|---|
| Problem severity | How serious is the harm if unsupported? |
| Evidence strength | How much official or research evidence supports it? |
| User reachability | Can we realistically reach and recruit this user group? |
| Current service gap | Are existing resources insufficient for the first-step moment? |
| Product fit | Can a website/app meaningfully help without creating danger? |
| Safety risk | Could the product accidentally increase harm? Lower risk scores better. |
| Differentiation | Is this meaningfully different from government information sites? |

## 7. Research Methods

### Desk Research

Purpose:

Map what already exists and avoid building a weaker duplicate of official services.

Sources:

- ABS Personal Safety Survey
- AIHW Family, Domestic and Sexual Violence
- Family Violence Law Help
- eSafety Commissioner
- ANROWS
- AIC dating app research
- 1800RESPECT
- Ask Izzy
- state police, legal aid, and court pages
- multicultural service providers
- university wellbeing and safer community pages

### Data Analysis

Purpose:

Quantify the Australian problem landscape.

Analysis outputs:

- national prevalence summary
- state/territory comparison
- violence type comparison
- trend chart for selected indicators
- data gap table for each product direction

### Competitor / Service Audit

Purpose:

Identify where existing sites stop helping.

Audit questions:

- Does the service explain what to do first?
- Does it explain what happens after contact?
- Does it support Chinese/CALD users?
- Does it address phone monitoring and privacy?
- Does it ask for state/territory?
- Does it work for users who are unsure whether abuse is happening?
- Does it avoid overwhelming users?

### User Research

Start with lower-risk participants:

- support workers
- community workers
- legal centre staff
- university wellbeing staff
- Chinese/CALD community organization staff
- bystanders who have helped friends

Only recruit victim-survivors with appropriate ethics, safeguarding, consent, and referral procedures.

## 8. What We Should Not Build First

Do not build these as first-version core features:

- public posting forum
- private messaging between users
- visible profiles
- location-based community features
- unmoderated instant comments
- AI legal advice
- crisis diagnosis
- complex account system

Reason:

In domestic/family/relationship violence contexts, these can create identity exposure, perpetrator monitoring risk, misinformation risk, retraumatization, and moderation burden.

Safer alternative:

> Reviewed anonymous story library + professional notes + state-specific next-step navigation.

## 9. Proposed MVP Direction To Validate

Current strongest hypothesis:

> Beacon should become a discreet, bilingual, state-aware first-step safety navigator for people in Australia who are unsure whether their relationship, phone, dating situation, or family environment is unsafe.

Core first screen:

1. "I feel unsafe now"
2. "I am not sure if this counts"
3. "I think my phone/location is monitored"
4. "I want to leave or prepare"
5. "I need Chinese/bilingual support"
6. "I want to help someone else"

The site should ask very few questions first:

- Are you in immediate danger?
- Which state/territory are you in?
- Is someone able to see your device?
- What kind of situation is closest?
- Do you want information only, a checklist, or a human service?

## 10. Next Analysis Tasks

1. Build a cleaned ABS data summary table.
2. Create charts for national prevalence, state comparison, and selected trends.
3. Audit official service pathways for each state/territory.
4. Audit Chinese-language and CALD-specific support availability.
5. Audit technology-facilitated abuse resources.
6. Score the five product directions using the ranking criteria above.
7. Choose one narrow direction for the first prototype.

## 11. Working Conclusion

Beacon still has meaning, but not as a generic anti-violence website.

The meaningful product space is:

> first-step decision support under uncertainty.

The research should now prove which specific uncertainty matters most:

- language/culture uncertainty
- system/legal uncertainty
- phone/privacy uncertainty
- dating/relationship uncertainty
- bystander uncertainty

Once that is proven, features and UI can be designed from evidence rather than assumption.
