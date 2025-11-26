import { NotificationProvider } from '@armhr/ui';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import AdminUserPermissionsPage from '../../../src/pages/admin/AdminUserPermissionsPage';

// Mock the hooks
vi.mock('../../../src/contexts/company.context', () => ({
  useCompany: () => ({
    name: 'Test Company',
    id: '1',
  }),
}));

vi.mock('../../../src/hooks/useApiData', () => ({
  useApiData: () => ({
    data: [
      {
        employee_id: 'EMP001',
        user_type: 'admin',
        user_role: ['WSMALL', 'W2'],
        email: 'john.doe@example.com',
        employee_first_name: 'John',
        employee_last_name: 'Doe',
        human_resource_role: [{ code: 'W2', desc: 'HR Manager' }],
        allowed_employees: [],
      },
    ],
    loading: false,
    error: null,
  }),
}));

describe('UserPermissionsPage', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <NotificationProvider>
          <AdminUserPermissionsPage />
        </NotificationProvider>
      </BrowserRouter>
    );
  };

  it('renders user data correctly', async () => {
    renderComponent();

    // Wait for the user data to be loaded and rendered
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('EMP001')).toBeInTheDocument();
      expect(screen.getByText('WSMALL')).toBeInTheDocument();
      expect(screen.getByText('HR Manager')).toBeInTheDocument();
    });
  });

  it('filters users by user role', async () => {
    renderComponent();
    const user = userEvent.setup();

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Open the user role filter
    const userRoleFilter = screen.getByPlaceholderText('Filter by user roles');
    await user.click(userRoleFilter);

    // Wait for and select the WSMALL role from the dropdown
    const roleOption = await screen.findByRole('option', {
      name: /Worksite Manager All Functions/i,
    });
    await user.click(roleOption);

    // Verify the filter is applied
    await waitFor(() => {
      const chip = screen.getByTestId('user-role-filter-WSMALL');
      expect(chip).toBeInTheDocument();
    });
  });

  it('filters users by HR role', async () => {
    renderComponent();
    const user = userEvent.setup();

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Open the HR role filter
    const hrRoleFilter = screen.getByPlaceholderText('Filter by HR roles');
    await user.click(hrRoleFilter);

    // Wait for and select the HR Manager role from the dropdown
    const roleOption = await screen.findByRole('option', {
      name: /HR Manager/i,
    });
    await user.click(roleOption);

    // Verify the filter is applied
    await waitFor(() => {
      const chip = screen.getByTestId('hr-role-filter-W2');
      expect(chip).toBeInTheDocument();
    });
  });

  it('shows multiple selection summary when more than one role is selected', async () => {
    renderComponent();
    const user = userEvent.setup();

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Open the user role filter
    const userRoleFilter = screen.getByPlaceholderText('Filter by user roles');
    await user.click(userRoleFilter);

    // Select first role (WSMALL)
    const roleOption1 = await screen.findByRole('option', {
      name: /Worksite Manager All Functions/i,
    });
    await user.click(roleOption1);

    // Click the filter again to reopen it
    await user.click(userRoleFilter);

    // Select second role (W2)
    const roleOption2 = await screen.findByRole('option', {
      name: /W2 Access/i,
    });
    await user.click(roleOption2);

    // Verify the multiple selection summary is shown
    await waitFor(() => {
      const summaryChip = screen.getByTestId('user-role-filter-multiple');
      expect(summaryChip).toBeInTheDocument();
      expect(summaryChip).toHaveTextContent('2 roles selected');
    });
  });

  it('clears filters when clear button is clicked', async () => {
    renderComponent();
    const user = userEvent.setup();

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Open the user role filter and select a role
    const userRoleFilter = screen.getByPlaceholderText('Filter by user roles');
    await user.click(userRoleFilter);
    const roleOption = await screen.findByRole('option', {
      name: /Worksite Manager All Functions/i,
    });
    await user.click(roleOption);

    // Verify the filter is applied
    await waitFor(() => {
      const chip = screen.getByTestId('user-role-filter-WSMALL');
      expect(chip).toBeInTheDocument();
    });

    // Click the clear button (the X icon in the chip)
    const clearButton = screen
      .getByTestId('user-role-filter-WSMALL')
      .querySelector('[data-testid="CancelIcon"]');
    await user.click(clearButton!);

    // Verify the filter is cleared
    await waitFor(() => {
      expect(
        screen.queryByTestId('user-role-filter-WSMALL')
      ).not.toBeInTheDocument();
    });
  });
});
