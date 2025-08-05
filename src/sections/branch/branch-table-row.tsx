import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

import type { BranchProps } from 'src/_mock/branch';

// ----------------------------------------------------------------------

type BranchTableRowProps = {
  branch: BranchProps;
  onView: (branch: BranchProps) => void;
  onEdit: (branch: BranchProps) => void;
  onDelete: (branch: BranchProps) => void;
};

export function BranchTableRow({ 
  branch, 
  onView, 
  onEdit, 
  onDelete 
}: BranchTableRowProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'inactive':
        return 'Pasif';
      default:
        return status;
    }
  };

  return (
    <TableRow hover>
      <TableCell>{branch.code}</TableCell>
      <TableCell>{branch.name}</TableCell>
      <TableCell>{branch.address}</TableCell>
      <TableCell>{branch.phone}</TableCell>
      <TableCell>{branch.manager}</TableCell>
      <TableCell>
        <Chip
          label={getStatusLabel(branch.status)}
          color={getStatusColor(branch.status)}
          size="small"
        />
      </TableCell>
      <TableCell align="center">{branch.employeeCount}</TableCell>
      <TableCell>
        {new Date(branch.createdAt).toLocaleDateString('tr-TR')}
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={1}>
          <IconButton 
            size="small" 
            color="primary"
            onClick={() => onView(branch)}
            title="Görüntüle"
          >
            <Iconify icon="solar:eye-bold" />
          </IconButton>
          <IconButton 
            size="small" 
            color="info"
            onClick={() => onEdit(branch)}
            title="Düzenle"
          >
            <Iconify icon="solar:pen-bold" />
          </IconButton>
          <IconButton 
            size="small" 
            color="error"
            onClick={() => onDelete(branch)}
            title="Sil"
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Stack>
      </TableCell>
    </TableRow>
  );
}