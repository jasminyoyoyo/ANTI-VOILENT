import { GoogleGenAI } from '@google/genai';
import { GroundingSource, UserLocation } from '../types';
import {
  buildGeminiResourcePrompt,
  buildMimoResourceSystemPrompt,
  buildMimoResourceUserPrompt,
  buildSafetyPlanUserPrompt,
  chatSystemPrompt,
  safetyPlanSystemPrompt,
} from './prompts';

const MIMO_BASE_URL = 'https://api.xiaomimimo.com/v1/chat/completions';
const MIMO_MODEL = 'mimo-v2-flash';
const GEMINI_MODEL = 'gemini-2.5-flash';

type ChatMessageInput = {
  role: string;
  parts: { text: string }[];
};

type MimoMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type AiProvider = 'gemini' | 'mimo';

export type AiConnectionResult = {
  configured: boolean;
  provider: AiProvider;
  ok: boolean;
  status: number | null;
  message: string;
};

type CuratedResource = GroundingSource & {
  description: string;
  tags: string[];
  state?: string;
};

const AU_RESOURCE_DIRECTORY: CuratedResource[] = [
  {
    title: '1800RESPECT',
    uri: 'https://www.1800respect.org.au/',
    latitude: -35.2809,
    longitude: 149.13,
    type: 'other',
    description: 'National 24/7 domestic, family and sexual violence counselling, information, and referral support.',
    phone: '1800737732',
    whyThisHelps: 'A strong first contact if someone needs confidential guidance, emotional support, or referrals without knowing where to start.',
    tags: ['national', 'hotline', 'counselling', 'friend', 'crisis', 'support', 'family violence'],
    state: 'National',
  },
  {
    title: 'Safe Steps Family Violence Response Centre',
    uri: 'https://www.safesteps.org.au/',
    latitude: -37.8136,
    longitude: 144.9631,
    type: 'shelter',
    description: 'Victoria-wide crisis response, refuge coordination, safety planning, and family violence support.',
    phone: '1800015188',
    whyThisHelps: 'Useful for urgent safety planning and help finding refuge or crisis accommodation in Victoria.',
    tags: ['victoria', 'melbourne', 'shelter', 'accommodation', 'crisis', 'support'],
    state: 'VIC',
  },
  {
    title: 'Domestic Violence Line NSW',
    uri: 'https://www.facs.nsw.gov.au/domestic-violence/services-and-support',
    latitude: -33.8688,
    longitude: 151.2093,
    type: 'other',
    description: 'NSW domestic violence line for crisis counselling, safety planning, and referrals to local services.',
    phone: '1800656463',
    whyThisHelps: 'Useful for NSW-based crisis counselling, local referrals, and practical support planning.',
    tags: ['nsw', 'sydney', 'hotline', 'crisis', 'support', 'referral'],
    state: 'NSW',
  },
  {
    title: 'DVConnect Womensline',
    uri: 'https://www.dvconnect.org/womensline/',
    latitude: -27.4698,
    longitude: 153.0251,
    type: 'shelter',
    description: 'Queensland crisis support, safe accommodation coordination, and family violence referrals.',
    phone: '1800811811',
    whyThisHelps: 'A good option for Queensland crisis support and fast connection to accommodation pathways.',
    tags: ['queensland', 'brisbane', 'shelter', 'accommodation', 'crisis', 'support'],
    state: 'QLD',
  },
  {
    title: 'Legal Aid NSW Domestic Violence Unit',
    uri: 'https://www.legalaid.nsw.gov.au/',
    latitude: -33.8795,
    longitude: 151.2069,
    type: 'legal',
    description: 'Legal information and referrals for protection orders, family violence matters, and court support in NSW.',
    whyThisHelps: 'Helpful for understanding legal options, protection orders, and court-related next steps in NSW.',
    tags: ['legal', 'nsw', 'sydney', 'protection order', 'family law', 'court'],
    state: 'NSW',
  },
  {
    title: 'Women’s Legal Service Victoria',
    uri: 'https://www.womenslegal.org.au/',
    latitude: -37.814,
    longitude: 144.9633,
    type: 'legal',
    description: 'Family violence legal advice, migration-related support, and legal information for women in Victoria.',
    tags: ['legal', 'victoria', 'melbourne', 'migration', 'family law', 'women'],
    state: 'VIC',
  },
  {
    title: 'Relationships Australia',
    uri: 'https://www.relationships.org.au/',
    latitude: -35.2809,
    longitude: 149.13,
    type: 'other',
    description: 'Counselling, family support, and relationship services with locations across Australia.',
    whyThisHelps: 'Useful when someone needs ongoing counselling, emotional support, or family-focused services.',
    tags: ['national', 'counselling', 'mental health', 'family support', 'recovery'],
    state: 'National',
  },
  {
    title: 'Full Stop Australia',
    uri: 'https://fullstop.org.au/',
    latitude: -33.8731,
    longitude: 151.206,
    type: 'other',
    description: 'Trauma specialist support for sexual, domestic and family violence, including counselling and advice.',
    whyThisHelps: 'Useful for trauma-informed counselling and specialist support after violence or abuse.',
    tags: ['nsw', 'national', 'counselling', 'trauma', 'support', 'sexual violence'],
    state: 'NSW',
  },
  {
    title: 'inTouch Multicultural Centre Against Family Violence',
    uri: 'https://intouch.org.au/',
    latitude: -37.8136,
    longitude: 144.9631,
    type: 'other',
    description: 'Specialist support for migrant and multicultural women experiencing family violence.',
    whyThisHelps: 'A strong option when language, culture, migration, or settlement issues affect safety and support access.',
    tags: ['migrant', 'multicultural', 'victoria', 'melbourne', 'community', 'cultural support'],
    state: 'VIC',
  },
  {
    title: 'eSafety Commissioner',
    uri: 'https://www.esafety.gov.au/key-topics/domestic-family-violence',
    latitude: -35.2809,
    longitude: 149.13,
    type: 'other',
    description: 'Australian government guidance on technology-facilitated abuse, online safety, and image-based abuse.',
    whyThisHelps: 'Best when the concern involves stalking, spyware, online harassment, account access, or location tracking.',
    tags: ['digital safety', 'technology', 'stalking', 'monitoring', 'national', 'online safety'],
    state: 'National',
  },
  {
    title: 'Link2Home NSW',
    uri: 'https://www.facs.nsw.gov.au/housing/help/ways/are-you-homeless',
    latitude: -33.8688,
    longitude: 151.2093,
    type: 'shelter',
    description: 'NSW homelessness and crisis accommodation support, including referrals for urgent housing needs.',
    phone: '1800152152',
    whyThisHelps: 'Useful when someone needs urgent housing support or accommodation referrals in NSW.',
    tags: ['nsw', 'sydney', 'homelessness', 'accommodation', 'housing', 'crisis'],
    state: 'NSW',
  },
  {
    title: '1800ELDERHelp',
    uri: 'https://www.opan.org.au/1800elderhelp/',
    latitude: -35.2809,
    longitude: 149.13,
    type: 'other',
    description: 'National line for elder abuse information, advocacy, and support pathways.',
    phone: '1800353374',
    whyThisHelps: 'Useful when abuse affects an older person and advocacy or specialist elder support is needed.',
    tags: ['elder abuse', 'national', 'advocacy', 'support', 'older person'],
    state: 'National',
  },
];

