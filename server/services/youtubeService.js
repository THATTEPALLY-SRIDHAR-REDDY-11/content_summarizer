import { YoutubeTranscript } from 'youtube-transcript';

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
  } catch {
    return input;
  }

  return input;
};

export const extractYoutubeText = async (youtubeUrl) => {
  const videoId = getVideoId(youtubeUrl);
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    return transcript.map((item) => item.text).join(' ').replace(/\s+/g, ' ').trim();
  } catch (error) {
    const message = error?.message || '';
    const status = 422;

    if (error?.name === 'YoutubeTranscriptDisabledError') {
      const transcriptError = new Error(
        'Transcript is disabled for this video. Please use a video with captions enabled.'
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
        'Transcript is disabled for this video. Please use a video with captions enabled.'
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