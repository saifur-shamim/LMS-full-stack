import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { apiUrl, token } from "../../../common/Config";
import { MdDragIndicator } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";

import UpdateOutcome from "./UpdateOutcome";

const ManageOutcome = () => {
  const [loading, setLoading] = useState(false);
  const [outcomes, setOutcomes] = useState([]);
  const [outcomeData, setOutcomeData] = useState();

  const [showOutcome, setShowOutcome] = useState(false);
  const handleClose = () => setShowOutcome(false);
  const handleShow = (outcome) => {
    setShowOutcome(true);
    setOutcomeData(outcome);
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const params = useParams();

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = { ...data, course_id: params.id };

    await fetch(`${apiUrl}/outcomes`, {
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
          const newOutcomes = [...outcomes, result.data];
          setOutcomes(newOutcomes);
          toast.success(result.message);
          reset();
        } else {
          console.log("Something went wrong");
        }
      });
  };

  const fetchOutcomes = async () => {
    await fetch(`${apiUrl}/outcomes?course_id=${params.id}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.status == 200) {
          setOutcomes(result.data);
        } else {
          console.log("Something went wrong");
        }
      });
  };

  const deleteOutcome = async (id) => {
    if(confirm("Are you sure want to delete?")) {
 await fetch(`${apiUrl}/outcomes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      }
    })
      .then((res) => res.json())
      .then((result) => {
        setLoading(false);
        if (result.status == 200) {
          const newOutcomes = outcomes.filter(outcome=> outcome.id!=id)
          setOutcomes(newOutcomes);
          toast.success(result.message);
        } else {
          console.log("Something went wrong");
        }
      });
    }
  
  };

  useEffect(() => {
    fetchOutcomes();
  }, []);

  return (
    <>
      <div className="card shadow-lg border-0">
        <div className="card-body p-4">
          <div className="d-flex">
            <h4 className="h5 mb-3">Outcome</h4>
          </div>
          <form className="mb-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <input
                {...register("outcome", {
                  required: "The outcome field is required.",
                })}
                type="text"
                className={`form-control ${errors.outcome && "is-invalid"}`}
                placeholder="Outcome"
              />
              {errors.outcome && (
                <p className="invalid-feedback">{errors.outcome.message}</p>
              )}
            </div>
            <button disabled={loading} className="btn btn-primary">
              {loading == false ? "Save" : "Please wait..."}
            </button>
          </form>

          {outcomes &&
            outcomes.map((outcome) => {
              return (
                <div key={`outcome-${outcome.id}`} className="card shadow mb-2">
                  <div className="card-body p-2 d-flex">
                    <div>
                      <MdDragIndicator />
                    </div>
                    <div className="d-flex justify-content-between w-100">
                      <div className="ps-2">{outcome.text}</div>
                      <div className="d-flex">
                        <Link  onClick={()=>handleShow(outcome)} className="text-primary me-1">
                          <BsPencilSquare />
                        </Link>
                        <Link  onClick={()=>deleteOutcome(outcome.id)} className="text-danger">
                          <FaTrashAlt />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

     <UpdateOutcome
     outcomeData={outcomeData}
     showOutcome={showOutcome}
     handleClose={handleClose}
     outcomes={outcomes}
     setOutcomes={setOutcomes}
     />
    </>
  );
};
export default ManageOutcome;
