/// <reference lib="es2018.asynciterable" />

import * as React from 'react';
import { spfi } from '@pnp/sp';
import { SPFx } from '@pnp/sp/behaviors/spfx';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import * as strings from 'DigitalAssetsWebPartStrings';
import styles from '../../DigitalAssets.module.scss';
import type { IAssetSectionProps, IDashboardAsset } from '../../IDigitalAssetsProps';
import type { UserRole } from '../../roleGroups';

type AssetTab = 'New Uploads' | 'In Review' | 'In Collection' | 'Out of Collection';

const ASSET_TABS: AssetTab[] = [
  'New Uploads',
  'In Review',
  'In Collection',
  'Out of Collection'
];

interface IAssetListItem {
  Id: number;
  Title: string;
  Created: string;
  AssetStatus: string;
  IsInCollection: boolean;
}

interface IAssetSectionState {
  activeTab: AssetTab;
  assets: IDashboardAsset[];
  search: string;
  status: string;
  uploadedFrom: string;
  uploadedTo: string;
  filtersVisible: boolean;
  isLoading: boolean;
  error?: string;
}

function getTabsForRole(userRole: UserRole): AssetTab[] {
  return userRole === 'assetCoordinator' || userRole === 'administrator'
    ? ASSET_TABS
    : ASSET_TABS.slice(1);
}

function getInitialTab(userRole: UserRole): AssetTab {
  return getTabsForRole(userRole)[0];
}

function getLocalizedStatus(status: string): string {
  switch (status) {
    case 'New':
      return strings.NewAssetStatus;
    case 'In Review':
      return strings.InReviewAssetStatus;
    case 'Completed':
      return strings.CompletedAssetStatus;
    default:
      return status;
  }
}

export default class AssetSection extends React.Component<IAssetSectionProps, IAssetSectionState> {
  private _loadSequence: number = 0;

  public state: IAssetSectionState = {
    activeTab: getInitialTab(this.props.userRole),
    assets: [],
    search: '',
    status: '',
    uploadedFrom: '',
    uploadedTo: '',
    filtersVisible: false,
    isLoading: true
  };

  public componentDidMount(): void {
    this._loadAssets(this.state.activeTab);
  }

  public componentDidUpdate(previousProps: IAssetSectionProps): void {
    if (previousProps.userRole !== this.props.userRole) {
      const activeTab = getInitialTab(this.props.userRole);
      this.setState({ activeTab }, () => this._loadAssets(activeTab));
    }
  }

  public componentWillUnmount(): void {
    this._loadSequence += 1;
  }

  private _selectTab = (activeTab: AssetTab): void => {
    this.setState({ activeTab }, () => this._loadAssets(activeTab));
  };

  private _toggleFilters = (): void =>
    this.setState(state => ({ filtersVisible: !state.filtersVisible }));

  private _handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void =>
    this.setState({ search: event.currentTarget.value });

  private _handleStatus = (event: React.ChangeEvent<HTMLSelectElement>): void =>
    this.setState({ status: event.currentTarget.value });

  private _handleUploadedFrom = (event: React.ChangeEvent<HTMLInputElement>): void =>
    this.setState({ uploadedFrom: event.currentTarget.value });

  private _handleUploadedTo = (event: React.ChangeEvent<HTMLInputElement>): void =>
    this.setState({ uploadedTo: event.currentTarget.value });

  private _clearFilters = (): void =>
    this.setState({ status: '', uploadedFrom: '', uploadedTo: '' });

  private _loadAssets = (activeTab: AssetTab): void => {
    const requestId = ++this._loadSequence;
    this.setState({ isLoading: true, error: undefined });
    this._fetchAssets(activeTab, requestId).catch((error: unknown) => {
      if (requestId !== this._loadSequence) {
        return;
      }
      const detail = error instanceof Error ? error.message : strings.UnexpectedError;
      this.setState({
        isLoading: false,
        error: `${strings.AssetsLoadError} ${detail}`
      });
    });
  };

  private _fetchAssets = async (activeTab: AssetTab, requestId: number): Promise<void> => {
    let tabFilter: string;
    switch (activeTab) {
      case 'New Uploads':
        tabFilter = "AssetStatus eq 'New'";
        break;
      case 'In Review':
        tabFilter = "AssetStatus eq 'In Review'";
        break;
      case 'In Collection':
        tabFilter = "IsInCollection eq true and AssetStatus eq 'Completed'";
        break;
      case 'Out of Collection':
        tabFilter = "IsInCollection eq false and AssetStatus eq 'Completed'";
        break;
    }

    const sp = spfi().using(SPFx(this.props.context));
    const query = sp.web.lists.getByTitle('Assets').items
      .select('Id', 'Title', 'Created', 'AssetStatus', 'IsInCollection')
      .filter(`IsActive eq true and ${tabFilter}`);
    const items: IAssetListItem[] = [];
    const pages = query[Symbol.asyncIterator]();
    let page = await pages.next();
    while (!page.done) {
      items.push(...page.value as IAssetListItem[]);
      page = await pages.next();
    }

    if (requestId !== this._loadSequence) {
      return;
    }

    this.setState({
      assets: items.map(item => ({
        id: String(item.Id),
        title: item.Title,
        uploaded: new Date(item.Created).toISOString().slice(0, 10),
        status: item.AssetStatus,
        isInCollection: item.IsInCollection
      })),
      isLoading: false
    });
  };

