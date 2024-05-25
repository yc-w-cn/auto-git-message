import { invoke } from "@tauri-apps/api/tauri";

export const checkIsDirectory = async (fileFullPath: string) => {
  try {
    const result = await invoke<boolean>("is_directory", {
      path: fileFullPath,
    });
    return result;
  } catch (error) {
    console.error("Error checking directory:", error);
  }
};
