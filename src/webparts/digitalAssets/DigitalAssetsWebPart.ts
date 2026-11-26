import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { SPHttpClient } from '@microsoft/sp-http';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'DigitalAssetsWebPartStrings';
import DigitalAssets from './components/DigitalAssets';
import type { IDigitalAssetsProps, IDigitalAssetsWebPartProps } from './components/IDigitalAssetsProps';
import { resolveUserRole } from './components/roleGroups';

export default class DigitalAssetsWebPart extends BaseClientSideWebPart<IDigitalAssetsWebPartProps> {

  private _environmentMessage: string = '';
  private _role?: IDigitalAssetsProps['role'];
  private _roleError?: string;

  public render(): void {
    const element: React.ReactElement<IDigitalAssetsProps> = React.createElement(
      DigitalAssets,
      {
        context: this.context,
        description: this.properties.description,
        environmentMessage: this._environmentMessage,
        userDisplayName: this.context.pageContext.user.displayName,
        role: this._role,
        roleError: this._roleError
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return Promise.all([this._getEnvironmentMessage(), this._loadCurrentUserRole()])
      .then(([message]) => {
        this._environmentMessage = message;
      });
  }

  private _loadCurrentUserRole(): Promise<void> {
    const webUrl = this.context.pageContext.web.absoluteUrl;
    const headers = { Accept: 'application/json;odata=nometadata' };
    const currentUserGroupsUrl = `${webUrl}/_api/web/currentuser/groups?$select=Title`;
    const defaultReadersGroupUrl = `${webUrl}/_api/web?$select=AssociatedVisitorGroup/Title&$expand=AssociatedVisitorGroup`;

    return Promise.all([
      this.context.spHttpClient.get(
        currentUserGroupsUrl,
        SPHttpClient.configurations.v1,
        { headers }
      ),
      this.context.spHttpClient.get(
        defaultReadersGroupUrl,
        SPHttpClient.configurations.v1,
        { headers }
      )
    ]).then(([groupsResponse, webResponse]) => {
      if (!groupsResponse.ok) {
        throw new Error(`Could not load current-user SharePoint groups (${groupsResponse.status}).`);
      }
      if (!webResponse.ok) {
        throw new Error(`Could not load the site's default Readers group (${webResponse.status}).`);
      }

      return Promise.all([
        groupsResponse.json() as Promise<{ value: Array<{ Title: string }> }>,
        webResponse.json() as Promise<{ AssociatedVisitorGroup?: { Title: string } }>
      ]);
    }).then(([groups, web]) => {
      this._role = resolveUserRole(
        groups.value.map(group => group.Title),
        web.AssociatedVisitorGroup && web.AssociatedVisitorGroup.Title
      );
    }).catch((error: unknown) => {
      const detail = error instanceof Error ? error.message : 'An unexpected error occurred.';
      this._roleError = `Unable to determine your Digital Assets role. ${detail}`;
    });
  }

  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
            case 'TeamsModern':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
