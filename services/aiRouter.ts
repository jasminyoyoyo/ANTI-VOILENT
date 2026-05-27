import { SupportResponse } from '../types';
import {
  buildClassificationUserPrompt,
  buildResponseSystemPrompt,
  classificationRouterPrompt,
  crisisModeMessage,
} from './prompts';
import { getActiveAiProvider, isAiConfigured, runAiText } from './geminiService';
import { mergeRouting, ruleBasedRoute } from './riskEngine';

const parseJsonBlock = (text: string) => {
  const match = text.match(/```json\s*([\s\S]*?)\s*```/i) || text.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    return JSON.parse(match[1] ?? match[0]);
  } catch {
    return null;
  }
};

const stripJsonBlock = (text: string) => text.replace(/```json[\s\S]*?```/i, '').trim();

const buildConversationText = (history: { role: string; parts: { text: string }[] }[], latestMessage: string) =>
  [
    ...history.map((item) => `${item.role === 'model' ? 'Assistant' : 'User'}: ${item.parts[0]?.text ?? ''}`),
    `User: ${latestMessage}`,
  ].join('\n');

const classifyWithLlm = async (conversationText: string) => {
  if (!isAiConfigured()) return null;

  try {
    const text = await runAiText({
      systemPrompt: classificationRouterPrompt,
      userPrompt: buildClassificationUserPrompt(conversationText),
      temperature: 0.1,
      maxCompletionTokens: 350,
    });

    return parseJsonBlock(text);
  } catch (error) {
    console.error('LLM classification failed', error);
    return null;
  }
};

export const sendRoutedSupportMessage = async (
  history: { role: string; parts: { text: string }[] }[],
  latestMessage: string
): Promise<SupportResponse> => {
  const conversationText = buildConversationText(history, latestMessage);
  const ruleRoute = ruleBasedRoute(
    history.map((item) => item.parts[0]?.text ?? '').join('\n'),
    latestMessage
  );
  const llmRoute = await classifyWithLlm(conversationText);
  const routing = mergeRouting(ruleRoute, llmRoute);

  if (!isAiConfigured()) {
    return {
      routing,
      text:
        routing.riskLevel === 'high' || routing.riskLevel === 'imminent'
          ? `${crisisModeMessage}\n\nIf you are in Australia and in immediate danger, call **000**.\n\nYou can also contact **1800RESPECT** on **1800 737 732**.`
          : "Beacon's AI features are not configured yet. If you are in Australia and in immediate danger, call **000**.",
    };
  }

  if (routing.riskLevel === 'imminent') {
    return {
      routing,
      text: [
        crisisModeMessage,
        '',
        'If you can, focus on immediate safety first.',
        '- If the person causing harm is nearby and you are in danger, call **000** now.',
        '- If it is safer, move toward a more secure place or a trusted person.',
        '- Contact **1800RESPECT** on **1800 737 732** for specialist support.',
        '',
        'You do not need to explain everything right now. Safety comes first.',
      ].join('\n'),
    };
  }

  const responseText = await runAiText({
    systemPrompt: buildResponseSystemPrompt(routing.persona, routing.riskLevel),
    userPrompt: conversationText,
    temperature: routing.riskLevel === 'high' ? 0.2 : 0.5,
    maxCompletionTokens: routing.riskLevel === 'high' ? 350 : 700,
  });

  const finalText =
    routing.riskLevel === 'high'
      ? `${stripJsonBlock(responseText)}\n\nA trained support worker may help more than AI right now. In Australia, you can contact **1800RESPECT** on **1800 737 732**. If there is immediate danger, call **000**.`
      : stripJsonBlock(responseText);

  return {
    routing,
    text: finalText,
  };
};

export const getCurrentAiProviderLabel = () => getActiveAiProvider();
