import fs from "node:fs/promises";
import path from "node:path";
import ytDlpModule from "yt-dlp-wrap";

// Handle double default export
const YtDlpWrap = ytDlpModule.default || ytDlpModule;

const YOUTUBE_CHANNEL_HANDLE = "@MarkHazleton";
const YOUTUBE_CHANNEL_ID = "UCWy4-89rNbDI_HGUCB8pkBA";
const CHANNEL_URL = `https://www.youtube.com/${YOUTUBE_CHANNEL_HANDLE}`;

/**
 * Fetches YouTube videos using yt-dlp and saves to data folder
 */
async function fetchYouTubeVideos() {
  console.log("Fetching YouTube videos using yt-dlp...");

  const rootDir = process.cwd();
  const dataDir = path.join(rootDir, "src", "data");
  const outputPath = path.join(dataDir, "youtube-videos.json");

  try {
    await fs.mkdir(dataDir, { recursive: true });

    console.log("Downloading yt-dlp binary (if needed)...");
    // Download yt-dlp binary to a specific location
    const binDir = path.join(rootDir, "node_modules", ".bin");
    await fs.mkdir(binDir, { recursive: true });

    const binaryPath = await YtDlpWrap.downloadFromGithub(
      path.join(binDir, process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp")
    );

    console.log(`Using yt-dlp at: ${binaryPath}`);

    // Initialize yt-dlp with binary path
    const ytDlp = new YtDlpWrap(binaryPath);

    console.log("Fetching video metadata from channel...");

    // Fetch playlist info with full metadata
    // We use --extract-flat to get all videos quickly without downloading
    const jsonText = await ytDlp.execPromise([
      "--dump-single-json",
      "--flat-playlist",
      "--no-warnings",
      "--skip-download",
      CHANNEL_URL,
    ]);

    const data = JSON.parse(jsonText);
    const entries = data.entries || [];

    console.log(`Found ${entries.length} videos in channel`);

    // For each video, we need to fetch full metadata to get description and dates
    // Limit to most recent 50 videos to avoid long build times
    const recentEntries = entries.slice(0, 50);
    const videos = [];

    for (const entry of recentEntries) {
      if (!entry.id) continue;

      try {
        // Fetch full metadata for this video
        const videoJsonText = await ytDlp.execPromise([
          "--dump-single-json",
          "--no-warnings",
          "--skip-download",
          `https://www.youtube.com/watch?v=${entry.id}`,
        ]);

        const videoData = JSON.parse(videoJsonText);

        videos.push({
          id: videoData.id,
          title: videoData.title || entry.title || "Untitled Video",
          description: videoData.description || "",
          publishedAt: videoData.upload_date
            ? formatDateFromYtDlp(videoData.upload_date)
            : new Date().toISOString(),
          thumbnailUrl:
            videoData.thumbnail || `https://i.ytimg.com/vi/${videoData.id}/hqdefault.jpg`,
          videoUrl: videoData.webpage_url || `https://www.youtube.com/watch?v=${videoData.id}`,
          channelTitle: videoData.uploader || videoData.channel || "Mark Hazleton",
          duration: videoData.duration || 0,
          viewCount: videoData.view_count || 0,
        });

        console.log(`  ✓ Fetched: ${videoData.title}`);
      } catch (error) {
        console.warn(`  ✗ Failed to fetch video ${entry.id}: ${error.message}`);
        // Continue with next video
      }
    }

    // Sort by published date (newest first)
    videos.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    // Save to file
    await fs.writeFile(
      outputPath,
      JSON.stringify(
        {
          generated_at: new Date().toISOString(),
          channel_id: YOUTUBE_CHANNEL_ID,
          videos,
        },
        null,
        2
      )
    );

    console.log(`\n✓ Saved ${videos.length} videos to ${outputPath}`);
  } catch (error) {
    console.error("Error fetching YouTube videos:", error.message);
    console.error(error.stack);

    // Don't fail the build, create empty file with error
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(
      outputPath,
      JSON.stringify(
        {
          generated_at: new Date().toISOString(),
          channel_id: YOUTUBE_CHANNEL_ID,
          videos: [],
          error: error.message,
        },
        null,
        2
      )
    );
    console.log("✓ Created empty videos file (fetch failed)");
  }
}

/**
 * Convert yt-dlp date format (YYYYMMDD) to ISO string
 */
function formatDateFromYtDlp(dateString) {
  if (!dateString || dateString.length !== 8) {
    return new Date().toISOString();
  }

  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);

  return new Date(`${year}-${month}-${day}`).toISOString();
}

// Run the script
fetchYouTubeVideos();
