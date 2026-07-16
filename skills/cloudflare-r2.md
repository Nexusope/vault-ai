# Cloudflare R2 Skill
## Purpose
Store private media and generated assets.
## Architecture
Database owns metadata; R2 owns bytes; access is through short signed URLs.
## Libraries
Cloudflare R2 binding/S3 API.
## Folder structure
Storage adapter, key policy, upload/download services, lifecycle jobs.
## Best practices
Opaque keys, checksum, content sniffing, quarantine, lifecycle, orphan reconciliation.
## Performance targets
Upload acknowledgement <2 s; regional download start <500 ms.
## Security considerations
No public buckets; validate MIME/size; signed URL ≤5 minutes.
## Examples
`prod/{tenant}/{assetId}/thumbnail.webp`.
## Anti-patterns
User filename as key, permanent public URL, DB blobs.
## Testing strategy
Upload, checksum mismatch, unauthorized access, delete, expiry.
## Production checklist
CORS, lifecycle, replication choice, inventory, restore.
