import React, { useEffect, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import { apiUrl, token } from "../../../common/Config";
import toast from "react-hot-toast";
import Accordion from "react-bootstrap/Accordion";
import UpdateChapter from "./UpdateChapter";
import CreateLesson from "./CreateLesson";
import { Link } from "react-router-dom";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import { BsPencilSquare } from "react-icons/bs";
import LessonsSort from "./LessonsSort";

const ManageChapter = ({ course, params }) => {
  const [loading, setLoading] = useState(false);
  const [chapterData, setChapterData] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [lessonsData, setLessonsData]=useState([]);

  // Update Chapter Modal
  const [showChapter, setShowChapter] = useState(false);
  const handleClose = () => setShowChapter(false);
  const handleShow = (chapter) => {
    setShowChapter(true);
    setChapterData(chapter);
  };

  // Create Lesson Modal
  const [showLessonModal, setShowLessonModal] = useState(false);
  const handleCloseLessonModal = () => setShowLessonModal(false);
  const handleShowLessonModal = () => {
    setShowLessonModal(true);
  };

  // Sort Lesson Modal
  const [showLessonSortModal, setShowLessonSortModal] = useState(false);
  const handleCloseLessonSortModal = () => setShowLessonSortModal(false);
  const handleShowLessonSortModal = (lessons) => {
    setLessonsData(lessons);
    setShowLessonSortModal(true);
  };


  const chapterReducer = (state, action) => {
    switch (action.type) {
      case "SET_CHAPTERS":
        return action.payload;
      case "ADD_CHAPTER":
        return [...state, action.payload];
      case "UPDATE_CHAPTER":
        return state.map((chapter) => {
          if (chapter.id === action.payload.id) {
            return action.payload;
          }

          return chapter;
        });
      case "DELETE_CHAPTER":
        return state.filter((chapter) => chapter.id !== action.payload);
      default:
        return state;
    }
  };

  const [chapters, setChapters] = useReducer(chapterReducer, []);

  const onSubmit = async (id) => {
    setLoading(true);
    const formData = { ...data, course_id: params.id };

    await fetch(`${apiUrl}/chapters`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((result) => {
        setLoading(false);
        if (result.status == 200) {
          // const newOutcomes = [...outcomes, result.data];
          //setOutcomes(newOutcomes);
          setChapters({ type: "ADD_CHAPTER", payload: result.data });
          toast.success(result.message);
          reset();
        } else {
          console.log("Something went wrong");
        }
      });
  };

  const deleteChapter = async (id) => {
    if (confirm("Are you sure you want to delete?")) {
      await fetch(`${apiUrl}/chapters/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.status == 200) {
            setChapters({ type: "DELETE_CHAPTER", payload: id });
            toast.success(result.message);
          } else {
            console.log("Something went wrong");
          }
        });
    }
  };

  const deleteLesson = async (id) => {
    if (confirm("Are you sure you want to delete?")) {
      await fetch(`${apiUrl}/lessons/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.status == 200) {
            setChapters({type: "UPDATE_CHAPTER", payload: result.chapter})
            toast.success(result.message);
          } else {
            console.log("Something went wrong");
          }
        });
    }
  };

  useEffect(() => {
    if (course.chapters) {
      setChapters({ type: "SET_CHAPTERS", payload: course.chapters });
    }
  }, [course]);

  return (
    <>
      <div className="card shadow-lg border-0">
        <div className="card-body p-4">
          <div className="d-flex">
            <div className="d-flex justify-content-between w-100">
              <h4 className="h5 mb-3">Chapters</h4>
              <Link onClick={() => handleShowLessonModal()}>
                {" "}
                <FaPlus />
                <strong>Add Lesson</strong>
              </Link>
            </div>
          </div>
          <form className="mb-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <input
                {...register("chapter", {
                  required: "The chapter field is required.",
                })}
                type="text"
                className={`form-control ${errors.chapter && "is-invalid"}`}
                placeholder="Chapter"
              />
              {errors.chapter && (
                <p className="invalid-feedback">{errors.chapter.message}</p>
              )}
            </div>
            <button disabled={loading} className="btn btn-primary">
              {loading == false ? "Save" : "Please wait..."}
            </button>
          </form>

          <Accordion>
            {chapters.map((chapter, index) => {
              return (
                <Accordion.Item  key={chapter.id} eventKey={index}>
                  <Accordion.Header>{chapter.title}</Accordion.Header>
                  <Accordion.Body>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="d-flex justify-content-between mb-2 mt-4">
                          <h4 className="h5">Lessons</h4>
                          <Link  onClick={()=>handleShowLessonSortModal( chapter.lessons)} className="h6"  data-discover="true">
                            <strong>Reorder Lessons</strong>
                          </Link>
                        </div>
                      </div>
                      <div className="col-md-12">
                        {chapter.lessons &&
                          chapter.lessons.map((lesson) => {
                            return (
                              <div  key={lesson.id} className="row">
                                <div className="col-md-7">{lesson.title}</div>
                                <div className="col-md-5 text-end">
                                  {lesson.duration > 0 && (
                                    <small className="fw-bold text-muted me-2">
                                      20 Mins
                                    </small>
                                  )}
                                  {lesson.is_free_preview == "yes" && (
                                    <span className="badge bg-success">
                                      Preview
                                    </span>
                                  )}

                                  <Link
                                    to={`/account/courses/edit-lesson/${lesson.id}/${course.id}`}
                                    className="ms-2"
                                  >
                                    {" "}
                                    <BsPencilSquare />{" "}
                                  </Link>
                                  <Link onClick={()=>deleteLesson(lesson.id)} className="ms-2 text-danger">
                                    {" "}
                                    <FaTrashAlt />{" "}
                                  </Link>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                      <div className="col-md-12 mt-3">
                        <div className="d-flex">
                          <button
                            onClick={() => deleteChapter(chapter.id)}
                            className="btn btn-danger btn-sm"
                          >
                            Delete Chapter
                          </button>
                          <button
                            onClick={() => handleShow(chapter)}
                            className="btn btn-primary btn-sm ms-2"
                          >
                            Update Chapter
                          </button>
                        </div>
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              );
            })}
          </Accordion>
        </div>
      </div>

      <UpdateChapter
        chapterData={chapterData}
        showChapter={showChapter}
        handleClose={handleClose}
        setChapters={setChapters}
      />
      <CreateLesson
        showLessonModal={showLessonModal}
        handleCloseLessonModal={handleCloseLessonModal}
        course={course}
      />

      <LessonsSort
      showLessonSortModal = {showLessonSortModal}
      handleCloseLessonSortModal = {handleCloseLessonSortModal}
      lessonsData={lessonsData}
      setChapters={setChapters}
      />
    </>
  );
};

export default ManageChapter;
