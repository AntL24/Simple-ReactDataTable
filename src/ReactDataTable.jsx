import React, { useCallback, useMemo, useReducer, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { debounce } from './utils/debounce.jsx';
import { TableRow } from './components/TableRow.jsx';
import './styles/DataTableStyles.css';

//Memoized version of TableRow component to prevent unnecessary re-renders as memo does a shallow comparison of props
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
    containerWidth = '100%',
}) {

    //Dispatch an action to set the filtered data when the data prop changes
    useEffect(() => {
        dispatch({ type: 'SET_FILTERED_DATA', payload: data });
    }, [data]);

    //Object with every property needed for the table
    //Is used in the useReducer hook as the initial state
    //and will be updated by the reducer function depending on the action dispatched
    const initialState = {
        searchTerm: '',
        filteredData: data,
        searchColumn: 'all',
        currentPage: 1,
        entriesPerPage: defaultEntriesPerPage,
        sortColumn: { key: sortColumnParam, direction: 'neutral' },
        visibleColumns: new Set(columns.map(col => col.key)),
    };

    //Reducer, will return the corresponding new state when an action is dispatched
    //action type (ex: 'SET_SEARCH_TERM') determines which property of the state will be updated
    //action payload (ex: 'John') is the new value of the property
    function reducer(state, action) {
        switch (action.type) {
            case 'SET_SEARCH_TERM'://Search input
                return { ...state, searchTerm: action.payload };
            case 'SET_FILTERED_DATA'://Search results (or full received data when the search input is empty)
                return { ...state, filteredData: action.payload };
            case 'SET_SEARCH_COLUMN'://Column selected to search in
                return { ...state, searchColumn: action.payload };
            case 'SET_CURRENT_PAGE'://Page viewed in the table
                return { ...state, currentPage: action.payload };
            case 'SET_ENTRIES_PER_PAGE'://Page size
                return { ...state, entriesPerPage: action.payload };
            case 'SET_SORT_COLUMN'://Sort selected column in ascending, descending or neutral order
                return { ...state, sortColumn: action.payload };
            default:
                return state;
        }
    }

    //useReducer hook which will update the state via the reducer function
    //function reducer is the first parameter, initialState (ex: 
    //It updates the state with the results returned by the reducer function
    const [state, dispatch] = useReducer(reducer, initialState);

    //Function to search for a value in the data
    //It is used with a debounce in the handleSearch function
    const search = useCallback((name, items) => {
        if (!Array.isArray(items)) {
            console.error('Expected an array for items');
            return [];
        }

        const results = new Set();//A set is used to avoid duplicates
        const searchTerms = name.toLowerCase().split(/\s+/);//We split the search value to search for each word

        items.forEach(item => {

            //Prepare data by searching in all columns or only in the selected column
            //add the data to the concatenatedData string
            let concatenatedData = '';
            columns.forEach(column => {
                if (state.searchColumn === 'all' || state.searchColumn === column.key) {
                    concatenatedData += ' ' + String(item[column.key]).toLowerCase();
                }
            });

            //Datasegments contains the data we will search in, with each word separated by a space
            const dataSegments = concatenatedData.split(/\s+/);

            //For each search term, check if it is found in the data
            let termFound = false;
            for (let term of searchTerms) {//Check if all search terms are found in the data
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

    //Debounce function to call search function with a delay
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

    //onRowClick is the function passed as a prop
    //only re-created when the onRowClick prop changes
    const memoizedOnRowClick = useCallback(
        (item) => onRowClick(item),
        [onRowClick]
    );

    //Used to send the search value to the search function when the search input changes
    const handleSearch = (e) => {
        dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value });
        debouncedSearch(e.target.value);
    };

    //Props Styles
    const containerStyle = {
        width: containerWidth,
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

    //Memoized version of the sorted data, will be used by totalPages and currentEntries
    //to calculate the number of pages and the entries to display in the current page
    //Sorts the data when: any data change or search input change
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
    }, [state.filteredData, state.sortColumn]);//Only re-sort when the filtered data or sort column changes

    //Function to handle the click on a column header
    //It will dispatch an action to update the sortColumn
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

    //Calculate the total number of pages based on the number of entries per page
    const totalPages = Math.ceil(sortedData.length / state.entriesPerPage);
    //Get the entries to display based on the current page and entries per page
    const currentEntries = sortedData.slice((state.currentPage - 1) * state.entriesPerPage, state.currentPage * state.entriesPerPage);

    return (
        <div className="datatable-container" style={containerStyle}>
            <div className="datatable-header" style={headerStyle}>
                {/* Select the number of entries per page */}
                <label>Show entries:
                    <select value={state.entriesPerPage} onChange={(e) => dispatch({ type: 'SET_ENTRIES_PER_PAGE', payload: Number(e.target.value) })}>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </label>

                {/* Select the column to search in*/}
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
                    <tbody>
                        {/* Map through the currentEntries (based on sortedData, current page and entries per page)
                        to display data with the TableRow component */}
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