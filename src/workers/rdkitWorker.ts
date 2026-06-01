/// <reference lib="webworker" />

let rdkitModule: any = null;

const initRDKit = async () => {
  if (rdkitModule) return;
  // @rdkit/rdkit exposes initRDKitModule globally or via import. 
  // In a worker we can import scripts or use modern imports if we bundle it.
  // We'll use dynamic import since we are using vite
  try {
    const initRDKitModule = (await import('@rdkit/rdkit')).default as any;
    rdkitModule = await initRDKitModule();
    self.postMessage({ type: 'INIT_SUCCESS' });
  } catch (error: any) {
    self.postMessage({ type: 'INIT_ERROR', error: error.message });
  }
};

self.addEventListener('message', async (e) => {
  const { type, payload, id } = e.data;

  if (type === 'INIT') {
    await initRDKit();
  } 
  
  if (!rdkitModule) return;

  if (type === 'VALIDATE_SMILES') {
    const { smiles } = payload;
    try {
      const mol = rdkitModule.get_mol(smiles);
      if (mol) {
        // If mol is created, the smiles is valid.
        // We can check for valency errors or other properties
        const isValid = mol.is_valid();
        const details = rdkitModule.get_mol_details(mol);
        mol.delete();
        
        self.postMessage({ 
          type: 'VALIDATE_SMILES_RESULT', 
          id,
          payload: { isValid, details } 
        });
      } else {
        self.postMessage({ 
          type: 'VALIDATE_SMILES_RESULT', 
          id,
          payload: { isValid: false, details: 'Invalid SMILES' } 
        });
      }
    } catch (err: any) {
      self.postMessage({ 
        type: 'VALIDATE_SMILES_RESULT', 
        id,
        payload: { isValid: false, details: err.message } 
      });
    }
  }

  // Handle other RDKit tasks like structure generation, etc.
});
