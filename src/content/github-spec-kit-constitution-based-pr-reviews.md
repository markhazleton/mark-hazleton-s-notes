---
id: 0
Section: Case Studies
slug: articles/github-spec-kit-constitution-based-pr-reviews.html
name: Extending GitHub Spec Kit for Constitution-Based Pull Request Reviews
description: Transform code reviews from tribal knowledge gatekeeping into systematic constitutional enforcement using AI-assisted reviews.
keywords: GitHub Spec Kit, constitutional PR reviews, code review automation, AI-assisted code review, specification-driven development, architectural principles
img_src: /img/MarkHazleton.jpg
lastmod: 2026-01-24
publishedDate: 2026-01-24
estimatedReadTime: 10
changefreq: weekly
subtitle: How a well-written constitution for your codebase can power automated code reviews that understand your project's architectural principles
author: Mark Hazleton
summary: Every mature codebase accumulates institutional knowledge that lives in scattered places. This article explores how to extend a SpecKit-based development workflow to perform AI-powered pull request reviews that validate changes against a project constitution—a living document capturing architectural principles, anti-patterns, and non-negotiable standards.
conclusionTitle: When to Use Constitutional PR Reviews
conclusionSummary: Constitutional PR reviews work best for mature codebases with established patterns, teams with high turnover or distributed contributors, and projects where consistency matters more than speed.
conclusionKeyHeading: The Real Value Proposition
conclusionKeyText: Making architectural rules explicit and using them to power automated reviews turns governance from an afterthought into a competitive advantage.
conclusionText: Your codebase has rules. Most are implicit, scattered, contradictory, or forgotten. A constitution formalizes that context and gives AI assistants the information they need to enforce your standards consistently.
seo:
  title: GitHub Spec Kit - Constitution-Based PR Reviews
  titleSuffix: ""
  description: Transform code reviews from tribal knowledge gatekeeping into systematic constitutional enforcement using AI-assisted reviews powered by project constitutions.
  keywords: GitHub Spec Kit, constitutional PR reviews, code review automation, AI-assisted code review, specification-driven development, architectural principles
  canonical: https://markhazleton.com/articles/github-spec-kit-constitution-based-pr-reviews.html
  robots: index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1
og:
  title: Extending GitHub Spec Kit for Constitution-Based PR Reviews
  description: Transform code reviews from tribal knowledge gatekeeping into systematic constitutional enforcement with AI-assisted reviews.
  type: article
  image: /img/MarkHazleton.jpg
  imageAlt: Mark Hazleton - Solutions Architect
twitter:
  title: Constitution-Based PR Reviews with Spec Kit
  description: Write your codebase's rules down. Then make your AI assistant enforce them.
  image: /img/MarkHazleton.jpg
  imageAlt: Mark Hazleton - Solutions Architect
youtubeUrl: null
youtubeTitle: null
---

## Executive Summary

Every mature codebase accumulates institutional knowledge that lives in scattered places: senior developers' heads, buried code comments, outdated wiki pages, or lost PR discussions. This article explores how I extended a SpecKit-based development workflow to perform AI-powered pull request reviews that validate changes against a project "constitution"—a living document capturing architectural principles, anti-patterns, and non-negotiable standards.

The result is code reviews that understand *why* certain patterns exist, not just *what* the code does. Constitutional references in review feedback transform subjective disagreements into objective governance, making code review conversations more productive and less adversarial.

If you've struggled with inconsistent code reviews, lost tribal knowledge, or onboarding new team members to your codebase's unwritten rules, this approach offers a path forward.

## The Problem: Code Reviews Without Context

Every codebase has rules. Most are implicit, scattered, contradictory, or forgotten. This knowledge traditionally lives in problematic places:

| Location | Problem |
|----------|---------|
| Senior developers' heads | Single point of failure |
| Scattered code comments | Nobody reads them |
| Wiki pages | Always outdated |
| PR review comments | Lost after merge |

The result? Reviewers re-discover the same issues repeatedly. Junior developers unknowingly break conventions. Everyone wastes time explaining context that should be obvious.

