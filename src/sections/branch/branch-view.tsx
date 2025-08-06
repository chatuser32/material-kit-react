import React, { useState, useCallback, ChangeEvent } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Snackbar from '@mui/material/Snackbar';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';
import TablePagination from '@mui/material/TablePagination';
import ConfirmDialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';

import { Iconify } from 'src/components/iconify';

import type { Branch, BranchFormData } from 'src/types/stock';

import { BranchForm } from './branch-form';
import { BranchTableRow } from './branch-table-row';

// ----------------------------------------------------------------------

// Mock veri (gerçek uygulamada API'den gelir)
const MOCK_BRANCHES: Branch[] = [
  {
    id: 1,
    code: 'SB001',
    name: 'Merkez Şube',
    address: 'İstanbul, Türkiye',
    phone: '0212 123 45 67',
    isActive: true,
    company: { id: 1, name: 'ABC Şirketi' },
  },
  {
    id: 2,
    code: 'SB002',
    name: 'Ankara Şubesi',
    address: 'Ankara, Türkiye',
    phone: '0312 987 65 43',
    isActive: true,
    company: { id: 1, name: 'ABC Şirketi' },
  },
];

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

export function BranchView() {
  const [branches, setBranches] = useState<Branch[]>(MOCK_BRANCHES);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterName, setFilterName] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleChangePage = useCallback((event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleFilterName = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value);
    setPage(0);
  }, []);

  const showSnackbar = useCallback((message: string, severity: SnackbarState['severity'] = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleView = useCallback((branch: Branch) => {
    setSelectedBranch(branch);
    setDetailModalOpen(true);
  }, []);

  const handleEdit = useCallback((branch: Branch) => {
    setSelectedBranch(branch);
    setEditMode(true);
    setFormModalOpen(true);
  }, []);

  const handleDelete = useCallback((branch: Branch) => {
    setSelectedBranch(branch);
    setDeleteConfirmOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (selectedBranch) {
      setBranches(prev => prev.filter(b => b.id !== selectedBranch.id));
      showSnackbar(`${selectedBranch.name} şubesi başarıyla silindi!`, 'success');
      setDeleteConfirmOpen(false);
      setSelectedBranch(null);
    }
  }, [selectedBranch, showSnackbar]);

  const handleNewBranch = useCallback(() => {
    setSelectedBranch(null);
    setEditMode(false);
    setFormModalOpen(true);
  }, []);

  const handleSubmitForm = useCallback((formData: BranchFormData) => {
    // Mock şirket verisi (gerçek uygulamada API'den gelir)
    const mockCompanies = [
      { id: 1, name: 'ABC Şirketi' },
      { id: 2, name: 'XYZ Şirketi' },
      { id: 3, name: 'DEF Şirketi' },
    ];
    
    const selectedCompany = mockCompanies.find(c => c.id === formData.companyId) || mockCompanies[0];

    if (editMode && selectedBranch) {
      // Şube güncelleme işlemi
      const updatedBranch: Branch = {
        ...selectedBranch,
        code: formData.code,
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        isActive: formData.isActive,
        company: selectedCompany,
      };
      setBranches(prev => prev.map(b => b.id === selectedBranch.id ? updatedBranch : b));
      showSnackbar(`${formData.name} şubesi başarıyla güncellendi!`, 'success');
    } else {
      // Yeni şube ekleme
      const newBranch: Branch = {
        id: Math.max(...branches.map(b => b.id), 0) + 1,
        code: formData.code,
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        isActive: formData.isActive,
        company: selectedCompany,
      };
      setBranches(prev => [...prev, newBranch]);
      showSnackbar(`${formData.name} şubesi başarıyla eklendi!`, 'success');
    }

    setFormModalOpen(false);
    setSelectedBranch(null);
    setEditMode(false);
  }, [editMode, selectedBranch, branches, showSnackbar]);

  const handleCloseForm = useCallback(() => {
    setFormModalOpen(false);
    setSelectedBranch(null);
    setEditMode(false);
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const filteredBranches = branches.filter(
    (branch) =>
      branch.name.toLowerCase().includes(filterName.toLowerCase()) ||
      branch.code.toLowerCase().includes(filterName.toLowerCase())
  );

  const paginatedBranches = filteredBranches.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Şubeler</Typography>
        <Button 
          variant="contained" 
          startIcon={<Iconify icon="mingcute:add-line" />} 
          onClick={handleNewBranch}
        >
          Yeni Şube
        </Button>
      </Box>

      <Card>
        <Box sx={{ p: 2.5 }}>
          <TextField
            fullWidth
            value={filterName}
            onChange={handleFilterName}
            placeholder="Şube ara..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Şube Kodu</TableCell>
                <TableCell>Şube Adı</TableCell>
                <TableCell>Şirket</TableCell>
                <TableCell>Adres</TableCell>
                <TableCell>Telefon</TableCell>
                <TableCell>Durum</TableCell>
                <TableCell>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedBranches.map((branch) => (
                <BranchTableRow
                  key={branch.id}
                  branch={branch}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
              {paginatedBranches.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary">
                      {filterName ? 'Arama kriterlerine uygun şube bulunamadı.' : 'Henüz şube eklenmemiş.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredBranches.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Sayfa başına kayıt:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count !== -1 ? count : `~${to}`}`}
        />
      </Card>

      {/* Şube Form Modal */}
      <Dialog open={formModalOpen} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Şube Düzenle' : 'Yeni Şube'}</DialogTitle>
        <DialogContent>
          <BranchForm 
            onSubmit={handleSubmitForm} 
            onCancel={handleCloseForm} 
            isEditMode={editMode} 
            initialData={selectedBranch} 
          />
        </DialogContent>
      </Dialog>

      {/* Detay Modal */}
      <Dialog open={detailModalOpen} onClose={() => setDetailModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Iconify icon="solar:eye-bold" sx={{ mr: 1 }} />
            Şube Detayları
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedBranch && (
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Şube Kodu
                </Typography>
                <Typography variant="body1">{selectedBranch.code}</Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Şube Adı
                </Typography>
                <Typography variant="body1">{selectedBranch.name}</Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Şirket
                </Typography>
                <Typography variant="body1">{selectedBranch.company.name}</Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Adres
                </Typography>
                <Typography variant="body1">{selectedBranch.address}</Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Telefon
                </Typography>
                <Typography variant="body1">{selectedBranch.phone}</Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Durum
                </Typography>
                <Chip 
                  label={selectedBranch.isActive ? 'Aktif' : 'Pasif'} 
                  color={selectedBranch.isActive ? 'success' : 'error'} 
                  size="small" 
                />
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailModalOpen(false)}>Kapat</Button>
          <Button
            variant="contained"
            startIcon={<Iconify icon="solar:pen-bold" />}
            onClick={() => { 
              if (selectedBranch) {
                handleEdit(selectedBranch); 
                setDetailModalOpen(false); 
              }
            }}
          >
            Düzenle
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Şube Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedBranch?.name} şubesini silmek istediğinizden emin misiniz? 
            Bu işlem geri alınamaz.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>İptal</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Sil
          </Button>
        </DialogActions>
      </ConfirmDialog>

      {/* Snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}