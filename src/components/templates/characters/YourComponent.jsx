import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './YourComponent.sass';

const YourComponent = ({ character }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className={`image-container ${isHovered ? 'hovered' : ''}`}
         onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}>
      <Link to={`/characters/${character.name}`} className="link-style">
        <img src={character.img} alt={character.name} className="character-image" />
        {character.candy && (
          <img src={character.candy_img_3} alt="Candy" className="candy_image" />
        )}
        {isHovered && (
          <div className="overlay">
            <div className="text">{character.name}</div>
          </div>
        )}
      </Link>
    </div>
  );
};

export default YourComponent;

