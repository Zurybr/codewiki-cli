#!/usr/bin/env python3
"""
CodeWiki Python Client - Wrapper para la herramienta codewiki.js
Permite acceder a CodeWiki desde Python de forma sencilla.
"""

import subprocess
import json
from pathlib import Path
from typing import Optional, List, Dict, Any

CODEWIKI_PATH = Path.home() / "tools" / "codewiki" / "codewiki"


class CodeWikiClient:
    """Cliente para acceder a CodeWiki de Google."""

    def __init__(self, codewiki_path: Optional[str] = None):
        self.codewiki_path = Path(codewiki_path) if codewiki_path else CODEWIKI_PATH

    def _run(self, *args) -> str:
        """Ejecuta el comando codewiki."""
        cmd = [str(self.codewiki_path)] + list(args)
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        if result.returncode != 0:
            raise RuntimeError(f"CodeWiki error: {result.stderr}")
        return result.stdout

    def get_featured_repos(self) -> List[Dict[str, Any]]:
        """Obtiene la lista de repositorios destacados."""
        output = self._run("featured")
        return json.loads(output)

    def get_repo_docs(self, owner: str, repo: str) -> Dict[str, Any]:
        """Obtiene la documentación completa de un repositorio (JSON)."""
        output = self._run("repo", f"{owner}/{repo}")
        return json.loads(output)

    def get_repo_markdown(self, owner: str, repo: str) -> str:
        """Obtiene la documentación de un repositorio en formato Markdown."""
        return self._run("doc", f"{owner}/{repo}")

    def get_url(self, owner: str, repo: str) -> str:
        """Genera la URL de CodeWiki para un repositorio."""
        return f"https://codewiki.google/github.com/{owner}/{repo}"


def main():
    """CLI para probar el cliente."""
    import sys

    client = CodeWikiClient()

    if len(sys.argv) < 2:
        print("Uso: python codewiki.py [featured|repo|doc] [owner/repo]")
        print("\nEjemplos:")
        print("  python codewiki.py featured")
        print("  python codewiki.py repo facebook/react")
        print("  python codewiki.py doc anthropics/anthropic-sdk-python")
        sys.exit(1)

    command = sys.argv[1]

    if command == "featured":
        repos = client.get_featured_repos()
        print(json.dumps(repos, indent=2))

    elif command in ("repo", "doc") and len(sys.argv) >= 3:
        owner, repo = sys.argv[2].split("/")

        if command == "repo":
            docs = client.get_repo_docs(owner, repo)
            print(json.dumps(docs, indent=2))
        else:
            md = client.get_repo_markdown(owner, repo)
            print(md)

    else:
        print("Comando no reconocido. Usa: featured, repo, doc")
        sys.exit(1)


if __name__ == "__main__":
    main()
