import React from 'react';
import styles from './NotFounBlock.module.scss';
console.log(styles);

export const NotFoundBlock = () => {
  return (
    <div className={styles.root}>
      <h1>
        Ничего не найдено <span>😕</span>
      </h1>
      <p>К сожалени данная страница отсутствует в нашем интернет-магазине</p>
    </div>
  );
};
