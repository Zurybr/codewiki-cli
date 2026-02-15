const puppeteer = require('puppeteer');
const fs = require('fs');

class CodeWikiClient {
  constructor() {
    this.browser = null;
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
  }

  async close() {
    if (this.browser) await this.browser.close();
  }

  async getFeaturedRepos() {
    const page = await this.browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36');
    
    await page.goto('https://codewiki.google/', { waitUntil: 'networkidle2', timeout: 45000 });
    await new Promise(r => setTimeout(r, 2000));
    
    const repos = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a[href*="github.com"]'))
        .filter(a => a.href.includes('codewiki.google/github.com'))
        .map(a => {
          const text = a.textContent.trim();
          const match = a.href.match(/github\.com\/([^/]+\/[^/]+)/);
          const fullName = match ? match[1] : null;
          
          // Extract name and description
          const lines = text.split('\n').filter(l => l.trim());
          const name = lines[0] || '';
          const desc = lines.slice(1).join(' ').replace(/star\s*[\d.]+k?/gi, '').trim();
          
          // Extract stars
          const starMatch = text.match(/star\s*([\d.]+k?)/i);
          const stars = starMatch ? starMatch[1] : null;
          
          return { name, fullName, description: desc, stars, url: a.href };
        })
        .filter(r => r.fullName && !r.fullName.includes('See Code Wiki'));
    });
    
    await page.close();
    
    // Deduplicate by fullName
    const seen = new Set();
    return repos.filter(r => {
      if (seen.has(r.fullName)) return false;
      seen.add(r.fullName);
      return true;
    });
  }

  async getRepoDocumentation(owner, repo) {
    const page = await this.browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36');
    
    const url = `https://codewiki.google/github.com/${owner}/${repo}`;
    console.error(`Fetching: ${url}`);
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 3000));
    
    const data = await page.evaluate(() => {
      const title = document.querySelector('h1')?.textContent?.trim() || '';
      
      const toc = Array.from(document.querySelectorAll('h2, h3'))
        .map(h => ({
          level: h.tagName,
          text: h.textContent.trim(),
          id: h.id || ''
        }));
      
      const body = document.body.innerText;
      
      const codeLinks = Array.from(document.querySelectorAll('a[href*="github.com"]'))
        .filter(a => a.href.includes('/blob/') || a.href.includes('/tree/'))
        .map(a => ({
          text: a.textContent.trim(),
          href: a.href
        }));
      
      return { title, toc, body, codeLinks };
    });
    
    await page.close();
    
    return {
      owner,
      repo,
      url,
      ...data
    };
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  const client = new CodeWikiClient();
  await client.init();
  
  try {
    if (command === 'featured') {
      const repos = await client.getFeaturedRepos();
      console.log(JSON.stringify(repos, null, 2));
    }
    else if (command === 'repo' && args[1]) {
      const [owner, repo] = args[1].split('/');
      if (!owner || !repo) {
        console.error('Usage: node codewiki.js repo owner/repo');
        process.exit(1);
      }
      const doc = await client.getRepoDocumentation(owner, repo);
      console.log(JSON.stringify(doc, null, 2));
    }
    else if (command === 'doc' && args[1]) {
      const [owner, repo] = args[1].split('/');
      const doc = await client.getRepoDocumentation(owner, repo);
      console.log(`# ${doc.title}\n`);
      console.log(`URL: ${doc.url}\n`);
      console.log('## Table of Contents\n');
      doc.toc.forEach(h => {
        const indent = h.level === 'H3' ? '  ' : '';
        console.log(`${indent}- ${h.text}`);
      });
      console.log('\n## Documentation\n');
      console.log(doc.body.slice(0, 5000));
    }
    else {
      console.log('CodeWiki Client');
      console.log('Commands:');
      console.log('  featured          - List featured repositories');
      console.log('  repo owner/repo   - Get full documentation (JSON)');
      console.log('  doc owner/repo    - Get documentation (Markdown)');
    }
  } finally {
    await client.close();
  }
}

main().catch(console.error);
