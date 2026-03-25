---
title: "Systems Languages: Rust and Go"
description: A test post demonstrating syntax highlighting. This is not real content.
publishedAt: 2023-11-01
---

> **Note:** This is a test post used to verify syntax highlighting and layout. It is not real content.

## Rust

```rust
use std::collections::HashMap;

fn word_count(text: &str) -> HashMap<&str, usize> {
    let mut counts = HashMap::new();
    for word in text.split_whitespace() {
        *counts.entry(word).or_insert(0) += 1;
    }
    counts
}

fn main() {
    let text = "hello world hello rust";
    let counts = word_count(text);
    for (word, count) in &counts {
        println!("{word}: {count}");
    }
}
```

## Go

```go
package main

import "fmt"

func fibonacci(n int) int {
    if n <= 1 {
        return n
    }
    return fibonacci(n-1) + fibonacci(n-2)
}

func main() {
    for i := range 10 {
        fmt.Printf("fib(%d) = %d\n", i, fibonacci(i))
    }
}
```
