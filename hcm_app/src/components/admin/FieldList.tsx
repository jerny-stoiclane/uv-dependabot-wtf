import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Typography,
} from '@mui/material';
import React from 'react';

interface FieldListProps {
  fields: CustomFieldDefinition[];
  onEditField: (field: CustomFieldDefinition) => void;
  onDeleteField: (fieldId: number, fieldLabel: string) => void;
  fieldTypeOptions: Array<{ value: string; label: string }>;
}

const FieldList: React.FC<FieldListProps> = ({
  fields,
  onEditField,
  onDeleteField,
  fieldTypeOptions,
}) => {
  return (
    <Box
      sx={{
        maxHeight: '60vh',
        overflowY: 'auto',
      }}
    >
      <Box sx={{ display: 'grid', pb: 4, gap: 1.5 }}>
        {fields.map((field) => (
          <Card
            key={field.id}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1.5,
              py: 0.5,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'primary.main',
              },
            }}
          >
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {field.field_label}
                    </Typography>
                    <Chip
                      label={
                        fieldTypeOptions.find(
                          (opt) => opt.value === field.field_type
                        )?.label || field.field_type
                      }
                      size="small"
                      variant="outlined"
                      sx={{
                        fontWeight: 500,
                        textTransform: 'capitalize',
                        fontSize: '0.7rem',
                        height: '20px',
                      }}
                    />
                    {field.is_required && (
                      <Chip
                        label="Required"
                        size="small"
                        color="error"
                        variant="outlined"
                        sx={{
                          fontWeight: 500,
                          fontSize: '0.7rem',
                          height: '20px',
                        }}
                      />
                    )}
                  </Box>

                  {field.description && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        mb: 0.5,
                        fontStyle: 'italic',
                        display: 'block',
                      }}
                    >
                      {field.description}
                    </Typography>
                  )}

                  {field.field_type === 'dropdown' &&
                    field.dropdown_values.length > 0 && (
                      <Box sx={{ mt: 0.5 }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            fontWeight: 600,
                            mb: 0.5,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                            fontSize: '0.65rem',
                          }}
                        >
                          Options ({field.dropdown_values.length})
                        </Typography>
                      </Box>
                    )}
                </Box>

                <Box sx={{ display: 'flex', gap: 0.25, ml: 1 }}>
                  <IconButton
                    onClick={() => onEditField(field)}
                    size="small"
                    sx={{
                      color: 'text.secondary',
                      padding: '4px',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                    title="Edit field"
                  >
                    <EditIcon sx={{ fontSize: '16px' }} />
                  </IconButton>
                  <IconButton
                    onClick={() => onDeleteField(field.id!, field.field_label)}
                    size="small"
                    sx={{
                      color: 'error.main',
                      padding: '4px',
                      '&:hover': {
                        backgroundColor: 'error.50',
                      },
                    }}
                    title="Delete field"
                  >
                    <DeleteIcon sx={{ fontSize: '16px' }} />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default FieldList;
