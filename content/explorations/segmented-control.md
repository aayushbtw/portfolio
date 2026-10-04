---
title: Segmented Control
description: A row of options with a pill that slides to the one you pick.
publishedAt: 2026-10-05
draft: true
---

<!-- ::demo name="segmented-control" -->

Click an option and the pill slides over to it. Use the arrow keys instead and it jumps there at once.

Every option gets the same width. The pill never changes size; it only slides from one column to another. Nothing has to be measured, so the page arrives from the server with the pill already in the right place.

The label color doesn't flip the moment you click. A second copy of the labels, in the selected color, sits on top and is clipped to the pill's shape. The clip moves on the same clock as the pill, so a label changes color exactly as the pill passes under it, even halfway through a letter.

The keyboard skips the animation on purpose. Someone holding an arrow key is moving faster than any slide could keep up with. A click is a single deliberate choice, so it gets the motion. With reduced motion turned on, the pill always jumps.
