
import { describe, it, expect } from 'vitest';
import { render, fireEvent, screen, waitFor  } from '@testing-library/react';
import ReactDataTable from '../src/ReactDataTable';

describe('ReactDataTable', () => {
    const columns = [
        { key: 'firstName', title: 'First Name' },
        { key: 'lastName', title: 'Last Name' },
        { key: 'dateOfBirth', title: 'Date of Birth' },
        { key: 'startDate', title: 'Start Date' },
        { key: 'street', title: 'Street' },
        { key: 'city', title: 'City' },
        { key: 'state', title: 'State' },
        { key: 'zipCode', title: 'Zip Code' },
        { key: 'department', title: 'Department' },
    ];

    const data = [
        {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            dateOfBirth: "1990-01-01",
            startDate: "2021-06-01",
            street: "123 Main St",
            city: "Anytown",
            state: "CA",
            zipCode: "12345",
            department: "Engineering",
        },
        {
            id: 2,
            firstName: "Jane",
            lastName: "Smith",
            dateOfBirth: "1985-05-05",
            startDate: "2022-01-10",
            street: "456 Elm St",
            city: "Somewhere",
            state: "NY",
            zipCode: "54321",
            department: "Marketing",
        },
        {
            id: 3,
            firstName: "Bob",
            lastName: "Smith",
            dateOfBirth: "1980-10-10",
            startDate: "2020-12-25",
            street: "789 Maple St",
            city: "Nowhere",
            state: "TX",
            zipCode: "67890",
            department: "Sales",
        },
        {
            id: 4,
            firstName: "Joe",
            lastName: "Bloggs",
            dateOfBirth: "1975-03-15",
            startDate: "2021-06-01",
            street: "123 Main St",
            city: "Anytown",
            state: "CA",
            zipCode: "12345",
            department: "Engineering",
        },
        {
            id: 5,
            firstName: "Jane",
            lastName: "Doe",
            dateOfBirth: "1995-07-20",
            startDate: "2022-01-10",
            street: "456 Elm St",
            city: "Somewhere",
            state: "NY",
            zipCode: "54321",
            department: "Marketing",
        },
        {
            id: 6,
            firstName: "John",
            lastName: "Smith",
            dateOfBirth: "1980-12-25",
            startDate: "2020-12-25",
            street: "789 Maple St",
            city: "Nowhere",
            state: "TX",
            zipCode: "67890",
            department: "Sales",
        },
        {
            id: 7,
            firstName: "Bob",
            lastName: "Bloggs",
            dateOfBirth: "1975-08-30",
            startDate: "2021-06-01",
            street: "123 Main St",
            city: "Anytown",
            state: "CA",
            zipCode: "12345",
            department: "Engineering",
        },
        {
            id: 8,
            firstName: "Joe",
            lastName: "Doe",
            dateOfBirth: "1995-02-03",
            startDate: "2022-01-10",
            street: "456 Elm St",
            city: "Somewhere",
            state: "NY",
            zipCode: "54321",
            department: "Marketing",
        },
        {
            id: 9,
            firstName: "Jane",
            lastName: "Smith",
            dateOfBirth: "1980-07-08",
            startDate: "2020-12-25",
            street: "789 Maple St",
            city: "Nowhere",
            state: "TX",
            zipCode: "67890",
            department: "Sales",
        },
        {
            id: 10,
            firstName: "John",
            lastName: "Bloggs",
            dateOfBirth: "1975-12-13",
            startDate: "2021-06-01",
            street: "123 Main St",
            city: "Anytown",
            state: "CA",
            zipCode: "12345",
            department: "Engineering",
        },
        {
            id: 11,
            firstName: "Bob",
            lastName: "Doe",
            dateOfBirth: "1995-06-18",
            startDate: "2022-01-10",
            street: "456 Elm St",
            city: "Somewhere",
            state: "NY",
            zipCode: "54321",
            department: "Marketing",
        },
        {
            id: 12,
            firstName: "Joe",
            lastName: "Smith",
            dateOfBirth: "1980-11-23",
            startDate: "2020-12-25",
            street: "789 Maple St",
            city: "Nowhere",
            state: "TX",
            zipCode: "67890",
            department: "Sales",
        },
        {
            id: 13,
            firstName: "Jane",
            lastName: "Bloggs",
            dateOfBirth: "1975-04-28",
            startDate: "2021-06-01",
            street: "123 Main St",
            city: "Anytown",
            state: "CA",
            zipCode: "12345",
            department: "Engineering",
        }
    ];

    it('renders with initial data', () => {
        render(<ReactDataTable data={data} columns={columns} />);
        const johnElements = screen.getAllByText('John');
        expect(johnElements.length).toBe(3); //There is 3 John in the data
    });

    it('sorts data when header clicked', () => {
        render(<ReactDataTable data={data} columns={columns} />);
        const nameHeader = screen.getByRole('columnheader', { name: 'First Name' });
        fireEvent.click(nameHeader);
    });
    
    it('filters data based on search input', async () => {
        render(<ReactDataTable data={data} columns={columns} />);
        const searchInput = screen.getByRole('textbox');
        fireEvent.change(searchInput, { target: { value: 'John' } });
    
        await new Promise(r => setTimeout(r, 200));
    
        const johnElements = screen.getAllByText('John');
        expect(johnElements.length).toBeLessThan(data.length); //Number of johns should be less than the number of data
    
        expect(screen.queryByText('Jane')).toBeNull();
    });
    
    it('paginates data when next button is clicked', async () => {
        render(<ReactDataTable data={data} columns={columns} defaultEntriesPerPage={1} />);
        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);
    
        await waitFor(() => {
            expect(screen.queryByText('Jane')).not.toBe(null); // Utilise une assertion compatible avec Vitest
            expect(screen.queryByText('John')).toBe(null);
        });
    });
    
    it('changes number of entries per page', () => {
        render(<ReactDataTable data={data} columns={columns} />);
        const entriesSelect = screen.getByLabelText('Show entries:');
        fireEvent.change(entriesSelect, { target: { value: 25 } });

    });

    it('sorts data in descending order when header clicked twice', () => {
        render(<ReactDataTable data={data} columns={columns} />);
        const nameHeader = screen.getByRole('columnheader', { name: 'First Name' });
        // Tri ascendant
        fireEvent.click(nameHeader);
        // Tri descendant
        fireEvent.click(nameHeader);
    });
    
    it('calls onRowClick when a row is clicked', () => {
        const onRowClickMock = vi.fn();
        render(<ReactDataTable data={data} columns={columns} onRowClick={onRowClickMock} />);
        
        const johnElements = screen.getAllByText('John');
        // Check tr element closest to the text 'John'
        const row = johnElements[0].closest('tr');
        fireEvent.click(row);
    
        expect(onRowClickMock).toHaveBeenCalled();
    });
    
});