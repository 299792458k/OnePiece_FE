export class HistoryModel {
  constructor(data) {
    this.id = data.id;
    this.rowsCount = data.rowsCount;
    this.columnsCount = data.columnsCount;
    this.typesOfChestCount = data.typesOfChestCount;
    this.matrix = this.parseMatrix(data.matrix, data.rowsCount, data.columnsCount);
    this.minFuel = data.minFuel;
    this.path = data.path || [];
    this.createdDate = data.createdDate;
  }

  /**
   * Map dữ liệu ma trận trả về từ server
   * @param {String} matrixString 
   * @param {Number} rows 
   * @param {Number} cols 
   * @returns 
   */
  parseMatrix(matrixString, rows, cols) {
    try {
      if (!matrixString || !rows || !cols) return [];
      const values = matrixString.split(',').map(Number);
      const matrix = [];
      for (let i = 0; i < rows; i++) {
        matrix.push(values.slice(i * cols, (i + 1) * cols));
      }
      return matrix;
    } catch (err) {
      console.error('Error parsing matrix:', err);
      return [];
    }
  }

  /**
   * Parse dữ liệu lịch sử từ server
   * @param {Object} data 
   * @returns 
   */
  static fromServerData(data) {
    return new HistoryModel(data);
  }

  /**
   * dữ liệu lịch sử input
   * @param {Array} dataArray 
   * @returns 
   */
  static fromServerArray(dataArray) {
    return dataArray.map(item => HistoryModel.fromServerData(item));
  }
}
