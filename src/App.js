// Import React hooks
import React, { useState } from 'react';

// Import Material-UI theme và styling
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, Box, CssBaseline, AppBar, Toolbar, Typography, Tabs, Tab } from '@mui/material';

// Import toast notification library
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import các components
import TreasureHuntForm from './components/problemSolve/TreasureHuntForm';
import HistoryList from './components/problemHistory/HistoryList';
import ProblemDescription from './components/problemDescription/ProblemDescription';

// Import enums
import { TabIndex } from './enums/TabIndex';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#ff9800',
    },
  },
});

function App() {
  // State quản lý tab hiện tại (Mô tả / Giải / Lịch sử)
  const [currentTab, setCurrentTab] = useState(TabIndex.PROBLEM_DESCRIPTION);

  // State để trigger reload lại history list
  const [refreshHistory, setRefreshHistory] = useState(0);

  // State lưu dữ liệu form khi retry từ history
  const [formData, setFormData] = useState(null);

  /**
   * Xử lý khi người dùng chuyển tab
   * @param {*} event - Event của tab change
   * @param {TabIndex} newValue - Index của tab mới
   */
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setFormData(null); // Reset form data khi chuyển tab
  };

  /**
   * Callback khi lưu solution thành công, load lại lịch sử
   */
  const handleSolutionSaved = () => {
    setRefreshHistory(prev => prev + 1);
  };

  /**
   * Giải bài toán với input đã lưu
   * @param {Object} data - Dữ liệu input đã lưu từ history
   */
  const handleRetry = (data) => {
    setFormData(data);
    setCurrentTab(TabIndex.SOLVE_PROBLEM);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Toast notification container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              🏴‍☠️ Tìm Kho Báu Hải Tặc
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
          {/* Tab navigation */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={currentTab} onChange={handleTabChange}>
              <Tab label="Mô Tả Bài Toán" />
              <Tab label="Giải Bài Toán" />
              <Tab label="Lịch Sử" />
            </Tabs>
          </Box>

          {/* Tab 1: Hiển thị mô tả bài toán */}
          {currentTab === TabIndex.PROBLEM_DESCRIPTION && <ProblemDescription />}

          {/* Tab 2: Form giải bài toán */}
          {currentTab === TabIndex.SOLVE_PROBLEM && (
            <TreasureHuntForm
              onSolutionSaved={handleSolutionSaved}
              initialData={formData}
            />
          )}

          {/* Tab 3: Danh sách lịch sử (các input đã lưu)*/}
          {currentTab === TabIndex.HISTORY && (
            <HistoryList
              refresh={refreshHistory}
              onRetry={handleRetry}
            />
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
