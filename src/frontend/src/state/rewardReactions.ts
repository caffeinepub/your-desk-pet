export function getRewardReaction(petType: 'cat' | 'dog', action: 'feed' | 'groom' | 'pet' | 'play'): string {
  if (petType === 'cat') {
    switch (action) {
      case 'feed':
        return "Finally. This is acceptable.";
      case 'groom':
        return "I suppose I can tolerate this.";
      case 'pet':
        return "You may continue... for now.";
      case 'play':
        return "If you insist. But only because I allow it.";
      default:
        return "Hmm.";
    }
  } else {
    switch (action) {
      case 'feed':
        return "YES! FOOD! You're the BEST!";
      case 'groom':
        return "This is wonderful! I love you!";
      case 'pet':
        return "More pets! This is the best day ever!";
      case 'play':
        return "PLAY TIME! Let's go! I'm so happy!";
      default:
        return "Yay!";
    }
  }
}
