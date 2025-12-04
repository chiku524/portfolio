# Blockchain Circus Assets

## Profile Picture Setup

1. **Save your pug profile picture** to this directory as `profile.png` (or any image format)

2. **Resize to 1024x1024** using the npm script:
   ```bash
   npm run image:resize src/assets/blockchain-circus/profile.png src/assets/blockchain-circus/profile-1024x1024.png
   ```

   Or manually:
   ```bash
   node scripts/resizeImage.mjs src/assets/blockchain-circus/profile.png src/assets/blockchain-circus/profile-1024x1024.png
   ```

3. The resized image (`profile-1024x1024.png`) will be used:
   - On the Blockchain Circus page
   - For TikTok Developer Portal submission (1024x1024 requirement)

## File Structure

- `profile.png` - Original image (your pug picture)
- `profile-1024x1024.png` - Resized version for TikTok (1024x1024px)

