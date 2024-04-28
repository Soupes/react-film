import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
export const FullFilm: React.FC = () => {
    const [data, setData] = useState<{
        imageUrl: string;
        name: string;
        description: string;
        price: number;
        rating: number;
        sizes: number;
    }>();

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function getFilm() {
            try {
                const { data } = await axios.get('https://63bb1a1e32d17a50908714d3.mockapi.io/items/' + id);
                setData(data);
            } catch (error) {
                alert(error)
                navigate("/");
            }
        }
        getFilm();
    }, []);

    if (!data) {
        return <>'Загрузка...'</>
    }
    return (
        <div className="container">
            <div className='title'>
                {data.name}
            </div>
            <div className='filmCard'>
                <img className="film-block__image" src={data.imageUrl} alt="Film" />
                <div className="description">
                    {data.description} <br></br> <br></br>
                    Рейтинг: {data.rating} <br></br>
                    Год выхода: {data.sizes}
                </div>
            </div>
        </div>
    )
}