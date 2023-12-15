### Simple-ReactDataTable ###


## Description

Simple React DataTable is a lightweight and flexible React component for displaying data in a tabular format. It offers pagination, search, and columnar sorting features, making the management of large data sets more accessible and intuitive.


## Features

- **Pagination:** Easily navigate through paginated data.
- **Search:** Quickly search for specific data, including within a particular column.
- **Columnar Sorting:** Sort data in a column in ascending or descending order.


## Installation

To install the package, run the following command in your React project:

```bash
npm install simple-reactdatatable
```


## Usage
# How to use the ReactDataTable component in your application?

**==> Importing:**

```javascript
import {ReactDataTable} from 'simple-reactdatatable';
```

**==> Usage Example:**

```javascript
function MyComponent() {
    const data = [...]; // Your data array
    const columns = [...]; // Columns to display

    return <ReactDataTable data={data} columns={columns} />;
}
```

**==> Props:**

- data (Array): Data to display in a table format. Must be an array of objects.

- columns (Array): Table columns. Each object should contain a key and a title.

- onRowClick (Function): Function called when a row is clicked. Receives the data object of the row.

- defaultEntriesPerPage (Number): Number of entries to show per page. Default is 10.

- sortColumnParam (String): Initial column key for sorting. Default is 'name'.

- headerHeight, tableBodyHeight, paginationHeight (String): Custom height for different parts of the table. Default is 'auto'.

- headerFontSize, tableBodyFontSize, paginationFontSize (String): Font size for the header, body, and pagination. Default is '1rem'.

- fontFamily (String): Font family for the table text. Default is 'Arial'.

- containerWidth (String): Width of the table container. Default is '100%'.


## Dependencies

- React
- prop-types
- Node.js (v20.8.1 or newer)

## Recommended Development Environment

- This package was made in Vscode.
