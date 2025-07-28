import multer from "multer";

export const uploadMemory = () => {
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 1 * 1024 * 1024 },
  });
};
