import * as React from 'react';
import { Link } from 'react-router-dom';
import styles from '../DigitalAssets.module.scss';

export default class NotFoundPage extends React.Component {
  public render(): React.ReactElement {
    return (
      <div className={styles.notFound}>
        <h1>Page not found</h1>
        <p>The page you’re looking for isn’t part of this workspace.</p>
        <Link className={styles.textLink} to="/">Return to overview</Link>
      </div>
    );
  }
}
