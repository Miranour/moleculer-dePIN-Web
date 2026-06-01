import axios from 'axios';

const PDB_FILES_URL = 'https://files.rcsb.org/download';

export const pdbService = {
  /**
   * PDB ID kullanarak protein yapısını (PDB formatında) getirir
   */
  fetchPdbData: async (pdbId: string): Promise<string> => {
    try {
      const response = await axios.get(`${PDB_FILES_URL}/${pdbId.toLowerCase()}.pdb`);
      return response.data;
    } catch (error) {
      console.error('PDB verisi çekilirken hata oluştu:', error);
      throw new Error('Protein yapısı bulunamadı veya ağ hatası oluştu.');
    }
  },

  /**
   * PDB ID'si geçerli mi kontrol eder
   */
  validatePdbId: (pdbId: string): boolean => {
    const pdbRegex = /^[1-9][a-zA-Z0-9]{3}$/;
    return pdbRegex.test(pdbId);
  }
};
