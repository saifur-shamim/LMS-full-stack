import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

const ManageRequirement = () => {
  
  const [loading, setLoading] = useState(false);
  const [requirements, setRequirements] = useState([]);
  const [requirementData, setRequirementData] = useState();
  const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm();
  
  const params = useParams();

  const onSubmit = (data)=> {

  }

  return (
    <> 
    <div className="card shadow-lg border-0">
        <div className="card-body p-4">
          <div className="d-flex">
            <h4 className="h5 mb-3">Requirement</h4>
          </div>
          <form className="mb-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <input
                {...register("requirement", {
                  required: "The requirement field is required.",
                })}
                type="text"
                className={`form-control ${errors.requirement && "is-invalid"}`}
                placeholder="Requirement"
              />
              {errors.requirement && (
                <p className="invalid-feedback">{errors.requirement.message}</p>
              )}
            </div>
            <button disabled={loading} className="btn btn-primary">
              {loading == false ? "Save" : "Please wait..."}
            </button>
          </form>
          </div>
          </div>
    </>
  )
}

export default ManageRequirement
