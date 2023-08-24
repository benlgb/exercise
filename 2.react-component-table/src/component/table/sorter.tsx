import React, { useState } from 'react';
import style from './sorter.module.css';
import { SortType } from './constant';

// 下一个排序方式
const NEXT_SORT_TYPE = {
    [SortType.DEFAULT]: SortType.INCREASE,
    [SortType.INCREASE]: SortType.DECREASE,
    [SortType.DECREASE]: SortType.DEFAULT,
};

interface SorterProps {
    // 排序方式
    sort?: SortType;

    // 更新排序
    onSort?(sort: SortType): void;
}

/**
 * 排序器（图标）
 */
function TableSorter(props: SorterProps) {
    let className = style.sorter;
    const sort = props.sort === undefined ? SortType.DEFAULT : props.sort;

    if (sort === SortType.INCREASE) {
        className += ' ' + style.increase;
    } else if (sort === SortType.DECREASE) {
        className += ' ' + style.decrease;
    }

    const clickHandler = () => {
        props.onSort && props.onSort(NEXT_SORT_TYPE[sort]);
    };

    return <div className={className} onClick={clickHandler}></div>;
}

export default TableSorter;
