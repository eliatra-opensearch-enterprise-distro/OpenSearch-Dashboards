/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Any modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

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

import { getInstalledPackages } from '../../npm';
import { LICENSE_OVERRIDES } from '../../license_checker';

import { write, Task } from '../lib';
import { getNodeDownloadInfo } from './nodejs';
import { generateNoticeFromSource, generateBuildNoticeText } from '../../notice';

export const CreateNoticeFile: Task = {
  description: 'Generating NOTICE.txt file',

  async run(config, log, build) {
    log.info('Generating notice from source');
    log.indent(4);
    const noticeFromSource = await generateNoticeFromSource({
      productName: 'Eliatra OpenSearch Distro (https://eliatra.com/)',
      directory: build.resolvePath(),
      log,
    });
    log.indent(-4);

    log.info('Discovering installed packages');
    const packages = await getInstalledPackages({
      directory: build.resolvePath(),
      includeDev: false,
      licenseOverrides: LICENSE_OVERRIDES,
    });

    log.info('Generating build notice');

    const { extractDir: nodeDir, version: nodeVersion } = await getNodeDownloadInfo(
      config,
      config.hasSpecifiedPlatform()
        ? config.getPlatform(
            config.getTargetPlatforms()[0].getName(),
            config.getTargetPlatforms()[0].getArchitecture()
          )
        : config.getPlatform('linux', 'x64')
    );

    const notice = await generateBuildNoticeText({
      noticeFromSource,
      packages,
      nodeDir,
      nodeVersion,
    });

    log.info('Writing notice to NOTICE.txt');
    await write(build.resolvePath('NOTICE.txt'), notice);
  },
};
