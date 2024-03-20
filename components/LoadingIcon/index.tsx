import React, { ReactNode } from 'react';
import classNames from 'classnames';

import Loading from 'public/svg/loading_icon.svg';

import styles from './styles.module.scss';

type LoadingIconProps = {
  className?: string;
  src?: ReactNode | string | any;
};

const LoadingIcon = ({ src = Loading, className }: LoadingIconProps) => {
  return <img src={src} className={classNames(styles.image, className)} />;
};

export default LoadingIcon;
