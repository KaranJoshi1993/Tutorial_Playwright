import { getVideoDurationInSeconds } from 'get-video-duration';

/**
 * Video utility functions for automation tests
 */
export class VideoUtils {
    /**
     * Gets the duration of a video file in seconds
     * 
     * @param filePath Path to the video file
     * @returns A promise that resolves to the duration in seconds
     */
    static async getVideoDuration(filePath: string): Promise<number> {
        try {
            const duration = await getVideoDurationInSeconds(filePath);
            return duration;
        } catch (error) {
            console.error(`Failed to get video duration for file ${filePath}:`, error);
            throw error;
        }
    }

    /**
     * Formats duration in seconds to a human-readable string (HH:MM:SS)
     * 
     * @param durationInSeconds Duration in seconds
     * @returns Formatted duration string
     */
    static formatDuration(durationInSeconds: number): string {
        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        const seconds = Math.floor(durationInSeconds % 60);
        
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }
    
    /**
     * Compares two video durations with a tolerance
     * 
     * @param duration1 First duration in seconds
     * @param duration2 Second duration in seconds
     * @param toleranceSeconds Tolerance in seconds for the comparison (default: 1 second)
     * @returns True if the durations are within the tolerance range
     */
    static areDurationsEqual(duration1: number, duration2: number, toleranceSeconds: number = 1): boolean {
        return Math.abs(duration1 - duration2) <= toleranceSeconds;
    }
}
