# daily-meme-bot

1. Goal: build a Twitter bot that posts memes depending on the day of the week

2. High level breakdown:
   - Script deployed as Lambda fxn
   - Triggered by EventBridge every day at 12:30? 4:44?
   - Posts meme depending on the day of the week
   - Memes hosted on S3
   - JSON file used to decide which tweet to post hosted in S3 as well
   

3. JSON file breakdown:
    ```
   {
        "monday": [tweetsToPost...],
        "tuesday": [tweetsToPost...],
        "wednesday": [tweetsToPost...],
        "thursday": [tweetsToPost...],
        "friday": [tweetsToPost...],
        "saturday": [tweetsToPost...],
        "sunday": [tweetsToPost...]]
   }
   ```

Each day will have an array of the tweets for every meme. We can then get the day of the week and pick a tweet at
random.

4. Extra features:
   - We should be able to trigger Lambda manually and pass a message that will then be posted

5. Running/testing
```
npm install
node index.js -d
```