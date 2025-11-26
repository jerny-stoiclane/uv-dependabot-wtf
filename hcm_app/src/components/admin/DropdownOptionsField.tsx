import { ConfirmationDialog } from '@armhr/ui';
import { Delete as DeleteIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

interface DropdownOptionsFieldProps {
  values: CustomFieldDropdownValue[];
  onChange: (values: CustomFieldDropdownValue[]) => void;
  error?: string;
  editingField: CustomFieldDefinition | null;
}

const DropdownOptionsField: React.FC<DropdownOptionsFieldProps> = ({
  values,
  onChange,
  error,
}) => {
  const [newValue, setNewValue] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    open: boolean;
    index: number | null;
    value: string;
  }>({
    open: false,
    index: null,
    value: '',
  });

  const addDropdownValue = () => {
    if (newValue.trim()) {
      const newDropdownValue: CustomFieldDropdownValue = {
        // Temporary ID for new values
        id: undefined,
        value: newValue.trim(),
        display_order: values.length,
      };
      onChange([...values, newDropdownValue]);
      setNewValue('');
    }
  };

  const updateDropdownValue = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = { ...newValues[index], value };
    onChange(newValues);
  };

  const handleDeleteClick = (index: number, value: string) => {
    setDeleteConfirmation({
      open: true,
      index,
      value,
    });
  };

  const confirmDelete = () => {
    if (deleteConfirmation.index !== null) {
      onChange(values.filter((_, i) => i !== deleteConfirmation.index));
    }
    setDeleteConfirmation({ open: false, index: null, value: '' });
  };

  // An option is considered "persisted" if it has an ID.
  // Newly added options will have `id` as `undefined`.
  const isPersisted = (option: CustomFieldDropdownValue) =>
    option.id !== undefined && option.id !== 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          label="Add Option"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addDropdownValue()}
          size="small"
          fullWidth
          placeholder="Enter option text..."
        />
        <Button
          onClick={addDropdownValue}
          variant="outlined"
          size="small"
          disabled={!newValue.trim()}
          sx={{ minWidth: '80px' }}
        >
          Add
        </Button>
      </Box>

      {error && (
        <Typography
          color="error"
          variant="caption"
          sx={{ mb: 1, display: 'block' }}
        >
          {error}
        </Typography>
      )}

      {values.length > 0 && (
        <Box sx={{ maxHeight: '200px', overflowY: 'auto', pr: 1 }}>
          {values.map((value, index) => (
            <Card
              key={index}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                mb: 1,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1,
                }}
              >
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={value.value}
                  disabled={isPersisted(value)}
                  onChange={(e) => updateDropdownValue(index, e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      border: 'none',
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                    },
                    '& .Mui-disabled': {
                      color: 'text.primary',
                      WebkitTextFillColor: 'text.primary',
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                    },
                  }}
                />

                <IconButton
                  onClick={() => handleDeleteClick(index, value.value)}
                  size="small"
                  sx={{
                    color: 'error.main',
                    '&:hover': {
                      backgroundColor: 'error.50',
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Card>
          ))}
        </Box>
      )}

      <ConfirmationDialog
        open={deleteConfirmation.open}
        onClose={() =>
          setDeleteConfirmation({ open: false, index: null, value: '' })
        }
        onConfirm={confirmDelete}
        title="Delete Dropdown Option"
        message={
          <>
            Are you sure you want to delete the option{' '}
            <strong>"{deleteConfirmation.value}"</strong>? <br /> This will
            remove the option for all employees who may have it selected.
          </>
        }
        confirmText="Delete"
        cancelText="Cancel"
        color="error"
        confirmButtonProps={{
          color: 'error',
        }}
      />
    </Box>
  );
};

export default DropdownOptionsField;
