import { MoodTier } from './mood';

export interface DialogueSet {
  [key: string]: string[];
}

export const catDialogues: DialogueSet = {
  calm: [
    "I suppose you're working. How novel.",
    "Don't mind me. I'll just be here... watching.",
    "Focus time. Try not to disappoint me."
  ],
  annoyed: [
    "Oh. You're still here. I assumed you'd started.",
    "I scheduled my disappointment for earlier, but this works.",
    "Staring at the screen counts as thinking now?"
  ],
  judging: [
    "Interesting strategy. Let's see how ignoring responsibility plays out.",
    "You know, other humans manage to work and feed their cats.",
    "I've waited longer for food. I just never forgot."
  ],
  furious: [
    "At this point, I'm not hungry…just disappointed.",
    "Do you want me to remind you why you set a focus timer?",
    "This delay will be noted. Internally. Forever."
  ],
  happy: [
    "Acceptable performance. You may feed me.",
    "Well done. I knew you had it in you... eventually.",
    "Finally. Let's not make me wait this long again."
  ]
};

export const dogDialogues: DialogueSet = {
  calm: [
    "Hey! Is it focus time? I'm ready! I'm so ready!",
    "You've got this! I believe in you!",
    "Let's do this together! I'll be right here!"
  ],
  anxious: [
    "Oh okay, we're just warming up. That's fine. Totally fine.",
    "I can wait! I'm great at waiting. Look, I'm waiting!",
    "Everything's okay, right? We're still doing this?"
  ],
  desperate: [
    "Do you think the work knows you're avoiding it?",
    "I told myself you had a plan. Please tell me you had a plan.",
    "Every minute you delay is one less minute of believing in you."
  ],
  furious: [
    "I defended you. To no one. But still.",
    "If this is a test, I think we're failing together.",
    "I'm still proud of you. Just… confused."
  ],
  happy: [
    "YOU DID IT! I KNEW YOU WOULD! FOOD TIME!",
    "I'm so proud! You're the best! Can we eat now?",
    "That was amazing! You're amazing! Let's celebrate!"
  ]
};

export function getDialogue(petType: 'cat' | 'dog', mood: MoodTier): string {
  const dialogues = petType === 'cat' ? catDialogues : dogDialogues;
  const moodDialogues = dialogues[mood] || dialogues.calm;
  return moodDialogues[Math.floor(Math.random() * moodDialogues.length)];
}
