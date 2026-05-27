# AI Model Routing Guide

This document outlines how to route tasks to appropriate models within the AI Tools Kit.

## Role-to-Model Mapping

| Role | Preferred Model |
| :--- | :--- |
| **Controller** | GPT-5.5 |
| **Reviewer** | GPT-5.5 |
| **Executor** | Gemini/Gemma |
| **Frontend** | Claude |
| **Repo Intelligence** | Serena |

## Configuration Setup

1. Copy the `.template` files in the `configs/` directory to your actual configuration paths (e.g., `~/.config/ai-tools-kit/`).
2. Rename the files, removing the `.template` suffix.
3. Replace all `*_PLACEHOLDER` values with your actual configuration (API keys, etc.).
4. Do not commit actual API keys to the repository.
