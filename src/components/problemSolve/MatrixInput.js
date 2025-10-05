import React, { useCallback, useMemo } from 'react';
import {
  Box,
  TextField,
  Typography,
} from '@mui/material';

/**
 * Component cho từng cell - được memoize để chỉ re-render khi value thay đổi
 */
const MatrixCell = React.memo(({ row, col, value, max, cellSize, onChange }) => (
  <TextField
    value={value}
    onChange={(e) => onChange(row, col, e.target.value)}
    type="number"
    inputProps={{
      min: 1,
      max: max,
      style: {
        textAlign: 'center',
        fontSize: '16px',
        padding: '4px',
        height: '42px',
        backgroundColor: 'white'
      }
    }}
    sx={{
      width: cellSize,
      height: cellSize,
      mr: 0.5,
      '& .MuiOutlinedInput-root': {
        height: '100%',
        '& input': {
          padding: 0
        }
      }
    }}
    variant="outlined"
    size="small"
  />
), (prevProps, nextProps) => {
  // Chỉ re-render khi value hoặc max thay đổi
  return prevProps.value === nextProps.value && prevProps.max === nextProps.max;
});

/**
 * Ma trận để nhập input
 * @param {Object} param0
 * @returns
 */
const MatrixInput = ({ rowsCount, columnsCount, typesOfChestCount, matrix, onChange }) => {
  const cellSize = 50;

  /**
   * thay đổi giá trị input ở cell
   * useCallback để memoize function, tránh tạo mới mỗi render
   * @param {Number} row hàng
   * @param {Number} col cột
   * @param {Number} value new value
   */
  const handleCellChange = useCallback((row, col, value) => {
    onChange(prevMatrix => {
      const newMatrix = prevMatrix.map(r => [...r]);
      // Parse value thành số, nếu rỗng thì để ''
      newMatrix[row][col] = value === '' ? '' : Number(value);
      return newMatrix;
    });
  }, [onChange]);

  // Memoize column headers để tránh tạo lại array mỗi render
  const columnHeaders = useMemo(() =>
    Array.from({ length: columnsCount }, (_, j) => j),
    [columnsCount]
  );

  // Memoize styles để tránh tạo lại object
  const containerStyle = useMemo(() => ({
    overflowX: 'auto',
    overflowY: 'auto',
    maxHeight: '400px',
    border: '1px solid #ddd',
    borderRadius: 1,
    p: 1.5,
    backgroundColor: '#f5f5f5'
  }), []);

  const headerCellStyle = useMemo(() => ({
    width: cellSize,
    height: cellSize / 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: 'primary.main',
    mr: 0.5
  }), [cellSize]);

  const rowHeaderStyle = useMemo(() => ({
    width: cellSize,
    height: cellSize,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: 'primary.main'
  }), [cellSize]);

  return (
    <Box>
      <Box sx={containerStyle}>
        <Box sx={{
          display: 'inline-block',
          minWidth: 'fit-content'
        }}>
          {/* Header cột */}
          <Box sx={{ display: 'flex', mb: 1 }}>
            <Box sx={{
              width: cellSize,
              height: cellSize / 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }} />
            {columnHeaders.map((j) => (
              <Box
                key={`col-header-${j}`}
                sx={headerCellStyle}
              >
                {j + 1}
              </Box>
            ))}
          </Box>

          {/* Ma trận */}
          {matrix.map((row, i) => (
            <Box key={`row-${i}`} sx={{ display: 'flex', mb: 0.5 }}>
              {/* Header hàng */}
              <Box sx={rowHeaderStyle}>
                {i + 1}
              </Box>

              {/* Các ô nhập liệu - sử dụng MatrixCell đã được memoize */}
              {row.map((cell, j) => (
                <MatrixCell
                  key={`cell-${i}-${j}`}
                  row={i}
                  col={j}
                  value={cell}
                  max={typesOfChestCount}
                  cellSize={cellSize}
                  onChange={handleCellChange}
                />
              ))}
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Ghi chú: Ô (1,1) là vị trí xuất phát của hải tặc (góc trên bên trái)
        </Typography>
      </Box>
    </Box>
  );
};

export default MatrixInput;
