class PromptService {
  private dailyPrompts = [
    `What inspired you today?`,
    `What’s something you’re looking forward to in the future?`,
    `What made you smile or laugh today?`,
    `What are you grateful for today?`,
    `What simple things are you grateful for today?`,
    `Who made a positive impact in your life recently?`,
    `What relationships are you thankful for today?`,
    `What big or small accomplishments can you celebrate today?`,
    `What about today has been better than yesterday?`,
    `What are your favourite moments from today?`,
    `What would you want to do for future you?`,
  ];

  private otherPrompts = [
    `What does love mean to you?`,
    `Who do you admire most in this world, and why?`,
    `If you could, what is the one thing you would change from your past?`,
    `What one event in your life has changed you the most?`,
    `What is a day that you'd like to forget?`,
    `What would you do if you could travel into the future?`,
    `Describe what a perfect day looks like to you.`,
    `What is your hobby? Why do you enjoy it?`,
    `What is something that you can't tell people you know about?`,
    `What is your favourite song, and why?`,
    `Is there something that upset you today? Why?`,
    `Is there something that you are frustrated about today?`,
  ];

  newDailyPrompt = () => {
    const idx = Math.floor(Math.random() * this.dailyPrompts.length);
    const prompt = this.dailyPrompts[idx];
    return prompt;
  };

  newOtherPrompt = () => {
    const isDailyPrompt = Math.random() > 0.5;
    const arr = isDailyPrompt ? this.dailyPrompts : this.otherPrompts;
    const idx = Math.floor(Math.random() * arr.length);
    const prompt = arr[idx];
    return prompt;
  };
}

export default new PromptService();
