# CodeWiki Client

Herramienta para acceder a [CodeWiki de Google](https://codewiki.google/) desde la terminal. Compatible con [LettaBot](https://github.com/letta-ai/lettabot), Claude Code y otros agentes de IA.

## Qué es CodeWiki

CodeWiki es una plataforma de Google (lanzada noviembre 2025) que genera documentación automáticamente para repositorios públicos de GitHub usando Gemini AI.

## Instalación

```bash
# La herramienta ya está instalada en:
~/tools/codewiki/codewiki

# O agregar al PATH (requiere sudo):
sudo ln -sf ~/tools/codewiki/codewiki /usr/local/bin/codewiki
```

## Uso

### Listar repositorios destacados

```bash
~/tools/codewiki/codewiki featured
```

### Obtener documentación de un repositorio (JSON)

```bash
~/tools/codewiki/codewiki repo facebook/react
~/tools/codewiki/codewiki repo anthropics/anthropic-sdk-python
```

### Obtener documentación de un repositorio (Markdown)

```bash
~/tools/codewiki/codewiki doc modelcontextprotocol/python-sdk
```

## URL Format

Cualquier repositorio público de GitHub puede accederse en CodeWiki con el formato:

```
https://codewiki.google/github.com/[owner]/[repo]
```

Ejemplos:
- https://codewiki.google/github.com/facebook/react
- https://codewiki.google/github.com/anthropics/anthropic-sdk-python
- https://codewiki.google/github.com/modelcontextprotocol/python-sdk

## LettaBot Integration

This tool is a [LettaBot](https://github.com/letta-ai/lettabot)-compatible skill. To use it with LettaBot:

### Installation as a LettaBot Skill

```bash
# 1. Clone into your skills directory
cd ~/.skills   # or your LettaBot skills directory
git clone https://github.com/zurybr/codewiki-cli.git codewiki
cd codewiki
npm install

# Make the CLI executable (if needed)
chmod +x codewiki

# 2. Register the skill with LettaBot
lettabot skills
# Select "codewiki" from the list (space to toggle, enter to confirm)

# 3. Verify the skill is active
lettabot skills status
```

### Usage with LettaBot

Once installed, message your LettaBot and ask questions like:

- *"What does the facebook/react repository do?"*
- *"Show me the architecture of kubernetes/kubernetes"*
- *"Research pydantic/pydantic before I install it"*
- *"List featured repositories on CodeWiki"*

The agent will automatically invoke the codewiki tool to answer your questions.

### Example Prompts for LettaBot Agent Setup

When configuring a LettaBot agent to use this skill, you can instruct the agent:

```
Read the SKILL.md in the codewiki skill directory to understand when
and how to use the codewiki tool for GitHub repository research.
```

## Repositorios Destacados (Feb 2026)

| Repo | Stars | URL |
|------|-------|-----|
| facebook/react | 242.1k | [CodeWiki](https://codewiki.google/github.com/facebook/react) |
| flutter/flutter | 174.8k | [CodeWiki](https://codewiki.google/github.com/flutter/flutter) |
| golang/go | 132.1k | [CodeWiki](https://codewiki.google/github.com/golang/go) |
| kubernetes/kubernetes | 120.1k | [CodeWiki](https://codewiki.google/github.com/kubernetes/kubernetes) |
| google-gemini/gemini-cli | 92.7k | [CodeWiki](https://codewiki.google/github.com/google-gemini/gemini-cli) |
| modelcontextprotocol/python-sdk | 21.4k | [CodeWiki](https://codewiki.google/github.com/modelcontextprotocol/python-sdk) |

## Features de CodeWiki

- **Documentación automática**: Generada por Gemini AI
- **Siempre actualizada**: Se actualiza con cada PR mergeado
- **Diagramas**: Genera diagramas de arquitectura
- **Chat**: Permite chatear con el codebase
- **Links al código**: Saltar directamente al código fuente

## Notas Técnicas

- CodeWiki es una SPA (Single Page Application)
- No tiene API pública documentada
- Esta herramienta usa Puppeteer para extraer datos
- Los datos se generan dinámicamente con JavaScript
- Salida limpia: JSON/Markdown en stdout, errores en stderr (compatible con herramientas de agentes)

## Requisitos

- Node.js v18+
- Puppeteer (incluido en node_modules)
