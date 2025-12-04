# Image Setup Instructions for The Blockchain Circus

## Current Status

A placeholder image has been created at `src/assets/blockchain-circus/profile-1024x1024.png`. 
**You need to replace this with your actual pug profile picture!**

## Step 1: Save Your Profile Picture

1. Save the pug profile picture you attached to:
   ```
   src/assets/blockchain-circus/profile.png
   ```
   (You can use any image format - .png, .jpg, etc.)

## Step 2: Resize to 1024x1024

Run the resize script to create the TikTok-ready version (this will replace the placeholder):

```bash
npm run image:resize src/assets/blockchain-circus/profile.png src/assets/blockchain-circus/profile-1024x1024.png
```

Or manually:
```bash
node scripts/resizeImage.mjs src/assets/blockchain-circus/profile.png src/assets/blockchain-circus/profile-1024x1024.png
```

This will create/update `profile-1024x1024.png` which is:
- Used on the Blockchain Circus page
- Ready for TikTok Developer Portal submission (1024x1024px requirement)

## Step 3: Verify

After adding the image and running the resize script, the profile picture should appear on:
- The Blockchain Circus page: `/the-blockchain-circus`
- The project card in your portfolio

## Notes

- The image will be displayed as a circular profile picture (200x200px on the page)
- The 1024x1024 version is what you'll upload to TikTok Developer Portal
- The script uses "contain" fit with white background to maintain aspect ratio

