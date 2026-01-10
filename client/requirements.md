## Packages
framer-motion | Smooth animations for cards and transitions
file-saver | Helper for saving the PDF blob
jspdf | (Optional) Client-side PDF generation fallback if needed, but we rely on server

## Notes
- PDF download endpoint returns a Blob. Frontend must handle creating a URL and triggering download.
- No database persistence required for history, so state is local to the session.
- Google Fonts: 'Outfit' for headers, 'Inter' for body text.