const getProvider = (): AiProvider => {
  const configured = import.meta.env.VITE_AI_PROVIDER?.trim().toLowerCase();
  if (configured === 'mimo') return 'mimo';
  return 'gemini';
};

const getGeminiKey = () => import.meta.env.VITE_GEMINI_API_KEY?.trim() || '';
const getMimoKey = () => import.meta.env.VITE_MIMO_API_KEY?.trim() || '';

const buildNoKeyMessage = (provider: AiProvider) =>
  [
    "Beacon's AI features are not configured yet.",
    '',
    provider === 'mimo'
      ? 'To enable Xiaomi MiMo support, add `VITE_MIMO_API_KEY` to your `.env.local` file and restart the app.'
      : 'To enable Gemini support, add `VITE_GEMINI_API_KEY` to your `.env.local` file and restart the app.',
    '',
    'If you are in immediate danger in Australia, call **000**.',
  ].join('\n');

const createGeminiClient = () => {
  const apiKey = getGeminiKey();
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const runAiText = async (params: {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxCompletionTokens?: number;
}) => {
  const provider = getProvider();

  if (provider === 'mimo') {
    const data = await postMimoChatCompletion(
      [
        { role: 'system', content: params.systemPrompt },
        { role: 'user', content: params.userPrompt },
      ],
      {
        model: MIMO_MODEL,
        temperature: params.temperature ?? 0.4,
        maxCompletionTokens: params.maxCompletionTokens ?? 900,
      }
    );

    return extractMimoAssistantText(data);
  }

  const ai = createGeminiClient();
  if (!ai) {
    return '';
  }

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: params.userPrompt,
    config: {
      systemInstruction: params.systemPrompt,
    },
  });

  return response.text || '';
};

