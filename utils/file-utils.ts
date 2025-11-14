import * as fs from 'fs';
import * as path from 'path';
import AdmZip from 'adm-zip';
import * as fs2 from 'fs/promises';
import axios from 'axios';
import pdfParse from 'pdf-parse';
import sharp from 'sharp';
import { PNG } from 'pngjs';
import { expect } from '@playwright/test';

export const getFileContent = (filePath: string): string | null => {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    console.error(`Error reading file: ${filePath}`, err);
    return null;
  }
};

export const isFileExists = (filePath: string): boolean => {
  return fs.existsSync(filePath) && fs.lstatSync(filePath).isFile();
};

export const isDirExists = (dirPath: string): boolean => {
  return fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
};

export const createDir = (dirPath: string): void => {
  if (!isDirExists(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export const deleteDir = (dirPath: string): void => {
  if (isDirExists(dirPath)) {
    fs.rmdirSync(dirPath, { recursive: true });
  }
};

export const deleteFile = (filePath: string): void => {
  if (isFileExists(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export const deleteAllFilesInDir = (dirPath: string): void => {
  if (isDirExists(dirPath)) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      if (isFileExists(filePath)) {
        deleteFile(filePath);
      }
    }
  }
};

export async function deleteFilesAndFolders(folderPath: string): Promise<void> {
  try {
    // Check if the folder exists
    const entries = await fs2.readdir(folderPath, { withFileTypes: true });

    // Loop through the contents of the folder
    for (const entry of entries) {
      const entryPath = path.join(folderPath, entry.name);

      if (entry.isDirectory()) {
        // Recursively delete subfolders
        await deleteFilesAndFolders(entryPath);
        await fs2.rmdir(entryPath);
      } else {
        // Delete files
        await fs2.unlink(entryPath);
      }
    }
  } catch (error) {
    throw error;
  }
}

export async function unzipFile(zipFilePath: string, outputDir: string): Promise<void> {
  try {
    // Ensure the zip file exists
    if (!fs.existsSync(zipFilePath)) {
      throw new Error(`ZIP file not found: ${zipFilePath}`);
    }

    // Create the output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Initialize AdmZip and extract files
    const zip = new AdmZip(zipFilePath);
    zip.extractAllTo(outputDir, true);

  } catch (error) {
    throw error;
  }
}

export const getAllFileNamesFromDir = (dirPath: string): string[] => {
  if (isDirExists(dirPath)) {
    return fs.readdirSync(dirPath).filter(file => isFileExists(path.join(dirPath, file)));
  } else {
    console.error(`Directory ${dirPath} does not exist.`);
    return [];
  }
};

export async function isFileNameStartsWith(fileName: string, expectedStart: string | number): Promise<boolean> {
  return fileName.startsWith(expectedStart.toString());
}

export async function downloadVideoFromS3URL(url: string, path: string) {
  const response = await axios.get(url, {
    responseType: 'stream',
  });

  const writer = fs.createWriteStream(path);
  response.data.pipe(writer);

  return new Promise<void>((resolve, reject) => {
    writer.on('finish', () => {
      resolve();
    });
    writer.on('error', reject);
  });
}

export async function downloadImageFromS3URL(url: string, filePath: string): Promise<void> {
  const response = await axios.get(url, {
    responseType: 'stream',
  });

  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);

  return new Promise<void>((resolve, reject) => {
    writer.on('finish', () => {
      resolve();
    });
    writer.on('error', reject);
  });
}

export function readFileAsBuffer(downloadedImagePath: string) {
    throw new Error('Function not implemented.');
}

export const getFileSize = (filePath: string): number | null => {
  try {
    if (!isFileExists(filePath)) {
      return null;
    }
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (err) {
    console.error(`Error getting file size: ${filePath}`, err);
    return null;
  }
};

export async function downloadFileFromURL(url: string, filePath: string): Promise<void> {
  try {
    const response = await axios.get(url, {
      responseType: 'stream',
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    return new Promise<void>((resolve, reject) => {
      writer.on('finish', () => {
        resolve();
      });
      writer.on('error', reject);
    });
  } catch (error) {
    throw new Error(`Failed to download file from ${url}: ${error}`);
  }
}

export async function readPdfText(pdfPath: string): Promise<string> {
    try {
        const pdfFile = fs.readFileSync(pdfPath);
        const pdfData = await pdfParse(pdfFile);
        return pdfData.text;
    } catch (error) {
        console.error("Error reading PDF:", error);
        return "";
    }
}

export async function compareImages(imagePath1: string, imagePath2: string, threshold: number = 0.1): Promise<boolean> {
  try {
    // Dynamically import pixelmatch (ES module)
    const { default: pixelmatch } = await import('pixelmatch');

    // Read and convert images to PNG format with same dimensions
    const img1Buffer = await sharp(imagePath1).png().toBuffer();
    const img2Buffer = await sharp(imagePath2).png().toBuffer();

    // Get image metadata to ensure same dimensions
    const img1Metadata = await sharp(imagePath1).metadata();
    const img2Metadata = await sharp(imagePath2).metadata();

    // Resize images to same dimensions if different
    const width = Math.min(img1Metadata.width || 0, img2Metadata.width || 0);
    const height = Math.min(img1Metadata.height || 0, img2Metadata.height || 0);

    const resizedImg1 = await sharp(img1Buffer).resize(width, height).png().toBuffer();
    const resizedImg2 = await sharp(img2Buffer).resize(width, height).png().toBuffer();

    // Parse PNG data
    const png1 = PNG.sync.read(resizedImg1);
    const png2 = PNG.sync.read(resizedImg2);

    // Compare images
    const diffPixels = pixelmatch(png1.data, png2.data, undefined, width, height, { threshold: 0.1 });
    const totalPixels = width * height;
    const diffPercentage = diffPixels / totalPixels;

    return diffPercentage <= threshold;
  } catch (error) {
    console.error('Error comparing images:', error);
    return false;
  }
}

// ASSERTIONS
export const expectThatFileShouldExist = (filePath: string, message?: string): void => {
  expect(isFileExists(filePath), message || `File should exist at path: ${filePath}`).toBeTruthy();
};

export const expectThatFileCountShouldBeGreaterThan = (dirPath: string, count: number, message?: string): void => {
  const fileNames = getAllFileNamesFromDir(dirPath);
  expect(fileNames.length, message || `File count should be greater than ${count} in directory: ${dirPath}`).toBeGreaterThan(count);
};
