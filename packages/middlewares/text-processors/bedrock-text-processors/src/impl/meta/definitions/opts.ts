/*
 * Copyright (C) 2023 Amazon.com, Inc. or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as dsl from '@project-lakechain/core/dsl';
import { z } from 'zod';
import { LlamaModel } from './model';
import { TextProcessorPropsSchema } from '../../shared/opts';

/**
 * Properties which can be passed to the text model.
 */
export const ModelParametersSchema = z.object({

  /**
   * Large language models use probability to construct the words in a sequence.
   * For any given sequence, there is a probability distribution of options for
   * the next word in the sequence.
   * When you set the temperature closer to zero, the model tends to select the
   * higher-probability words.
   * When you set the temperature further away from zero,
   * the model may select a lower-probability word.
   */
  temperature: z
    .number()
    .min(0)
    .max(1)
    .optional(),

  /**
  * Top P defines a cut off based on the sum of probabilities of the potential choices.
  * If you set Top P below 1.0, the model considers the most probable options and
  * ignores less probable ones.
  * Top P is similar to Top K, but instead of capping the number of choices,
  * it caps choices based on the sum of their probabilities.
  */
  top_p: z
    .number()
    .min(0)
    .max(1)
    .optional(),

  /**
   * Specify the maximum number of tokens to use in the generated response.
   * The model truncates the response once the generated text exceeds `max_gen_len`.
   */
  max_gen_len: z
    .number()
    .min(1)
    .max(2048)
    .optional()

}).passthrough();

// Export the `ModelParameters` type.
export type ModelParameters = z.infer<typeof ModelParametersSchema>;

/**
 * Llama text processor properties schema.
 */
export const LlamaTextProcessorPropsSchema = TextProcessorPropsSchema.extend({

  /**
   * The text model to use.
   */
  model: z.instanceof(LlamaModel),

  /**
   * The parameters to pass to the text model.
   * @default {}
   */
  modelParameters: ModelParametersSchema
    .default({}),

  /**
   * The system prompt to use for generating text.
   */
  systemPrompt: z
    .string()
    .optional(),

  /**
   * The prompt to use for generating text.
   */
  prompt: z.custom<dsl.IReference<
    dsl.IReferenceSubject
  >>()
});

// The type of the `LlamaTextProcessorProps` schema.
export type LlamaTextProcessorProps = z.infer<typeof LlamaTextProcessorPropsSchema>;