const postMimoChatCompletion = async (
  messages: MimoMessage[],
  options?: {
    model?: string;
    temperature?: number;
    maxCompletionTokens?: number;
  }
) => {
  const apiKey = getMimoKey();
  if (!apiKey) {
    return null;
  }

  const response = await fetch(MIMO_BASE_URL, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: options?.model ?? MIMO_MODEL,
      messages,
      stream: false,
      temperature: options?.temperature ?? 0.7,
      max_completion_tokens: options?.maxCompletionTokens ?? 1024,
      thinking: { type: 'disabled' },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`MiMo API error ${response.status}: ${text}`);
  }

  return response.json();
};

const extractMimoAssistantText = (data: any) => data?.choices?.[0]?.message?.content?.trim() || '';

const parseJsonBlock = (text: string) => {
  const match = text.match(/```json\s*([\s\S]*?)\s*```/i);
  if (!match) return null;

  try {
    return JSON.parse(match[1]);
  } catch (error) {
    console.error('Failed to parse MiMo JSON block', error);
    return null;
  }
};

const stripJsonBlock = (text: string) => text.replace(/```json[\s\S]*?```/i, '').trim();

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

const getDistanceKm = (a: UserLocation, b: { latitude: number; longitude: number }) => {
  const earthRadiusKm = 6371;
  const dLat = toRadians(b.latitude - a.latitude);
  const dLng = toRadians(b.longitude - a.longitude);
  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);

  const haversine =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
};

