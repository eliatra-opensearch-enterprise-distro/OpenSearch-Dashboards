/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { TypeOf } from '@osd/config-schema';
import { CoreSetup, Plugin, PluginInitializerContext } from 'opensearch-dashboards/server';
import { registerRoutes } from './routes';
import { ConfigSchema, configSchema } from '../../config';

export class AutocompleteService implements Plugin<void> {
  private valueSuggestionsEnabled: boolean = true;

  constructor(private initializerContext: PluginInitializerContext<ConfigSchema>) {
    initializerContext.config.create<TypeOf<typeof configSchema>>().subscribe((configUpdate) => {
      this.valueSuggestionsEnabled = configUpdate.autocomplete.valueSuggestions.enabled;
    });
  }

  public setup(core: CoreSetup) {
    if (this.valueSuggestionsEnabled)
      registerRoutes(core, this.initializerContext.config.legacy.globalConfig$);
  }

  public start() { }
}
