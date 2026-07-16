# Storage

R2 stores source media, thumbnails, transcripts, exports, and generated assets. Keys are opaque: `{environment}/{tenant}/{assetId}/{variant}`. Metadata in the database records owner, checksum, MIME, bytes, dimensions/duration, state, encryption version, and retention class.

Uploads use short-lived signed URLs, declared size/MIME, checksum verification, quarantine, and malware scan before promotion. Downloads use authorization-checked signed URLs valid for five minutes. Browser-supplied filenames are display metadata only. Public buckets are forbidden.

Lifecycle rules delete failed temporary uploads after 24 hours and honor workspace retention. Deleting an idea revokes access immediately, then removes derivatives and vectors asynchronously. Daily inventory reconciles orphaned database rows and objects. Restore procedures are tested quarterly; media RPO is 24 hours unless cross-region replication is enabled.