---

## The Solution: A Living Constitution

A GitHub Spec Kit constitution is a governing document for a repo that captures the **fundamental** rules your project must always follow. It encodes things like coding standards, testing requirements, security and privacy constraints, UX and accessibility expectations, and any architectural “musts” or “must nots.” The idea is that every spec, plan, and change generated with Spec Kit has to respect this constitution, so your system stays coherent over time instead of drifting with each new feature.

Because it acts as the project’s “source of truth” for intent, a good constitution is concrete and enforceable, not aspirational fluff. Rather than saying “we care about performance,” it might say “API p95 latency must stay under 300 ms for core operations” and “every new endpoint requires contract tests.” The clearer and more testable the rules are, the easier it is for both humans and AI to make consistent decisions without having to re-negotiate standards on every change.

In practice, you usually create the constitution early, then evolve it carefully as the system and organization mature. Many teams treat it as “slow to change but not frozen”: updates go through review, are versioned, and are communicated explicitly. That way, when you adjust something big—like adopting a new auth model, enforcing WCAG AA, or mandating feature flags for risky changes—you do it once in the constitution, and every subsequent spec generated by Spec Kit naturally follows the new rules.

The constitution includes:

- **Architectural Principles**: What patterns are required and why
- **Anti-Patterns**: What mistakes we've made before (with code examples)
- **Enforcement Mechanisms**: How violations are detected
- **Amendment Process**: How to change the rules (requires approval)

The difference between a constitution and documentation matters. A constitution is designed for machine parsing and automated enforcement.

---

## Connecting the Constitution to PR Reviews

If you're already using SpecKit for specification-driven development (the **/speckit.specify**, **speckit.plan**, **speckit.implement** workflows), you can extend that same agentic approach for code reviews.

### The Architecture

The implementation of a SpecKit PR Review has three layers:

```
+-------------------------------------+
|  /speckit.pr-review 99999           |  <- GitHub Copilot prompt file
+-------------------------------------+
|  pr-review.ps1                      |  <- PowerShell script (Azure DevOps API)
+-------------------------------------+
|  constitution.md                    |  <- Source of truth for review criteria
+-------------------------------------+
```

**Layer 1: The Prompt** (***speckit.pr-review.prompt.md***)

This structured prompt transforms your AI assistant from a generic code reviewer into a *constitutional lawyer* for your codebase:

```markdown
## Goal
Perform a comprehensive code review of an Azure DevOps pull request,
validating all changes against the project constitution
(`.specify/memory/constitution.md`) and coding standards.

### 1. Load Constitutional Framework
Read the project constitution and extract:
- Architectural Principles
- Development Workflow Standards
- Quality & Consistency Standards
- Anti-Patterns to Detect (Appendix A)
```

**Layer 2: The API Integration** (***pr-review.ps1***)

A PowerShell script fetches PR metadata from Azure DevOps:

```powershell
function Get-PullRequestMetadata {
    param(
        [string]$PrId,
        [hashtable]$Headers
    )

    $endpoint = "git/pullRequests/$PrId"
    return Invoke-AzureDevOpsApi -Endpoint $endpoint -Headers $Headers
}
```

The script authenticates via Azure CLI, fetches PR details, retrieves changed files, and classifies files by code area. That classification triggers different constitutional principles:

```powershell
function Classify-FileByArea {
    param([string]$FilePath)

    switch -Regex ($FilePath) {
        'app/api/routes/' { return 'API Routes' }        # -> Principle VI (Security)
        'app/core/azure/' { return 'Azure Integration' } # -> Principle IV
        'app/tests/' { return 'Tests' }                  # -> Testing Requirements
        'specs/' { return 'Specifications' }             # -> Spec Workflow
    }
}
```

**Layer 3: The Constitution**

The living document organized for machine parsing:

1. Principles with clear MUST/SHOULD/PROHIBITED language
2. Implementation patterns with code examples
3. Anti-patterns in appendices with explicit wrong/correct comparisons
4. Enforcement mechanisms that map to reviewable checks

---

## The Review Framework

