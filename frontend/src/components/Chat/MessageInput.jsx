import React, { useRef, useState } from "react";

export default function MessageInput({ onSend }) {
  // State to store the current message being typed
  const [text, setText] = useState("");

  // Ref to keep input focused after sending a message
  const inputRef = useRef(null);

  // Handle sending the message
  const submit = async (e) => {
    e?.preventDefault();

    // Do not send empty messages
    if (!text.trim()) return;

    // Call the parent component function to send the message
    await onSend(text);

    // Clear input and focus for next message
    setText("");
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={submit}
      className="flex gap-2 border-t border-gray-200 pt-3 mt-4"
    >
      {/* Input field for typing messages */}
      <input
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />

      {/* Button to submit/send message */}
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition"
      >
        Send
      </button>
    </form>
  );
}
