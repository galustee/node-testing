const uuid = require('uuid').v4;
const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error')

// 
let DUMMY_PLACES = [
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

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid
    const places = DUMMY_PLACES.filter(p => {
        return p.creator === userId
    })
    if (!places || places.length === 0) {
        const error = new HttpError('Could not find palces for the provided id.', 404)
        return next(error)
    }

    res.json({places})
}

const createPlace = (req, res, next) => {
    const valErrors = validationResult(req)

    if (!valErrors.isEmpty()) {
        console.log(valErrors)
        throw new HttpError('Invalid inputs', 422)
    }

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

const updatePlaceById = (req, res, next) => {
    const valErrors = validationResult(req)

    if (!valErrors.isEmpty()) {
        console.log(valErrors)
        throw new HttpError('Invalid inputs', 422)
    }

    const {title, description, location, address, creator} = req.body
    const placeId = req.params.pid
    const createdPlace = {
        id: placeId,
        title,
        description,
        location,
        address,
        creator
    }


    const placeIdx = DUMMY_PLACES.findIndex(p => {
        return p.id === placeId;
    })
    DUMMY_PLACES[placeIdx] = createdPlace

    res.status(200).json({place: createdPlace})
}
///
const deletePlaceById = (req, res, next) => {
    const placeId = req.params.pid
    if (!DUMMY_PLACES.find(p => p.id === placeId)){
        throw new HttpError('Could not find a place for that id', 404)
    }
    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId)
    res.status(200).json({message: 'deleted'})
}


exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.updatePlaceById = updatePlaceById
exports.deletePlaceById = deletePlaceById