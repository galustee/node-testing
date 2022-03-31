const uuid = require('uuid').v4;
const HttpError = require('../models/http-error')

// 
const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'empire state building',
        description: 'its so wow',
        location: {
            lat: 40.7484,
            lng: 73.9857
        },
        address: '20 W 34th st, New York, NY 10001',
        creator: 'u1'
    }
]


const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId;
    })

    if (!place) {
        const error = new HttpError('Could not find a palce for the provided id.', 404)
        return next(error)
    }
    res.json({place})
}

const getPlaceByUserId = (req, res, next) => {
    const userId = req.params.uid
    const place = DUMMY_PLACES.find(p => {
        return p.creator === userId
    })
    if (!place) {
        const error = new HttpError('Could not find a palce for the provided id.', 404)
        return next(error)
    }

    res.json({place})
}

const createPlace = (req, res, next) => {
    const { title, description, location, address, creator} = req.body
    const createdPlace = {
        id: uuid(),
        title,
        description,
        location,
        address,
        creator
    }

    DUMMY_PLACES.push(createdPlace)

    res.status(201).json({place: createdPlace})
}

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId
exports.createPlace = createPlace