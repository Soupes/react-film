import { useEffect, useRef, useCallback } from 'react';
import qs from 'qs';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '../components/FilmBlock/Skeleton';
import { Categories } from '../components/Categories';
import Sort, { sortList } from '../components/Sort';
import FilmBlock from '../components/FilmBlock';
import { Pagination } from '../components/Pagination';
import { setCategoryId, setCurrentPage, setFilters } from '../redux/filter/slice';
import { fetchFilm } from '../redux/film/slice';
import { useAppDispatch } from '../redux/store';
import { selectFilter } from '../redux/filter/selectors';
import { SearchFilmParams } from '../redux/film/types';
import { selectFilmData } from '../redux/film/selectors';



export const Home: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isMounted = useRef(false);
    const isSearch = useRef(false);

    const { items, status } = useSelector(selectFilmData);
    const { categoryId, sort, currentPage, searchValue } = useSelector(selectFilter);

    const sortType = sort.sortProperty;

    const onChangeCategory = useCallback((idx: number) => {
        dispatch(setCategoryId(idx));
    }, []);

    const onChangePage = (page: number) => {
        dispatch(setCurrentPage(page));
    };

    const getFilm = async () => {

        const sortBy = sortType.replace('-', '');
        const order = sortType.includes('-') ? 'asc' : 'desc';
        const category = categoryId > 0 ? `category=${categoryId}` : '';
        const search = searchValue ? `&search=${searchValue}` : '';

        dispatch(
            fetchFilm({
                sortBy,
                order,
                category,
                search,
                currentPage: String(currentPage),
            }),
        );
    }

    // Если изменили параметры и был первый рендер
    useEffect(() => {
        if (isMounted.current) {
            const queryString = qs.stringify({
                sortProperty: sort.sortProperty,
                categoryId,
                currentPage,
            });

            navigate(`/?${queryString}`);
        }
        isMounted.current = true;
        getFilm();
    }, [categoryId, sort.sortProperty, searchValue, currentPage]);

    // Если был первый рендер, то проверяем параметеры
    useEffect(() => {
        if (window.location.search) {
            const params = qs.parse(window.location.search.substring(1)) as unknown as SearchFilmParams;
            const sort = sortList.find((obj) => obj.sortProperty === params.sortBy);
            dispatch(
                setFilters({
                    searchValue: params.search,
                    categoryId: Number(params.category),
                    currentPage: Number(params.currentPage),
                    sort: sort || sortList[0],
                }),
            );
        }
        isMounted.current = true;
    }, []);

    // Если был первый рендер, то запрашиваем
    useEffect(() => {
        window.scrollTo(0, 0);

        if (!isSearch.current) {
            getFilm();
        }
        isSearch.current = false;
    }, [categoryId, sortType, searchValue, currentPage]);
    const films = items.map((obj: any) => <FilmBlock key={obj.id}  {...obj} />);

    const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);

    return (
        <div className='container'>
            <div className="content__top">
                <Categories value={categoryId} onChangeCategory={onChangeCategory} />
                <Sort value={sort} />
            </div>
            <h2 className="content__title"></h2>
            {
                status === 'error' ?
                    <div className='content__error-info'>
                        <h2> Товар не найден </h2>
                    </div> : <div className="content__items">
                        {status === 'loading' ? skeletons : films}
                    </div>
            }

            <Pagination currentPage={currentPage} onChangePage={onChangePage} />
        </div>
    )
}