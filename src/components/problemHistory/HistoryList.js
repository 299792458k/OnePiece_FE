import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Collapse,
  IconButton,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { toast } from 'react-toastify';
import { treasureHuntAPI } from '../../services/Api';
import { HistoryModel } from '../../models/HistoryModel';
import { formatDate } from '../../utils/Formatters';

/**
 * lịch sử các input đã lưu
 * @param {Object} param0 
 * @returns 
 */
const HistoryList = ({ refresh, onRetry }) => {
  // State lưu dữ liệu lịch sử
  const [history, setHistory] = useState([]);

  // State quản lý loading (khi lấy lấy dữ liệu)
  const [loading, setLoading] = useState(true);

  // State quản lý lỗi
  const [error, setError] = useState('');

  // State quản lý mở rộng 1 dòng lịch sử (để xem chi tiết ma trận)
  const [expandedId, setExpandedId] = useState(null);

  /**
   * Lấy dữ liệu lịch sử
   */
  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await treasureHuntAPI.getHistory();
      const processedData = HistoryModel.fromServerArray(response.data);
      setHistory(processedData);
    } catch (err) {
      setError('Không thể tải lịch sử');
    } finally {
      setLoading(false);
    }
  };

  /**
   * refresh lịch sử
   */
  useEffect(() => {
    fetchHistory();
  }, [refresh]);

  /**
   * ẩn/hiện chi tiết
   * @param {Number} id id của input đã lưu
   */
  const handleToggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  /**
   * giải lại bái toán
   * @param {Object} item dữ liệu input đã lưu
   */
  const handleRetry = (item) => {
    if (onRetry) {
      onRetry({
        rowsCount: item.rowsCount,
        columnsCount: item.columnsCount,
        typesOfChestCount: item.typesOfChestCount,
        matrix: item.matrix
      });
    }
  };

  /**
   * Xoá dữ liệu lịch sử theo id
   * @param {Number} id 
   * @returns 
   */
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài toán này?')) {
      return;
    }

    try {
      await treasureHuntAPI.delete(id);
      toast.success('Đã xóa bài toán thành công!');
      fetchHistory();
    } catch (err) {
      toast.error('Không thể xóa bài toán');
    }
  };

  /**
   * render chi tiết ma trận
   * @param {Array<Array<Number>>} matrix dữ liệu mảng 2 chiều 
   * @returns 
   */
  const renderMatrix = (matrix) => {
    const cellSize = 40;
    return (
      <Box sx={{
        overflowX: 'auto',
        border: '1px solid #ddd',
        borderRadius: 1,
        p: 1,
        backgroundColor: '#f5f5f5',
        maxWidth: '100%'
      }}>
        <Box sx={{ display: 'inline-block' }}>
          {matrix.map((row, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 0.5, mb: 0.5 }}>
              {row.map((cell, j) => (
                <Box
                  key={`${i}-${j}`}
                  sx={{
                    width: cellSize,
                    height: cellSize,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #ccc',
                    backgroundColor: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  {cell}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Lịch Sử Bài Toán ({history.length})
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={fetchHistory}
          variant="outlined"
        >
          Làm Mới
        </Button>
      </Box>

      {history.length === 0 ? (
        <Alert severity="info">
          Chưa có bài toán nào được giải. Hãy thử giải bài toán đầu tiên!
        </Alert>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {history.map((item) => (
            <Card key={item.id} elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Bài toán #{item.id}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(item.createdDate)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      onClick={() => handleToggleExpand(item.id)}
                      size="small"
                    >
                      {expandedId === item.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                    <IconButton
                      onClick={() => handleRetry(item)}
                      size="small"
                      color="primary"
                      title="Giải lại"
                    >
                      <PlayArrowIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(item.id)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Kích thước
                    </Typography>
                    <Typography variant="body1">
                      {item.rowsCount} × {item.columnsCount}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Số loại rương
                    </Typography>
                    <Typography variant="body1">
                      {item.typesOfChestCount}
                    </Typography>
                  </Grid>

                </Grid>

                <Collapse in={expandedId === item.id}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Ma trận:
                  </Typography>
                  {renderMatrix(item.matrix)}

                  {item.path && item.path.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Lộ trình:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {item.path.map((pos, index) => (
                          <React.Fragment key={index}>
                            <Chip
                              label={`(${pos.row + 1},${pos.col + 1})`}
                              size="small"
                              color={index === 0 ? 'success' : index === item.path.length - 1 ? 'error' : 'default'}
                            />
                            {index < item.path.length - 1 && <span>→</span>}
                          </React.Fragment>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Collapse>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default HistoryList;