  public render(): React.ReactElement {
    const { props } = this;
    const {
      activeTab,
      assets,
      search,
      status,
      uploadedFrom,
      uploadedTo,
      filtersVisible,
      isLoading,
      error
    } = this.state;
    const tabs = getTabsForRole(props.userRole);
    const filteredAssets = assets.filter(asset => {
      const query = search.trim().toLowerCase();
      const matchesSearch = !query ||
        `${asset.title} ${asset.status}`.toLowerCase().indexOf(query) !== -1;
      const matchesStatus = !status || asset.status === status;
      const matchesUploadedFrom = !uploadedFrom || asset.uploaded >= uploadedFrom;
      const matchesUploadedTo = !uploadedTo || asset.uploaded <= uploadedTo;
      return matchesSearch && matchesStatus && matchesUploadedFrom && matchesUploadedTo;
    });
    const activeFilters = Number(Boolean(status)) + Number(Boolean(uploadedFrom || uploadedTo));

    return (
      <section className={`${styles.dashboardCard} ${styles.assetSection}`} aria-label={props.title}>
        <div className={styles.dashboardSectionHeader}>
          <div>
            <h2>{props.title}</h2>
            <p>{props.subtitle}</p>
          </div>
          <label className={styles.dashboardSearchLabel}>
            <span className={styles.visuallyHidden}>{strings.SearchAssetsLabel}</span>
            <input
              className={styles.dashboardSearch}
              type="search"
              placeholder={strings.SearchAssetsPlaceholder}
              value={search}
              onChange={this._handleSearch}
            />
          </label>
        </div>

        <div className={styles.assetToolbar}>
          <div className={styles.dashboardTabs} role="tablist" aria-label={strings.AssetViewsLabel}>
            {tabs.map(tab => (
              <button
                className={`${styles.dashboardTab} ${activeTab === tab ? styles.activeDashboardTab : ''}`}
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => this._selectTab(tab)}
              >
                {tab === 'New Uploads' ? strings.NewUploadsStage :
                  tab === 'In Review' ? strings.InReviewStage :
                    tab === 'In Collection' ? strings.InCollectionStage : strings.OutOfCollectionStage}
              </button>
            ))}
          </div>
          <button
            className={styles.filterToggle}
            type="button"
            aria-expanded={filtersVisible}
            onClick={this._toggleFilters}
          >
            {strings.FiltersLabel}{activeFilters > 0 ? ` (${activeFilters})` : ''}
          </button>
        </div>

        {filtersVisible && (
          <div className={styles.filterPanel}>
            <label>
              {strings.StatusFilterLabel}
              <select value={status} onChange={this._handleStatus}>
                <option value="">{strings.AllStatusesOption}</option>
                <option value="New">{strings.NewAssetStatus}</option>
                <option value="In Review">{strings.InReviewAssetStatus}</option>
                <option value="Completed">{strings.CompletedAssetStatus}</option>
              </select>
            </label>
            <label>
              {strings.UploadedFromLabel}
              <input type="date" value={uploadedFrom} onChange={this._handleUploadedFrom} />
            </label>
            <label>
              {strings.UploadedToLabel}
              <input type="date" value={uploadedTo} onChange={this._handleUploadedTo} />
            </label>
            <button className={styles.clearFilters} type="button" onClick={this._clearFilters}>
              {strings.ClearFiltersLabel}
            </button>
          </div>
        )}

        <div className={styles.dashboardList}>
          {filteredAssets.map(asset => (
            <article className={styles.dashboardListRow} key={asset.id}>
              <span className={styles.dashboardAssetIcon} aria-hidden="true">{strings.AssetFileType}</span>
              <div className={styles.dashboardRowMain}>
                <strong>{asset.title}</strong>
                <span>{strings.UploadedLabel} {new Date(asset.uploaded).toLocaleDateString()}</span>
              </div>
              <span className={styles.statusBadge}>{getLocalizedStatus(asset.status)}</span>
              {asset.status === 'Completed' && (
                <span className={styles.collectionStatus}>
                  {asset.isInCollection
                    ? strings.InCollectionStage
                    : strings.OutOfCollectionStage}
                </span>
              )}
            </article>
          ))}
          {!isLoading && !error && filteredAssets.length === 0 && (
            <p className={styles.emptyDashboard}>{strings.NoAssetsMatch}</p>
          )}
          {isLoading && <p className={styles.emptyDashboard} role="status">{strings.LoadingAssets}</p>}
          {error && <p className={styles.roleAlert} role="alert">{error}</p>}
        </div>
      </section>
    );
  }
}