When the AI processes a PR, it applies a multi-dimensional review framework.

### Constitutional Compliance Matrix

| Principle | What It Checks |
|-----------|----------------|
| I. Template-Driven | Logic externalized to JSON? No hardcoded workflows? |
| II. Schema Stability | No new top-level fields?  |
| III. API Versioning | Breaking changes in new version? Deprecation warnings? |
| IV. Azure-First | Sync Cosmos calls without await? Proper parameters? |
| V. Fire-and-Forget | Try/except/finally pattern? Single log entry? |
| VI. API Security | ***Depends(check_api_key)***? Type normalization? |

### File-Specific Checks

For a route file, the review verifies:

- ***Depends(check_api_key)*** used (not Header-only)
- Type normalization before Pydantic instantiation
- Module aliasing when parameter shadows import
- Proper HTTP status codes (401 for auth, not 422)

### Severity Classification

Issues are classified using constitutional language:

- **CRITICAL**: Violates MUST requirement (blocks merge)
- **HIGH**: Violates SHOULD requirement (should fix before merge)
- **MEDIUM**: Style inconsistency (consider addressing)
- **LOW**: Suggestion for improvement (optional)


## Why This Approach Works

### 1. Consistency Without Memorization

Human reviewers forget edge cases. They have good days and bad days. They might catch an anti-pattern on Monday but miss it on Friday. The constitution-based review applies the same standards every time.

### 2. Knowledge Transfer at Scale

New team members don't need to absorb months of tribal knowledge. They see constitutional violations in their first PR, with explanations and references. The review process *teaches* the architecture.

### 3. Reduced Review Friction

Instead of "I don't like this pattern," the feedback becomes "This violates Principle VI." It's not personal—it's constitutional. This makes code review conversations more productive and less adversarial.

### 4. Governance Documentation That Gets Read

Most architecture documents rot on the vine. Nobody reads them because they're disconnected from daily work. A constitution that powers PR reviews gets read *every time* a PR is submitted. Developers encounter the principles when they matter most.

---

## Implementation Tips

If you want to implement something similar:

### 1. Start with your actual pain points

Your constitution should evolve from real bugs. The schema stability principle exists because someone added a top-level field and broke the analytics pipeline. The API security pattern exists because endpoints were returning 422 instead of 401. Document what you've learned the hard way.

### 2. Use normative language

Not "we generally prefer"—use MUST, SHOULD, PROHIBITED. Make violations objectively detectable.

### 3. Include code examples for anti-patterns

Abstract principles are hard to review against. Concrete examples make detection trivial:

```python
# WRONG
document = await get_document(...)

# CORRECT
document = get_document(...)
```

### 4. Organize for machine parsing

Section headers, consistent formatting, categorized appendices. The AI needs to extract patterns—make that easy.

### 5. Keep it living

Your constitution should have a version history. Changes require documented approval. It evolves with the codebase.

---

## Conclusion

This approach exemplifies a shift in how I think about AI coding assistants. The best results don't come from asking an AI to "review my code"—they come from giving it *context* about what matters.

A constitution is that context, formalized.

Making architectural rules explicit and using them to power automated reviews turns governance from an afterthought into a competitive advantage. Your codebase has rules. Write them down. Then make your AI assistant enforce them.

This approach works with any AI that can process structured prompts and read files—GitHub Copilot, Claude, GPT-4, or others. The key insight is treating your architectural principles as a reviewable specification, not just documentation.

## Key Takeaways

- A "constitution" formalizes your codebase's unwritten rules using normative language (MUST, SHOULD, PROHIBITED)
- AI-powered PR reviews can validate changes against constitutional principles, not just syntax
- Constitutional references transform subjective code review feedback into objective governance
- The constitution becomes living documentation because it's encountered during every PR review
- Start with real pain points—document what you've learned the hard way

## References

- GitHub Copilot: https://github.com/features/copilot
- SpecKit Repository: https://github.com/Villamor-bot/specify
- RFC 2119 (Key words for RFCs): https://www.rfc-editor.org/rfc/rfc2119
