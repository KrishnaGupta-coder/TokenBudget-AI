/**
 * TokenBudget AI — Real-Time Multi-Model LLM Tokenizer, Cost Matrix & Prompt Compressor
 * Author: Krishna Gupta (https://github.com/KrishnaGupta-coder)
 */

(function () {
  'use strict';

  // Model Catalog & Verified Live Pricing Rates (per 1,000,000 tokens — Late 2026)
  const MODEL_CATALOG = {
    // 🌟 Google Gemini 4 & 3.x
    'gemini-4-hydrogen': {
      name: 'Gemini 4 Hydrogen',
      shortName: 'Gemini 4 Hydrogen',
      inputRate: 1.50,
      cachedInputRate: 0.075,
      outputRate: 7.50,
      contextLimit: 1048576,
      badge: 'Speed/Reason',
      category: 'google',
      isThinking: true
    },
    'gemini-4-carbon': {
      name: 'Gemini 4 Carbon',
      shortName: 'Gemini 4 Carbon',
      inputRate: 3.00,
      cachedInputRate: 0.15,
      outputRate: 15.00,
      contextLimit: 2097152,
      badge: 'Flagship Reason',
      category: 'google',
      isThinking: true
    },
    'gemini-4-neon': {
      name: 'Gemini 4 Neon',
      shortName: 'Gemini 4 Neon',
      inputRate: 3.00,
      cachedInputRate: 0.15,
      outputRate: 15.00,
      contextLimit: 2097152,
      badge: 'High Reasoning',
      category: 'google',
      isThinking: true
    },
    'gemini-3-8-flash': {
      name: 'Gemini 3.8 Flash',
      shortName: 'Gemini 3.8 Flash',
      inputRate: 0.75,
      cachedInputRate: 0.075,
      outputRate: 3.75,
      contextLimit: 1048576,
      badge: 'Agentic Speed',
      category: 'google',
      isThinking: false
    },
    'gemini-3-5-flash-lite': {
      name: 'Gemini 3.5 Flash-Lite',
      shortName: 'Gemini 3.5 Lite',
      inputRate: 0.25,
      cachedInputRate: 0.025,
      outputRate: 1.50,
      contextLimit: 1048576,
      badge: 'Flash-Lite',
      category: 'google',
      isThinking: false
    },

    // 🧠 Anthropic Claude 5.x & 4.6
    'claude-sonnet-5-5': {
      name: 'Claude Sonnet 5.5',
      shortName: 'Claude Sonnet 5.5',
      inputRate: 2.00,
      cachedInputRate: 0.10,
      outputRate: 10.00,
      contextLimit: 200000,
      badge: 'Coding SOTA',
      category: 'anthropic',
      isThinking: true
    },
    'claude-opus-5-5': {
      name: 'Claude Opus 5.5',
      shortName: 'Claude Opus 5.5',
      inputRate: 4.00,
      cachedInputRate: 0.20,
      outputRate: 20.00,
      contextLimit: 200000,
      badge: 'Agentic SOTA',
      category: 'anthropic',
      isThinking: true
    },
    'claude-haiku-5-5': {
      name: 'Claude Haiku 5.5',
      shortName: 'Claude Haiku 5.5',
      inputRate: 0.10,
      cachedInputRate: 0.01,
      outputRate: 0.50,
      contextLimit: 200000,
      badge: 'Ultra Fast',
      category: 'anthropic',
      isThinking: false
    },
    'claude-fable-5-2': {
      name: 'Claude Fable 5.2',
      shortName: 'Claude Fable 5.2',
      inputRate: 8.00,
      cachedInputRate: 0.20,
      outputRate: 40.00,
      contextLimit: 200000,
      badge: 'Deep Reason',
      category: 'anthropic',
      isThinking: true
    },
    'claude-sonnet-4-6': {
      name: 'Claude Sonnet 4.6',
      shortName: 'Claude Sonnet 4.6',
      inputRate: 3.00,
      cachedInputRate: 0.30,
      outputRate: 15.00,
      contextLimit: 200000,
      badge: 'Thinking',
      category: 'anthropic',
      isThinking: true
    },
    'claude-opus-4-6': {
      name: 'Claude Opus 4.6',
      shortName: 'Claude Opus 4.6',
      inputRate: 5.00,
      cachedInputRate: 0.50,
      outputRate: 25.00,
      contextLimit: 200000,
      badge: 'Frontier Think',
      category: 'anthropic',
      isThinking: true
    },

    // ⚡ OpenAI GPT-6, GPT-5, o-Series & GPT-OSS
    'gpt-6-2-astra': {
      name: 'OpenAI GPT-6.2 Astra',
      shortName: 'GPT-6.2 Astra',
      inputRate: 10.00,
      cachedInputRate: 1.00,
      outputRate: 50.00,
      contextLimit: 400000,
      badge: 'GPT-6 Flagship',
      category: 'openai',
      isThinking: true
    },
    'gpt-6-1-sol': {
      name: 'OpenAI GPT-6.1 Sol',
      shortName: 'GPT-6.1 Sol',
      inputRate: 2.00,
      cachedInputRate: 0.10,
      outputRate: 10.00,
      contextLimit: 256000,
      badge: 'Balanced SOTA',
      category: 'openai',
      isThinking: true
    },
    'gpt-6-luna': {
      name: 'OpenAI GPT-6 Luna',
      shortName: 'GPT-6 Luna',
      inputRate: 0.10,
      cachedInputRate: 0.01,
      outputRate: 0.50,
      contextLimit: 128000,
      badge: 'Budget Speed',
      category: 'openai',
      isThinking: false
    },
    'gpt-5': {
      name: 'OpenAI GPT-5',
      shortName: 'GPT-5',
      inputRate: 1.25,
      cachedInputRate: 0.125,
      outputRate: 10.00,
      contextLimit: 256000,
      badge: 'Agentic Core',
      category: 'openai',
      isThinking: true
    },
    'o3': {
      name: 'OpenAI o3',
      shortName: 'OpenAI o3',
      inputRate: 2.00,
      cachedInputRate: 0.50,
      outputRate: 8.00,
      contextLimit: 200000,
      badge: 'CoT Reasoning',
      category: 'openai',
      isThinking: true
    },
    'o3-mini': {
      name: 'OpenAI o3-mini',
      shortName: 'o3-mini',
      inputRate: 0.66,
      cachedInputRate: 0.16,
      outputRate: 2.64,
      contextLimit: 200000,
      badge: 'STEM Reason',
      category: 'openai',
      isThinking: true
    },
    'gpt-oss-120b': {
      name: 'GPT-OSS 120B (MoE)',
      shortName: 'GPT-OSS 120B',
      inputRate: 0.20,
      cachedInputRate: 0.05,
      outputRate: 0.60,
      contextLimit: 128000,
      badge: 'Open Weights',
      category: 'openai',
      isThinking: false
    },

    // 🚀 DeepSeek V4 & R1
    'deepseek-v4-pro': {
      name: 'DeepSeek V4-Pro',
      shortName: 'DeepSeek V4-Pro',
      inputRate: 0.66,
      cachedInputRate: 0.022,
      outputRate: 1.98,
      contextLimit: 128000,
      badge: 'Off-Peak Pro',
      category: 'deepseek',
      isThinking: true
    },
    'deepseek-v4-1-flash': {
      name: 'DeepSeek V4.1-Flash',
      shortName: 'V4.1-Flash',
      inputRate: 0.15,
      cachedInputRate: 0.003,
      outputRate: 0.60,
      contextLimit: 128000,
      badge: 'Flash MoE',
      category: 'deepseek',
      isThinking: false
    },
    'deepseek-r1': {
      name: 'DeepSeek R1',
      shortName: 'DeepSeek R1',
      inputRate: 0.70,
      cachedInputRate: 0.14,
      outputRate: 2.40,
      contextLimit: 128000,
      badge: 'Open Reason',
      category: 'deepseek',
      isThinking: true
    },

    // 🟣 Alibaba Qwen 3.x
    'qwen-3-8-max': {
      name: 'Qwen 3.8-Max',
      shortName: 'Qwen 3.8-Max',
      inputRate: 1.65,
      cachedInputRate: 0.25,
      outputRate: 4.95,
      contextLimit: 1000000,
      badge: 'Qwen Flagship',
      category: 'qwen',
      isThinking: true
    },
    'qwen-3-5-plus': {
      name: 'Qwen 3.5 Plus',
      shortName: 'Qwen 3.5 Plus',
      inputRate: 0.40,
      cachedInputRate: 0.05,
      outputRate: 2.40,
      contextLimit: 1000000,
      badge: '1M Context',
      category: 'qwen',
      isThinking: false
    },
    'qwen-flash': {
      name: 'Qwen Flash',
      shortName: 'Qwen Flash',
      inputRate: 0.10,
      cachedInputRate: 0.01,
      outputRate: 0.40,
      contextLimit: 1000000,
      badge: 'Ultra Budget',
      category: 'qwen',
      isThinking: false
    }
  };

  // Preset Demonstrations
  const PRESETS = {
    rag: `You are an elite enterprise RAG (Retrieval-Augmented Generation) Knowledge Assistant for FinTech workflows.
Your primary role is to answer questions strictly and accurately based on the provided retrieved context.

Guidelines:
1. Always base your response directly on the context documents supplied.
2. If the context does not contain enough evidence to answer reliably, state: "I cannot determine this from the retrieved records."
3. Never invent facts, company statistics, or regulatory citations.
4. Output your analysis using clear headings, bullet points, and citation tags [Doc-X].
5. Maintain a professional, objective, and audit-compliant tone.`,

    code: `Please act as a Principal Software Engineer. I want you to carefully review the following Python code snippet for computational bottlenecks, memory leaks, concurrency hazards, and edge cases.

def process_large_dataset(records):
    # Process each record and accumulate summary metrics
    results = []
    for item in records:
        if item.get("status") == "ACTIVE" and item.get("value") > 0:
            parsed = parse_payload(item["raw"])
            results.append({"id": item["id"], "score": parsed["score"] * 1.42})
    return sorted(results, key=lambda x: x["score"], reverse=True)

Provide refactored code using Python standard library best practices, type annotations, and Big-O time complexity analysis.`,

    json: `Extract all customer order details from the unstructured invoice below into a valid, strictly formatted JSON object adhering to the schema.
Do not output markdown codeblocks, explanatory preamble, or conversational commentary.

Invoice Record:
Client: Acme Logistics Global Ltd
Purchase Date: October 14, 2026
Items Purchased:
- 12x Enterprise Vision Camera Nodes @ $450.00 each (SKU: CAM-9021)
- 4x High-Bandwidth Gigabit Switch Blades @ $1,200.00 each (SKU: SW-40G)
Subtotal: $10,200.00
Tax (8.25%): $841.50
Total Billed: $11,041.50
Shipping Address: 400 Silicon Parkway, Suite 800, Austin, TX 78701`,

    verbose: `Please act as a professional writing assistant. It is extremely important that you read the following paragraph very carefully. In order to help me improve my communication, I would like you to make sure to analyze each and every sentence in great detail. At the end of the day, as an AI language model, you should always remember to provide comprehensive and thorough suggestions that will help me sound much more concise and effective in all future business correspondence. Thank you very much for your kind help and cooperation!`
  };

  // DOM Elements
  const primaryModelSelect = document.getElementById('primaryModelSelect');
  const statModelName = document.getElementById('statModelName');
  const metricTokens = document.getElementById('metricTokens');
  const metricRatio = document.getElementById('metricRatio');
  const metricChars = document.getElementById('metricChars');
  const metricWords = document.getElementById('metricWords');
  const metricLines = document.getElementById('metricLines');
  const metricSingleCost = document.getElementById('metricSingleCost');
  const metricRateBreakdown = document.getElementById('metricRateBreakdown');
  const metric100kCost = document.getElementById('metric100kCost');
  const metricAnnualCost = document.getElementById('metricAnnualCost');
  const tokenPillCount = document.getElementById('tokenPillCount');

  // Tabs & Views
  const tabInput = document.getElementById('tabInput');
  const tabTokens = document.getElementById('tabTokens');
  const tabCompress = document.getElementById('tabCompress');
  const viewEditor = document.getElementById('viewEditor');
  const viewTokens = document.getElementById('viewTokens');
  const viewCompress = document.getElementById('viewCompress');

  // Editor Inputs & Controls
  const promptInput = document.getElementById('promptInput');
  const presetSelect = document.getElementById('presetSelect');
  const btnClear = document.getElementById('btnClear');
  const btnQuickOptimize = document.getElementById('btnQuickOptimize');
  const tokenStream = document.getElementById('tokenStream');
  const tokenInspector = document.getElementById('tokenInspector');
  const btnCopyTokensJson = document.getElementById('btnCopyTokensJson');

  // Compressor View Elements
  const compOriginalTokens = document.getElementById('compOriginalTokens');
  const compOptimizedTokens = document.getElementById('compOptimizedTokens');
  const compSavingsPct = document.getElementById('compSavingsPct');
  const compDollarsSaved = document.getElementById('compDollarsSaved');
  const tagOriginalTokens = document.getElementById('tagOriginalTokens');
  const tagOptimizedTokens = document.getElementById('tagOptimizedTokens');
  const diffOriginalText = document.getElementById('diffOriginalText');
  const diffOptimizedText = document.getElementById('diffOptimizedText');
  const btnApplyOptimized = document.getElementById('btnApplyOptimized');
  const btnAiDeepCompress = document.getElementById('btnAiDeepCompress');
  const btnCopyOptimized = document.getElementById('btnCopyOptimized');

  // Cost Matrix & Simulator
  const costTableBody = document.getElementById('costTableBody');
  const outputTokensInput = document.getElementById('outputTokensInput');
  const cacheHitToggle = document.getElementById('cacheHitToggle');
  const simSlider = document.getElementById('simSlider');
  const simVolumeVal = document.getElementById('simVolumeVal');
  const contextBar = document.getElementById('contextBar');
  const contextPercent = document.getElementById('contextPercent');
  const contextTokensLeft = document.getElementById('contextTokensLeft');
  const contextWindowCap = document.getElementById('contextWindowCap');
  const auditSnippet = document.getElementById('auditSnippet');
  const btnCopyAudit = document.getElementById('btnCopyAudit');

  // State
  let currentTokens = [];
  let optimizedPromptText = '';
  let activeTab = 'editor';
  let simulatedVolume = 100000;
  let expectedOutputTokens = 250;
  let useCachedInput = false;
  let activeCategoryFilter = 'all';

  // BPE Subword Tokenizer Simulation Engine
  // Approximates GPT-4/o200k/cl100k tokenizer regex & subword boundaries
  function tokenizeText(text) {
    if (!text || text.length === 0) return [];

    // BPE Regex pattern capturing contractions, alphanumeric tokens, punctuations, and whitespace chunks
    const tokenRegex = /(?:'s|'t|'re|'ve|'m|'ll|'d)|[^\r\n\p{L}\p{N}]?\p{L}+|\p{N}{1,3}| ?[^\s\p{L}\p{N}]+[\r\n]*|\s*[\r\n]+|\s+(?!\S)|\s+/gu;
    
    const rawMatches = text.match(tokenRegex) || [];
    const tokens = [];

    rawMatches.forEach((chunk, idx) => {
      // Split long alphanumeric sequences into realistic 3-4 character subword chunks if needed
      if (chunk.length > 5 && /^[a-zA-Z0-9_]+$/.test(chunk)) {
        for (let i = 0; i < chunk.length; i += 4) {
          const sub = chunk.substring(i, i + 4);
          tokens.push({
            id: tokens.length + 1,
            text: sub,
            bytes: new TextEncoder().encode(sub).length
          });
        }
      } else {
        tokens.push({
          id: tokens.length + 1,
          text: chunk,
          bytes: new TextEncoder().encode(chunk).length
        });
      }
    });

    return tokens;
  }

  // Smart Prompt Compression Engine
  function compressPrompt(text) {
    if (!text || text.trim().length === 0) return '';

    let compressed = text;

    // 1. Remove verbose AI polite boilerplate & conversational filler
    const conversationalFillers = [
      /\bplease\s+(?:act\s+as|make\s+sure\s+to|be\s+sure\s+to|remember\s+to)\b/gi,
      /\bas\s+an\s+ai\s+language\s+model,?\b/gi,
      /\bit\s+is\s+(?:extremely\s+)?important\s+that\s+you\b/gi,
      /\bin\s+order\s+to\b/gi,
      /\bat\s+the\s+end\s+of\s+the\s+day,?\b/gi,
      /\bthank\s+you\s+(?:very\s+much\s+)?(?:in\s+advance\s+)?(?:for\s+your\s+help)?\.?/gi,
      /\bi\s+would\s+like\s+you\s+to\b/gi,
      /\byour\s+task\s+is\s+to\b/gi,
      /\bevery\s+single\b/gi,
      /\bcarefully\s+and\s+thoroughly\b/gi
    ];

    conversationalFillers.forEach(pattern => {
      compressed = compressed.replace(pattern, '');
    });

    // 2. Condense common prompt instructions
    compressed = compressed
      .replace(/\bdo\s+not\s+output\b/gi, 'No')
      .replace(/\bprovide\s+refactored\s+code\b/gi, 'Refactor code')
      .replace(/\balways\s+base\s+your\s+response\s+directly\s+on\b/gi, 'Base response on')
      .replace(/\boutput\s+your\s+analysis\s+using\b/gi, 'Format:');

    // 3. Clean duplicate whitespace & excessive newlines
    compressed = compressed
      .replace(/[ \t]{2,}/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return compressed;
  }

  // Recalculate Metrics & Update UI
  function updateAll() {
    const text = promptInput.value;
    currentTokens = tokenizeText(text);

    const tokenCount = currentTokens.length;
    const charCount = text.length;
    const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const lineCount = text === '' ? 1 : text.split('\n').length;
    const charsPerToken = tokenCount > 0 ? (charCount / tokenCount).toFixed(1) : '0.0';

    // Update Strip Metrics
    metricTokens.textContent = tokenCount.toLocaleString();
    metricChars.textContent = charCount.toLocaleString();
    metricWords.textContent = wordCount.toLocaleString();
    metricLines.textContent = lineCount.toLocaleString();
    metricRatio.textContent = `~${charsPerToken} chars/token`;
    tokenPillCount.textContent = tokenCount.toLocaleString();

    // Selected Model Cost Calculation (Input + Cached Discount + Output)
    const selectedModelKey = primaryModelSelect.value;
    const model = MODEL_CATALOG[selectedModelKey] || MODEL_CATALOG['gemini-4-hydrogen'];
    const effectiveInputRate = useCachedInput ? (model.cachedInputRate ?? model.inputRate) : model.inputRate;
    statModelName.textContent = model.shortName;
    metricRateBreakdown.textContent = `${useCachedInput ? 'Cache' : 'In'}: $${effectiveInputRate.toFixed(3)} | Out: $${model.outputRate.toFixed(2)} / 1M`;

    const singleCallCost = ((tokenCount / 1000000) * effectiveInputRate) + ((expectedOutputTokens / 1000000) * model.outputRate);
    metricSingleCost.textContent = singleCallCost.toFixed(6);

    const costPerVolume = singleCallCost * simulatedVolume;
    metric100kCost.textContent = costPerVolume >= 1000 ? costPerVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : costPerVolume.toFixed(2);
    metricAnnualCost.textContent = (costPerVolume * 12).toFixed(2);

    // Update Context Utilization
    const contextLimit = model.contextLimit;
    const contextPct = ((tokenCount / contextLimit) * 100);
    contextPercent.textContent = `${contextPct.toFixed(2)}%`;
    const tokensRemaining = Math.max(0, contextLimit - tokenCount);
    contextTokensLeft.textContent = tokensRemaining.toLocaleString();
    contextWindowCap.textContent = `${(contextLimit / 1000).toLocaleString()}k Limit`;
    contextBar.style.width = `${Math.min(100, Math.max(1, contextPct))}%`;

    if (contextPct > 80) {
      contextBar.style.background = 'linear-gradient(90deg, #f59e0b, #ef4444)';
    } else if (contextPct > 50) {
      contextBar.style.background = 'linear-gradient(90deg, #00e5ff, #f59e0b)';
    } else {
      contextBar.style.background = 'linear-gradient(90deg, #00e5ff, #10b981)';
    }

    // Render Token Visualizer Chips
    renderTokenChips(currentTokens);

    // Render Multi-Model Cost Matrix Table
    renderCostMatrix(tokenCount, simulatedVolume, selectedModelKey);

    // Update Prompt Compressor Preview
    updateCompressor(text, tokenCount, model);

    // Update Cost Audit Report Snippet
    renderAuditSnippet(tokenCount, charCount, wordCount, selectedModelKey);
  }

  // Render Colored Token Chips
  function renderTokenChips(tokens) {
    if (!tokens || tokens.length === 0) {
      tokenStream.innerHTML = '<div class="empty-state">No text to tokenize. Type or paste prompt in the editor tab.</div>';
      tokenInspector.textContent = 'Hover over any token to inspect its subword index, character boundaries, and raw byte length.';
      return;
    }

    tokenStream.innerHTML = '';
    const fragment = document.createDocumentFragment();

    tokens.forEach((tok, i) => {
      const chip = document.createElement('span');
      chip.className = `token-chip token-hue-${i % 5}`;
      
      // Make spaces and line breaks visually inspectable
      let displayContent = tok.text;
      if (displayContent === ' ') {
        displayContent = '· ';
      } else if (displayContent.startsWith(' ') && displayContent.length > 1) {
        displayContent = '·' + displayContent.substring(1);
      } else if (displayContent === '\n') {
        displayContent = '↵\n';
      }

      chip.textContent = displayContent;
      
      chip.addEventListener('mouseenter', () => {
        tokenInspector.textContent = `Token #${tok.id} | Subword: "${tok.text.replace(/\n/g, '\\n')}" | Length: ${tok.text.length} chars | Size: ${tok.bytes} bytes`;
      });

      fragment.appendChild(chip);
    });

    tokenStream.appendChild(fragment);
  }

  // Render Multi-Model Matrix
  function renderCostMatrix(tokenCount, volume, selectedKey) {
    costTableBody.innerHTML = '';

    Object.keys(MODEL_CATALOG).forEach(key => {
      const m = MODEL_CATALOG[key];

      // Category filtering
      if (activeCategoryFilter === 'thinking' && !m.isThinking) return;
      if (activeCategoryFilter !== 'all' && activeCategoryFilter !== 'thinking' && m.category !== activeCategoryFilter) return;

      const effectiveIn = useCachedInput ? (m.cachedInputRate ?? m.inputRate) : m.inputRate;
      const costPerCall = ((tokenCount / 1000000) * effectiveIn) + ((expectedOutputTokens / 1000000) * m.outputRate);
      const costPerVol = costPerCall * volume;
      const isSelected = key === selectedKey;

      const tr = document.createElement('tr');
      if (isSelected) tr.className = 'selected';

      tr.innerHTML = `
        <td>
          <div class="model-name-cell">
            <span>${m.name}</span>
            <span class="model-tag">${m.badge}</span>
          </div>
        </td>
        <td class="font-mono">${(m.contextLimit / 1000).toLocaleString()}k</td>
        <td class="font-mono text-cyan">$${costPerCall.toFixed(6)}</td>
        <td class="font-mono font-bold">$${costPerVol.toFixed(2)}</td>
      `;

      tr.addEventListener('click', () => {
        primaryModelSelect.value = key;
        updateAll();
      });

      costTableBody.appendChild(tr);
    });
  }

  // Update Smart Compressor
  function updateCompressor(text, originalTokens, model) {
    optimizedPromptText = compressPrompt(text);
    const optimizedTokens = tokenizeText(optimizedPromptText).length;

    compOriginalTokens.textContent = originalTokens.toLocaleString();
    compOptimizedTokens.textContent = optimizedTokens.toLocaleString();
    tagOriginalTokens.textContent = `${originalTokens} tok`;
    tagOptimizedTokens.textContent = `${optimizedTokens} tok`;

    diffOriginalText.textContent = text || 'No prompt entered.';
    diffOptimizedText.textContent = optimizedPromptText || 'Optimized prompt will appear here.';

    if (originalTokens > 0) {
      const savedTokens = Math.max(0, originalTokens - optimizedTokens);
      const savingsPct = Math.round((savedTokens / originalTokens) * 100);
      compSavingsPct.textContent = `${savingsPct}%`;

      const effectiveIn = useCachedInput ? (model.cachedInputRate ?? model.inputRate) : model.inputRate;
      const dollarsSaved = (savedTokens / 1000000) * effectiveIn * simulatedVolume;
      compDollarsSaved.textContent = `$${dollarsSaved.toFixed(2)}`;
    } else {
      compSavingsPct.textContent = '0%';
      compDollarsSaved.textContent = '$0.00';
    }
  }

  // Render Cost Audit Markdown
  function renderAuditSnippet(tokens, chars, words, modelKey) {
    const m = MODEL_CATALOG[modelKey] || MODEL_CATALOG['gemini-4-hydrogen'];
    const effectiveIn = useCachedInput ? (m.cachedInputRate ?? m.inputRate) : m.inputRate;
    const singleCost = ((tokens / 1000000) * effectiveIn) + ((expectedOutputTokens / 1000000) * m.outputRate);
    const monthlyCost = singleCost * simulatedVolume;
    const annualCost = monthlyCost * 12;

    const report =
`### TokenBudget AI — Cost Audit
- Model: ${m.name} (${(m.contextLimit / 1000).toLocaleString()}k Context)
- Input: ${tokens.toLocaleString()} tok (${useCachedInput ? 'Cached' : 'Standard'} $${effectiveIn.toFixed(3)}/1M)
- Expected Output: ${expectedOutputTokens.toLocaleString()} tok ($${m.outputRate.toFixed(2)}/1M)
- Cost / Call: $${singleCost.toFixed(6)}
- Monthly (${simulatedVolume.toLocaleString()} calls): $${monthlyCost.toFixed(2)}
- Projected Annual Spend: $${annualCost.toFixed(2)}`;

    auditSnippet.textContent = report;
  }

  // Switch Tabs
  function setTab(tab) {
    activeTab = tab;
    tabInput.classList.toggle('active', tab === 'editor');
    tabTokens.classList.toggle('active', tab === 'tokens');
    tabCompress.classList.toggle('active', tab === 'compress');

    viewEditor.classList.toggle('hidden', tab !== 'editor');
    viewTokens.classList.toggle('hidden', tab !== 'tokens');
    viewCompress.classList.toggle('hidden', tab !== 'compress');
  }

  // Event Listeners
  promptInput.addEventListener('input', updateAll);

  primaryModelSelect.addEventListener('change', updateAll);

  tabInput.addEventListener('click', () => setTab('editor'));
  tabTokens.addEventListener('click', () => setTab('tokens'));
  tabCompress.addEventListener('click', () => setTab('compress'));

  presetSelect.addEventListener('change', (e) => {
    const key = e.target.value;
    if (PRESETS[key]) {
      promptInput.value = PRESETS[key];
      updateAll();
    }
  });

  btnClear.addEventListener('click', () => {
    promptInput.value = '';
    presetSelect.value = '';
    updateAll();
  });

  btnQuickOptimize.addEventListener('click', () => {
    setTab('compress');
    updateAll();
  });

  btnApplyOptimized.addEventListener('click', () => {
    if (optimizedPromptText) {
      promptInput.value = optimizedPromptText;
      updateAll();
      setTab('editor');
    }
  });

  btnCopyOptimized.addEventListener('click', () => {
    if (optimizedPromptText) {
      navigator.clipboard.writeText(optimizedPromptText).then(() => {
        const originalText = btnCopyOptimized.textContent;
        btnCopyOptimized.textContent = 'Copied to Clipboard!';
        setTimeout(() => {
          btnCopyOptimized.textContent = originalText;
        }, 1800);
      });
    }
  });

  btnCopyTokensJson.addEventListener('click', () => {
    const jsonOutput = JSON.stringify(currentTokens, null, 2);
    navigator.clipboard.writeText(jsonOutput).then(() => {
      const originalText = btnCopyTokensJson.textContent;
      btnCopyTokensJson.textContent = 'JSON Copied!';
      setTimeout(() => {
        btnCopyTokensJson.textContent = originalText;
      }, 1800);
    });
  });

  simSlider.addEventListener('input', (e) => {
    simulatedVolume = parseInt(e.target.value, 10);
    simVolumeVal.textContent = simulatedVolume.toLocaleString();
    updateAll();
  });

  outputTokensInput.addEventListener('input', (e) => {
    expectedOutputTokens = Math.max(0, parseInt(e.target.value, 10) || 0);
    updateAll();
  });

  cacheHitToggle.addEventListener('change', (e) => {
    useCachedInput = e.target.checked;
    updateAll();
  });

  btnAiDeepCompress.addEventListener('click', async () => {
    const raw = promptInput.value.trim();
    if (!raw) return;
    let cfg = {};
    try { cfg = JSON.parse(localStorage.getItem('kg_ai_config') || '{}'); } catch {}
    if (!cfg.provider || cfg.provider === 'offline') {
      alert('Shared AI Engine is in Offline Mode. Open Krishna.OS -> AI Engine to enable local Ollama or a Cloud API key.');
      return;
    }
    btnAiDeepCompress.textContent = 'Compressing via AI...';
    btnAiDeepCompress.disabled = true;
    const sysPrompt = `Rewrite this prompt to be ultra-token-efficient (cut 30-45% tokens) while keeping 100% of constraints, output format rules, and schemas intact. Output ONLY the compressed prompt:\n\n${raw}`;
    try {
      let out = '';
      if (cfg.provider === 'ollama') {
        const res = await fetch(cfg.endpoint || 'http://localhost:11434/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: cfg.model || 'qwen2.5:3b', messages: [{ role: 'user', content: sysPrompt }], stream: false })
        });
        const d = await res.json();
        out = d.message?.content || d.response || '';
      } else if (cfg.provider === 'gemini') {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${cfg.model || 'gemini-4-hydrogen'}:generateContent?key=${cfg.apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: sysPrompt }] }] })
        });
        const d = await res.json();
        out = d.candidates?.[0]?.content?.parts?.[0]?.text || '';
      } else if (cfg.provider === 'groq' || cfg.provider === 'openai') {
        const res = await fetch(cfg.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cfg.apiKey}` },
          body: JSON.stringify({ model: cfg.model, messages: [{ role: 'user', content: sysPrompt }] })
        });
        const d = await res.json();
        out = d.choices?.[0]?.message?.content || '';
      }
      if (out.trim()) {
        optimizedPromptText = out.trim();
        const origTok = currentTokens.length;
        const optTok = tokenizeText(optimizedPromptText).length;
        compOptimizedTokens.textContent = optTok.toLocaleString();
        tagOptimizedTokens.textContent = `${optTok} tok`;
        diffOptimizedText.textContent = optimizedPromptText;
        const saved = Math.max(0, origTok - optTok);
        compSavingsPct.textContent = origTok > 0 ? `${Math.round((saved / origTok) * 100)}%` : '0%';
      }
    } catch (err) {
      alert(`AI Compress error: ${err.message}`);
    } finally {
      btnAiDeepCompress.textContent = 'AI Rewrite Compress ✨';
      btnAiDeepCompress.disabled = false;
    }
  });

  btnCopyAudit.addEventListener('click', () => {
    navigator.clipboard.writeText(auditSnippet.textContent).then(() => {
      btnCopyAudit.textContent = 'Copied!';
      setTimeout(() => {
        btnCopyAudit.textContent = 'Copy Markdown';
      }, 1800);
    });
  });

  // Category Filter Pills Listener
  document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategoryFilter = btn.getAttribute('data-filter') || 'all';
      updateAll();
    });
  });

  // Default Init with RAG preset
  promptInput.value = PRESETS.rag;
  presetSelect.value = 'rag';
  updateAll();
})();
