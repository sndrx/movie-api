const customResponses = {
    success(payload) {
        return this.status(200).json({
            success: true,
            payload: payload,
        });
    },

    badRequest(customError) {
        return this.status(400).json({
            success: false,
            error: customError || "Bad Request",
        });
    },


    unauthorized() {
        return this.status(401).json({
            success: false,
            error: "Unauthorized",
        });
    },

    forbidden() {
        return this.status(403).json({
            success: false,
            error: "Forbidden",
        });
    },

    preconditionFailed(customError) {
        return this.status(412).json({
            success: false,
            error: customError || "Precondition Failed",
        });
    },

    validationError(error) {
        if (!error || !error.errors) {
            return this.serverError();
        }

        let errorResponse = {};
        const typeFields = extractValidationType(error.errors);
        if (typeFields.length > 0) {
            errorResponse = typeFields;
        }

        return this.unprocessableEntity(errorResponse);
    },

    blocked() {
        return this.status(410).json({
            success: false,
            error: "Version Blocked",
        });
    },

    unprocessableEntity(customError) {
        return this.status(422).json({
            success: false,
            error: "Unprocessable Entity",
            payload: customError,
        });
    },

    notFound(customError) {
        return this.status(404).json({
            success: false,
            error: customError || "Not Found",
        });
    },

    serverError(err) {
        console.log("Server ERR", err);
        return this.status(503).json({
            success: false,
            error: "Server Error",
        });
    },
};

module.exports = (req, res, next) => {
    Object.assign(res, customResponses);
    next();
};

function extractValidationType(errors) {
    const fields = Object.keys(errors);
    return fields.map(key => errors[key])
        .map(validation => ({ errorOnField: validation.path, message: validation.message }));
}
