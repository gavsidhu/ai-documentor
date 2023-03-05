export function removeCodeBlockWrappers(code: string) {
    if (code.startsWith("```") && code.endsWith("```")) {
        code = code.slice(3, -3).trim();
      }
      return code;
  }
  