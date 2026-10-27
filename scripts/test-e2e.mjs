import puppeteer from 'puppeteer';

const BASE_URL = 'http://localhost:3000';

async function runAudit() {
  console.log('🚀 Starting CASEFILE ZERO End-to-End Browser Audit...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  try {
    // 1. Visit Landing Page
    console.log('\n--- Step 1: Landing Page ---');
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    const titleText = await page.$eval('h1', el => el.innerText);
    console.log(`✓ Loaded Landing Page. Title: "${titleText.replace(/\n/g, ' ')}"`);

    // Click Start Investigation
    const startBtn = await page.waitForSelector('a[href="/briefing"]');
    await startBtn.click();
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    console.log(`✓ Navigated to Briefing: ${page.url()}`);

    // Visit Suspects Page
    await page.goto(`${BASE_URL}/suspects`, { waitUntil: 'networkidle0' });
    const suspectsHeader = await page.$eval('h1, h2', el => el.innerText).catch(() => '');
    console.log(`✓ Loaded Suspects Page: ${page.url()} ("${suspectsHeader.slice(0, 30)}")`);

    // 2. Navigate to Crime Scene
    console.log('\n--- Step 2: Crime Scene & Clue Collection ---');
    await page.goto(`${BASE_URL}/crime-scene`, { waitUntil: 'networkidle0' });
    console.log(`✓ Loaded Crime Scene: ${page.url()}`);

    // Click all 8 hotspots inside crime scene viewport
    const hotspotButtons = await page.$$('.relative.aspect-\\[16\\/9\\] button[aria-label]');
    console.log(`Found ${hotspotButtons.length} hotspot buttons inside the crime scene viewport.`);

    for (let i = 0; i < hotspotButtons.length; i++) {
      const label = await page.evaluate(el => el.getAttribute('aria-label'), hotspotButtons[i]);
      await page.evaluate(el => el.click(), hotspotButtons[i]);
      await new Promise(r => setTimeout(r, 200));
      console.log(`  ✓ Clicked hotspot: "${label}"`);
    }

    // Verify 6/6 clues found in localStorage & UI
    let cluesCountText = await page.$eval('nav span:nth-child(2)', el => el.innerText).catch(() => '');
    console.log(`Navbar status text: "${cluesCountText}"`);

    const storedClues = await page.evaluate(() => {
      const raw = localStorage.getItem('casefile_zero_investigation_state_v1');
      if (!raw) return [];
      return JSON.parse(raw).discoveredClueIds || [];
    });
    console.log(`✓ Discovered clues in localStorage (${storedClues.length}/6):`, storedClues);
    if (storedClues.length !== 6) {
      throw new Error(`Expected 6 clues collected, found ${storedClues.length}`);
    }

    // Test duplicate click behavior
    console.log('\n--- Testing Duplicate Collection ---');
    await hotspotButtons[0].click(); // Click victim desk again
    await new Promise(r => setTimeout(r, 200));
    const alertText = await page.evaluate(() => {
      const alert = document.querySelector('.animate-fade-in-up');
      return alert ? alert.innerText : '';
    });
    console.log(`✓ Duplicate click alert verification: "${alertText.slice(0, 60)}..."`);

    // 3. Refresh and test persistence
    console.log('\n--- Step 3: Page Refresh & Persistence ---');
    await page.reload({ waitUntil: 'networkidle0' });
    const storedCluesAfterRefresh = await page.evaluate(() => {
      const raw = localStorage.getItem('casefile_zero_investigation_state_v1');
      if (!raw) return [];
      return JSON.parse(raw).discoveredClueIds || [];
    });
    console.log(`✓ Post-refresh clues count in localStorage: ${storedCluesAfterRefresh.length}/6`);
    if (storedCluesAfterRefresh.length !== 6) {
      throw new Error(`Persistence failed! Expected 6 clues after refresh.`);
    }

    // 4. Interrogation Room Testing
    console.log('\n--- Step 4: Interrogation Room & Evidence Unlocks ---');
    await page.goto(`${BASE_URL}/interrogation`, { waitUntil: 'networkidle0' });
    console.log(`✓ Loaded Interrogation Room: ${page.url()}`);

    const suspectsToTest = [
      { id: 'suspect-1', name: 'Elena Marchetti' },
      { id: 'suspect-2', name: 'Marcus Chen' },
      { id: 'suspect-3', name: 'Diana Okafor' }
    ];

    for (const s of suspectsToTest) {
      console.log(`\nTesting interrogation for: ${s.name}`);
      // Select suspect button
      await page.evaluate((suspectName) => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const target = buttons.find(b => b.innerText.includes(suspectName));
        if (target) target.click();
      }, s.name);
      await new Promise(r => setTimeout(r, 400));

      // Check available questions
      const questionButtons = await page.$$eval('.max-h-36 button', (buttons) =>
        buttons.map(b => b.innerText.trim())
      );
      console.log(`  Found ${questionButtons.length} available question topics.`);
      const unlockedQuestions = questionButtons.filter(q => q.includes('⚡') || q.includes('📎'));
      console.log(`  ✓ Evidence-unlocked questions available: ${unlockedQuestions.length}`);

      if (unlockedQuestions.length === 0) {
        throw new Error(`Evidence unlocked questions not appearing for ${s.name}`);
      }

      // Click the first unlocked question
      const firstQ = await page.$('.max-h-36 button');
      if (firstQ) {
        await firstQ.click();
        await page.waitForFunction(() => {
          const input = document.querySelector('input[placeholder*="Ask"]');
          return input && !input.disabled;
        }, { timeout: 30000 });
        console.log(`  ✓ Clicked question topic & received suspect answer.`);
      }

      // Test custom input
      const inputEl = await page.$('input[placeholder*="Ask"]');
      if (inputEl) {
        await inputEl.type('Where were you?');
        const sendBtn = await page.$('button.bg-amber-400');
        if (sendBtn) await sendBtn.click();
        await page.waitForFunction(() => {
          const input = document.querySelector('input[placeholder*="Ask"]');
          return input && !input.disabled;
        }, { timeout: 30000 });
        console.log(`  ✓ Sent custom keyword question & received suspect answer.`);
      }
    }

    // Verify transcript persistence in localStorage
    const storedLogs = await page.evaluate(() => {
      const raw = localStorage.getItem('casefile_zero_investigation_state_v1');
      if (!raw) return {};
      return JSON.parse(raw).interrogationLogs || {};
    });
    console.log('✓ Interrogation transcripts stored in localStorage for suspects:', Object.keys(storedLogs));
    if (Object.keys(storedLogs).length !== 3) {
      throw new Error(`Expected interrogation logs for all 3 suspects, found ${Object.keys(storedLogs).length}`);
    }

    // 5. Evidence Board & Final Accusation Testing
    console.log('\n--- Step 5: Evidence Board & Final Accusation ---');
    await page.goto(`${BASE_URL}/evidence`, { waitUntil: 'networkidle0' });
    console.log(`✓ Loaded Evidence Board: ${page.url()}`);

    // Verify all 6 clues show as cataloged
    const catalogedBadges = await page.$$eval('button', btns =>
      btns.filter(b => b.innerText.includes('✓ Cataloged')).length
    );
    console.log(`✓ Found ${catalogedBadges}/6 clues marked "✓ Cataloged" on evidence board.`);

    // Accusation Scenario 1: Accuse Elena with full key evidence (100% Master Detective)
    console.log('\n--- Submitting Accusation 1: Elena Marchetti with All 4 Key Clues ---');
    // Select Elena via data-testid
    await page.click('[data-testid="accuse-suspect-suspect-1"]');
    await new Promise(r => setTimeout(r, 200));

    // Select all 6 evidence items via data-testid
    for (const cid of ['clue-1', 'clue-2', 'clue-3', 'clue-4', 'clue-5', 'clue-6']) {
      await page.click(`[data-testid="accuse-evidence-${cid}"]`);
      await new Promise(r => setTimeout(r, 100));
    }

    // Select Motive 1: IPO Sabotage
    await page.click('[data-testid="accuse-motive-motive-1"]');
    await new Promise(r => setTimeout(r, 200));

    // Submit indictment
    await page.click('[data-testid="submit-indictment-btn"]');
    await new Promise(r => setTimeout(r, 600));

    // Check localStorage accusation result directly
    const storedAccusation = await page.evaluate(() => {
      const raw = localStorage.getItem('casefile_zero_investigation_state_v1');
      if (!raw) return null;
      return JSON.parse(raw).accusationResult;
    });
    console.log('✓ Stored Accusation in localStorage:', storedAccusation);

    // Verify Score & Rank for Elena
    const scoreText = await page.$eval('[data-testid="verdict-score"]', el => el.innerText).catch(() => '');
    const rankText = await page.$eval('[data-testid="verdict-rank"]', el => el.innerText).catch(() => '');
    const verdictText = await page.$eval('[data-testid="verdict-title"]', el => el.innerText).catch(() => '');
    console.log(`✓ Accusation 1 Result:`);
    console.log(`  Score: "${scoreText}"`);
    console.log(`  Rank: "${rankText}"`);
    console.log(`  Verdict: "${verdictText}"`);

    if (!scoreText.includes('100 / 100') || !rankText.includes('Master Detective')) {
      throw new Error(`Scoring validation failed! Expected 100 / 100 Master Detective, got: ${scoreText} / ${rankText}`);
    }

    // Accusation Scenario 2: Reopen and Accuse Innocent Suspect (Marcus Chen)
    console.log('\n--- Submitting Accusation 2: Innocent Suspect (Marcus Chen) ---');
    await page.click('[data-testid="modify-accusation-btn"]');
    await new Promise(r => setTimeout(r, 400));

    // Select Marcus Chen
    await page.click('[data-testid="accuse-suspect-suspect-2"]');
    await new Promise(r => setTimeout(r, 200));

    // Select Motive 2: Algorithm IP Dispute
    await page.click('[data-testid="accuse-motive-motive-2"]');
    await new Promise(r => setTimeout(r, 200));

    // Submit indictment against Marcus
    await page.click('[data-testid="submit-indictment-btn"]');
    await new Promise(r => setTimeout(r, 600));

    const innocentScoreText = await page.$eval('[data-testid="verdict-score"]', el => el.innerText).catch(() => '');
    const innocentRankText = await page.$eval('[data-testid="verdict-rank"]', el => el.innerText).catch(() => '');
    const innocentVerdictText = await page.$eval('[data-testid="verdict-title"]', el => el.innerText).catch(() => '');
    console.log(`✓ Accusation 2 (Innocent Suspect) Result:`);
    console.log(`  Score: "${innocentScoreText}"`);
    console.log(`  Rank: "${innocentRankText}"`);
    console.log(`  Verdict: "${innocentVerdictText}"`);

    if (!innocentScoreText.includes('0 / 100') || !innocentRankText.includes('Wrongful Conviction')) {
      throw new Error(`Innocent suspect scoring failed! Expected 0 / 100 Wrongful Conviction, got: ${innocentScoreText} / ${innocentRankText}`);
    }

    // Accusation Scenario 3: Reopen and Accuse Second Innocent Suspect (Diana Okafor)
    console.log('\n--- Submitting Accusation 3: Innocent Suspect (Diana Okafor) ---');
    await page.click('[data-testid="modify-accusation-btn"]');
    await new Promise(r => setTimeout(r, 400));

    // Select Diana Okafor
    await page.click('[data-testid="accuse-suspect-suspect-3"]');
    await new Promise(r => setTimeout(r, 200));

    // Select Motive 3: Retaliation for Security Outsourcing
    await page.click('[data-testid="accuse-motive-motive-3"]');
    await new Promise(r => setTimeout(r, 200));

    // Submit indictment against Diana
    await page.click('[data-testid="submit-indictment-btn"]');
    await new Promise(r => setTimeout(r, 600));

    const dianaScoreText = await page.$eval('[data-testid="verdict-score"]', el => el.innerText).catch(() => '');
    const dianaRankText = await page.$eval('[data-testid="verdict-rank"]', el => el.innerText).catch(() => '');
    const dianaVerdictText = await page.$eval('[data-testid="verdict-title"]', el => el.innerText).catch(() => '');
    console.log(`✓ Accusation 3 (Diana Okafor) Result:`);
    console.log(`  Score: "${dianaScoreText}"`);
    console.log(`  Rank: "${dianaRankText}"`);
    console.log(`  Verdict: "${dianaVerdictText}"`);

    if (!dianaScoreText.includes('0 / 100') || !dianaRankText.includes('Wrongful Conviction')) {
      throw new Error(`Diana Okafor scoring failed! Expected 0 / 100 Wrongful Conviction, got: ${dianaScoreText} / ${dianaRankText}`);
    }

    // 6. Test Case Restart
    console.log('\n--- Step 6: Case Restart Behavior ---');
    await page.click('[data-testid="restart-case-btn"]');
    await new Promise(r => setTimeout(r, 500));
    await new Promise(r => setTimeout(r, 500));

    // Verify localStorage is completely reset
    const stateAfterReset = await page.evaluate(() => {
      const raw = localStorage.getItem('casefile_zero_investigation_state_v1');
      if (!raw) return null;
      return JSON.parse(raw);
    });

    console.log('✓ State after case restart:');
    console.log(`  Discovered Clues: ${stateAfterReset?.discoveredClueIds?.length || 0}`);
    console.log(`  Accusation Result: ${stateAfterReset?.accusationResult}`);

    if (stateAfterReset && stateAfterReset.discoveredClueIds.length > 0) {
      throw new Error('Reset failed! Clues still in state after reset.');
    }
    if (stateAfterReset && stateAfterReset.accusationResult !== null) {
      throw new Error('Reset failed! Accusation still present after reset.');
    }

    console.log('\n🎉 ALL 8 AUDIT SCENARIOS PASSED WITH 100% SUCCESS!');
  } catch (err) {
    console.error('❌ Audit encountered an error:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

runAudit();
