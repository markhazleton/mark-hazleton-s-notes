import fs from "node:fs/promises";
import path from "node:path";
import ytDlpModule from "yt-dlp-wrap";

// Handle double default export
const YtDlpWrap = ytDlpModule.default || ytDlpModule;

const YOUTUBE_CHANNEL_HANDLE = "@MarkHazleton";
const YOUTUBE_CHANNEL_ID = "UCWy4-89rNbDI_HGUCB8pkBA";
const CHANNEL_URL = `https://www.youtube.com/${YOUTUBE_CHANNEL_HANDLE}`;

// Cache configuration
const CACHE_MAX_AGE_DAYS = 7; // Re-fetch video metadata older than 7 days
const MAX_VIDEOS_TO_CHECK = 50; // Limit how many videos we check from channel

/**
 * Fetches YouTube videos using yt-dlp with intelligent caching
 * Only fetches new videos or videos that haven't been cached recently
 */
async function fetchYouTubeVideosWithCache() {
  console.log("Fetching YouTube videos with caching enabled...");

  const rootDir = process.cwd();
  const dataDir = path.join(rootDir, "src", "data");
  const cacheDir = path.join(rootDir, ".youtube-cache");
  const outputPath = path.join(dataDir, "youtube-videos.json");
  const cacheMetaPath = path.join(cacheDir, "cache-metadata.json");

  try {
    // Ensure directories exist
    await fs.mkdir(dataDir, { recursive: true });
    await fs.mkdir(cacheDir, { recursive: true });

    // Load existing data and cache metadata
    const existingData = await loadExistingData(outputPath);
    const cacheMetadata = await loadCacheMetadata(cacheMetaPath);

    console.log("Downloading yt-dlp binary (if needed)...");
    const binDir = path.join(rootDir, "node_modules", ".bin");
    await fs.mkdir(binDir, { recursive: true });

    const binaryPath = await YtDlpWrap.downloadFromGithub(
      path.join(binDir, process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp")
    );

    console.log(`Using yt-dlp at: ${binaryPath}`);
    const ytDlp = new YtDlpWrap(binaryPath);

    console.log("Fetching video list from channel...");

    // First, get just the list of video IDs (fast)
    const jsonText = await ytDlp.execPromise([
      "--dump-single-json",
      "--flat-playlist",
      "--no-warnings",
      "--skip-download",
      CHANNEL_URL,
    ]);

    const data = JSON.parse(jsonText);
    const entries = data.entries || [];
    const recentEntries = entries.slice(0, MAX_VIDEOS_TO_CHECK);

    console.log(`Found ${entries.length} videos in channel (checking ${recentEntries.length})`);

    // Determine which videos need fetching
    const { newVideos, cachedVideos, removedVideos } = categorizeVideos(
      recentEntries,
      existingData.videos,
      cacheMetadata
    );

    console.log(`\nCache Analysis:`);
    console.log(`  ✓ Cached videos (reusing): ${cachedVideos.length}`);
    console.log(`  ↓ New videos (fetching): ${newVideos.length}`);
    console.log(`  ✗ Removed videos: ${removedVideos.length}`);

    // Fetch metadata for new videos only
    const fetchedVideos = [];
    for (const entry of newVideos) {
      try {
        const videoJsonText = await ytDlp.execPromise([
          "--dump-single-json",
          "--no-warnings",
          "--skip-download",
          `https://www.youtube.com/watch?v=${entry.id}`,
        ]);

        const videoData = JSON.parse(videoJsonText);
        const video = {
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
        };

        fetchedVideos.push(video);
        console.log(`  ✓ Fetched: ${video.title}`);
      } catch (error) {
        console.warn(`  ✗ Failed to fetch video ${entry.id}: ${error.message}`);
      }
    }

    // Combine cached and newly fetched videos
    const allVideos = [...cachedVideos, ...fetchedVideos];

    // Sort by published date (newest first)
    allVideos.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    // Update cache metadata
    const newCacheMetadata = {
      lastUpdated: new Date().toISOString(),
      videoCache: allVideos.reduce((acc, video) => {
        acc[video.id] = {
          cachedAt: cacheMetadata.videoCache?.[video.id]?.cachedAt || new Date().toISOString(),
          title: video.title,
        };
        return acc;
      }, {}),
      stats: {
        totalVideos: allVideos.length,
        newVideosFetched: fetchedVideos.length,
        videosReused: cachedVideos.length,
        videosRemoved: removedVideos.length,
      },
    };

    // Save output file
    await fs.writeFile(
      outputPath,
      JSON.stringify(
        {
          generated_at: new Date().toISOString(),
          channel_id: YOUTUBE_CHANNEL_ID,
          videos: allVideos,
        },
        null,
        2
      )
    );

    // Save cache metadata
    await fs.writeFile(cacheMetaPath, JSON.stringify(newCacheMetadata, null, 2));

    console.log(`\n✓ Saved ${allVideos.length} videos to ${outputPath}`);
    console.log(
      `✓ Cache efficiency: ${cachedVideos.length}/${allVideos.length} videos reused (${Math.round(
        (cachedVideos.length / allVideos.length) * 100
      )}%)`
    );
  } catch (error) {
    console.error("Error fetching YouTube videos:", error.message);
    console.error(error.stack);

    // Don't fail the build, use existing data or create empty file
    const existingData = await loadExistingData(outputPath);
    if (existingData.videos.length > 0) {
      console.log(`✓ Using existing cached data with ${existingData.videos.length} videos`);
    } else {
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
}

/**
 * Load existing video data from output file
 */
async function loadExistingData(outputPath) {
  try {
    const content = await fs.readFile(outputPath, "utf-8");
    const data = JSON.parse(content);
    return {
      videos: data.videos || [],
      generated_at: data.generated_at,
    };
  } catch (error) {
    return { videos: [], generated_at: null };
  }
}

/**
 * Load cache metadata
 */
async function loadCacheMetadata(cacheMetaPath) {
  try {
    const content = await fs.readFile(cacheMetaPath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    return { videoCache: {}, lastUpdated: null };
  }
}

/**
 * Categorize videos into new, cached, and removed
 */
function categorizeVideos(channelEntries, existingVideos, cacheMetadata) {
  const channelVideoIds = new Set(channelEntries.map((e) => e.id));
  const existingVideoMap = new Map(existingVideos.map((v) => [v.id, v]));
  const cacheAgeLimit = new Date();
  cacheAgeLimit.setDate(cacheAgeLimit.getDate() - CACHE_MAX_AGE_DAYS);

  const newVideos = [];
  const cachedVideos = [];
  const removedVideos = [];

  // Check each video in the channel
  for (const entry of channelEntries) {
    const existingVideo = existingVideoMap.get(entry.id);
    const cacheEntry = cacheMetadata.videoCache?.[entry.id];

    if (!existingVideo) {
      // Brand new video
      newVideos.push(entry);
    } else if (cacheEntry && new Date(cacheEntry.cachedAt) > cacheAgeLimit) {
      // Video exists and cache is fresh
      cachedVideos.push(existingVideo);
    } else {
      // Video exists but cache is stale - re-fetch
      newVideos.push(entry);
    }
  }

  // Find removed videos
  for (const video of existingVideos) {
    if (!channelVideoIds.has(video.id)) {
      removedVideos.push(video);
    }
  }

  return { newVideos, cachedVideos, removedVideos };
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
fetchYouTubeVideosWithCache();
