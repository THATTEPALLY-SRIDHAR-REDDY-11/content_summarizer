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

    if (
      error?.name === 'YoutubeTranscriptDisabledError' ||
      /transcript.*disabled|disabled.*transcript|no transcript|captions/i.test(message)
    ) {
      const transcriptError = new Error(
        'Transcript is disabled for this video. Please use a video with captions enabled.'
      );
      transcriptError.status = 422;
      throw transcriptError;
    }

    throw error;
  }
};