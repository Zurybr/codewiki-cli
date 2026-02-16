---
name: codewiki
description: Use when needing to explore GitHub repository documentation, understand codebase architecture, or get structured docs for any public repo without cloning. Use for research before using a library, understanding unfamiliar code, or providing context about open-source projects.
---

# CodeWiki

Herramienta para acceder a [Google CodeWiki](https://codewiki.google/) desde Claude Code. Permite obtener documentación estructurada de cualquier repositorio público de GitHub sin necesidad de clonarlo.

## Overview

CodeWiki es una plataforma de Google que genera documentación automáticamente para repositorios públicos usando Gemini AI. Esta skill permite:

- Explorar repositorios destacados
- Obtener documentación estructurada en Markdown
- Extraer información de arquitectura y APIs
- Investigar dependencias antes de usarlas

## Architecture (Real Code Example)

```javascript
// ./codewiki.js
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

  async getRepoDocumentation(owner, repo) {
    const page = await this.browser.newPage();
    const url = `https://codewiki.google/github.com/${owner}/${repo}`;

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 3000));

    const data = await page.evaluate(() => {
      const title = document.querySelector('h1')?.textContent?.trim() || '';
      const toc = Array.from(document.querySelectorAll('h2, h3'))
        .map(h => ({ level: h.tagName, text: h.textContent.trim() }));
      const body = document.body.innerText;
      return { title, toc, body };
    });

    await page.close();
    return { owner, repo, url, ...data };
  }
}
```

**Key Patterns:**
- Class-based client con lifecycle: init → operation → close
- Puppeteer para browser automation
- Wait strategy: networkidle2 + hard delay
- page.evaluate() para extracción DOM

## CLI Router Pattern

```javascript
// ./codewiki.js - Command dispatching
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'featured') {
    const repos = await client.getFeaturedRepos();
    console.log(JSON.stringify(repos, null, 2));
  }
  else if (command === 'doc' && args[1]) {
    const [owner, repo] = args[1].split('/');
    const doc = await client.getRepoDocumentation(owner, repo);
    console.log(`# ${doc.title}\n`);
    console.log('## Table of Contents\n');
    doc.toc.forEach(h => console.log(`- ${h.text}`));
    console.log('\n## Documentation\n');
    console.log(doc.body.slice(0, 5000));
  }
}
```

## When to Use

**Usar cuando:**
- Necesitas entender un repositorio de GitHub rápidamente
- Quieres documentación estructurada de una librería
- Investigas una dependencia antes de instalarla
- Necesitas contexto sobre un proyecto open-source
- Quieres ver la arquitectura de un codebase sin clonarlo

**No usar cuando:**
- El repositorio es privado (CodeWiki solo funciona con repos públicos)
- Necesitas el código fuente completo (usar `git clone`)
- El repo no está indexado por CodeWiki

## Commands

| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `featured` | Lista repos destacados | `./codewiki featured` |
| `doc owner/repo` | Documentación en Markdown | `./codewiki doc facebook/react` |
| `repo owner/repo` | Datos completos en JSON | `./codewiki repo golang/go` |

## Installation

```bash
# Clone y setup
git clone https://github.com/zurybr/codewiki-cli.git .
npm install

# Ejecutar desde este directorio
./codewiki doc facebook/react
```

## Python Integration

```python
# ./codewiki.py
import subprocess

class CodeWikiClient:
    def _run(self, args: list) -> str:
        result = subprocess.run(
            ['./codewiki'] + args,
            capture_output=True, text=True
        )
        return result.stdout

    def get_repo_markdown(self, owner: str, repo: str) -> str:
        return self._run(['doc', f'{owner}/{repo}'])
```

## Common Use Cases

1. **Pre-dependency research**
   ```bash
   ./codewiki doc pydantic/pydantic
   ```

2. **Architecture analysis**
   ```bash
   ./codewiki doc facebook/react
   ```

3. **Quick API reference**
   ```bash
   ./codewiki doc anthropics/anthropic-sdk-python
   ```

## Limitations

- Solo repositorios públicos de GitHub
- Requiere Puppeteer (Node.js)
- Tiempo de respuesta: 30-60 segundos por request
- Depende de la estructura HTML de CodeWiki

## Repository

- **GitHub:** https://github.com/zurybr/codewiki-cli
- **Local:** `./` (este directorio)
