# get-hype-bot

get-hype-bot is a simple Discord bot that joins your current channel and plays an audio clip you provide from youtube.

This was written using the Discord.js and Node.js, and I've used a PostgreSQL database to store the song data
I'm using ytdl-core plus FFMPEG to download and rip the audio from the clip to stream into the discord server.

Future Enhancements:
<ul>
  <li> Cache downloaded data so we don't have to hit youtube and rip the audio every time
  <li> Create a local cache to reduce database reads when playing a song (since this will be done far more often than adding a song)
  <li> Enhance permissions so only the users who added the song, or other specified roles, can update or remove a song
  <li> Add unit testing
</ul>

This is a work in progress, and my first real foray into Node.js programming and Discord bots.
