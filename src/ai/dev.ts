'use server';
/**
 * @fileOverview Development-only utilities, including database seeding.
 * This file is executed by `genkit start` in development.
 */
import {config} from 'dotenv';
config();

import '@/ai/flows/llm-error-handling.ts';
