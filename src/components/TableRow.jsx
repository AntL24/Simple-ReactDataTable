import React from 'react';

export const TableRow = ({ item, columns, onRowClick, visibleColumns }) => {
    return (
        <tr onClick={() => onRowClick(item)}>
            {columns.filter(col => visibleColumns.has(col.key)).map((column) => (
                <td key={column.key}>{item[column.key]}</td>
            ))}
        </tr>
    );
};
