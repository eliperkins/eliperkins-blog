---
title: "Tools I Love: xcrun simctl io booted recordVideo"
date: 2026-01-30
excerpt: Record high quality videos of the iOS simulator right from the command line.
---

I've used a million different ways to record videos of iOS apps that I've worked over the last many years. From recording with tools like [CleanShot X](https://cleanshot.com) to macOS's built-in screen recorder, to QuickTime recordings of devices.

Even Simulator.app has a built-in way of recording videos via buttons in the UI now too:

<figure>
    <img src="/images/record-video-sim.gif">
    <figcaption>Holding <kbd>option</kbd> swaps the button in Simulator.app from capturing a screenshot to recording a video.</figcaption>
</figure>

However, one method of recording videos has really stuck with me: `xcrun simctl io booted recordVideo`.

I've got a lil function in my dotfiles for this command, since I use it so often:

```bash
function xcrecord() {
    xcrun simctl io booted recordVideo ~/Desktop/$(uuidgen).mp4
}
```

I usually use this alongside `git commit` and `git submitpr` so my flow looks something like:

```bash
# commit my changes
$ git commit -m 'Something new'

# create a PR
$ git submitpr

# record a video
$ xcrecord
Recording started
^CRecording completed. Writing to disk.

Wrote video to: /Users/eliperkins/Desktop/EAB9665D-447E-4033-96B7-FC4D54B7B2D6.mp4
```

and then I'll drag-and-drop the video into the PR description that's waiting for me in the new tab in my browser.

The result is an MP4 with no artifacting or watermarks that clearly shows the change I've made in my PR.

<video autoplay loop muted playsinline width="320px" src="/images/xcrecord-demo.mp4"></video>

It's a little quality of life thing that's fit into my workflow as a way to create high-quality recordings from the simulator!
