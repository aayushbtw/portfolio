---
title: Chat Input
description: A chat box that grows from one row into two once your message needs more than one line.
publishedAt: 2026-09-13
---

<!-- ::demo name="chat-input" -->

Type past the end of the line, or press Shift+Enter, and the box grows: the text takes the full width on top and the buttons drop to a row underneath. Enter sends, which here only clears the box and folds it back into one row.

The box only collapses once it is empty. If it collapsed as soon as the text fit on one line again, deleting a single character at the wrap point would flip it back and forth, and the text would jump sideways every time.

Every change runs on one timeline. Before the layout switches, the component records the box height and where each button sits. After the switch, it animates the height and slides each button from its old spot to its new one, all with the same duration and easing. When the box collapses, the placeholder fades in where it lands instead of sliding, since there is no text to follow. With reduced motion turned on, it all switches instantly.
