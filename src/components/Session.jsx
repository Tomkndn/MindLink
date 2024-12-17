import React from 'react';

function Session() {
  const liveSessions = [
    {
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfqZlOjBsZWpsAkigPFWtsQ0JM2kQjPOwpHjjWS_RTmS95kSd6M44HZJw&s=0',
      title: 'Math Crash Course',
      description: 'Master algebra in one session.',
      likes: 'Like',
      status: '5k live',
    },
    {
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2RNsp973bHPAcSE8QPqBUlWKZmHr5g2MwrQ&s',
      title: 'Physics Fundamentals',
      description: 'Explore the basics of motion.',
      likes: 'Like',
      status: '3k live',
    },
    {
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCiyWVIwUzkQZBxvSLSvwQK_HC0wN2Yr8PIQ&s',
      title: 'Creative Writing Workshop',
      description: 'Learn to write compelling stories.',
      likes: 'Like',
      status: '4k live',
    },
    {
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQrXwuMAZlMs0vpFKkwXf64sNfwmsWlryf3w&s',
      title: 'History Revisited',
      description: 'A fresh look at world history.',
      likes: 'Like',
      status: '2k live',
    },
  ];

  return (
    <div>
      <section className="py-10 px-5 bg-gray-100 text-center">
        {/* Section Heading */}
        <h2 className="text-4xl text-green-800 font-serif font-bold mb-4"
        style={{ fontFamily: '"Times New Roman", Times, serif' }}>
          Join The Live Study Sessions
        </h2>

        {/* Live Sessions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {liveSessions.map((session, index) => (
            <div
              key={index}
              className="relative bg-white rounded-lg p-5 shadow-md transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              {/* Live Status Button */}
              <button className="absolute top-2 left-2 bg-green-500 text-white rounded-full px-4 py-1 text-sm hover:bg-green-600">
                {session.status}
              </button>

              {/* Session Image */}
              <img
                src={session.image}
                alt={session.title}
                className="w-full h-64 object-cover rounded-md mb-4"
              />

              {/* Session Title and Description */}
              <h3 className="text-lg font-bold mb-2">{session.title}</h3>
              <p className="text-gray-600 text-sm">{session.description}</p>

              {/* Like Button */}
              <button className="mt-4 text-sm text-gray-800 bg-gray-200 hover:bg-gray-300 py-1 px-4 rounded-lg flex items-center">
                👍 {session.likes}
              </button>
            </div>
          ))}
        </div>

        {/* See More Button */}
        <button className="mt-8 bg-green-700 text-white py-2 px-6 rounded-lg hover:bg-green-800 transition duration-300">
          See more
        </button>
      </section>
    </div>
  );
}

export default Session;
