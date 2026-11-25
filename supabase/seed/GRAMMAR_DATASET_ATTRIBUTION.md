# Attribution for the imported grammar exercise dataset

The grammar exercise catalog includes 27,514 English multiple-choice cloze records from:

- Repository: [ZanichelliEditore/english-grammar-multiple-choice-generation](https://github.com/ZanichelliEditore/english-grammar-multiple-choice-generation)
- File: `dataset/train_exercise_dataset.json`
- Pinned revision: [`374f402068cf15bf0e71c44410ba72f3a8c9c301`](https://github.com/ZanichelliEditore/english-grammar-multiple-choice-generation/commit/374f402068cf15bf0e71c44410ba72f3a8c9c301)
- Authors: Nicolò Donati, Matteo Periani, Paolo Di Natale, Giuseppe Savino, and Paolo Torroni
- Paper: [Generation and Evaluation of English Grammar Multiple-Choice Cloze Exercises](https://aclanthology.org/2024.clicit-1.39/)

The repository README describes the project as CC BY 4.0, while its `LICENSE` file at the pinned revision contains CC BY-NC-ND 4.0 terms. HustLingo conservatively treats the imported records under the more restrictive **CC BY-NC-ND 4.0** terms: use only in this non-commercial course demo, preserve the original exercise text unchanged, and do not translate, rewrite, or redistribute adapted versions. Review the source repository's license before any use outside this class demo.

The importer stores the original gap text, solution, distractors, completed sentence, and topic without rewriting them. It pins the Git commit and checks the downloaded file's SHA-256 before importing so a changed upstream file is not silently substituted.

This is a research exercise dataset, not an official CEFR syllabus or a guarantee that every item is error-free. It has no per-question CEFR labels; HustLingo does not invent levels for these records.