const selectCuratedResources = (location: UserLocation | null, query: string): CuratedResource[] => {
  const normalizedQuery = query.toLowerCase();

  const scored = AU_RESOURCE_DIRECTORY.map((resource) => {
    let score = 0;

    resource.tags.forEach((tag) => {
      if (normalizedQuery.includes(tag)) {
        score += 4;
      }
    });

    if (normalizedQuery.includes('friend') && resource.tags.includes('friend')) score += 3;
    if (normalizedQuery.includes('legal') && resource.type === 'legal') score += 4;
    if (
      (normalizedQuery.includes('shelter') ||
        normalizedQuery.includes('accommodation') ||
        normalizedQuery.includes('housing') ||
        normalizedQuery.includes('refuge')) &&
      resource.type === 'shelter'
    ) {
      score += 4;
    }
    if (
      (normalizedQuery.includes('counselling') ||
        normalizedQuery.includes('therapy') ||
        normalizedQuery.includes('mental health') ||
        normalizedQuery.includes('recovery')) &&
      resource.description.toLowerCase().includes('counselling')
    ) {
      score += 3;
    }
    if (
      (normalizedQuery.includes('digital') ||
        normalizedQuery.includes('technology') ||
        normalizedQuery.includes('online') ||
        normalizedQuery.includes('monitor')) &&
      resource.tags.includes('digital safety')
    ) {
      score += 5;
    }
    if (
      (normalizedQuery.includes('migrant') ||
        normalizedQuery.includes('multicultural') ||
        normalizedQuery.includes('international student') ||
        normalizedQuery.includes('cultural')) &&
      resource.tags.some((tag) => ['migrant', 'multicultural', 'cultural support'].includes(tag))
    ) {
      score += 5;
    }
    if (
      normalizedQuery.includes('police') ||
      normalizedQuery.includes('danger') ||
      normalizedQuery.includes('urgent') ||
      normalizedQuery.includes('emergency')
    ) {
      if (resource.title.includes('1800RESPECT') || resource.title.includes('Domestic Violence Line') || resource.title.includes('DVConnect')) {
        score += 3;
      }
    }

    if (resource.state && normalizedQuery.includes(resource.state.toLowerCase())) {
      score += 3;
    }

    if (location && resource.latitude && resource.longitude) {
      const distance = getDistanceKm(location, { latitude: resource.latitude, longitude: resource.longitude });
      score += Math.max(0, 4 - distance / 300);
    }

    if (score === 0 && resource.title === '1800RESPECT') {
      score = 1;
    }

    return { resource, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .filter((item, index) => item.score > 0 || index < 3)
    .slice(0, 5)
    .map((item) => item.resource);
};

export const isAiConfigured = () => {
  const provider = getProvider();
  return provider === 'mimo' ? Boolean(getMimoKey()) : Boolean(getGeminiKey());
};

export const getActiveAiProvider = () => getProvider();

export const testAiConnection = async (): Promise<AiConnectionResult> => {
  const provider = getProvider();

  if (!isAiConfigured()) {
    return {
      configured: false,
      provider,
      ok: false,
      status: null,
      message:
        provider === 'mimo'
          ? 'No Xiaomi MiMo API key found in .env.local.'
          : 'No Gemini API key found in .env.local.',
    };
  }

  try {
    if (provider === 'mimo') {
      const data = await postMimoChatCompletion(
        [
          { role: 'system', content: 'You are a concise assistant.' },
          { role: 'user', content: 'Say hello in one short sentence.' },
        ],
        {
          model: MIMO_MODEL,
          temperature: 0.2,
          maxCompletionTokens: 80,
        }
      );

      return {
        configured: true,
        provider,
        ok: true,
        status: 200,
        message: extractMimoAssistantText(data) || 'MiMo connection successful.',
      };
    }

    const ai = createGeminiClient();
    if (!ai) {
      return {
        configured: false,
        provider,
        ok: false,
        status: null,
        message: 'No Gemini API key found in .env.local.',
      };
    }

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: 'Say hello in one short sentence.',
    });

    return {
      configured: true,
      provider,
      ok: true,
      status: 200,
      message: response.text || 'Gemini connection successful.',
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown AI connection error.';
    const statusMatch = message.match(/\b(\d{3})\b/);
    return {
      configured: true,
      provider,
      ok: false,
      status: statusMatch ? Number(statusMatch[1]) : null,
      message,
    };
  }
};

export const sendSupportMessage = async (history: ChatMessageInput[], message: string) => {
  const provider = getProvider();
  if (!isAiConfigured()) {
    return buildNoKeyMessage(provider);
  }

  if (provider === 'mimo') {
    const messages: MimoMessage[] = [
      { role: 'system', content: chatSystemPrompt },
      ...history.map((item) => ({
        role: item.role === 'model' ? 'assistant' : 'user',
        content: item.parts[0]?.text ?? '',
      })) as MimoMessage[],
      { role: 'user', content: message },
    ];

    const data = await postMimoChatCompletion(messages, {
      model: MIMO_MODEL,
      temperature: 0.6,
      maxCompletionTokens: 800,
    });

    return extractMimoAssistantText(data) || "I'm listening. Please tell me more.";
  }

  const ai = createGeminiClient();
  if (!ai) {
    return buildNoKeyMessage('gemini');
  }

  const contents = [
    ...history.map((item) => ({
      role: item.role,
      parts: [{ text: item.parts[0]?.text ?? '' }],
    })),
    { role: 'user', parts: [{ text: message }] },
  ];

  const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      config: {
        systemInstruction: chatSystemPrompt,
      },
    contents,
  });

  return response.text || "I'm listening. Please tell me more.";
};

