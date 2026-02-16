import { MoodTier } from '../state/mood';

interface SpriteInfo {
  src: string;
  position: string;
}

export function getPetSprite(petType: 'cat' | 'dog', mood: MoodTier): SpriteInfo {
  const spriteSheet = petType === 'cat' 
    ? '/assets/generated/cat-sprites.dim_512x128.png'
    : '/assets/generated/dog-sprites.dim_512x128.png';

  // Sprite sheet has 4 frames: idle, annoyed/anxious, furious/desperate, happy
  // Each frame is 128x128 in a 512x128 sheet
  let frameIndex = 0;
  
  if (petType === 'cat') {
    switch (mood) {
      case 'calm': frameIndex = 0; break;
      case 'annoyed': frameIndex = 1; break;
      case 'judging': frameIndex = 1; break;
      case 'furious': frameIndex = 2; break;
      case 'happy': frameIndex = 3; break;
      default: frameIndex = 0;
    }
  } else {
    switch (mood) {
      case 'calm': frameIndex = 0; break;
      case 'anxious': frameIndex = 1; break;
      case 'desperate': frameIndex = 2; break;
      case 'furious': frameIndex = 2; break;
      case 'happy': frameIndex = 3; break;
      default: frameIndex = 0;
    }
  }

  const xOffset = frameIndex * -128;

  return {
    src: spriteSheet,
    position: `${xOffset}px 0px`
  };
}
