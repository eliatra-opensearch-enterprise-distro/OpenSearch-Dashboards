/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
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

/*
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

import React, { FunctionComponent, createElement } from 'react';

import { RenderingMetadata } from '../types';
import { Fonts } from './fonts';
import { Styles } from './styles';

interface Props {
  metadata: RenderingMetadata;
}

export const Template: FunctionComponent<Props> = ({
  metadata: {
    uiPublicUrl,
    locale,
    darkMode,
    injectedMetadata,
    i18n,
    bootstrapScriptUrl,
    strictCsp,
  },
}) => {
  const openSearchLogo = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <path
        d="M19.97,20v20c0,6.63,5.36,12,11.96,12h19.93v8h-19.93c-11.01,0-19.93-8.95-19.93-20v-20h7.97Z"
        style={{ fill: '#00796b', fillRule: 'evenodd', strokeWidth: 0 }}
      />
      <path
        d="M19.97,4v24h-7.97V4h7.97Z"
        style={{ fill: '#00796b', fillRule: 'evenodd', strokeWidth: 0 }}
      />
      <path
        d="M27.95,4h3.98c11.01,0,19.93,8.95,19.93,20v12H12v-8s31.9,0,31.9,0v-4c0-6.63-5.36-12-11.96-12h-3.98v-8Z"
        style={{ fill: '#00796b', fillRule: 'evenodd', strokeWidth: 0 }}
      />
    </svg>
  );
  const openSearchLogoSpinner = (
    <svg viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M53.8,42.4v-7.5c0-6.9-5.5-12.4-12.4-12.4h-2.5v5h2.5c4.1,0,7.4,3.3,7.4,7.5v2.5H34l0,0v-5v-9.9h-5v9.9v5l0,0v5v2.4c0,6.9,5.5,12.4,12.4,12.4h12.4v-5H41.4c-4.1,0-7.4-3.3-7.4-7.5v-2.5L53.8,42.4L53.8,42.4z"
        style={{ fill: '#00796b', fillRule: 'evenodd', strokeWidth: 0 }}
      />
      <g>
        <path
          d="M75.7374 37.5C74.4878 37.5 73.4748 38.513 73.4748 39.7626C73.4748 58.3813 58.3813 73.4748 39.7626 73.4748C38.513 73.4748 37.5 74.4878 37.5 75.7374C37.5 76.987 38.513 78 39.7626 78C60.8805 78 78 60.8805 78 39.7626C78 38.513 76.987 37.5 75.7374 37.5Z"
          fill="#00796b"
        />
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 40 40"
          to="359.9 40 40"
          dur="1.5s"
          repeatCount="indefinite"
          values="0 40 40; 15 40 40; 340 40 40; 359.9 40 40"
          keyTimes="0; .3; .7; 1"
        />
      </g>
    </svg>
  );

  const loadingLogoDefault = injectedMetadata.branding.loadingLogo?.defaultUrl;
  const loadingLogoDarkMode = injectedMetadata.branding.loadingLogo?.darkModeUrl;
  const markDefault = injectedMetadata.branding.mark?.defaultUrl;
  const markDarkMode = injectedMetadata.branding.mark?.darkModeUrl;
  const favicon = injectedMetadata.branding.faviconUrl;
  const applicationTitle = injectedMetadata.branding.applicationTitle;

  /**
   * Use branding configurations to check which URL to use for rendering
   * loading logo in default mode. In default mode, loading logo will
   * proritize default loading logo URL, and then default mark URL.
   * If both are invalid, default opensearch logo and spinner will be rendered.
   *
   * @returns a valid custom URL or undefined if no valid URL is provided
   */
  const customLoadingLogoDefaultMode = () => {
    return loadingLogoDefault ?? markDefault ?? undefined;
  };

  /**
   * Use branding configurations to check which URL to use for rendering
   * loading logo in default mode. In dark mode, loading logo will proritize
   * loading logo URLs, then mark logo URLs.
   * Within each type, the dark mode URL will be proritized if provided.
   *
   * @returns a valid custom URL or undefined if no valid URL is provided
   */
  const customLoadingLogoDarkMode = () => {
    return loadingLogoDarkMode ?? loadingLogoDefault ?? markDarkMode ?? markDefault ?? undefined;
  };

  /**
   * Render custom loading logo for both default mode and dark mode
   *
   * @returns a valid custom loading logo URL, or undefined
   */
  const customLoadingLogo = () => {
    return darkMode ? customLoadingLogoDarkMode() : customLoadingLogoDefaultMode();
  };

  /**
   * Check if a horizontal loading is needed to be rendered.
   * Loading bar will be rendered only when a default mode mark URL or
   * dark mode mark URL is rendered as the loading logo. We add the
   * horizontal loading bar on the bottom of the static mark logo to have
   * some loading effect for the loading page.
   *
   * @returns a loading bar component or no loading bar component
   */
  const renderBrandingEnabledOrDisabledLoadingBar = () => {
    if (customLoadingLogo() && !loadingLogoDefault) {
      return <div className="osdProgress" />;
    }
  };

  /**
   * Check if we render a custom loading logo or the default opensearch spinner.
   * If customLoadingLogo() returns undefined(no valid custom URL is found), we
   * render the default opensearch logo spinenr
   *
   * @returns a image component with custom logo URL, or the default opensearch logo spinner
   */
  const renderBrandingEnabledOrDisabledLoadingLogo = () => {
    if (customLoadingLogo()) {
      return (
        <div className="loadingLogoContainer">
          <img className="loadingLogo" src={customLoadingLogo()} alt={applicationTitle + ' logo'} />
        </div>
      );
    }
    return openSearchLogoSpinner;
  };

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="viewport" content="width=device-width" />
        <title>{applicationTitle}</title>
        <Fonts url={uiPublicUrl} />
        {/**
         * Favicons (generated from https://realfavicongenerator.net/)
         *
         * For user customized favicon using yml file:
         * If user inputs a valid URL, we gurantee basic favicon customization, such as
         * browser favicon(Chrome, Firefox, Safari, and Edge), apple touch icon, safari
         * pinned icon. (For Safari browser favicon, we recommend input a png image URL,
         * svg image URL might not work)
         *
         * we do not guarantee other advanced favicon customization such as
         * windows tile icon, Andriod device favicon etc. However, the opensearch favicon
         * will not be shown at those places and the default browser/device icon will be shown instead.
         *
         * If user inputs a invalid URL, original opensearch favicon will be used.
         */}

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={favicon ?? `${uiPublicUrl}/favicons/apple-touch-icon.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={favicon ?? `${uiPublicUrl}/favicons/favicon-32x32.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={favicon ?? `${uiPublicUrl}/favicons/favicon-16x16.png`}
        />

        <link rel="manifest" href={favicon ? `` : `${uiPublicUrl}/favicons/manifest.json`} />

        <link
          rel="mask-icon"
          color="#e8488b"
          href={favicon ?? `${uiPublicUrl}/favicons/safari-pinned-tab.svg`}
        />
        <link rel="shortcut icon" href={favicon ?? `${uiPublicUrl}/favicons/favicon.ico`} />

        <meta
          name="msapplication-config"
          content={favicon ? `` : `${uiPublicUrl}/favicons/browserconfig.xml`}
        />

        <meta name="theme-color" content="#ffffff" />
        <Styles darkMode={darkMode} />

        {/* Inject stylesheets into the <head> before scripts so that KP plugins with bundled styles will override them */}
        <meta name="add-styles-here" />
        <meta name="add-scripts-here" />
      </head>
      <body>
        {createElement('osd-csp', {
          data: JSON.stringify({ strictCsp }),
        })}
        {createElement('osd-injected-metadata', { data: JSON.stringify(injectedMetadata) })}
        <div
          className="osdWelcomeView"
          id="osd_loading_message"
          style={{ display: 'none' }}
          data-test-subj="osdLoadingMessage"
        >
          <div className="osdLoaderWrap" data-test-subj="loadingLogo">
            {renderBrandingEnabledOrDisabledLoadingLogo()}
            <div
              className="osdWelcomeText"
              data-error-message={i18n('core.ui.welcomeErrorMessage', {
                defaultMessage: `${injectedMetadata.branding.applicationTitle} did not load properly. Check the server output for more information.`,
              })}
            >
              {i18n('core.ui.welcomeMessage', {
                defaultMessage: `Loading ${injectedMetadata.branding.applicationTitle}`,
              })}
            </div>
            {renderBrandingEnabledOrDisabledLoadingBar()}
          </div>
        </div>

        <div className="osdWelcomeView" id="osd_legacy_browser_error" style={{ display: 'none' }}>
          {openSearchLogo}

          <h2 className="osdWelcomeTitle">
            {i18n('core.ui.legacyBrowserTitle', {
              defaultMessage: 'Please upgrade your browser',
            })}
          </h2>
          <div className="osdWelcomeText">
            {i18n('core.ui.legacyBrowserMessage', {
              defaultMessage:
                'This OpenSearch installation has strict security requirements enabled that your current browser does not meet.',
            })}
          </div>
        </div>

        <script>
          {`
            // Since this is an unsafe inline script, this code will not run
            // in browsers that support content security policy(CSP). This is
            // intentional as we check for the existence of __osdCspNotEnforced__ in
            // bootstrap.
            window.__osdCspNotEnforced__ = true;
          `}
        </script>
        <script src={bootstrapScriptUrl} />
      </body>
    </html>
  );
};
