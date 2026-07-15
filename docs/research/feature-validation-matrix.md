# Feature Validation Matrix

Use this matrix to decide what to keep, redesign, hide, or remove.

## Scoring

Score each feature from 1-5:

- User motivation strength
- First-screen urgency
- Practical output
- Differentiation
- Safety/privacy fit
- Build effort
- Risk if wrong

High value features have:

- strong motivation
- clear output
- strong safety fit
- low confusion

## Matrix

| Feature | User Motivation | Output | Current Status | Risk | Decision To Validate |
|---|---|---|---|---|---|
| Tonight Safety | High | Immediate checklist | Not built | Medium | Likely core |
| Leave Preparation | High | Leaving checklist | Partly in Safety Plan | Medium | Likely core |
| Phone Monitoring Check | High | Digital safety checklist | Partly in Safety Plan | High | Likely core |
| Safe Word / Help Message | Medium-high | Safe message script | Not built | Medium | Test |
| Evidence Timeline | Medium | Structured record | Notes only | High | Test carefully |
| Find Human Help | High | Official services | Built in Resources | Medium | Keep, simplify |
| Risk Check | Medium | Risk explanation + next step | Built | Medium | Redesign as pattern check |
| AI Chat | Medium | Conversation | Built | High | Keep secondary |
| Safety Plan | High | AI-generated plan | Built | Medium | Redesign into scenario plans |
| Resources Search | Medium | Services and links | Built | Medium-high | Keep but official-first |
| Quick Exit | High | Immediate escape | Built | Low | Keep |
| Disguise Mode | High | Weather disguise | Built | Medium | Keep, fix rough edges |
| Voice Mode | Unknown | Voice support | Placeholder | High | Hide until real |
| AI Test | Low for users | Debug info | Built | Low | Hide from nav |

## Initial Product Recommendation

The next MVP should prioritize:

1. Tonight Safety
2. Leave Preparation
3. Phone Monitoring Check
4. Find Human Help
5. Quick Exit + Disguise Mode

Keep AI Chat as a support layer, not the main product.

## Decision Rules

### Keep

Feature has a clear user situation, clear output, and low safety risk.

### Redesign

Feature is useful but currently framed too generally.

### Hide

Feature is technical, unfinished, or not meant for users.

### Remove

Feature does not solve a strong motivation or creates unnecessary risk.
