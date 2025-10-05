import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RouteIcon from '@mui/icons-material/Route';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import { formatNumber } from '../../utils/Formatters';

/**
 * Hiển thị kết quả lời giải
 * @param {Object} param0 
 * @returns 
 */
const ResultDisplay = ({ result }) => {
  if (!result) return null;
  const { minFuel, path } = result;

  return (
    <Paper elevation={3} sx={{ p: 3, backgroundColor: '#e8f5e9' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CheckCircleIcon sx={{ color: 'success.main', fontSize: 40, mr: 2 }} />
        <Typography variant="h6" color="success.main">
          Tìm Thấy Kho Báu!
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Kết quả nhiên liệu */}
      <Card sx={{ mb: 2, backgroundColor: '#fff3e0' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocalGasStationIcon sx={{ color: 'warning.main', mr: 1 }} />
            <Typography variant="h7">
              Nhiên Liệu Tối Thiểu
            </Typography>
          </Box>
          <Typography variant="h6" color="warning.main" sx={{ fontWeight: 'bold' }}>
            {formatNumber(minFuel)}
          </Typography>
        </CardContent>
      </Card>

      {/* Đường đi */}
      {path && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <RouteIcon sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h6">
                Lộ Trình Di Chuyển
              </Typography>
            </Box>

            <Box>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', color: 'primary.main' }}>
                {path}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}
    </Paper>
  );
};

export default ResultDisplay;
