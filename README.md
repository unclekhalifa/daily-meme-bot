# daily-meme-bot

1. Goal: build a Twitter bot that posts memes depending on the time of the day


2. High level breakdown:
   - Script deployed as Lambda fxn
   - Triggered by EventBridge every day at 12:30? 4:44?
   - Posts meme depending on the day of the week
   - Memes hosted on S3
   - JSON file used to decide which meme to use on what day stored in S3 as well?
   

3. JSON file breakdown:
    ```
   {
        "monday": [s3-file-names...],
        "tuesday": [s3-file-names...],
        "wednesday": [s3-file-names...],
        "thursday": [s3-file-names...],
        "friday": [s3-file-names...],
        "saturday": [s3-file-names...],
        "sunday": [s3-file-names...]
   }
   ```

Each day will have an array of the filenames for every meme. We can then get the day of the week and pick a file at
random (files will be numbered).

4. Extra features:
   - We should be able to trigger Lambda manually and pass a message that will then be posted