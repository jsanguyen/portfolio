const input = '**Experience Level:**He has eight years of experience as a full-stack software engineer [Source 1, Source 2].***Architectural Responsibility:**His resume notes that he has "spearheaded the architecture and development" of backend services and has been responsible for "architecting highly available, cloud-native infrastructure" [Source 1, Source 2].***Subject Matter Expertise:**He has served as the "subject matter expert" for multiple microservices [Source 1, Source 2].*Strategic Oversight: He has engineered disaster recovery strategies, managed complex security models (IAM and RBAC), and architected automated CI/CD pipelines [Source 1, Source 2].';

const fixMarkdown = (text) => {
  let clean = text;

  // Fix spaces immediately inside bold/italic/strikethrough/code markers
  clean = clean.replace(/([*_~`]{1,3})\s+([^\n*_~`]+?)\s*\1/g, "$1$2$1");
  clean = clean.replace(/([*_~`]{1,3})([^\n*_~`]+?)\s+\1/g, "$1$2$1");

  // Fix squashed bold list items (e.g. "].***Architectural")
  // Add punctuation characters before it.
  clean = clean.replace(/([a-zA-Z0-9\]>.,!?])\s*\*\*\*(?=[a-zA-Z0-9])/g, "$1\n\n* **");
  
  // Fix squashed normal list items (e.g. "].*Strategic")
  clean = clean.replace(/([a-zA-Z0-9\]>.,!?])\s*\*(?=[a-zA-Z0-9])/g, "$1\n\n* ");

  // Fix squashed text after bold tags (e.g. "**Word:**He")
  // Target '**' that is followed by a letter/number, but preceded by punctuation.
  // We use lookbehind for punctuation/letters before the **, and lookahead for letter/number.
  clean = clean.replace(/(?<=[a-zA-Z0-9:.,?!])(\*\*|__)(?=[a-zA-Z0-9])/g, "$1 ");

  // Ensure double newlines for proper paragraph breaks around lists
  clean = clean.replace(/\n(\*|-|\d+\.)\s/g, "\n\n$1 ");

  return clean;
};

console.log(fixMarkdown(input));
