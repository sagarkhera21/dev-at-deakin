import React, { useRef, useState } from "react";

export default function MessageInput({ onSend }) {
  // Store the message text
  const [text, setText] = useState("");

  // Keep a reference to the input field for focus control
  const inputRef = useRef(null);

  // Handle form submission
  const submit = async (e) => {
    e?.preventDefault();

    // Ignore empty messages
    if (!text.trim()) return;

    // Trigger parent function to send the message
    await onSend(text);

    // Clear input and return focus for next message
    setText("");
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={submit}
      className="flex gap-2 border-t border-gray-200 pt-3 mt-4"
    >
      {/* Message input field */}
      <input
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />

      {/* Send button */}
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition"
      >
        Send
      </button>
    </form>
  );
}
