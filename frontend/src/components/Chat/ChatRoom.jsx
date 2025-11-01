import React, { useEffect, useRef, useState } from "react";
import { ref, push, onValue } from "firebase/database";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import MessageInput from "./MessageInput";
import CryptoJS from "crypto-js";

export default function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [roomTitle, setRoomTitle] = useState("");
  const [roomPin, setRoomPin] = useState("");
  const [enteredPin, setEnteredPin] = useState("");
  const [accessMap, setAccessMap] = useState({});
  const { currentUser } = useAuth();
  const bottomRef = useRef(null);

  const secretKey = import.meta.env.VITE_CHAT_SECRET_KEY;
  const accessGranted = accessMap[roomId] || false;

  useEffect(() => {
    if (!roomId) return;

    // Room info (title + pin)
    const roomRef = ref(db, `rooms/${roomId}`);
    onValue(roomRef, (snap) => {
      const data = snap.val();
      if (data) {
        setRoomTitle(data.title || "Room");
        setRoomPin(data.pin || "");
      }
    });

    // Room messages
    const messagesRef = ref(db, `rooms/${roomId}/messages`);
    onValue(messagesRef, (snap) => {
      const val = snap.val() || {};
      const arr = Object.entries(val).map(([id, m]) => {
        let decryptedText = "";
        try {
          const bytes = CryptoJS.AES.decrypt(m.text, secretKey);
          decryptedText = bytes.toString(CryptoJS.enc.Utf8) || "[Decryption failed]";
        } catch {
          decryptedText = "[Encrypted message]";
        }
        return { id, ...m, text: decryptedText };
      });
      arr.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      setMessages(arr);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, [roomId, secretKey]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    // Encrypt message text before sending
    const encryptedText = CryptoJS.AES.encrypt(text.trim(), secretKey).toString();

    const messagesRef = ref(db, `rooms/${roomId}/messages`);
    await push(messagesRef, {
      text: encryptedText,
      uid: currentUser.uid,
      displayName: currentUser.displayName || currentUser.email,
      createdAt: Date.now(),
    });
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (enteredPin === roomPin) {
      setAccessMap((prev) => ({ ...prev, [roomId]: true }));
    } else {
      alert("❌ Incorrect PIN");
    }
  };

  if (!accessGranted) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h3 className="text-2xl font-semibold text-gray-700 mb-3">
          Enter PIN to access “{roomTitle}”
        </h3>
        <form onSubmit={handlePinSubmit} className="flex gap-3">
          <input
            className="border rounded-xl px-3 py-2 text-center text-lg w-32 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            maxLength={4}
            placeholder="4-digit PIN"
            value={enteredPin}
            onChange={(e) => setEnteredPin(e.target.value.replace(/\D/, ""))}
          />
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 py-2 font-medium transition">
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-2xl font-bold mb-4 text-indigo-700 border-b pb-2">
        {roomTitle}
      </h3>

      {/* Messages */}
      <div className="flex-1 h-[400px] overflow-y-auto border rounded-2xl p-4 bg-gray-50 space-y-3">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center mt-20">
            No messages yet. Start the conversation 👋
          </p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.uid === currentUser.uid ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[75%] shadow-sm ${
                  m.uid === currentUser.uid
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-800 border border-gray-200"
                }`}
              >
                <div className="text-xs text-gray-300 mb-1">{m.displayName}</div>
                {m.text}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={handleSend} />
    </div>
  );
}
