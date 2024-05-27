import { invoke } from "@tauri-apps/api/tauri";

export const checkIsFile = async (fileFullPath: string) => {
  try {
    const result = await invoke<boolean>("is_file", {
      path: fileFullPath,
    });
    return result;
  } catch (error) {
    console.error("Error checking file:", error);
  }
};
