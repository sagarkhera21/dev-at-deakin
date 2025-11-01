import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Interactive Tutorials",
      desc: "Learn coding step by step with guided lessons and examples.",
      icon: "📚",
    },
    {
      title: "Secure Chat Rooms",
      desc: "Join private rooms and collaborate safely with peers.",
      icon: "💬",
    },
    {
      title: "Community Projects",
      desc: "Showcase your projects and learn from others’ work.",
      icon: "🤝",
    },
    {
      title: "2FA Security",
      desc: "Keep your account safe with advanced two-factor authentication.",
      icon: "🔒",
    },
  ];

  const interactiveCards = [
    {
      title: "Our Community",
      desc: "Connect with thousands of learners across multiple colleges.",
      icon: "👨‍🎓",
    },
    {
      title: "Code Editor",
      desc: "Practice and share your code in real-time within your dashboard.",
      icon: "📝",
    },
    {
      title: "Tutorial Hub",
      desc: "Access curated tutorials to boost your coding skills.",
      icon: "🎥",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans bg-linear-to-b from-indigo-50 via-white to-purple-50 text-gray-800">
      {/* ===== Navbar ===== */}
      <nav className="fixed top-0 left-0 w-full bg-indigo-600/90 backdrop-blur-md text-white px-8 py-5 flex justify-between items-center shadow-lg z-50 rounded-b-xl">
        <h1
          onClick={() => navigate("/")}
          className="text-3xl font-extrabold cursor-pointer hover:text-gray-200 transition"
        >
          Dev@Deakin
        </h1>
        <div className="space-x-4 flex items-center">
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 bg-white text-indigo-700 rounded-full font-semibold hover:bg-gray-100 transition shadow-md"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-5 py-2 border border-white rounded-full font-semibold hover:bg-white hover:text-indigo-700 transition shadow-md"
          >
            Register
          </button>
        </div>
      </nav>

      {/* ===== Hero Section ===== */}
      <section className="flex flex-col-reverse lg:flex-row items-center justify-between py-32 px-8 pt-36 relative overflow-hidden bg-linear-to-br from-indigo-100 to-purple-100 rounded-b-3xl">
        {/* Left Text */}
        <div className="lg:w-1/2 flex flex-col items-start mb-10 lg:mb-0 z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-indigo-800 mb-6 leading-tight">
            Learn, Code & Collaborate
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg">
            Dev@Deakin is the ultimate platform for students to learn coding,
            connect with peers, and share projects safely.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="bg-indigo-700 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-indigo-800 transition shadow-lg"
          >
            🚀 Get Started
          </button>

          {/* Small Feature Highlights */}
          <div className="flex flex-wrap mt-8 gap-4">
            {features.slice(0, 2).map((f, i) => (
              <div
                key={i}
                className="bg-white/80 text-indigo-700 px-4 py-2 rounded-xl shadow-md backdrop-blur-sm flex items-center gap-2 font-semibold hover:scale-105 transition transform"
              >
                {f.icon} {f.title}
              </div>
            ))}
          </div>
        </div>

        {/* Right Image */}
        <div className="lg:w-1/2 flex justify-center lg:justify-end z-0 -mr-6 lg:-mr-12">
          <img
            src="image.png"
            alt="Learning illustration"
            className="w-full max-w-md rounded-xl shadow-2xl border-2 border-indigo-200"
          />
        </div>
      </section>

      {/* ===== Features Section ===== */}
      <section className="py-16 bg-white px-8 -mt-16">
        <h2 className="text-4xl font-bold text-center text-indigo-800 mb-12">
          Why Dev@Deakin?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-linear-to-b from-indigo-50 to-white p-8 rounded-3xl shadow-md hover:shadow-2xl hover:scale-105 transition transform flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-100 rounded-full opacity-30"></div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Interactive Section ===== */}
      <section className="py-16 px-8 bg-purple-50">
        <h2 className="text-4xl font-bold text-center text-indigo-800 mb-12">
          Explore Our Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {interactiveCards.map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl shadow-md p-8 flex flex-col items-center text-center cursor-pointer hover:scale-105 hover:shadow-2xl transition transform relative overflow-hidden"
            >
              <div className="text-6xl mb-4">{card.icon}</div>
              <h3 className="text-xl font-bold text-indigo-700 mb-2">{card.title}</h3>
              <p className="text-gray-600">{card.desc}</p>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-indigo-100 rounded-full opacity-30"></div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA Banner ===== */}
      <section className="bg-linear-to-r from-indigo-700 to-purple-600 text-white text-center py-24 px-8 rounded-t-3xl">
        <h2 className="text-4xl font-extrabold mb-4 drop-shadow-md">
          Ready to join Dev@Deakin?
        </h2>
        <p className="text-lg text-gray-100 mb-8 max-w-2xl mx-auto drop-shadow-sm">
          Start learning, coding, and sharing projects with our vibrant community.
        </p>
        <button
          onClick={() => navigate("/register")}
          className="bg-white text-indigo-700 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-lg"
        >
          🚀 Join Now
        </button>
      </section>

      {/* ===== Footer ===== */}
      <footer className="bg-indigo-700 text-white py-8 text-center mt-auto">
        <p className="text-sm">
          © {new Date().getFullYear()} DevAtDeakin — All rights reserved.
        </p>
        <p className="text-sm mt-1">Made with ❤️ using React & Firebase</p>
      </footer>
    </div>
  );
}
