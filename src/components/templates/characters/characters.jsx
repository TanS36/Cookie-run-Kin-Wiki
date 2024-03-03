import React, { useState, useEffect } from "react";
import "./character.sass";
import CharacterList from "./characterList";
import { filterAndSortCharacters, rarityOrder } from "../../atoms/characterUtils";
import { RingLoader } from "react-spinners";
import { firestore } from "../../../../firebase";
import { collection, getDocs} from "firebase/firestore"; 

const Character = () => {
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedRarity, setSelectedRarity] = useState(null);
  const [sortField, setSortField] = useState("rarity");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCharactersWithCandy, setShowCharactersWithCandy] = useState(null);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [charactersPerPage, setCharactersPerPage] = useState(30);
  const [showAllCharacters, setShowAllCharacters] = useState(false);
  const [showAllButtonVisible, setShowAllButtonVisible] = useState(true);
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      console.log(firestore);
      const charactersRef = await getDocs(collection(firestore, "Characters"));
      charactersRef.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
      });
    
      const charactersData = charactersRef.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    
      const options = {
        searchTerm,
        selectedElement,
        selectedClass,
        selectedPosition,
        selectedRarity,
        showCharactersWithCandy,
        sortField,
        sortOrder,
      };
      const sortedChars = filterAndSortCharacters(charactersData, options);
      
      if (showAllCharacters) {
        setFilteredCharacters(sortedChars);
      } else {
        setFilteredCharacters(sortedChars.slice((pageNumber - 1) * charactersPerPage, pageNumber * charactersPerPage));
      }
      
      setLoading(false);
    };
    

    fetchData();
  }, [sortField, sortOrder, searchTerm, selectedElement, selectedClass, selectedPosition, selectedRarity, showCharactersWithCandy, pageNumber, charactersPerPage, showAllCharacters]);
  
  const loadNextPage = () => {
    setPageNumber(pageNumber + 1);
  };

  const loadPreviousPage = () => {
    setPageNumber(pageNumber - 1);
  };

  const charactersOnCurrentPage = filteredCharacters.length;

  const showAllCharactersHandler = () => {
    if (showAllCharacters) {
      setCharactersPerPage(30);
      setShowAllCharacters(false);
      setShowAllButtonVisible(true);
      setPageNumber(1); 
    } else {
      setCharactersPerPage(filteredCharacters.length);
      setShowAllCharacters(true);
      setShowAllButtonVisible(false);
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleElementChange = (element) => {
    setSelectedElement(element);
    setPageNumber(1); 
  };

  const handleClassChange = (characterClass) => {
    setSelectedClass(characterClass);
    setPageNumber(1); 
  };

  const handlePositionChange = (position) => {
    setSelectedPosition(position);
    setPageNumber(1); 
  };

  const handleRarityChange = (rarity) => {
    setSelectedRarity(rarity);
    setPageNumber(1); 
  };

  const handleSortOrderChange = (field, sortOrder) => {
    setSortOrder(sortOrder);
    setSortField(field);
    setPageNumber(1); 
  };

  const handleCandyFilterChange = (value) => {
    setShowCharactersWithCandy(value);
    setPageNumber(1); 
  };
  

  const resetFilters = () => {
    setSelectedElement(null);
    setSelectedClass(null);
    setSelectedPosition(null);
    setSelectedRarity(null);
    setSortField("rarity");
    setSortOrder("asc");
    setSearchTerm("");
    setShowCharactersWithCandy(null);
    setPageNumber(1); 
  };

  const handleSearchTermChange = (event) => {
    const searchTerm = event.target.value.toLowerCase().trim();
    setSearchTerm(searchTerm);
    const searchRegex = new RegExp(searchTerm.split(" ").map(word => `(?=.*${word})`).join(""), "i");
    const filteredChars = characters.filter(character =>
      searchRegex.test(character.name.toLowerCase())
    );
    setFilteredCharacters(filteredChars); 
    setPageNumber(1);
  };
  
  
  return (
    <div className="content">
      <div className="Sort_head" onClick={toggleFilters}>
        <img className="Sort_Icon" src="https://i.postimg.cc/nhCC4BCb/Sort-Icon.png" alt="Filter" />
      </div>

      {showFilters && (
        <div className="sort" id="myDIV">
          <div className="BlockS Search">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchTermChange}
              placeholder="Поиск по имени"
            />
          </div>
          <div className="BlockS">
            <div>
              <label>Элемент:</label>
              <select value={selectedElement || ""} onChange={(e) => handleElementChange(e.target.value || null)}>
                <option value="">All</option>
                <option value="None">None</option>
                <option value="fire">Fire</option>
                <option value="poison">Poison</option>
                <option value="light">Light</option>
                <option value="water">Water</option>
                <option value="earth">Earth</option>
                <option value="ice">Ice</option>
              </select>
            </div>
            <div>
              <label>Класс:</label>
              <select value={selectedClass || ""} onChange={(e) => handleClassChange(e.target.value || null)}>
                <option value="">All</option>
                <option value="Ambush">Ambush</option>
                <option value="Bomber">Bomber</option>
                <option value="BTS">BTS</option>
                <option value="Charge">Charge</option>
                <option value="Defense">Defense</option>
                <option value="Healing">Healing</option>
                <option value="Magic">Magic</option>
                <option value="Ranged">Ranged</option>
                <option value="Support">Support</option>
              </select>
            </div>
            <div>
              <label>Позиция:</label>
              <select value={selectedPosition || ""} onChange={(e) => handlePositionChange(e.target.value || null)}>
                <option value="">All</option>
                <option value="Front">Front</option>
                <option value="Middle">Middle</option>
                <option value="Rear">Rear</option>
              </select>
            </div>
            <div>
              <label>Редкость:</label>
              <select value={selectedRarity || ""} onChange={(e) => handleRarityChange(e.target.value || null)}>
                <option value="">All</option>
                <option value="Common">Common</option>
                <option value="Rare">Rare</option>
                <option value="Epic">Epic</option>
                <option value="Super epic">Super epic</option>
                <option value="Legendary">Legendary</option>
                <option value="Dragon">Dragon</option>
                <option value="Ancient">Ancient</option>
                <option value="Special">Special</option>
                <option value="Guest">Guest</option>
              </select>
            </div>
            <div>
              <label>Сортировка:</label>
              <select value={`${sortField}-${sortOrder}`} onChange={(e) => {const [field, order] = e.target.value.split("-"); handleSortOrderChange(field, order); }}>
                <option value="rarity-asc" defaultValue>по умолчанию</option>
                <option value="name-asc">по алфавиту</option>
                <option value="name-desc">обратно по алфавиту</option>
                <option value="id-asc">по ID (возрастание)</option>
                <option value="id-desc">по ID (убывание)</option>
              </select>
            </div>
            <div>
              <label>Конфеты:</label>
              <select
                value={
                  showCharactersWithCandy
                    ? "with-candy"
                    : showCharactersWithCandy === false
                    ? "without-candy"
                    : "all"
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "with-candy") {
                    handleCandyFilterChange(true);
                  } else if (value === "without-candy") {
                    handleCandyFilterChange(false);
                  } else {
                    if (value === "all") {
                      handleCandyFilterChange(null);
                    }
                  }
                }}
              >
                <option value="all" defaultValue>Показать всех</option>
                <option value="with-candy">Только с конфетами</option>
                <option value="without-candy">Только без конфет</option>
              </select>
            </div>
          </div>
          <div className="BlockS">
            <button onClick={resetFilters}>Сбросить фильтры</button>
            {showAllButtonVisible ? (
              <button onClick={showAllCharactersHandler}>Показать весь список</button>
            ) : (
              <button onClick={showAllCharactersHandler}>Показать по страницам</button>
            )}
          </div>
        </div>
      )}

      <div className="Searchbuttons">
      {pageNumber > 1 && !loading && <button onClick={loadPreviousPage}>Предыдущая страница</button>}
      {charactersOnCurrentPage === charactersPerPage && !loading && (<button onClick={loadNextPage}>Следующая страница</button>)}
      </div>
      {loading ? (
        <div className="loader-container">
          <RingLoader color={"#36D7B7"} loading={loading} size={300} />
        </div>
      ) : (
        <div>
          {filteredCharacters.length > 0 ? (
            <CharacterList characters={filteredCharacters} />
          ) : (
            <div className="no-results-container">
              <p>Результат не найден</p>
              <img src="https://cdn.comic.studio/images/cookierun/characters/b933f9e7b3af34fcd881b9191612886b/exhausted.png" alt="Exhausted"/>
            </div>
          )}
        </div>
      )}
      <div className="Searchbuttons">
      {pageNumber > 1 && !loading && <button onClick={loadPreviousPage}>Предыдущая страница</button>}
      {charactersOnCurrentPage === charactersPerPage && !loading && (<button onClick={loadNextPage}>Следующая страница</button>)}
      </div>
    </div>
  );
};

export default Character;
