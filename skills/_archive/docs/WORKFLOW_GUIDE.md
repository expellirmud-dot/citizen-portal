# Workflow Guide

The project utilizes a governed AI workflow:

1.  **Controller (GPT-5.5)**: Decomposes tasks, validates pre-conditions, and provides final sign-off.
2.  **Executor (Gemini/Gemma)**: Performs scoped implementation work, runs validations.
3.  **Reviewer (GPT-5.5)**: Verifies changes against constraints, authority, and safety rules.
