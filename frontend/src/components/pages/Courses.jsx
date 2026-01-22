import React, { useEffect, useState, useCallback } from 'react';
import Course from './../common/Course';
import Layout from './../common/Layout';
import { apiUrl } from '../common/Config';
import { Link, useSearchParams } from 'react-router-dom';
import Loading from '../common/Loading';
import NotFound from '../common/NotFound';

const Courses = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // --- State Initialization ---
    const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sortby') || 'desc');
    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    // Initializing checked states from URL params to persist on refresh
    const [categoryChecked, setCategoryChecked] = useState(() => {
        const category = searchParams.get('category');
        return category ? category.split(',') : [];
    });

    const [levelChecked, setLevelChecked] = useState(() => {
        const level = searchParams.get('level');
        return level ? level.split(',') : [];
    });

    const [languageChecked, setLanguageChecked] = useState(() => {
        const language = searchParams.get('language');
        return language ? language.split(',') : [];
    });

    // --- Handlers ---
    // Using functional updates (prev) to prevent stale state bugs
    const handleCategory = (e) => {
        const { checked, value } = e.target;
        if (checked) {
            setCategoryChecked(prev => [...prev, value]);
        } else {
            setCategoryChecked(prev => prev.filter(id => id != value));
        }
    };

    const handleLevel = (e) => {
        const { checked, value } = e.target;
        if (checked) {
            setLevelChecked(prev => [...prev, value]);
        } else {
            setLevelChecked(prev => prev.filter(id => id !== value));
        }
    };

    const handleLanguage = (e) => {
        const { checked, value } = e.target;
        if (checked) {
            setLanguageChecked(prev => [...prev, value]);
        } else {
            setLanguageChecked(prev => prev.filter(id => id != value));
        }
    };

    // --- API Fetching ---
    const fetchCourses = useCallback(() => {

        setLoading(true);
        let search = [];

        if (categoryChecked.length > 0) {
            categoryChecked.forEach(id => search.push(['category', id]));
        }
        if (levelChecked.length > 0) {
            levelChecked.forEach(id => search.push(['level', id]));
        }
        if (languageChecked.length > 0) {
            languageChecked.forEach(id => search.push(['language', id]));
        }
        if (keyword.length > 0) {
            search.push(['keyword', keyword]);
        }

        search.push(['sortby', sortBy]);

        const params = new URLSearchParams(search);
        setSearchParams(params); // Sync state to URL

        fetch(`${apiUrl}/fetch-courses?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(res => res.json())
            .then(result => {
                setLoading(false);
                if (result.status == 200) {
                    setCourses(result.data);

                } else {
                    console.error("Failed to fetch courses");
                }
            });
    }, [categoryChecked, levelChecked, languageChecked, keyword, sortBy, setSearchParams]);

    const fetchMetadata = (endpoint, setter) => {
        fetch(`${apiUrl}/${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(res => res.json())
            .then(result => {
                if (result.status == 200) setter(result.data);
            });
    };

    useEffect(() => {
        fetchMetadata('fetch-categories', setCategories);
        fetchMetadata('fetch-levels', setLevels);
        fetchMetadata('fetch-languages', setLanguages);
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const clearFilters = (e) => {
        e.preventDefault();
        setCategoryChecked([]);
        setLevelChecked([]);
        setLanguageChecked([]);
        setKeyword('');
        setSortBy('desc');

        document.querySelectorAll('.form-check-input').forEach(input => input.checked = false);
    };



    return (
        <Layout>
            <div className='container pb-5 pt-3'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item active">Courses</li>
                    </ol>
                </nav>
                <div className='row'>
                    <div className='col-lg-3'>
                        <div className='sidebar mb-5 card border-0 shadow'>
                            <div className='card-body'>
                                <div className='mb-3 input-group'>
                                    <input
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        type="text" className='form-control' placeholder='Search by keyword' />
                                    <button className="btn btn-primary btn-sm" onClick={fetchCourses}>Search</button>
                                </div>

                                <div className='pt-3'>
                                    <h3 className='h5 mb-2'>Category</h3>
                                    <ul className="list-unstyled">
                                        {categories.map(category => (
                                            <li key={category.id}>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        value={category.id}
                                                        id={`cat-${category.id}`}
                                                        checked={categoryChecked.includes(category.id.toString())}
                                                        onChange={handleCategory}
                                                    />
                                                    <label className="form-check-label" htmlFor={`cat-${category.id}`}>{category.name}</label>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className='pt-1'>
                                    <h3 className='h5 mb-2'>Level</h3>
                                    <ul className="list-unstyled">
                                        {levels.map(level => (
                                            <li key={level.id}>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        value={level.id}
                                                        id={`lvl-${level.id}`}
                                                        checked={levelChecked.includes(level.id.toString())}
                                                        onChange={handleLevel}
                                                    />
                                                    <label className="form-check-label" htmlFor={`lvl-${level.id}`}>{level.name}</label>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className='mb-3'>
                                    <h3 className='h5 mb-2'>Language</h3>
                                    <ul className="list-unstyled">
                                        {languages.map(language => (
                                            <li key={language.id}>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        value={language.id}
                                                        id={`lang-${language.id}`}
                                                        checked={languageChecked.includes(language.id.toString())}
                                                        onChange={handleLanguage}
                                                    />
                                                    <label className="form-check-label" htmlFor={`lang-${language.id}`}>{language.name}</label>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Link onClick={() => clearFilters()} className='clear-filter text-danger'>Clear All Filters</Link>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-9'>
                        <section className='section-3'>
                            <div className='d-flex justify-content-between mb-3 align-items-center'>
                                <div className='h5 mb-0'>{courses.length} Courses Found</div>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className='form-select w-auto'>
                                    <option value="desc">Newest First</option>
                                    <option value="asc">Oldest First</option>
                                </select>
                            </div>
                            <div className="row gy-4">
                                {
                                    loading == true && <Loading />
                                }

                                {
                                    loading == false && courses.length == 0 && <div className='col-12'>
                                        <NotFound text="No courses found matching your criteria." />
                                    </div>
                                }
                                {loading == false && courses && courses.map(course => (
                                    <Course key={course.id} course={course} customClasses="col-lg-4 col-md-6" />
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Courses;