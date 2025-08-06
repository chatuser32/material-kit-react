import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import type { Branch, BranchFormData } from 'src/types/stock';

// ----------------------------------------------------------------------

interface BranchFormProps {
  onSubmit: (branch: BranchFormData) => void;
  onCancel: () => void;
  isEditMode: boolean;
  initialData?: Branch | null;
}

export function BranchForm({ onSubmit, onCancel, isEditMode, initialData }: BranchFormProps) {
  const [formData, setFormData] = useState<BranchFormData>({
    code: initialData?.code || '',
    name: initialData?.name || '',
    address: initialData?.address || '',
    phone: initialData?.phone || '',
    isActive: initialData?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Partial<BranchFormData>>({});

  const handleInputChange = (field: keyof BranchFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<BranchFormData> = {};
    
    if (!formData.code.trim()) newErrors.code = 'Şube kodu zorunludur';
    if (!formData.name.trim()) newErrors.name = 'Şube adı zorunludur';
    if (!formData.address.trim()) newErrors.address = 'Adres zorunludur';
    if (!formData.phone.trim()) newErrors.phone = 'Telefon zorunludur';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
      <Stack spacing={3}>
        <TextField
          label="Şube Kodu"
          value={formData.code}
          onChange={(e) => handleInputChange('code', e.target.value)}
          error={!!errors.code}
          helperText={errors.code}
          fullWidth
          required
        />
        
        <TextField
          label="Şube Adı"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
          fullWidth
          required
        />
        
        <TextField
          label="Adres"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          error={!!errors.address}
          helperText={errors.address}
          fullWidth
          required
          multiline
          rows={3}
        />
        
        <TextField
          label="Telefon"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          error={!!errors.phone}
          helperText={errors.phone}
          fullWidth
          required
        />

        <FormControlLabel
          control={
            <Switch
              checked={formData.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
              color="primary"
            />
          }
          label={
            <Box>
              <Typography variant="body2">Şube Durumu</Typography>
              <Typography variant="caption" color="text.secondary">
                {formData.isActive ? 'Aktif' : 'Pasif'}
              </Typography>
            </Box>
          }
        />

        <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            fullWidth
          >
            {isEditMode ? 'Güncelle' : 'Kaydet'}
          </Button>
          <Button 
            variant="outlined" 
            onClick={onCancel}
            size="large"
            fullWidth
          >
            İptal
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}