/**
 * TokenBudget AI — Real-Time Multi-Model LLM Tokenizer, Cost Matrix & Prompt Compressor
 * Author: Krishna Gupta (https://github.com/KrishnaGupta-coder)
 */

(function () {
  'use strict';

  // Model Catalog & Live Pricing Rates (per 1,000,000 tokens) - Latest 2025/2026 Models
  const MODEL_CATALOG = {
    'deepseek-r1': {
      name: 'DeepSeek R1 (Reasoning)',
      shortName: 'DeepSeek R1',
      inputRate: 0.55,
      outputRate: 2.19,
      contextLimit: 128000,
      badge: 'Reasoning SOTA'
    },
    'o1': {
      name: 'OpenAI o1 (Frontier Reasoning)',
      shortName: 'OpenAI o1',
      inputRate: 15.00,
      outputRate: 60.00,
      contextLimit: 200000,
      badge: 'Frontier SOTA'
    },
    'o3-mini': {
      name: 'OpenAI o3-mini (STEM Reasoning)',
      shortName: 'o3-mini',
      inputRate: 1.10,
      outputRate: 4.40,
      contextLimit: 200000,
      badge: 'Fast Reasoning'
    },
    'claude-3-5-sonnet': {
      name: 'Claude 3.5 Sonnet (v2)',
      shortName: 'Claude 3.5 Sonnet',
      inputRate: 3.00,
      outputRate: 15.00,
      contextLimit: 200000,
      badge: 'Top Coding'
    },
    'claude-3-5-haiku': {
      name: 'Claude 3.5 Haiku',
      shortName: 'Claude 3.5 Haiku',
      inputRate: 0.80,
      outputRate: 4.00,
      contextLimit: 200000,
      badge: 'Ultra Fast'
    },
    'gemini-2-flash': {
      name: 'Gemini 2.0 Flash',
      shortName: 'Gemini 2.0 Flash',
      inputRate: 0.10,
      outputRate: 0.40,
      contextLimit: 1048576,
      badge: 'Next-Gen 1M'
    },
    'gpt-4o': {
      name: 'OpenAI GPT-4o (Omni)',
      shortName: 'GPT-4o',
      inputRate: 2.50,
      outputRate: 10.00,
      contextLimit: 128000,
      badge: 'Omni Flagship'
    },
    'deepseek-v3': {
      name: 'DeepSeek V3 (MoE)',
      shortName: 'DeepSeek V3',
      inputRate: 0.14,
      outputRate: 0.28,
      contextLimit: 128000,
      badge: 'MoE Value'
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
  const metricInputRate = document.getElementById('metricInputRate');
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
  const btnCopyOptimized = document.getElementById('btnCopyOptimized');

  // Cost Matrix & Simulator
  const costTableBody = document.getElementById('costTableBody');
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

    // Selected Model Cost Calculation
    const selectedModelKey = primaryModelSelect.value;
    const model = MODEL_CATALOG[selectedModelKey];
    statModelName.textContent = model.shortName;
    metricInputRate.textContent = model.inputRate.toFixed(2);

    const singleCallCost = (tokenCount / 1000000) * model.inputRate;
    metricSingleCost.textContent = singleCallCost.toFixed(6);

    const costPerVolume = (tokenCount / 1000000) * model.inputRate * simulatedVolume;
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
      const costPerCall = (tokenCount / 1000000) * m.inputRate;
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

      const dollarsSaved = (savedTokens / 1000000) * model.inputRate * simulatedVolume;
      compDollarsSaved.textContent = `$${dollarsSaved.toFixed(2)}`;
    } else {
      compSavingsPct.textContent = '0%';
      compDollarsSaved.textContent = '$0.00';
    }
  }

  // Render Cost Audit Markdown
  function renderAuditSnippet(tokens, chars, words, modelKey) {
    const m = MODEL_CATALOG[modelKey];
    const singleCost = (tokens / 1000000) * m.inputRate;
    const monthlyCost = singleCost * simulatedVolume;
    const annualCost = monthlyCost * 12;

    const report = 
`### TokenBudget AI — Cost Audit
- Model: ${m.name} (${(m.contextLimit / 1000)}k Context)
- Total Tokens: ${tokens.toLocaleString()} (${chars.toLocaleString()} chars, ${words.toLocaleString()} words)
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

  btnCopyAudit.addEventListener('click', () => {
    navigator.clipboard.writeText(auditSnippet.textContent).then(() => {
      btnCopyAudit.textContent = 'Copied!';
      setTimeout(() => {
        btnCopyAudit.textContent = 'Copy Markdown';
      }, 1800);
    });
  });

  // Default Init with RAG preset
  promptInput.value = PRESETS.rag;
  presetSelect.value = 'rag';
  updateAll();
})();