export const findNearbyResources = async (
  location: UserLocation | null,
  query: string
): Promise<{ text: string; sources: GroundingSource[] }> => {
  const provider = getProvider();
  if (!isAiConfigured()) {
    return {
      text: [
        `Beacon can show live AI-curated resource suggestions once a ${provider === 'mimo' ? 'Xiaomi MiMo' : 'Gemini'} API key is configured.`,
        '',
        'For now, consider these trusted Australian starting points:',
        '- **1800RESPECT** for national domestic, family and sexual violence support',
        '- **Police or hospital emergency departments** if there is immediate danger',
        '- **Community legal centres** for protection orders, tenancy and family violence legal help',
        '',
        'If you are in immediate danger, call **000**.',
      ].join('\n'),
      sources: [],
    };
  }

  if (provider === 'mimo') {
    const curatedResources = selectCuratedResources(location, query);
    const directoryContext = curatedResources
      .map(
        (resource, index) =>
          `${index + 1}. ${resource.title} (${resource.type ?? 'other'}) - ${resource.description} - URL: ${resource.uri}`
      )
      .join('\n');

    const data = await postMimoChatCompletion(
      [
        { role: 'system', content: buildMimoResourceSystemPrompt() },
        { role: 'user', content: buildMimoResourceUserPrompt({ location, query, directoryContext }) },
      ],
      {
        model: MIMO_MODEL,
        temperature: 0.4,
        maxCompletionTokens: 900,
      }
    );

    const responseText = extractMimoAssistantText(data) || 'Could not fetch resources.';
    const parsed = parseJsonBlock(responseText);
    const selectedTitles = Array.isArray(parsed?.selectedTitles) ? parsed.selectedTitles.map((title: string) => title.toLowerCase()) : [];
    const matchedResources =
      selectedTitles.length > 0
        ? curatedResources.filter((resource) => selectedTitles.includes(resource.title.toLowerCase()))
        : curatedResources;

    return {
      text: stripJsonBlock(responseText) || 'Could not fetch resources.',
      sources: matchedResources.map((resource) => ({
        title: resource.title.replace('鈥�', "'"),
        uri: resource.uri,
        description: resource.description,
        phone: resource.phone,
        whyThisHelps: resource.whyThisHelps,
        latitude: resource.latitude,
        longitude: resource.longitude,
        type: resource.type,
      })),
    };
  }

  const ai = createGeminiClient();
  if (!ai) {
    return { text: 'Could not fetch resources.', sources: [] };
  }

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: buildGeminiResourcePrompt({ location, query }),
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text || '';
  const sources: GroundingSource[] = [];

  const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
  if (jsonMatch) {
    try {
      const coords = JSON.parse(jsonMatch[1]);
      coords.forEach((c: any) => {
        sources.push({
          title: c.title,
          uri: `https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`,
          latitude: c.lat,
          longitude: c.lng,
          type: c.type,
        });
      });
    } catch (e) {
      console.error('Failed to parse coordinates JSON', e);
    }
  }

  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (chunks) {
    chunks.forEach((chunk: any) => {
      if (chunk.web && !sources.some((s) => s.uri === chunk.web.uri)) {
        sources.push({ title: chunk.web.title, uri: chunk.web.uri });
      }
    });
  }

  return { text: text.replace(/```json[\s\S]*?```/, ''), sources };
};

export const generateSafetyPlan = async (inputs: Record<string, string>) => {
  const provider = getProvider();
  if (!isAiConfigured()) {
    return [
      '# Safety Plan Starter',
      '',
      `- **Current situation:** ${inputs.livingSituation || 'Not provided'}`,
      `- **Children involved:** ${inputs.children || 'Not provided'}`,
      `- **Transport options:** ${inputs.transport || 'Not provided'}`,
      `- **Support network:** ${inputs.support || 'Not provided'}`,
      '',
      '## Immediate steps',
      '- Call **000** if you are in immediate danger.',
      '- Keep a charged phone with you if possible.',
      '- Identify one trusted person you can contact quickly.',
      '- Prepare a small emergency bag with ID, medication, bank cards, keys, and essential documents.',
      '',
      '## Digital safety',
      '- Clear browsing history if it is safe to do so.',
      '- Change important passwords on a safer device if possible.',
      '- Turn off location sharing if someone is monitoring you.',
      '',
      '## Next support options',
      '- Contact **1800RESPECT** or a local domestic violence service.',
      '- Reach out to a community legal centre for protection order or family violence advice.',
      '',
      `Add a ${provider === 'mimo' ? 'Xiaomi MiMo' : 'Gemini'} API key to enable a more personalised AI-generated plan.`,
    ].join('\n');
  }

  if (provider === 'mimo') {
    const data = await postMimoChatCompletion(
      [
        { role: 'system', content: safetyPlanSystemPrompt },
        { role: 'user', content: buildSafetyPlanUserPrompt(inputs) },
      ],
      {
        model: MIMO_MODEL,
        temperature: 0.5,
        maxCompletionTokens: 1200,
      }
    );

    return extractMimoAssistantText(data);
  }

  const ai = createGeminiClient();
  if (!ai) {
    return 'Could not generate a plan.';
  }

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: buildSafetyPlanUserPrompt(inputs),
    config: {
      systemInstruction: safetyPlanSystemPrompt,
    },
  });

  return response.text || 'Could not generate a plan.';
};
