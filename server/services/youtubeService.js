import { fetchTranscript } from 'youtube-transcript';

const getVideoId = (input) => {
  try {
    const url = new URL(input);

    if (url.hostname.includes('youtu.be')) {
      return url.pathname.replace('/', '');
    }

    if (url.searchParams.get('v')) {
      return url.searchParams.get('v');
    }

    const match = url.pathname.match(/\/shorts\/([^/]+)/);
    if (match) {
      return match[1];
    }

    const liveMatch = url.pathname.match(/\/live\/([^/]+)/);
    if (liveMatch) {
      return liveMatch[1];
    }

    const embedMatch = url.pathname.match(/\/embed\/([^/]+)/);
    if (embedMatch) {
      return embedMatch[1];
    }
  } catch {
    return input;
  }

  return input;
};

const normalizeYoutubeUrl = (input) => {
  const videoId = getVideoId(input);

  if (!videoId || videoId === input) {
    return input;
  }

  return `https://www.youtube.com/watch?v=${videoId}`;
};

const tryFetchTranscript = async (candidate, config) => {
  try {
    return await fetchTranscript(candidate, config);
  } catch (error) {
    return error;
  }
};

export const extractYoutubeText = async (youtubeUrl) => {
  const videoId = getVideoId(youtubeUrl);
  const normalizedUrl = normalizeYoutubeUrl(youtubeUrl);

  const attempts = [
    { candidate: youtubeUrl, config: { lang: 'en' } },
    { candidate: youtubeUrl, config: undefined },
    { candidate: normalizedUrl, config: { lang: 'en' } },
    { candidate: normalizedUrl, config: undefined },
    { candidate: videoId, config: { lang: 'en' } },
    { candidate: videoId, config: undefined }
  ];

  let lastError;

  for (const attempt of attempts) {
    lastError = await tryFetchTranscript(attempt.candidate, attempt.config);

    if (!lastError || Array.isArray(lastError)) {
      const transcript = lastError;
      return transcript.map((item) => item.text).join(' ').replace(/\s+/g, ' ').trim();
    }
  }

  try {
    throw lastError;
  } catch (error) {
    const message = error?.message || '';
    const status = 422;

    if (error?.name === 'YoutubeTranscriptDisabledError') {
      const transcriptError = new Error(
        'This YouTube video does not expose a transcript. Try a video with captions enabled.'
      );
      transcriptError.status = status;
      throw transcriptError;
    }

    if (error?.name === 'YoutubeTranscriptNotAvailableError') {
      const transcriptError = new Error(
        'No transcript is available for this video. Try another video with captions enabled.'
      );
      transcriptError.status = status;
      throw transcriptError;
    }

    if (error?.name === 'YoutubeTranscriptNotAvailableLanguageError') {
      const transcriptError = new Error(
        'A transcript exists, but not in the requested language for this video.'
      );
      transcriptError.status = status;
      throw transcriptError;
    }

    if (error?.name === 'YoutubeTranscriptVideoUnavailableError') {
      const transcriptError = new Error('This YouTube video is unavailable or has been removed.');
      transcriptError.status = status;
      throw transcriptError;
    }

    if (error?.name === 'YoutubeTranscriptTooManyRequestError') {
      const transcriptError = new Error(
        'YouTube is temporarily rate limiting transcript requests. Please try again later.'
      );
      transcriptError.status = 429;
      throw transcriptError;
    }

    if (/transcript.*disabled|disabled.*transcript/i.test(message)) {
      const transcriptError = new Error(
        'This YouTube video does not expose a transcript. Try a video with captions enabled.'
      );
      transcriptError.status = status;
      throw transcriptError;
    }

    if (/no transcript|no transcripts|captions/i.test(message)) {
      const transcriptError = new Error(
        'No transcript is available for this video. Try another video with captions enabled.'
      );
      transcriptError.status = status;
      throw transcriptError;
    }

    throw error;
  }
};