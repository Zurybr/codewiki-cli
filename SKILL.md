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
| `featured` | Lista repos destacados | `codewiki featured` |
| `doc owner/repo` | Documentación en Markdown | `codewiki doc facebook/react` |
| `repo owner/repo` | Datos completos en JSON | `codewiki repo golang/go` |

## Installation

```bash
# Verificar si está instalado
if [ ! -d "$HOME/tools/codewiki" ]; then
    git clone https://github.com/zurybr/codewiki-cli.git ~/tools/codewiki
    cd ~/tools/codewiki && npm install
fi
```

## Usage

### Python (Recomendado)

```python
# Agregar a PYTHONPATH si es necesario
import sys
sys.path.insert(0, os.path.expanduser("~/tools/codewiki"))

from codewiki import CodeWikiClient

client = CodeWikiClient()

# Listar repositorios destacados
repos = client.get_featured_repos()

# Obtener documentación de un repo
docs = client.get_repo_docs("facebook", "react")

# Obtener markdown
markdown = client.get_repo_markdown("modelcontextprotocol", "python-sdk")
```

### CLI Directo

```bash
~/tools/codewiki/codewiki featured
~/tools/codewiki/codewiki doc owner/repo
~/tools/codewiki/codewiki repo owner/repo
```

## Integration Pattern

```python
def research_repository(owner: str, repo: str) -> dict:
    """Investiga un repositorio usando CodeWiki."""
    import sys
    import os
    sys.path.insert(0, os.path.expanduser("~/tools/codewiki"))
    from codewiki import CodeWikiClient

    client = CodeWikiClient()

    # Obtener datos
    data = client.get_repo_docs(owner, repo)

    return {
        "title": data.get("title", ""),
        "toc": data.get("toc", []),
        "url": data.get("url", ""),
        "summary": data.get("body", "")[:2000]  # Primeros 2000 chars
    }
```

## Common Use Cases

1. **Pre-dependency research**
   ```python
   # Antes de instalar una librería, entender su API
   docs = client.get_repo_markdown("pydantic", "pydantic")
   ```

2. **Architecture analysis**
   ```python
   # Entender la estructura de un framework
   data = client.get_repo_docs("fastapi", "fastapi")
   toc = data["toc"]  # Table of contents
   ```

3. **Quick API reference**
   ```python
   # Ver ejemplos de uso
   markdown = client.get_repo_markdown("anthropics", "anthropic-sdk-python")
   ```

## Limitations

- Solo repositorios públicos de GitHub
- Requiere Puppeteer (Node.js)
- Tiempo de respuesta: 30-60 segundos por request
- Depende de la estructura HTML de CodeWiki (puede romperse)

## Repository

- **GitHub:** https://github.com/zurybr/codewiki-cli
- **Local:** `~/tools/codewiki/`
