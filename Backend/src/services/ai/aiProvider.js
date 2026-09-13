import { buildCoachContext, answerWithRules } from "./ruleBasedCoach.js";

// Single entry point the rest of the app calls. Today this always uses the
// rule-based engine. To integrate an LLM later, branch here based on an env
// flag (e.g. AI_PROVIDER=anthropic) and call the provider with the same
// `context` object, keeping the rest of the application unchanged.
export const getCoachResponse = async ({ userId, profile, question }) => {
  const context = await buildCoachContext(userId, profile);
  const answer = answerWithRules(question, context);
  return { answer, context };
};
