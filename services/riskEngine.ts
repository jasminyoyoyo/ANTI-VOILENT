import { Persona, RiskLevel, RoutingResult } from '../types';

export type RiskCheckAnswerValue = 'no' | 'sometimes' | 'yes';

type SignalRule = {
  signal: string;
  weight: number;
  patterns: RegExp[];
  immediate?: boolean;
};

const VICTIM_SIGNAL_RULES: SignalRule[] = [
  { signal: 'coercive_control', weight: 2, patterns: [/control me/i, /controls me/i, /won't let me/i, /not allowed to/i, /checks my phone/i, /控制我/, /不让我/, /限制我/, /不准我/, /查我手机/] },
  { signal: 'monitoring', weight: 4, patterns: [/watch(es|ing)? my phone/i, /see(s|ing)? my phone/i, /track(s|ing)? me/i, /stalking me/i, /spyware/i, /monitor(ing)? me/i, /看我手机/, /监视我/, /定位我/, /跟踪我/, /偷看我消息/] },
  { signal: 'financial_control', weight: 2, patterns: [/controls the money/i, /won't let me access money/i, /financially control/i, /took my cards/i, /控制钱/, /不给我钱/, /拿走.*银行卡/, /经济控制/] },
  { signal: 'property_damage', weight: 3, patterns: [/smash(es|ed)? things/i, /break(s|ing)? things/i, /punch(ed)? the wall/i, /throw(s|ing)? things/i, /砸东西/, /摔东西/, /砸墙/, /扔东西/] },
  { signal: 'violence_history', weight: 4, patterns: [/hit me/i, /hurt me/i, /assault(ed)? me/i, /pushed me/i, /slapped me/i, /kicked me/i, /打我/, /家暴我/, /推我/, /扇我/, /踢我/, /伤害我/, /打她/, /打我妈/, /打我妈妈/] },
  { signal: 'threats', weight: 5, patterns: [/threaten(ed|s)? me/i, /said.*kill me/i, /said.*hurt me/i, /if i leave/i, /he'll kill/i, /she'll kill/i, /威胁我/, /说要杀了我/, /说要伤害我/, /如果我离开/, /弄死我/], immediate: true },
  { signal: 'strangulation', weight: 8, patterns: [/strangl/i, /chok(ed|ing)? me/i, /hands around my neck/i, /掐脖子/, /掐我脖子/, /勒我脖子/] , immediate: true },
  { signal: 'weapons', weight: 10, patterns: [/knife/i, /gun/i, /weapon/i, /machete/i, /刀/, /枪/, /武器/] , immediate: true },
  { signal: 'children_present', weight: 5, patterns: [/my child/i, /my children/i, /kids saw/i, /children were there/i, /baby/i, /孩子在/, /小孩在/, /宝宝在/, /孩子看到了/] },
  { signal: 'immediate_danger', weight: 10, patterns: [/not safe right now/i, /i'm in danger/i, /tonight could be bad/i, /he is outside/i, /she is outside/i, /can't go home/i, /现在很危险/, /他就在旁边/, /她就在旁边/, /今晚会出事/, /我现在不安全/, /正在打/, /现在在打/] , immediate: true },
];

const PERPETRATOR_SIGNAL_RULES: SignalRule[] = [
  { signal: 'loss_of_control', weight: 6, patterns: [/can't control myself/i, /control myself/i, /about to snap/i, /might hurt/i, /快控制不住了/, /控制不住自己/, /快要失控/] },
  { signal: 'violent_intent', weight: 10, patterns: [/want to hit/i, /want to hurt/i, /might kill/i, /want to kill/i, /想打人/, /想伤害/, /想杀/] , immediate: true },
  { signal: 'weapon_access', weight: 10, patterns: [/have a knife/i, /have a gun/i, /weapon/i, /我有刀/, /我有枪/, /拿着刀/] , immediate: true },
];

const BYSTANDER_PATTERNS = [/my friend/i, /my sister/i, /my brother/i, /someone i know/i, /my mum/i, /my mom/i, /my daughter/i, /my son/i, /我朋友/, /我同学/, /我姐姐/, /我哥哥/, /我弟弟/, /我妹妹/, /我妈/, /我妈妈/, /我爸/, /我爸爸/];
const CHILD_PATTERNS = [/i am 1[0-7]\b/i, /i'm 1[0-7]\b/i, /i am a child/i, /i'm a child/i, /at school/i, /my parents/i, /my dad/i, /my mum/i, /my mom/i, /我是小孩/, /我是孩子/, /我是学生/, /在学校/, /我爸/, /我爸爸/, /我妈/, /我妈妈/];
const CHILD_WITNESS_PATTERNS = [/我爸.*打我妈/, /我爸爸.*打我妈妈/, /我爸在打我妈/, /我爸爸在打我妈妈/, /my dad.*hit(s|ting)? my mom/i, /my dad.*hurt(s|ing)? my mom/i, /my father.*my mother/i];
const PERPETRATOR_PATTERNS = [/i might hurt/i, /i want to hit/i, /i want to hurt/i, /i am so angry/i, /i can't control myself/i, /我想打人/, /我想伤害/, /我快控制不住/] ;

const RISK_ORDER: RiskLevel[] = ['low', 'medium', 'high', 'imminent'];
const RISK_CHECK_QUESTION_WEIGHTS: Record<string, { sometimes: number; yes: number; signal: string; immediate?: boolean }> = {
  fear: { sometimes: 4, yes: 7, signal: 'fear', immediate: true },
  control: { sometimes: 2, yes: 4, signal: 'coercive_control' },
  isolation: { sometimes: 2, yes: 4, signal: 'isolation' },
  threats: { sometimes: 6, yes: 10, signal: 'threats', immediate: true },
  monitoring: { sometimes: 4, yes: 6, signal: 'monitoring' },
  money: { sometimes: 2, yes: 4, signal: 'financial_control' },
};

const maxRisk = (a: RiskLevel, b: RiskLevel): RiskLevel => (RISK_ORDER.indexOf(a) > RISK_ORDER.indexOf(b) ? a : b);

const collectSignals = (text: string, rules: SignalRule[]) => {
  const hits = rules.filter((rule) => rule.patterns.some((pattern) => pattern.test(text)));
  const score = hits.reduce((sum, hit) => sum + hit.weight, 0);
  const immediate = hits.some((hit) => hit.immediate);
  return { hits, score, immediate };
};

export const ruleBasedRoute = (historyText: string, latestUserMessage: string): RoutingResult => {
  const combinedText = `${historyText}\n${latestUserMessage}`.toLowerCase();

  let persona: Persona = 'victim_survivor';
  if (PERPETRATOR_PATTERNS.some((pattern) => pattern.test(combinedText))) {
    persona = 'potential_perpetrator';
  } else if (CHILD_WITNESS_PATTERNS.some((pattern) => pattern.test(combinedText))) {
    persona = 'child_youth';
  } else if (
    BYSTANDER_PATTERNS.some((pattern) => pattern.test(combinedText)) &&
    /friend|sister|brother|mum|mom|daughter|son|someone i know|我朋友|我同学|我姐姐|我哥哥|我弟弟|我妹妹/.test(combinedText)
  ) {
    persona = 'bystander';
  } else if (CHILD_PATTERNS.some((pattern) => pattern.test(combinedText))) {
    persona = 'child_youth';
  }

  const signalSet =
    persona === 'potential_perpetrator'
      ? collectSignals(combinedText, PERPETRATOR_SIGNAL_RULES)
      : collectSignals(combinedText, VICTIM_SIGNAL_RULES);

  let riskLevel: RiskLevel = 'low';
  if (signalSet.immediate || signalSet.score >= 20) {
    riskLevel = 'imminent';
  } else if (signalSet.score >= 11) {
    riskLevel = 'high';
  } else if (signalSet.score >= 5) {
    riskLevel = 'medium';
  }

  if (persona === 'child_youth' && riskLevel === 'low') {
    riskLevel = 'medium';
  }
  if (persona === 'child_youth' && signalSet.score >= 4) {
    riskLevel = maxRisk(riskLevel, 'high');
  }

  const immediateSafetyConcern = riskLevel === 'imminent' || signalSet.immediate;
  const needsHumanEscalation = riskLevel === 'high' || riskLevel === 'imminent';

  return {
    persona,
    riskLevel,
    detectedSignals: signalSet.hits.map((hit) => hit.signal),
    immediateSafetyConcern,
    needsHumanEscalation,
    explanation:
      signalSet.hits.length > 0
        ? `Rules detected ${signalSet.hits.map((hit) => hit.signal).join(', ')}.`
        : 'Rules detected no strong danger signals yet.',
    source: 'rules',
  };
};

export const mergeRouting = (ruleRoute: RoutingResult, llmRoute: Partial<RoutingResult> | null): RoutingResult => {
  if (!llmRoute) return ruleRoute;

  const persona =
    ruleRoute.persona === 'potential_perpetrator' || ruleRoute.persona === 'child_youth'
      ? ruleRoute.persona
      : (llmRoute.persona as Persona) || ruleRoute.persona;

  const riskLevel = maxRisk(ruleRoute.riskLevel, (llmRoute.riskLevel as RiskLevel) || ruleRoute.riskLevel);
  const detectedSignals = Array.from(new Set([...ruleRoute.detectedSignals, ...((llmRoute.detectedSignals as string[]) || [])]));
  const immediateSafetyConcern = ruleRoute.immediateSafetyConcern || Boolean(llmRoute.immediateSafetyConcern);
  const needsHumanEscalation = ruleRoute.needsHumanEscalation || Boolean(llmRoute.needsHumanEscalation) || riskLevel === 'high' || riskLevel === 'imminent';

  return {
    persona,
    riskLevel,
    detectedSignals,
    immediateSafetyConcern,
    needsHumanEscalation,
    explanation: llmRoute.explanation || ruleRoute.explanation,
    source: 'hybrid',
  };
};

export const assessRiskCheckAnswers = (
  answers: Record<string, RiskCheckAnswerValue>
): RoutingResult => {
  let score = 0;
  const detectedSignals: string[] = [];
  let immediateSafetyConcern = false;

  Object.entries(answers).forEach(([questionId, value]) => {
    const config = RISK_CHECK_QUESTION_WEIGHTS[questionId];
    if (!config || value === 'no') return;

    score += value === 'yes' ? config.yes : config.sometimes;
    detectedSignals.push(config.signal);

    if (config.immediate) {
      immediateSafetyConcern = true;
    }
  });

  let riskLevel: RiskLevel = 'low';
  if (immediateSafetyConcern || score >= 20) {
    riskLevel = 'imminent';
  } else if (score >= 11) {
    riskLevel = 'high';
  } else if (score >= 5) {
    riskLevel = 'medium';
  }

  return {
    persona: 'victim_survivor',
    riskLevel,
    detectedSignals,
    immediateSafetyConcern,
    needsHumanEscalation: riskLevel === 'high' || riskLevel === 'imminent',
    explanation:
      detectedSignals.length > 0
        ? `Risk check detected ${detectedSignals.join(', ')}.`
        : 'Risk check detected no strong danger signals yet.',
    source: 'rules',
  };
};
