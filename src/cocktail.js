import { useEffect, useState } from "react";
export default function Cocktail({ e }) {
    const [drink, setDrink] = useState('')
    const [ingredient, setingredient] = useState([])
    const [instructions, setinstructions] = useState('')
    const [image, setimage] = useState('')
    const [loading, setloading] = useState(true)
    const [url, seturl] = useState("https://www.thecocktaildb.com/api/json/v1/1/random.php")
    const [search, setsearch] = useState("")
    const [error, seterror] = useState(false)

    const HandleSubmit = (e) => {
        if (search === "") {
            seturl("https://www.thecocktaildb.com/api/json/v1/1/random.php")
        }
        else {
            seturl("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + search)
        }
        e.preventDefault()
    }
    useEffect(() => {
        DrinkChange()
    }, [url])

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function DrinkChange() {
        try {
            let res = await fetch(url);
            let result = await res.json();
            setDrink(result["drinks"][0]["strDrink"]);
            setimage(result["drinks"][0]["strDrinkThumb"]);
            setinstructions(result["drinks"][0]["strInstructions"])
            let i = 1;
            let text = [];
            while (result["drinks"][0]["strIngredient" + i.toString()] !== null) {
                text.push({
                    ingredient: result["drinks"][0]["strIngredient" + i.toString()],
                    measure: result["drinks"][0]["strMeasure" + i.toString()]
                });
                i++;
            }
            setingredient([...text]);
            await sleep(100)
            setloading(false)
            seterror(false)
        } catch (error) {
            setloading(false)
            seterror(true)
        }

    }

    useEffect(() => {
        DrinkChange();
    }, []);

    if (loading === true) {
        return (
            <>
                <p className="site center">Loading...</p>
            </>
        )
    }
    else if (error === true) {
        return (
            <>
                <div className="search">
                    <form onSubmit={HandleSubmit}>
                        <input type="text" value={search} placeholder="Search" onChange={e => setsearch(e.target.value)} />
                        <button type="submit">Search</button>
                    </form>
                </div>
                <p className="site center">Drink not found</p>
            </>
        )
    }
    else {
        return (
            <>
                <div className="search">
                    <form onSubmit={HandleSubmit}>
                        <input type="text" value={search} placeholder="Search" onChange={e => setsearch(e.target.value)} />
                        <button type="submit">Search</button>
                    </form>
                </div>
                <h1 className="center">{drink}</h1>
                <img src={image} alt="" />
                <div className="ingredients">
                    <h2>Ingredients</h2>
                    <ul>
                        {
                            ingredient.map(ingredient =>
                                <li>{ingredient.ingredient} {ingredient.measure}</li>
                            )
                        }
                    </ul>
                </div>
                <div className="instructions">
                    <h2>Instructions</h2>
                    <p>{instructions}</p>
                </div>
            </>

        )
    }
}