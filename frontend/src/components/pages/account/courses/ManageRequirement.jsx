import React from 'react'

const ManageRequirement = () => {
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
          </div>
          </div>
    </>
  )
}

export default ManageRequirement
