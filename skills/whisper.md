# Whisper Skill
## Purpose
Produce timestamped transcripts from creator media.
## Architecture
Worker extracts normalized audio, transcribes through provider/local Whisper adapter, stores versioned segments.
## Libraries
FFmpeg and Whisper-compatible API/runtime.
## Folder structure
Media extractor, transcription adapter, segment schema, fixtures.
## Best practices
Detect language, preserve timestamps, reuse checksum, separate cleanup from verbatim.
## Performance targets
One-minute media <30 s target.
## Security considerations
Private temporary files, deletion, no prompt/log content.
## Examples
Segments `{startMs,endMs,text,confidence}` enable cited hooks.
## Anti-patterns
Single un-timestamped blob, repeated transcription, permanent temp media.
## Testing strategy
Languages, silence, noisy audio, timeout, segment integrity.
## Production checklist
Codec limits, temp cleanup, quota, fallback, accuracy set.
