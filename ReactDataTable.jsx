import React, { useCallback, useMemo, useReducer, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import './DataTableStyles.css';

//Debounce function to delay search so that it doesn't fire on every keystroke
function debounce(func, wait) {
    let timeout;

    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

//Component for each row in the table
function TableRow({ item, columns, onRowClick, visibleColumns }) {
    console.log('item: ', item);
    return (
        <tr onClick={() => onRowClick(item)}>
            {columns.filter(col => visibleColumns.has(col.key)).map((column) => (
                <td key={column.key}>{item[column.key]}</td>
            ))}
        </tr>
    );
}
const MemoizedTableRow = React.memo(TableRow);

//Main component ReactDataTable
//Uses useReducer hook to manage state
function ReactDataTable({
    data = [],
    columns = [],
    onRowClick = () => { },
    defaultEntriesPerPage = 10,
    sortColumnParam = 'name',
    headerHeight = 'auto',
    tableBodyHeight = 'auto',
    paginationHeight = 'auto',
    headerFontSize = '1rem',
    tableBodyFontSize = '1rem',
    paginationFontSize = '1rem',
    fontFamily = 'Arial',
}) {
    useEffect(() => {
        dispatch({ type: 'SET_FILTERED_DATA', payload: data });
    }, [data]);  // Dependency array includes `data` to run the effect when `data` changes


    console.log('data in npm component: ', data);

    const initialState = {
        searchTerm: '',
        filteredData: data,
        searchColumn: 'all',
        currentPage: 1,
        entriesPerPage: defaultEntriesPerPage,
        sortColumn: { key: sortColumnParam, direction: 'neutral' },
        visibleColumns: new Set(columns.map(col => col.key)),
    };

    function reducer(state, action) {
        switch (action.type) {
            case 'SET_SEARCH_TERM':
                return { ...state, searchTerm: action.payload };
            case 'SET_FILTERED_DATA':
                return { ...state, filteredData: action.payload };
            case 'SET_SEARCH_COLUMN':
                return { ...state, searchColumn: action.payload };
            case 'SET_CURRENT_PAGE':
                return { ...state, currentPage: action.payload };
            case 'SET_ENTRIES_PER_PAGE':
                return { ...state, entriesPerPage: action.payload };
            case 'SET_SORT_COLUMN':
                return { ...state, sortColumn: action.payload };
            case 'SET_VISIBLE_COLUMNS':
                return { ...state, visibleColumns: action.payload };
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState);

    const search = useCallback((name, items) => {
        if (!Array.isArray(items)) {
            console.error('Expected an array for items');
            return [];
        }

        const results = new Set();
        const searchTerms = name.toLowerCase().split(/\s+/);

        items.forEach(item => {
            let concatenatedData = '';
            columns.forEach(column => {
                if (state.searchColumn === 'all' || state.searchColumn === column.key) {
                    concatenatedData += ' ' + String(item[column.key]).toLowerCase();
                }
            });

            const dataSegments = concatenatedData.split(/\s+/);

            let termFound = false;
            for (let term of searchTerms) {
                if (dataSegments.some(segment => segment.includes(term))) {
                    termFound = true;
                } else {
                    termFound = false;
                    break;
                }
            }

            if (termFound) {
                results.add(item);
            }
        });

        return Array.from(results);
    }, [state.searchColumn, columns]);

    const debouncedSearch = useCallback(
        debounce((searchValue) => {
            let results;
            if (searchValue === '') {
                results = data;
            } else {
                results = search(searchValue, data);
            }
            dispatch({ type: 'SET_FILTERED_DATA', payload: results });
        }, 150),
        [data, dispatch, search]
    );

    const memoizedOnRowClick = useCallback(
        (item) => onRowClick(item),
        [onRowClick]
    );

    const handleSearch = (e) => {
        dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value });
        debouncedSearch(e.target.value);
    };

    const headerStyle = {
        height: headerHeight,
        fontSize: headerFontSize,
        fontFamily,
    };

    const tableBodyStyle = {
        height: tableBodyHeight,
        fontSize: tableBodyFontSize,
        fontFamily,
    };

    const paginationStyle = {
        height: paginationHeight,
        fontSize: paginationFontSize,
        fontFamily,
    };

    const sortedData = useMemo(() => {
        let array = [...state.filteredData];
        if (state.sortColumn.direction === 'neutral') {
            return array;
        }
        return array.sort((a, b) => {
            if (state.sortColumn.direction === 'asc') {
                return String(a[state.sortColumn.key]).localeCompare(String(b[state.sortColumn.key]));
            } else {
                return String(b[state.sortColumn.key]).localeCompare(String(a[state.sortColumn.key]));
            }
        });
    }, [state.filteredData, state.sortColumn]);

    const handleHeaderClick = (columnKey) => {
        let newDirection = 'asc'; //Default to ascending on the first click

        //If the current sort column is the same as the clicked column, toggle the direction
        if (state.sortColumn.key === columnKey) {
            if (state.sortColumn.direction === 'asc') {
                newDirection = 'desc';
            } else if (state.sortColumn.direction === 'desc') {
                newDirection = 'neutral'; //Reset to neutral/unsorted state
            }
        }

        dispatch({
            type: 'SET_SORT_COLUMN',
            payload: { key: columnKey, direction: newDirection },
        });
    };


    const totalPages = Math.ceil(sortedData.length / state.entriesPerPage);
    const currentEntries = sortedData.slice((state.currentPage - 1) * state.entriesPerPage, state.currentPage * state.entriesPerPage);


    console.log('First employee: ', data[0]);
    
    return (
        <div className="datatable-container">
            <div className="datatable-header" style={headerStyle}>
                <label>Show entries:
                    <select value={state.entriesPerPage} onChange={(e) => dispatch({ type: 'SET_ENTRIES_PER_PAGE', payload: Number(e.target.value) })}>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </label>

                <label>Search Column:
                    <select value={state.searchColumn} onChange={(e) => dispatch({ type: 'SET_SEARCH_COLUMN', payload: e.target.value })}>
                        <option value="all">All</option>
                        {columns.map(column => (
                            <option key={column.key} value={column.key}>{column.title}</option>
                        ))}
                    </select>
                </label>

                {/* Search input */}
                <label className='search-label search-input-container'>
                    <input type="text" value={state.searchTerm} onChange={handleSearch} className="search-input" />
                    <div className="search-icon"></div>
                </label>
                
            </div>

            <div className='datatable-table-overflow-container' style={tableBodyStyle}>
                <table>
                    <thead>
                        <tr>
                            {columns.filter(col => state.visibleColumns.has(col.key)).map((column) => (
                                <th key={column.key} onClick={() => handleHeaderClick(column.key)} data-testid={`column-${column.key}`}>
                                    {column.title}
                                    <span className={`sort-indicator ${state.sortColumn.key === column.key ? (state.sortColumn.direction !== 'neutral' ? 'active ' : '') + state.sortColumn.direction : ''}`}></span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    {/* Display data based on current page and entries per page */}
                    <tbody>
                        {currentEntries.map((item) => (
                            <MemoizedTableRow
                                key={item.id}
                                item={item}
                                columns={columns}
                                onRowClick={memoizedOnRowClick}
                                visibleColumns={state.visibleColumns}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination menu */}
            <div className="datatable-pagination" style={paginationStyle}>
                <button onClick={() => dispatch({ type: 'SET_CURRENT_PAGE', payload: Math.max(state.currentPage - 1, 1) })}>Previous</button>
                <span className="pagination-text">
                    {`Showing ${Math.min((state.currentPage - 1) * state.entriesPerPage + 1, state.filteredData.length)} to ${Math.min(state.currentPage * state.entriesPerPage, state.filteredData.length)} of ${state.filteredData.length} entries`}
                </span>
                <button onClick={() => dispatch({ type: 'SET_CURRENT_PAGE', payload: Math.min(state.currentPage + 1, totalPages) })}>Next</button>
            </div>
        </div>
    );
}

//Proptypes to validate props passed to ReactDataTable
ReactDataTable.propTypes = {
    data: PropTypes.array.isRequired,
    columns: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired
    })).isRequired,
    onRowClick: PropTypes.func,
    defaultEntriesPerPage: PropTypes.number,
    sortColumnParam: PropTypes.string,
    headerHeight: PropTypes.string,
    tableBodyHeight: PropTypes.string,
    paginationHeight: PropTypes.string,
    headerWidth: PropTypes.string,
    tableWidth: PropTypes.string,
    paginationWidth: PropTypes.string,
    headerFontSize: PropTypes.string,
    tableBodyFontSize: PropTypes.string,
    paginationFontSize: PropTypes.string,
    fontFamily: PropTypes.string,
};

TableRow.propTypes = {
    item: PropTypes.object.isRequired,
    columns: PropTypes.array.isRequired,
    onRowClick: PropTypes.func.isRequired,
    visibleColumns: PropTypes.instanceOf(Set).isRequired,
};

export default ReactDataTable;