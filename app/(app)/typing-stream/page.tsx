"use client";

import { useState, useEffect } from "react";
import { DynamicTypewriterStream } from "@/components/shared/dynamic-typewriter-stream";

const LLM_SIMULATION_TEXT = `The short answer is **yes**. Flutter is a multi-platform framework that allows you to use a **single codebase** to generate apps for iOS, Android, and the Web (browser) simultaneously.

Here is how it works in practice:

### 1. How it works
When you write code in Flutter (using the Dart language), Flutter’s engine renders that code differently depending on the target:
*   **Mobile (iOS/Android):** It compiles to native ARM/Intel machine code, using its own high-performance rendering engine (Impeller or Skia).
*   **Web:** It compiles your Dart code into JavaScript, HTML, and CSS. It uses either **HTML/Canvas** (for fast loading) or **WebAssembly/CanvasKit** (for high-performance graphics) to render the UI in the browser.

### 2. Can you run them at the same time?
Yes. During development, you can have a mobile emulator (like an iPhone or Pixel) and a Chrome browser window open side-by-side. When you save your code, Flutter’s **Hot Reload** or **Hot Restart** will update the app on both screens almost instantly.

### 3. Key Considerations
While the code is mostly the same, there are three things you must manage:

*   **Responsive Layout:** A mobile screen is vertical and small; a browser window is usually horizontal and wide. You will need to use widgets like \`LayoutBuilder\` or \`MediaQuery\` to ensure your app looks good on both (e.g., showing a sidebar on desktop and a bottom navigation bar on mobile).
*   **Platform-Specific Features:** Some features don't exist on both platforms. For example, you can't "vibrate" a laptop, and you can't access a local C: drive file system on a mobile phone easily. You will use "conditional imports" or packages that handle these differences for you.
*   **Performance:** Flutter for Web is very powerful, but it feels slightly different than a traditional HTML website (like a blog or news site). It is best suited for **Progressive Web Apps (PWAs)** or complex internal tools rather than SEO-heavy content websites.

### 4. How to start
If you have Flutter installed, you can create a project that supports both by running:
\`\`\`bash
flutter create my_awesome_app
cd my_awesome_app
flutter run -d chrome  # Runs in the browser
flutter run -d android # Runs on your phone/emulator
\`\`\`

**Summary:** You write the UI logic once, and Flutter handles the heavy lifting of making it work on both the App Store and the Chrome/Safari browser.`;

export default function TypingStreamPage() {
  const [streamedText, setStreamedText] = useState("");
  //   console.log(streamedText);
  // Simulate an LLM stream: characters arrive in chunks over time.
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      // Simulate receiving chunks of 1 to 4 characters
      const chunkSize = Math.floor(Math.random() * 4) + 1;
      index += chunkSize;
      setStreamedText(LLM_SIMULATION_TEXT.slice(0, index));

      if (index >= LLM_SIMULATION_TEXT.length) {
        clearInterval(interval);
      }
    }, 40); // LLM speed simulation

    return () => clearInterval(interval);
  }, []);

  return (
    <DynamicTypewriterStream
      text={streamedText}
      plain={true}
      speed="fast"
      className="mt-5"
      cursorClassName="bg-red-500"
    />
  );
}
