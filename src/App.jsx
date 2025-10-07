// // import { BrowserRouter, Routes, Route } from "react-router-dom";
// // import { useState, useEffect } from 'react';
// // import Phaser from 'phaser';
// // import GameScene from './phaser/GameScene';
// // import config from './game/config';
// // import './App.css';
// // import SDGBar from './components/SDGBar';
// // import Home from "./pages/Home";
// // import Game from "./pages/Game";

// // function App() {


// //   const [sdgValue, setSdgValue] = useState(50); // Default: 50%

// //   useEffect(() => {
// //     const game = new Phaser.Game({
// //       ...config,
// //       callbacks: {
// //         postBoot: () => {
// //           game.registry.set('updateSDG', setSdgValue); // pass function to game
// //         },
// //       },
// //     });

// //     return () => game.destroy(true);
// //   }, []);

// //   return (
// //     <>
// //       <SDGBar value={sdgValue} />
// //       <div id="phaser-game" />
// //     </>
    
// //   );
// // }

// // export default App;



// // App.jsx
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import Game from "./pages/Game";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/game" element={<Game />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;