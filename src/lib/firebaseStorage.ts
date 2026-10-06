import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import { storage } from "./firebase";

// =====================================================
// Upload a user avatar image
// =====================================================

export const uploadAvatarImage = async (
  userId: string,
  file: File
): Promise<string> => {
  const storageRef = ref(
    storage,
    `avatars/${userId}_${Date.now()}`
  );

  const uploadTask = uploadBytesResumable(
    storageRef,
    file
  );

  const snapshot = await new Promise<
    import("firebase/storage").UploadTaskSnapshot
  >((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      undefined,
      reject,
      () => resolve(uploadTask.snapshot)
    );
  });

  return await getDownloadURL(snapshot.ref);
};


// =====================================================
// Upload a document
// =====================================================

export const uploadDocument = async (
  filename: string,
  file: File
): Promise<string> => {
  const storageRef = ref(
    storage,
    `documents/${filename}_${Date.now()}`
  );

  const uploadTask = uploadBytesResumable(
    storageRef,
    file
  );

  const snapshot = await new Promise<
    import("firebase/storage").UploadTaskSnapshot
  >((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      undefined,
      reject,
      () => resolve(uploadTask.snapshot)
    );
  });

  return await getDownloadURL(snapshot.ref);
};


// =====================================================
// Generic file upload with progress tracking
// =====================================================

export const uploadFileWithProgress = (
  path: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);

    const uploadTask = uploadBytesResumable(
      storageRef,
      file
    );

    uploadTask.on(
      "state_changed",

      // Progress
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred /
            snapshot.totalBytes) *
          100;

        if (onProgress) {
          onProgress(progress);
        }
      },

      // Error
      (error) => {
        reject(error);
      },

      // Complete
      async () => {
        try {
          const downloadURL =
            await getDownloadURL(
              uploadTask.snapshot.ref
            );

          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};


// =====================================================
// Get a download URL for a specific path
// =====================================================

export const getFileUrl = async (
  path: string
): Promise<string> => {
  const storageRef = ref(storage, path);

  return await getDownloadURL(storageRef);
};


// =====================================================
// Delete a file
// =====================================================

export const deleteFile = async (
  path: string
): Promise<void> => {
  const storageRef = ref(storage, path);

  await deleteObject(storageRef);
};