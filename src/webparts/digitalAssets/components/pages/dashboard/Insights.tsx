import * as React from 'react';
import { spfi } from '@pnp/sp';
import { SPFx } from '@pnp/sp/behaviors/spfx';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import * as strings from 'DigitalAssetsWebPartStrings';
import styles from '../../DigitalAssets.module.scss';
import type { IInsightsProps, IPipelineStage } from '../../IDigitalAssetsProps';
import PipelineCard from './PipelineCard';

interface IInsightsListItem {
  Id: number;
  PipelineType: string;
  TotalAssets?: number;
  NewUploads?: number;
  InReview?: number;
  InCollection?: number;
  OutOfCollection?: number;
}

interface IInsightsState {
  assetStages: IPipelineStage[];
  collectionStages: IPipelineStage[];
  isLoading: boolean;
  error?: string;
}

const INITIAL_ASSET_STAGES: IPipelineStage[] = [
  { name: strings.TotalStage, count: '—', fillClass: styles.pipelineTotal },
  { name: strings.NewUploadsStage, count: '—', fillClass: styles.pipelineUploads },
  { name: strings.InReviewStage, count: '—', fillClass: styles.pipelineReview }
];

const INITIAL_COLLECTION_STAGES: IPipelineStage[] = [
  { name: strings.InCollectionStage, count: '—', fillClass: styles.pipelineInCollection },
  { name: strings.OutOfCollectionStage, count: '—', fillClass: styles.pipelineOutCollection }
];

export default class Insights extends React.Component<IInsightsProps, IInsightsState> {
  public state: IInsightsState = {
    assetStages: INITIAL_ASSET_STAGES,
    collectionStages: INITIAL_COLLECTION_STAGES,
    isLoading: true
  };

  public componentDidMount(): void {
    this._loadInsights().catch(this._handleLoadError);
  }

  private _handleLoadError = (error: unknown): void => {
    const detail = error instanceof Error ? error.message : strings.UnexpectedError;
    this.setState({
      isLoading: false,
      error: `${strings.InsightsLoadError} ${detail}`
    });
  };

  private async _loadInsights(): Promise<void> {
    try {
      const sp = spfi().using(SPFx(this.props.context));
      const query = sp.web.lists.getByTitle('Insights').items.select(
        'Id',
        'PipelineType',
        'TotalAssets',
        'NewUploads',
        'InReview',
        'InCollection',
        'OutOfCollection'
      );

      const items = await query() as IInsightsListItem[];
      const assetPipelines = items.filter(item => item.PipelineType === 'Assets');
      const collectionPipelines = items.filter(item => item.PipelineType === 'Collections');
      const assetPipeline = assetPipelines?.length > 0 ? assetPipelines[0] : undefined;
      const collectionPipeline = collectionPipelines?.length > 0 ? collectionPipelines[0] : undefined;

      this.setState({
        assetStages: [
          { name: strings.TotalStage, count: assetPipeline?.TotalAssets ?? 0, fillClass: styles.pipelineTotal },
          { name: strings.NewUploadsStage, count: assetPipeline?.NewUploads ?? 0, fillClass: styles.pipelineUploads },
          { name: strings.InReviewStage, count: assetPipeline?.InReview ?? 0, fillClass: styles.pipelineReview }
        ],
        collectionStages: [
          { name: strings.InCollectionStage, count: collectionPipeline?.InCollection ?? 0, fillClass: styles.pipelineInCollection },
          { name: strings.OutOfCollectionStage, count: collectionPipeline?.OutOfCollection ?? 0, fillClass: styles.pipelineOutCollection }
        ],
        isLoading: false
      });
    } catch (error: unknown) {
      this._handleLoadError(error);
    }
  }

  public render(): React.ReactElement {
    const { assetStages, collectionStages, isLoading, error } = this.state;
    return (
      <section className={styles.insightsGrid} aria-label={strings.InsightsAriaLabel}>
        <PipelineCard
          title={strings.AssetPipelineTitle}
          subtitle={strings.AssetPipelineSubtitle}
          stages={assetStages}
        />
        <PipelineCard
          title={strings.CollectionsPipelineTitle}
          subtitle={strings.CollectionsPipelineSubtitle}
          stages={collectionStages}
        />
        {isLoading && <p className={styles.emptyDashboard} role="status">{strings.LoadingInsights}</p>}
        {error && <p className={styles.roleAlert} role="alert">{error}</p>}
      </section>
    );
  }
}
