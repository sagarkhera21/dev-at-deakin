import React, { useEffect, useState } from "react";
import { ref, push, onValue, remove } from "firebase/database";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ChatRoom from "./ChatRoom";

export default function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [title, setTitle] = useState("");
  const [pin, setPin] = useState("");
  const [activeRoomId, setActiveRoomId] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const roomsRef = ref(db, "rooms");
    onValue(roomsRef, (snap) => {
      const val = snap.val() || {};
      const arr = Object.entries(val).map(([id, data]) => ({ id, ...data }));
      setRooms(arr.reverse());
    });
  }, []);

  const createRoom = async (e) => {
    e.preventDefault();
    if (!title.trim() || pin.length !== 4)
      return alert("Enter a title & 4-digit PIN");

    const roomsRef = ref(db, "rooms");
    const newRef = await push(roomsRef, {
      title: title.trim(),
      pin: pin.trim(),
      createdAt: Date.now(),
      ownerUid: currentUser.uid,
      ownerName: currentUser.displayName || currentUser.email,
    });

    setTitle("");
    setPin("");
    setActiveRoomId(newRef.key);
  };

  const deleteRoom = async (room) => {
    // Only owner or someone with correct PIN can delete
    if (currentUser.uid !== room.ownerUid) {
      const enteredPin = prompt("Enter the 4-digit PIN to delete this room:");
      if (enteredPin !== room.pin) {
        alert("❌ Incorrect PIN. You can’t delete this room.");
        return;
      }
    }

    if (!window.confirm("Are you sure you want to delete this room?")) return;

    await remove(ref(db, `rooms/${room.id}`));
    setActiveRoomId(null);
  };

  return (
    <div className="grid grid-cols-[320px_1fr] gap-6 min-h-screen bg-linear-to-br from-gray-100 to-gray-200 p-6">
      {/* Sidebar */}
      <aside className="bg-white shadow-lg rounded-2xl p-5 border border-gray-100">
        <h3 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          💬 Chat Rooms
        </h3>

        {/* Create Room Form */}
        <form onSubmit={createRoom} className="flex flex-col gap-3 mb-5">
          <input
            className="border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Room title"
          />
          <input
            className="border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/, ""))}
            placeholder="4-digit PIN"
            maxLength={4}
          />
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl py-2 transition">
            Create Room
          </button>
        </form>

        {/* Room List */}
        <ul className="space-y-2">
          {rooms.map((r) => (
            <li
              key={r.id}
              className="flex justify-between items-center bg-gray-50 hover:bg-indigo-50 border border-gray-200 p-3 rounded-xl transition"
            >
              <button
                onClick={() => setActiveRoomId(r.id)}
                className="flex-1 text-left"
              >
                <strong className="text-gray-800 text-lg">{r.title}</strong>
                <div className="text-xs text-gray-500">
                  by {r.ownerName || "Unknown"} •{" "}
                  {new Date(r.createdAt).toLocaleString()}
                </div>
              </button>

              <button
                onClick={() => deleteRoom(r)}
                className="ml-3 text-red-500 hover:text-red-700 text-lg"
                title="Delete Room"
              >
                🗑
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Chat Section */}
      <section className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100 flex flex-col">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium shadow hover:bg-indigo-700 transition mb-4 w-fit"
        >
          ⬅ Back to Dashboard
        </button>

        {activeRoomId ? (
          <ChatRoom roomId={activeRoomId} />
        ) : (
          <p className="text-gray-500 text-center mt-32 text-lg">
            Select or create a room to start chatting 💬
          </p>
        )}
      </section>
    </div>
  );
}
