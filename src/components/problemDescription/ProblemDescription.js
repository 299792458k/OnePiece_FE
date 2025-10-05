import React from 'react';
import { Paper, Typography, Box, Divider } from '@mui/material';

/**
 * Mô tả bài toán
 * @returns 
 */
const ProblemDescription = () => {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Tìm Kho Báu
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
        Đoàn hải tặc tìm thấy một bản đồ kho báu, tuy nhiên để đến được kho báu thì phải vượt qua được thử thách. Vùng biển chứa kho báu là một ma trận các hòn đảo <strong>n</strong> hàng <strong>m</strong> cột, mỗi đảo có một chiếc rương đánh dấu bởi một số nguyên dương trong khoảng từ 1 đến <strong>p</strong> (tạm gọi là số <strong>x</strong>), và nó sẽ chứa chìa khoá cho chiếc rương đánh số <strong>x + 1</strong>. Và chỉ có chiếc rương được đánh số <strong>p</strong> (và là số lớn nhất) là chứa kho báu.
      </Typography>

      <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
        Để đi từ hòn đảo <strong>(x₁, y₁)</strong> đến đảo <strong>(x₂, y₂)</strong> cần một lượng nhiên liệu là <strong>√[(x₁ − x₂)² + (y₁ − y₂)²]</strong>.
      </Typography>

      <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
        Hải tặc đang ở hòn đảo <strong>(1, 1)</strong> - hàng 1 cột 1 và đã có sẵn chìa khoá số 0. Với việc cần tiết kiệm nhiên liệu để trở về, hãy tính lượng nhiên liệu ít nhất để lấy được kho báu. Biết rằng luôn có đường dẫn đến kho báu.
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Input:
        </Typography>
        <Typography variant="body1" component="div" sx={{ ml: 2 }}>
          <ul>
            <li>
              3 số nguyên dương <strong>n, m, p</strong> (1 ≤ n, m ≤ 500, 1 ≤ p ≤ n×m) – lần lượt là số hàng, số cột của ma trận và số p – số loại rương có thể có trên ma trận
            </li>
            <li>
              Ma trận n hàng m cột, mỗi vị trí là một số nguyên biểu thị ma trận kho báu: <strong>a[i][j]</strong> (1 ≤ a[i][j] ≤ p) là số thứ tự của rương trong mỗi hòn đảo. Và chỉ có một hòn đảo chứa rương đánh số p.
            </li>
          </ul>
        </Typography>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Output:
        </Typography>
        <Typography variant="body1" sx={{ ml: 2 }}>
          Một số thực là lượng nhiên liệu nhỏ nhất mà hải tặc cần có để lấy được rương kho báu.
        </Typography>
      </Box>
    </Paper>
  );
};

export default ProblemDescription;
