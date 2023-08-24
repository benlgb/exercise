import React, { useState } from 'react';
import TableSorter from './sorter';
import style from './table.module.css';
import { SortType } from './constant';

interface Item {
    name: string;
    chinese: number;
    math: number;
    english: number;
}

const enum Column {
    CHINESE = 'chinese',
    MATH = 'math',
    ENGLISH = 'english',
}

const COLUMNS = [Column.CHINESE, Column.MATH, Column.ENGLISH];

const COLUMN_LANGUAGE = {
    [Column.CHINESE]: 'Chinese',
    [Column.MATH]: 'Math',
    [Column.ENGLISH]: 'English',
};

function AppTable({ data }: { data: Item[] }) {
    const [sortTypes, updateSort] = useState(
        COLUMNS.map(() => SortType.DEFAULT)
    );

    // 排序数组
    const sortedData = data.sort((item, another) => {
        for (let i = 0; i < COLUMNS.length; i++) {
            const key = COLUMNS[i];

            if (item[key] === another[key]) {
                continue;
            }

            if (sortTypes[i] === SortType.INCREASE) {
                return item[key] - another[key];
            } else if (sortTypes[i] == SortType.DECREASE) {
                return another[key] - item[key];
            }
        }

        return 0;
    });

    // 更新排序类型
    const updateSortTypes = (index: number, type: SortType) => {
        sortTypes[index] = type;
        updateSort([...sortTypes]);
    };

    return (
        <table className={style.table}>
            <thead>
                <tr>
                    <th>Name</th>
                    {COLUMNS.map((column, index) => (
                        <th key={column}>
                            {COLUMN_LANGUAGE[column]}
                            <TableSorter
                                sort={sortTypes[index]}
                                onSort={type => updateSortTypes(index, type)}
                            />
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {sortedData.map(item => (
                    <tr key={item.name}>
                        <td>{item.name}</td>
                        {COLUMNS.map(column => (
                            <td key={column}>{item[column]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default AppTable;
