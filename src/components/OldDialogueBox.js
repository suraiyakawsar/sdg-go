import React from 'react';

const DialogueBox = ({ node, onChoice }) => {
  if (!node) return null;

  const choiceButtons = node.choices && node.choices.length > 0
    ? React.createElement(
        'div',
        { className: 'mt-6 grid grid-cols-1 md:grid-cols-2 gap-4' },
        ...node.choices.map((choice, index) =>
          React.createElement(
            'button',
            {
              key: index,
              onClick: () => onChoice(choice.nextId),
              className: 'w-full px-4 py-3 text-left text-white bg-gray-800/80 rounded-lg hover:bg-purple-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400',
            },
            choice.text
          )
        )
      )
    : null;

  const continueButton = node.nextId && !node.choices
    ? React.createElement(
        'div',
        { className: 'mt-6 flex justify-end' },
        React.createElement(
          'button',
          {
            onClick: () => onChoice(node.nextId),
            className: 'px-6 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400',
          },
          'Continue...'
        )
      )
    : null;

  return React.createElement(
    'div',
    { className: 'w-full max-w-4xl mx-auto animate-fade-in-up' },
    React.createElement(
      'div',
      { className: 'bg-black/70 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700' },
      React.createElement(
        'div',
        { className: 'flex items-start space-x-4' },
        React.createElement('img', {
          src: node.avatar,
          alt: node.character,
          className: 'w-24 h-24 rounded-full border-2 border-purple-400 object-cover',
        }),
        React.createElement(
          'div',
          { className: 'flex-1' },
          React.createElement(
            'h2',
            { className: 'text-2xl font-bold text-purple-300 mb-2' },
            node.character
          ),
          React.createElement(
            'p',
            { className: 'text-white text-lg leading-relaxed' },
            node.text
          )
        )
      ),
      choiceButtons,
      continueButton
    ),
    React.createElement(
      'style',
      null,
      `
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `
    )
  );
};

export default DialogueBox;
