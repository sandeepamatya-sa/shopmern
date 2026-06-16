const DataNotFound = (next, name = 'Data') => {
    next({ status: 404, message: `${name} not found` });
};

const DataExists = (next, name = 'Data') => {
    next({ status: 409, message: `${name} already exists` });
};

const paginate = (query = {}, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    return { query, skip, limit: parseInt(limit) };
};

module.exports = { DataNotFound, DataExists, paginate };
