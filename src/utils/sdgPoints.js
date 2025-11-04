// // src/utils/sdgPoints.js
// import { useState, useEffect } from 'react';

// // Initialize SDG points structure
// const initialSDGPoints = {
//   'SDG1': 0,  // No Poverty
//   'SDG2': 0,  // Zero Hunger
//   'SDG3': 0,  // Good Health
//   'SDG4': 0,  // Quality Education
//   'SDG5': 0,  // Gender Equality
//   'SDG6': 0,  // Clean Water
//   'SDG7': 0,  // Affordable Energy
//   'SDG8': 0,  // Economic Growth
//   'SDG9': 0,  // Innovation
//   'SDG10': 0, // Reduced Inequality
//   'SDG11': 0, // Sustainable Cities
//   'SDG12': 0, // Responsible Consumption
//   'SDG13': 0, // Climate Action
//   'SDG14': 0, // Life Below Water
//   'SDG15': 0, // Life on Land
//   'SDG16': 0, // Peace & Justice
//   'SDG17': 0  // Partnerships
// };

// export const useSDGPoints = () => {
//   const [sdgPoints, setSdgPoints] = useState(() => {
//     // Load from localStorage
//     const saved = localStorage.getItem('sdgPoints');
//     return saved ? JSON.parse(saved) : initialSDGPoints;
//   });

//   const updateSDGPoints = (impacts) => {
//     setSdgPoints(prev => {
//       const updated = { ...prev };
      
//       Object.entries(impacts).forEach(([sdg, points]) => {
//         if (updated.hasOwnProperty(sdg)) {
//           updated[sdg] = Math.max(0, updated[sdg] + points);
//         }
//       });
      
//       // Save to localStorage
//       localStorage.setItem('sdgPoints', JSON.stringify(updated));
      
//       // Notify about points update
//       if (window.eventBus) {
//         window.eventBus.emit('sdg-updated', updated);
//       }
      
//       return updated;
//     });
//   };

//   const resetSDGPoints = () => {
//     setSdgPoints(initialSDGPoints);
//     localStorage.setItem('sdgPoints', JSON.stringify(initialSDGPoints));
//   };

//   const getTotalPoints = () => {
//     return Object.values(sdgPoints).reduce((sum, points) => sum + points, 0);
//   };

//   const getTopSDGs = (count = 3) => {
//     return Object.entries(sdgPoints)
//       .sort(([, a], [, b]) => b - a)
//       .slice(0, count)
//       .map(([sdg]) => sdg);
//   };

//   return {
//     sdgPoints,
//     updateSDGPoints,
//     resetSDGPoints,
//     getTotalPoints,
//     getTopSDGs
//   };
// };


// let sdgPoints = 0;

// // Get current points
// export function getPoints() {
//   return sdgPoints;
// }

// // Add (or subtract) points
// export function addPoints(amount) {
//   sdgPoints += amount;
//   if (sdgPoints < 0) sdgPoints = 0;
//   return sdgPoints;
// }

// // Optional: reset points
// export function resetPoints() {
//   sdgPoints = 0;
// }


import { emit } from "./eventBus";

let sdgPoints = 0;

export function getPoints() {
  return sdgPoints;
}

export function addSDGPoints(amount) {
  sdgPoints += amount;
  if (sdgPoints < 0) sdgPoints = 0;

  // Emit for your SDGBar in React
  emit("updateSDGPoints", sdgPoints);

  return sdgPoints;
}

export function resetPoints() {
  sdgPoints = 0;
  emit("updateSDGPoints", sdgPoints);
}
