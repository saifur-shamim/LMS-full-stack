import Layout from './../common/Layout'
import React, { useEffect, useState } from 'react'
import { Rating } from 'react-simple-star-rating'
import ReactPlayer from 'react-player'
import { Accordion, Badge, ListGroup, Card } from "react-bootstrap";
import { apiUrl, convertMinutesToHours } from '../common/Config';
import { useParams } from 'react-router-dom';
import Loading from '../common/Loading';

const Detail = () => {
    const [course, setCourse] = useState(null);
    const [rating, setRating] = useState(5.0); // Fix: Defined rating
    const { id } = useParams();

    const fetchCourses = () => {
        fetch(`${apiUrl}/fetch-course/${id}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log(result); // optional
                setCourse(result.data);   // ✅ DIRECT
            })
            .catch(err => console.error("Fetch error:", err));
    };

    useEffect(() => {
        fetchCourses();
    }, [id]); // Refetc

    if (!course) {
        return <div className="container py-5 text-center"><Loading /></div>;
    }

    return (
        <Layout>
            <div className='container pb-5 pt-3'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item"><a href="/courses">Courses</a></li>
                        <li className="breadcrumb-item active">{course.title}</li>
                    </ol>
                </nav>

                <div className='row my-5'>
                    <div className='col-lg-8'>
                        <h2>{course.title}</h2>
                        <div className='d-flex'>
                            <span className="badge bg-green">{course.category?.name}</span>
                            <div className="text pe-2 pt-1 ms-3">5.0</div>
                            <Rating initialValue={rating} size={20} readonly />
                        </div>

                        <div className="row mt-4">
                            <div className="col">
                                <span className="text-muted d-block">Level</span>
                                <span className="fw-bold">{course.level?.name}</span>
                            </div>

                            <div className="col">
                                <span className="text-muted d-block">Students</span>
                                <span className="fw-bold">0</span>
                            </div>
                            <div className="col">
                                <span className="text-muted d-block">Language</span>
                                <span className="fw-bold">{course.language?.name}</span>
                            </div>
                        </div>

                        {/* Dynamic Overview */}
                        <div className='col-md-12 mt-4'>
                            <div className='border bg-white rounded-3 p-4'>
                                <h3 className='mb-3 h4'>Overview</h3>
                                <div dangerouslySetInnerHTML={{ __html: course.description }} />
                            </div>
                        </div>

                        {/* Dynamic Course Structure (Chapters & Lessons) */}
                        <div className='col-md-12 mt-4'>
                            <div className='border bg-white rounded-3 p-4'>
                                <h3 className="h4 mb-3">Course Structure</h3>
                                <Accordion defaultActiveKey="0">
                                    {course.chapters?.map((chapter, index) => (
                                        <Accordion.Item eventKey={index.toString()} key={chapter.id}>
                                            <Accordion.Header>
                                                {chapter.title}
                                                <span className="ms-3 text-muted">
                                                    ({chapter.lessons_count} lectures - {convertMinutesToHours(chapter.lessons_sum_duration)})
                                                </span>
                                            </Accordion.Header>

                                            <Accordion.Body>
                                                <ListGroup variant="flush">
                                                    {chapter.lessons?.map((lesson) => (
                                                        <ListGroup.Item key={lesson.id} className="d-flex justify-content-between">
                                                            {lesson.title}
                                                            <span className="text-muted">{lesson.duration ?? 0} mins</span>
                                                        </ListGroup.Item>
                                                    ))}
                                                </ListGroup>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    ))}
                                </Accordion>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar with Price */}
                    <div className='col-lg-4'>
                        <div className='border rounded-3 bg-white p-4 shadow-sm'>
                            <h3 className="fw-bold">${course.price}</h3>
                            <button className="btn btn-primary w-100 mt-3">Buy Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Detail;