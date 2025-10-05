import React, { useState, useEffect } from 'react';
import {
  Paper,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveIcon from '@mui/icons-material/Save';
import MatrixInput from './MatrixInput';
import ResultDisplay from './ResultDisplay';
import { treasureHuntAPI } from '../../services/Api';
import { toast } from 'react-toastify';

/**
 * Form để giải bài toán, cho phép nhập input và tính toán ra kết quả
 * @param {Object} param0 
 * @returns 
 */
const TreasureHuntForm = ({ onSolutionSaved, initialData }) => {
  // State quản lý input số hàng ma trận
  const [rowsCount, setRowsCount] = useState('');

  // State quản lý input số cột
  const [columnsCount, setColumnsCount] = useState('');

  // State quản lý số loại rương
  const [typesOfChestCount, setTypesOfChestCount] = useState('');

  // State quản lý dữ liệu ma trận
  const [matrix, setMatrix] = useState([]);

  // State quản lý render ma trận theo input hàng, cột, loại đã nhập
  const [matrixReady, setMatrixReady] = useState(false);

  // State quản lý kết quả lời giải
  const [result, setResult] = useState(null);

  // State quản lý error validation
  const [error, setError] = useState('');

  // State quản lý loading cho nút lưu
  const [saveLoading, setSaveLoading] = useState(false);

  // State quản lý loading cho nút giải bài toán
  const [solveLoading, setSolveLoading] = useState(false);

  // Khi có initialData truyền vào thì render input theo initialData
  useEffect(() => {
    if (initialData) {
      setRowsCount(initialData.rowsCount.toString());
      setColumnsCount(initialData.columnsCount.toString());
      setTypesOfChestCount(initialData.typesOfChestCount.toString());
      setMatrix(initialData.matrix);
      setMatrixReady(true);
      setError('');
      setResult(null);
    }
  }, [initialData]);

  /**
   * validate input nhập
   * @returns 
   */
  const validateDimensions = () => {
    const nVal = parseInt(rowsCount);
    const mVal = parseInt(columnsCount);
    const pVal = parseInt(typesOfChestCount);

    if (!rowsCount || !columnsCount || !typesOfChestCount) {
      setError('Vui lòng nhập đầy đủ số hàng, số cột, số loại rương');
      return false;
    }

    if (nVal < 1 || nVal > 500) {
      setError('Số hàng phải từ 1 đến 500');
      return false;
    }

    if (mVal < 1 || mVal > 500) {
      setError('Số cột phải từ 1 đến 500');
      return false;
    }

    if (pVal < 1 || pVal > nVal * mVal) {
      setError(`Số loại rương phải từ 1 đến ${nVal * mVal}`);
      return false;
    }

    return true;
  };

  /**
   * Sinh ma trận theo input
   * @returns 
   */
  const handleGenerateMatrix = () => {
    if (!validateDimensions()) {
      return;
    }

    const nVal = parseInt(rowsCount);
    const mVal = parseInt(columnsCount);
    const newMatrix = Array(nVal).fill(0).map(() => Array(mVal).fill(''));
    setMatrix(newMatrix);
    setMatrixReady(true);
    setError('');
    setResult(null);
  };

  /**
   * Thay đổi matrix
   * @param {Object} newMatrix 
   */
  const handleMatrixChange = (newMatrix) => {
    setMatrix(newMatrix);
    setResult(null);
  };

  /**
   * validate dữ liệu của ma trận
   * @returns 
   */
  const validateMatrix = () => {
    const nVal = parseInt(rowsCount);
    const mVal = parseInt(columnsCount);
    const pVal = parseInt(typesOfChestCount);

    // Kiểm tra tất cả ô đã được nhập
    for (let i = 0; i < nVal; i++) {
      for (let j = 0; j < mVal; j++) {
        if (matrix[i][j] === '' || matrix[i][j] === null || matrix[i][j] === undefined) {
          setError(`Ô [${i + 1}, ${j + 1}] chưa được nhập`);
          return false;
        }
        const val = parseInt(matrix[i][j]);
        if (isNaN(val) || val < 1 || val > pVal) {
          setError(`Ô [${i + 1}, ${j + 1}] phải là số từ 1 đến ${pVal}`);
          return false;
        }
      }
    }

    // Kiểm tra phải có ít nhất một ô có giá trị p
    let hasP = false;
    for (let i = 0; i < nVal; i++) {
      for (let j = 0; j < mVal; j++) {
        if (parseInt(matrix[i][j]) === pVal) {
          hasP = true;
          break;
        }
      }
      if (hasP) break;
    }

    if (!hasP) {
      setError(`Ma trận phải có ít nhất một ô chứa giá trị ${pVal} (rương kho báu)`);
      return false;
    }

    return true;
  };

  /**
   * Lưu input 
   * @returns 
   */
  const handleSave = async () => {
    if (!validateMatrix()) {
      return;
    }

    setSaveLoading(true);
    setError('');

    try {
      await treasureHuntAPI.save({
        rowsCount: parseInt(rowsCount),
        columnsCount: parseInt(columnsCount),
        typesOfChestCount: parseInt(typesOfChestCount),
        matrix: matrix.map(row => row.join(',')).join(',')
      });

      toast.success('Đã lưu bài toán thành công!');
      if (onSolutionSaved) {
        onSolutionSaved();
      }
    } catch (err) {
      setError(err.response?.data?.errorMessage || 'Có lỗi xảy ra khi lưu bài toán');
    } finally {
      setSaveLoading(false);
    }
  };

  /**
   * Giải ma trận
   * @returns 
   */
  const handleSubmit = async () => {
    if (!validateMatrix()) {
      return;
    }

    setSolveLoading(true);
    setError('');

    try {
      // Gọi API backend để giải bài toán và lưu vào database
      const response = await treasureHuntAPI.solve({
        rowsCount: parseInt(rowsCount),
        columnsCount: parseInt(columnsCount),
        typesOfChestCount: parseInt(typesOfChestCount),
        matrix: matrix.map(row => row.join(',')).join(',')
      });

      setResult(response.data);
      if (onSolutionSaved) {
        onSolutionSaved();
      }
    } catch (err) {
      setError(err.response?.data?.errorMessage || 'Có lỗi xảy ra khi giải bài toán');
    } finally {
      setSolveLoading(false);
    }
  };

  /**
   * reset input
   */
  const handleReset = () => {
    setRowsCount('');
    setColumnsCount('');
    setTypesOfChestCount('');
    setMatrix([]);
    setMatrixReady(false);
    setResult(null);
    setError('');
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Nhập Thông Tin Bài Toán
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Số hàng"
              type="number"
              value={rowsCount}
              onChange={(e) => setRowsCount(e.target.value)}
              disabled={matrixReady}
              size="small"
              helperText="1 ≤ n ≤ 500"
              inputProps={{ min: 1, max: 500 }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Số cột"
              type="number"
              value={columnsCount}
              onChange={(e) => setColumnsCount(e.target.value)}
              disabled={matrixReady}
              size="small"
              helperText="1 ≤ m ≤ 500"
              inputProps={{ min: 1, max: 500 }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Số loại rương"
              type="number"
              value={typesOfChestCount}
              onChange={(e) => setTypesOfChestCount(e.target.value)}
              disabled={matrixReady}
              size="small"
              helperText={`1 ≤ p ≤ ${rowsCount && columnsCount ? parseInt(rowsCount) * parseInt(columnsCount) : 'n×m'}`}
              inputProps={{ min: 1, max: rowsCount && columnsCount ? parseInt(rowsCount) * parseInt(columnsCount) : undefined }}
            />
          </Grid>

          <Grid item xs={12}>
            {!matrixReady ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateMatrix}
                disabled={!rowsCount || !columnsCount || !typesOfChestCount}
                fullWidth
                size="medium"
              >
                Tạo Ma Trận
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleReset}
                fullWidth
                size="medium"
                startIcon={<RestartAltIcon />}
              >
                Đặt Lại
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      {matrixReady && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2, mb: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                Nhập Ma Trận Kho Báu
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ flex: 1 }}>
                <MatrixInput
                  rowsCount={parseInt(rowsCount)}
                  columnsCount={parseInt(columnsCount)}
                  typesOfChestCount={parseInt(typesOfChestCount)}
                  matrix={matrix}
                  onChange={handleMatrixChange}
                />

                {error && (
                  <Alert severity="error" onClose={() => setError('')} sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}
              </Box>

              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleSave}
                      disabled={saveLoading || solveLoading}
                      startIcon={saveLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                      fullWidth
                      size="medium"
                    >
                      {saveLoading ? 'Đang Lưu...' : 'Lưu Bài Toán'}
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                      disabled={saveLoading || solveLoading}
                      startIcon={solveLoading ? <CircularProgress size={20} /> : <SendIcon />}
                      fullWidth
                      size="medium"
                    >
                      {solveLoading ? 'Đang Giải...' : 'Giải Bài Toán'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2, mb: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                Kết Quả
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ flex: 1, overflow: 'auto' }}>
                {result && (
                  <ResultDisplay result={result} />
                )}

                {!result && (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    Chưa có kết quả. Vui lòng nhập ma trận và nhấn "Giải Bài Toán".
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default TreasureHuntForm;
